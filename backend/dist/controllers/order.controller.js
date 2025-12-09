import { prisma } from '../lib/prisma.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { getPagination, generateOrderNumber } from '../utils/helpers.js';
import { buildDateRange, buildPriceRange, buildPagination } from '../utils/queryBuilder.js';
import { ORDER_STATUS, ORDER_CONFIG, HTTP_STATUS, PAYMENT_STATUS, PAYMENT_METHODS } from '../constants/index.js';
export class OrderController {
    /**
     * Get user's orders with pagination and filtering
     * GET /api/v1/orders/my-orders
     */
    getMyOrders = asyncHandler(async (req, res) => {
        const { page, limit, status, search, dateFrom, dateTo, minAmount, maxAmount, sortBy, sortOrder = 'desc' } = req.query;
        const userId = req.user.id;
        // Build where clause with proper typing
        const where = { userId };
        if (status) {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                {
                    items: {
                        some: {
                            productName: { contains: search, mode: 'insensitive' },
                        },
                    },
                },
            ];
        }
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom)
                where.createdAt.gte = new Date(dateFrom);
            if (dateTo)
                where.createdAt.lte = new Date(dateTo);
        }
        if (minAmount || maxAmount) {
            where.totalAmount = {};
            if (minAmount)
                where.totalAmount.gte = Number(minAmount);
            if (maxAmount)
                where.totalAmount.lte = Number(maxAmount);
        }
        // Build orderBy clause
        const orderBy = {};
        if (sortBy === 'totalAmount')
            orderBy.totalAmount = sortOrder;
        else if (sortBy === 'createdAt')
            orderBy.createdAt = sortOrder;
        else
            orderBy.createdAt = 'desc';
        // Get pagination metadata
        const total = await prisma.order.count({ where });
        const pagination = getPagination(total, Number(page), Number(limit));
        // Fetch orders
        const orders = await prisma.order.findMany({
            where,
            skip: pagination.skip,
            take: pagination.take,
            orderBy,
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                images: true
                            }
                        },
                    },
                },
            },
        });
        res.json({
            success: true,
            data: orders,
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total: pagination.total,
                pages: pagination.pages,
            },
        });
    });
    // Get order by ID (customer)
    getOrderById = asyncHandler(async (req, res) => {
        const order = await prisma.order.findFirst({
            where: { id: req.params.id, userId: req.user.id },
            include: {
                items: {
                    include: {
                        product: true,
                        variant: true,
                    },
                },
            },
        });
        if (!order) {
            throw new ApiError(404, 'Order not found');
        }
        res.json({ success: true, data: order });
    });
    /**
     * Create new order
     * POST /api/v1/orders
     */
    createOrder = asyncHandler(async (req, res) => {
        const { items, shippingAddress, billingAddress, paymentMethod, couponCode, customerNotes } = req.body;
        if (!items || items.length === 0) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Order must have at least one item');
        }
        // Validate shipping address
        if (!shippingAddress || !shippingAddress.addressLine1 || !shippingAddress.city ||
            !shippingAddress.state || !shippingAddress.pincode || !shippingAddress.fullName ||
            !shippingAddress.phone) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid shipping address provided');
        }
        // Calculate totals
        let subtotal = 0;
        const orderItemsData = [];
        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
                include: { variants: true },
            });
            if (!product) {
                throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Product ${item.productId} not found`);
            }
            if (product.status !== 'ACTIVE') {
                throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Product ${product.name} is not available`);
            }
            let price = product.salePrice || product.basePrice;
            let variantName;
            let productSku = product.sku;
            let variantId = item.variantId;
            if (variantId) {
                const variant = product.variants.find(v => v.id === variantId);
                if (!variant) {
                    throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Variant ${variantId} not found for product ${product.name}`);
                }
                if (!variant.isActive) {
                    throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Variant ${variant.name} for product ${product.name} is not active`);
                }
                if (variant.stockQuantity < item.quantity) {
                    throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Not enough stock for variant ${variant.name} of product ${product.name}`);
                }
                price = variant.price;
                variantName = variant.name;
                productSku = variant.sku || product.sku;
            }
            else {
                if (product.stockQuantity < item.quantity) {
                    throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Not enough stock for product ${product.name}`);
                }
            }
            const itemTotal = Number(price) * item.quantity;
            subtotal += itemTotal;
            orderItemsData.push({
                productId: product.id,
                variantId: variantId,
                productName: product.name,
                productSku: productSku,
                productImage: product.images[0] || null,
                variantName,
                quantity: item.quantity,
                unitPrice: price,
                totalPrice: itemTotal,
            });
            // Decrease stock
            if (variantId) {
                await prisma.productVariant.update({
                    where: { id: variantId },
                    data: { stockQuantity: { decrement: item.quantity } },
                });
            }
            else {
                await prisma.product.update({
                    where: { id: product.id },
                    data: { stockQuantity: { decrement: item.quantity } },
                });
            }
        }
        // Apply coupon if valid
        let discountAmount = 0;
        if (couponCode) {
            const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
            if (coupon && coupon.isActive) {
                // Check if coupon is valid (not expired)
                const now = new Date();
                if (coupon.expiresAt && now > coupon.expiresAt) {
                    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'This coupon has expired');
                }
                if (coupon.startsAt && now < coupon.startsAt) {
                    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'This coupon is not yet valid');
                }
                // Check minimum order amount
                if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
                    throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`);
                }
                // Check usage limits
                if (coupon.maxUsesPerUser) {
                    // Count user's usage of this coupon (would need Order model to check)
                    // For now, skip this check as we don't have CouponUsage model
                }
                if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
                    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'This coupon has reached its maximum usage limit.');
                }
                // Calculate discount
                if (coupon.discountType === 'PERCENTAGE') {
                    discountAmount = subtotal * (Number(coupon.discountValue) / 100);
                    if (coupon.maxDiscountAmount) {
                        discountAmount = Math.min(discountAmount, Number(coupon.maxDiscountAmount));
                    }
                }
                else {
                    discountAmount = Number(coupon.discountValue);
                }
            }
            else {
                throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired coupon code');
            }
        }
        // Apply online payment discount
        let paymentDiscount = 0;
        if (paymentMethod === 'UPI' || paymentMethod === 'CREDIT_CARD' ||
            paymentMethod === 'DEBIT_CARD' || paymentMethod === 'NET_BANKING' ||
            paymentMethod === 'WALLET') {
            paymentDiscount = ORDER_CONFIG.ONLINE_PAYMENT_DISCOUNT;
        }
        discountAmount += paymentDiscount;
        // Calculate tax and shipping
        const taxAmount = (subtotal - discountAmount) * ORDER_CONFIG.TAX_RATE;
        const shippingAmount = subtotal >= ORDER_CONFIG.FREE_SHIPPING_THRESHOLD
            ? 0
            : ORDER_CONFIG.DEFAULT_SHIPPING_CHARGE;
        const totalAmount = subtotal - discountAmount + taxAmount + shippingAmount;
        // Generate order number
        const orderNumber = generateOrderNumber();
        // Create order
        const order = await prisma.order.create({
            data: {
                userId: req.user.id,
                orderNumber,
                status: ORDER_STATUS.PENDING,
                paymentStatus: PAYMENT_STATUS.PENDING,
                paymentMethod,
                subtotal,
                discountAmount,
                taxAmount,
                shippingAmount,
                totalAmount,
                couponCode,
                shippingAddress: shippingAddress,
                billingAddress: (billingAddress || shippingAddress),
                customerNotes,
                items: {
                    create: orderItemsData,
                },
            },
            include: { items: true },
        });
        // Clear user cart after order
        const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
        if (cart) {
            await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: order,
        });
    });
    // Cancel order (customer)
    /**
     * Cancel order (customer)
     * POST /api/v1/orders/:id/cancel
     */
    cancelOrder = asyncHandler(async (req, res) => {
        const { reason } = req.body;
        const order = await prisma.order.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!order) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Order not found');
        }
        // Allowed to cancel if PENDING, CONFIRMED, PROCESSING
        if (![ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED, ORDER_STATUS.PROCESSING].includes(order.status)) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Order cannot be cancelled in ${order.status} status.`);
        }
        const updated = await prisma.order.update({
            where: { id: order.id },
            data: {
                status: ORDER_STATUS.CANCELLED,
                cancelledAt: new Date(),
                cancellationReason: reason || 'Cancelled by customer',
            },
        });
        // TODO: Revert stock for cancelled items
        // This would require fetching order items and incrementing stock
        res.json({ success: true, data: updated });
    });
    /**
     * Admin: Get all orders with advanced filters
     * GET /api/v1/orders
     */
    getAllOrders = asyncHandler(async (req, res) => {
        const { page, limit, status, paymentStatus, paymentMethod, search, dateFrom, dateTo, minAmount, maxAmount, userId, sortBy = 'createdAt', sortOrder = 'desc', } = req.query;
        // Build where clause with proper typing
        const where = {};
        // Status filter
        if (status) {
            where.status = status;
        }
        if (paymentStatus) {
            where.paymentStatus = paymentStatus;
        }
        if (paymentMethod) {
            // Handle PREPAID filter (includes multiple payment methods)
            if (paymentMethod === 'PREPAID') {
                where.paymentMethod = {
                    in: [
                        PAYMENT_METHODS.UPI,
                        PAYMENT_METHODS.CREDIT_CARD,
                        PAYMENT_METHODS.DEBIT_CARD,
                        PAYMENT_METHODS.NET_BANKING,
                        PAYMENT_METHODS.WALLET,
                    ],
                };
            }
            else {
                where.paymentMethod = paymentMethod;
            }
        }
        if (userId)
            where.userId = userId;
        // Search by order number or customer email
        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
                { user: { firstName: { contains: search, mode: 'insensitive' } } },
            ];
        }
        // Date range filter
        const dateFilter = buildDateRange(dateFrom, dateTo);
        if (dateFilter) {
            where.createdAt = dateFilter;
        }
        // Amount range filter
        const minAmountNum = minAmount ? (Array.isArray(minAmount) ? Number(minAmount[0]) : Number(minAmount)) : undefined;
        const maxAmountNum = maxAmount ? (Array.isArray(maxAmount) ? Number(maxAmount[0]) : Number(maxAmount)) : undefined;
        const priceFilter = buildPriceRange(minAmountNum, maxAmountNum);
        if (priceFilter) {
            where.totalAmount = priceFilter;
        }
        // Get pagination metadata
        const total = await prisma.order.count({ where });
        const pageValue = page ? (Array.isArray(page) ? String(page[0]) : String(page)) : undefined;
        const limitValue = limit ? (Array.isArray(limit) ? String(limit[0]) : String(limit)) : undefined;
        const pagination = buildPagination(total, { page: pageValue, limit: limitValue });
        // Build orderBy clause
        const orderBy = {};
        if (sortBy === 'totalAmount')
            orderBy.totalAmount = sortOrder;
        else if (sortBy === 'createdAt')
            orderBy.createdAt = sortOrder;
        else
            orderBy.createdAt = 'desc';
        // Fetch orders
        const orders = await prisma.order.findMany({
            where,
            skip: pagination.skip,
            take: pagination.take,
            orderBy,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                    },
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                images: true,
                            },
                        },
                    },
                },
            },
        });
        res.json({
            success: true,
            data: orders,
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total: pagination.total,
                pages: pagination.pages,
            },
        });
    });
    // Get order statistics (Admin)
    getOrderStats = asyncHandler(async (req, res) => {
        const { dateFrom, dateTo } = req.query;
        const dateFilter = {};
        if (dateFrom || dateTo) {
            dateFilter.createdAt = {};
            if (dateFrom)
                dateFilter.createdAt.gte = new Date(dateFrom);
            if (dateTo) {
                const endDate = new Date(dateTo);
                endDate.setHours(23, 59, 59, 999);
                dateFilter.createdAt.lte = endDate;
            }
        }
        const [totalOrders, pendingOrders, processingOrders, shippedOrders, deliveredOrders, cancelledOrders, codOrders, prepaidOrders, totalItemsOrdered, totalRevenue, prepaidRevenue, todayOrders, todayRevenue, statusBreakdown, paymentMethodBreakdown,] = await Promise.all([
            prisma.order.count({ where: dateFilter }),
            prisma.order.count({ where: { ...dateFilter, status: 'PENDING' } }),
            prisma.order.count({ where: { ...dateFilter, status: 'PROCESSING' } }),
            prisma.order.count({ where: { ...dateFilter, status: 'SHIPPED' } }),
            prisma.order.count({ where: { ...dateFilter, status: 'DELIVERED' } }),
            prisma.order.count({ where: { ...dateFilter, status: 'CANCELLED' } }),
            prisma.order.count({ where: { ...dateFilter, paymentMethod: 'COD' } }),
            prisma.order.count({
                where: {
                    ...dateFilter,
                    paymentMethod: { in: ['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'WALLET'] },
                },
            }),
            // Total items ordered (sum of all order items quantities)
            prisma.orderItem.aggregate({
                where: {
                    order: dateFilter,
                },
                _sum: { quantity: true },
            }),
            // Total revenue (all paid orders)
            prisma.order.aggregate({
                where: { ...dateFilter, paymentStatus: 'PAID' },
                _sum: { totalAmount: true },
            }),
            // Prepaid revenue (prepaid orders that are paid)
            prisma.order.aggregate({
                where: {
                    ...dateFilter,
                    paymentMethod: { in: ['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'WALLET'] },
                    paymentStatus: 'PAID',
                },
                _sum: { totalAmount: true },
            }),
            prisma.order.count({
                where: {
                    ...dateFilter,
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
            }),
            prisma.order.aggregate({
                where: {
                    ...dateFilter,
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                    paymentStatus: 'PAID',
                },
                _sum: { totalAmount: true },
            }),
            prisma.order.groupBy({
                by: ['status'],
                where: dateFilter,
                _count: { status: true },
            }),
            prisma.order.groupBy({
                by: ['paymentMethod'],
                where: dateFilter,
                _count: { paymentMethod: true },
                _sum: { totalAmount: true },
            }),
        ]);
        res.json({
            success: true,
            data: {
                overview: {
                    totalOrders,
                    totalItemsOrdered: Number(totalItemsOrdered._sum.quantity || 0),
                    pendingOrders,
                    processingOrders,
                    shippedOrders,
                    deliveredOrders,
                    cancelledOrders,
                    codOrders,
                    prepaidOrders,
                    totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
                    prepaidRevenue: Number(prepaidRevenue._sum.totalAmount || 0),
                    todayOrders,
                    todayRevenue: Number(todayRevenue._sum.totalAmount || 0),
                },
                statusBreakdown: statusBreakdown.map((item) => ({
                    status: item.status,
                    count: item._count.status,
                })),
                paymentMethodBreakdown: paymentMethodBreakdown.map((item) => ({
                    method: item.paymentMethod,
                    count: item._count.paymentMethod,
                    totalAmount: Number(item._sum.totalAmount || 0),
                })),
            },
        });
    });
    // Admin: Get order by ID
    getOrderByIdAdmin = asyncHandler(async (req, res) => {
        const order = await prisma.order.findUnique({
            where: { id: req.params.id },
            include: {
                user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true } },
                items: { include: { product: true, variant: true } },
            },
        });
        if (!order) {
            throw new ApiError(404, 'Order not found');
        }
        res.json({ success: true, data: order });
    });
    // Admin: Update order status
    updateOrderStatus = asyncHandler(async (req, res) => {
        const { status, trackingNumber, carrierName } = req.body;
        const updateData = { status };
        if (status === 'SHIPPED') {
            updateData.shippedAt = new Date();
            if (trackingNumber)
                updateData.trackingNumber = trackingNumber;
            if (carrierName)
                updateData.carrierName = carrierName;
        }
        else if (status === 'DELIVERED') {
            updateData.deliveredAt = new Date();
        }
        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: updateData,
        });
        res.json({ success: true, data: order });
    });
    // Admin: Update payment status
    updatePaymentStatus = asyncHandler(async (req, res) => {
        const { paymentStatus, paymentId } = req.body;
        const updateData = { paymentStatus };
        if (paymentId)
            updateData.paymentId = paymentId;
        if (paymentStatus === 'PAID')
            updateData.paidAt = new Date();
        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: updateData,
        });
        res.json({ success: true, data: order });
    });
}
//# sourceMappingURL=order.controller.js.map