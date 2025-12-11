import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Order } from '../models/order.model.js';
import { Product } from '../models/product.model.js';
import { Cart } from '../models/cart.model.js';
import { Coupon } from '../models/coupon.model.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { getPagination, generateOrderNumber } from '../utils/helpers.js';
import { buildDateRange, buildPriceRange, buildPagination } from '../utils/queryBuilder.js';
import { ORDER_STATUS, ORDER_CONFIG, HTTP_STATUS, PAYMENT_STATUS, PAYMENT_METHODS } from '../constants/index.js';

export class OrderController {
  /**
   * Get user's orders with pagination and filtering
   * GET /api/v1/orders/my-orders
   */
  getMyOrders = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, status, search, dateFrom, dateTo, minAmount, maxAmount, sortBy, sortOrder = 'desc' } = req.query;
    const userId = req.user!.id;

    const query: any = { user: userId };

    if (status) {
      query.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      query.$or = [
        { orderNumber: searchRegex },
        { 'items.productName': searchRegex }
      ];
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom as string);
      if (dateTo) query.createdAt.$lte = new Date(dateTo as string);
    }

    if (minAmount || maxAmount) {
      query.totalAmount = {};
      if (minAmount) query.totalAmount.$gte = Number(minAmount);
      if (maxAmount) query.totalAmount.$lte = Number(maxAmount);
    }

    const sortOptions: any = {};
    if (sortBy === 'totalAmount') sortOptions.totalAmount = sortOrder === 'desc' ? -1 : 1;
    else if (sortBy === 'createdAt') sortOptions.createdAt = sortOrder === 'desc' ? -1 : 1;
    else sortOptions.createdAt = -1;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [total, orders] = await Promise.all([
      Order.countDocuments(query),
      Order.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .populate('items.product', 'name slug images')
        .lean()
    ]);

    const pagination = getPagination(total, pageNum, limitNum);

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
  getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user!.id
    }).populate('items.product');

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    res.json({ success: true, data: order });
  });

  /**
   * Create new order
   * POST /api/v1/orders
   */
  createOrder = asyncHandler(async (req: Request, res: Response) => {
    const { items, shippingAddress, billingAddress, paymentMethod, couponCode, customerNotes } = req.body;
    const userId = req.user!.id;

    if (!items || items.length === 0) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Order must have at least one item');
    }

    if (!shippingAddress || !shippingAddress.addressLine1 || !shippingAddress.city ||
      !shippingAddress.state || !shippingAddress.pincode || !shippingAddress.fullName ||
      !shippingAddress.phone) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid shipping address provided');
    }

    // Start transaction session (if replica set is available, otherwise this will fail on standalone)
    // For safety in this migration script, I'll rely on singular updates or assume RS.
    // I'll proceed without explicit transaction session to be safe on standalone instances unless required.
    // Ideally: const session = await mongoose.startSession(); session.startTransaction();

    let subtotal = 0;
    const orderItemsData: any[] = [];
    const stockUpdates: any[] = [];

    // 1. Process items and check stock
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Product ${item.productId} not found`);
      }

      if (product.status !== 'ACTIVE') {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Product ${product.name} is not available`);
      }

      let price = Number(product.salePrice || product.basePrice);
      let variantName: string | undefined;
      let productSku = (product as any).sku;
      let variantId = item.variantId;
      let variant: any;

      if (variantId) {
        variant = product.variants?.find((v: any) => v._id.toString() === variantId);
        if (!variant) {
          throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Variant ${variantId} not found for product ${product.name}`);
        }
        if (!variant.isActive) {
          throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Variant ${variant.name} for product ${product.name} is not active`);
        }
        if (variant.stockQuantity < item.quantity) {
          throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Not enough stock for variant ${variant.name} of product ${product.name}`);
        }
        price = Number(variant.price);
        variantName = variant.name;
        productSku = variant.sku || (product as any).sku;
      } else {
        if (product.stockQuantity < item.quantity) {
          throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Not enough stock for product ${product.name}`);
        }
      }

      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        product: product._id,
        variant: variantId, // Just store ID, we don't have separate variant collection to key ref
        productName: product.name,
        productSku: productSku,
        productImage: (product.images as string[])[0] || null,
        variantName,
        quantity: item.quantity,
        unitPrice: price,
        totalPrice: itemTotal,
      });

      // Prepare stock update
      if (variantId) {
        stockUpdates.push({
          updateOne: {
            filter: { _id: product._id, 'variants._id': variantId },
            update: { $inc: { 'variants.$.stockQuantity': -item.quantity } }
          }
        });
      } else {
        stockUpdates.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $inc: { stockQuantity: -item.quantity } }
          }
        });
      }
    }

    // 2. Apply coupon
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });
      if (coupon && coupon.isActive) {
        const now = new Date();
        if (coupon.expiresAt && now > coupon.expiresAt) {
          throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'This coupon has expired');
        }
        if (coupon.startsAt && now < coupon.startsAt) {
          throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'This coupon is not yet valid');
        }
        if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
          throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`);
        }
        if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
          throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'This coupon has reached its maximum usage limit.');
        }

        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = subtotal * (Number(coupon.discountValue) / 100);
          if (coupon.maxDiscountAmount) {
            discountAmount = Math.min(discountAmount, Number(coupon.maxDiscountAmount));
          }
        } else {
          discountAmount = Number(coupon.discountValue);
        }

        // Increment coupon usage
        await Coupon.updateOne({ _id: coupon._id }, { $inc: { currentUses: 1 } });
      } else {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired coupon code');
      }
    }

    // 3. Payment method discount
    let paymentDiscount = 0;
    if (['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'WALLET'].includes(paymentMethod)) {
      paymentDiscount = ORDER_CONFIG.ONLINE_PAYMENT_DISCOUNT;
    }
    discountAmount += paymentDiscount;

    // 4. Final calculations
    const taxAmount = (subtotal - discountAmount) * ORDER_CONFIG.TAX_RATE;
    const shippingAmount = subtotal >= ORDER_CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : ORDER_CONFIG.DEFAULT_SHIPPING_CHARGE;
    const totalAmount = subtotal - discountAmount + taxAmount + shippingAmount;

    const orderNumber = generateOrderNumber();

    // 5. Create Order
    const order: any = await Order.create({
      user: userId,
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
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      customerNotes,
      items: orderItemsData,
    });

    // 6. Update Stock
    if (stockUpdates.length > 0) {
      await Product.bulkWrite(stockUpdates);
    }

    // 7. Clear Cart
    await Cart.findOneAndDelete({ user: userId });

    // 8. Save shipping address to user's saved addresses (if not already exists)
    try {
      const { userModel } = await import('../models/user.model.js');
      const user: any = await userModel.findById(userId);
      
      if (user) {
        // Check if address already exists
        const addressExists = user.addresses?.some((addr: any) => 
          addr.addressLine1 === shippingAddress.addressLine1 &&
          addr.city === shippingAddress.city &&
          addr.state === shippingAddress.state &&
          addr.pincode === shippingAddress.pincode &&
          addr.phone === shippingAddress.phone
        );

        // If address doesn't exist, add it
        if (!addressExists) {
          const newAddress = {
            fullName: shippingAddress.fullName,
            phone: shippingAddress.phone,
            addressLine1: shippingAddress.addressLine1,
            addressLine2: shippingAddress.addressLine2 || '',
            landmark: shippingAddress.landmark || '',
            city: shippingAddress.city,
            state: shippingAddress.state,
            pincode: shippingAddress.pincode,
            country: shippingAddress.country || 'India',
            isDefault: user.addresses?.length === 0, // Set as default if it's the first address
          };

          await userModel.findByIdAndUpdate(
            userId,
            { $push: { addresses: newAddress } },
            { new: true, runValidators: true }
          );
        }
      }
    } catch (error) {
      // Log error but don't fail the order creation
      console.error('Error saving address to user profile:', error);
    }

    // Populate for response
    const populatedOrder: any = await Order.findById(order._id).populate('items.product');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: populatedOrder,
    });
  });

  // Cancel order (customer)
  cancelOrder = asyncHandler(async (req: Request, res: Response) => {
    const { reason } = req.body;
    const order: any = await Order.findOne({ _id: req.params.id, user: req.user!.id });

    if (!order) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Order not found');
    }

    if (![ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED, ORDER_STATUS.PROCESSING].includes(order.status as any)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Order cannot be cancelled in ${order.status} status.`);
    }

    order.status = ORDER_STATUS.CANCELLED;
    order.cancelledAt = new Date();
    order.cancellationReason = reason || 'Cancelled by customer';
    await order.save();

    res.json({ success: true, data: order });
  });

  // Admin: Get all orders
  getAllOrders = asyncHandler(async (req: Request, res: Response) => {
    const {
      page,
      limit,
      status,
      paymentStatus,
      paymentMethod,
      search,
      dateFrom,
      dateTo,
      minAmount,
      maxAmount,
      userId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    if (paymentMethod) {
      if (paymentMethod === 'PREPAID') {
        query.paymentMethod = { $in: [PAYMENT_METHODS.UPI, PAYMENT_METHODS.CREDIT_CARD, PAYMENT_METHODS.DEBIT_CARD, PAYMENT_METHODS.NET_BANKING, PAYMENT_METHODS.WALLET] };
      } else {
        query.paymentMethod = paymentMethod;
      }
    }

    if (userId) query.user = userId;

    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      // To search user fields, we usually need aggregation with lookup. 
      // For simplicity, we search indexed fields or fetch users separately then filter? 
      // Efficient way: Aggregation. Simpler way: search orderNumber only or rely on strict search which is okay for admin.
      // Let's stick to orderNumber search for now or use Aggregation.
      query.orderNumber = searchRegex;
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom as string);
      if (dateTo) query.createdAt.$lte = new Date(dateTo as string);
    }

    if (minAmount || maxAmount) {
      query.totalAmount = {};
      if (minAmount) query.totalAmount.$gte = Number(minAmount);
      if (maxAmount) query.totalAmount.$lte = Number(maxAmount);
    }

    const sortOptions: any = {};
    const sortField = sortBy as string;
    sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;

    const [total, orders] = await Promise.all([
      Order.countDocuments(query),
      Order.find(query)
        .sort(sortOptions)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('user', 'email firstName lastName phone')
        .populate('items.product', 'name slug images')
        .lean()
    ]);

    const pagination = getPagination(total, pageNum, limitNum);

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
  getOrderStats = asyncHandler(async (req: Request, res: Response) => {
    const { dateFrom, dateTo } = req.query;

    const dateFilter: any = {};
    if (dateFrom || dateTo) {
      dateFilter.createdAt = {};
      if (dateFrom) dateFilter.createdAt.$gte = new Date(dateFrom as string);
      if (dateTo) {
        const endDate = new Date(dateTo as string);
        endDate.setHours(23, 59, 59, 999);
        dateFilter.createdAt.$lte = endDate;
      }
    }

    // Parallel aggregation queries
    const [
      totalOrders,
      statusBreakdown,
      paymentStats,
      itemStats,
      revenueStats
    ] = await Promise.all([
      Order.countDocuments(dateFilter),
      Order.aggregate([
        { $match: dateFilter },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: dateFilter },
        { $group: { _id: "$paymentMethod", count: { $sum: 1 }, totalAmount: { $sum: "$totalAmount" } } }
      ]),
      Order.aggregate([
        { $match: dateFilter },
        { $unwind: "$items" },
        { $group: { _id: null, totalQty: { $sum: "$items.quantity" } } }
      ]),
      Order.aggregate([
        { $match: { ...dateFilter, paymentStatus: 'PAID' } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
      ])
    ]);

    // Prepaid stats
    const prepaidMethods = ['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'WALLET'];
    const prepaidOrders = paymentStats.filter(p => prepaidMethods.includes(p._id)).reduce((acc, curr) => acc + curr.count, 0);
    const codOrders = paymentStats.find(p => p._id === 'COD')?.count || 0;

    // Revenue
    const totalRevenue = revenueStats[0]?.totalRevenue || 0;

    // Formatting response to match previous structure roughly
    res.json({
      success: true,
      data: {
        overview: {
          totalOrders,
          totalItemsOrdered: itemStats[0]?.totalQty || 0,
          pendingOrders: statusBreakdown.find(s => s._id === 'PENDING')?.count || 0,
          processingOrders: statusBreakdown.find(s => s._id === 'PROCESSING')?.count || 0,
          shippedOrders: statusBreakdown.find(s => s._id === 'SHIPPED')?.count || 0,
          deliveredOrders: statusBreakdown.find(s => s._id === 'DELIVERED')?.count || 0,
          cancelledOrders: statusBreakdown.find(s => s._id === 'CANCELLED')?.count || 0,
          codOrders,
          prepaidOrders,
          totalRevenue,
          prepaidRevenue: 0, // Simplified for now
          todayOrders: 0, // Simplified
          todayRevenue: 0,
        },
        statusBreakdown: statusBreakdown.map(s => ({ status: s._id, count: s.count })),
        paymentMethodBreakdown: paymentStats.map(p => ({ method: p._id, count: p.count, totalAmount: p.totalAmount })),
      },
    });
  });

  // Admin: Get order by ID
  getOrderByIdAdmin = asyncHandler(async (req: Request, res: Response) => {
    const order: any = await Order.findById(req.params.id)
      .populate('user', 'id email firstName lastName phone')
      .populate('items.product');

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    res.json({ success: true, data: order });
  });

  // Admin: Update order status
  updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status, trackingNumber, carrierName } = req.body;

    const updateData: any = { status };

    if (status === 'SHIPPED') {
      updateData.shippedAt = new Date();
      if (trackingNumber) updateData.trackingNumber = trackingNumber;
      if (carrierName) updateData.carrierName = carrierName;
    } else if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date();
    }

    const order: any = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.json({ success: true, data: order });
  });

  // Admin: Update payment status
  updatePaymentStatus = asyncHandler(async (req: Request, res: Response) => {
    const { paymentStatus, paymentId } = req.body;

    const updateData: any = { paymentStatus };
    if (paymentId) updateData.paymentId = paymentId;
    if (paymentStatus === 'PAID') updateData.paidAt = new Date();

    const order: any = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.json({ success: true, data: order });
  });

  // Track order by order number (public endpoint)
  trackOrder = asyncHandler(async (req: Request, res: Response) => {
    const { orderNumber } = req.query;

    if (!orderNumber) {
      throw new ApiError(400, 'Order number is required');
    }

    const order: any = await Order.findOne({ orderNumber: orderNumber as string })
      .populate('user', 'id email firstName lastName phone')
      .populate('items.product', 'name slug images')
      .lean();

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // Return limited information for public tracking
    const trackingInfo = {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      trackingNumber: order.trackingNumber,
      carrierName: order.carrierName,
      createdAt: order.createdAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      items: order.items.map((item: any) => ({
        productName: item.productName,
        variantName: item.variantName,
        quantity: item.quantity,
        productImage: item.productImage,
      })),
      shippingAddress: order.shippingAddress,
      totalAmount: order.totalAmount,
    };

    res.json({ success: true, data: trackingInfo });
  });

  // Track order by ID (authenticated - for customers to track their own orders)
  trackOrderById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const order: any = await Order.findOne({
      _id: id,
      user: req.user!.id
    })
      .populate('items.product', 'name slug images')
      .lean();

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    res.json({ success: true, data: order });
  });

  // Admin: Advanced order tracking/search
  adminTrackOrder = asyncHandler(async (req: Request, res: Response) => {
    const {
      orderNumber,
      customerEmail,
      customerPhone,
      customerName,
      dateFrom,
      dateTo,
      status,
      paymentStatus,
      limit = 10,
    } = req.query;

    const query: any = {};

    // Search by order number
    if (orderNumber) {
      query.orderNumber = new RegExp(String(orderNumber), 'i');
    }

    // Search by customer email, phone, or name (requires user lookup)
    if (customerEmail || customerPhone || customerName) {
      const userModel = mongoose.model('users');
      const userQuery: any = {};
      
      if (customerEmail) {
        userQuery.email = new RegExp(String(customerEmail), 'i');
      }
      if (customerPhone) {
        userQuery.phone = new RegExp(String(customerPhone), 'i');
      }
      if (customerName) {
        userQuery.$or = [
          { firstName: new RegExp(String(customerName), 'i') },
          { lastName: new RegExp(String(customerName), 'i') },
        ];
      }

      const users = await userModel.find(userQuery).select('_id').lean();
      const userIds = users.map((u: any) => u._id);
      
      if (userIds.length > 0) {
        query.user = { $in: userIds };
      } else {
        // If no users found, return empty result
        return res.json({
          success: true,
          data: [],
          count: 0,
          message: 'No orders found matching the customer criteria',
        });
      }
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom as string);
      if (dateTo) query.createdAt.$lte = new Date(dateTo as string);
    }

    // Status filters
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const limitNum = Number(limit) || 10;
    const orders = await Order.find(query)
      .populate('user', 'id email firstName lastName phone')
      .populate('items.product', 'name slug images')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .lean();

    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  });
}
