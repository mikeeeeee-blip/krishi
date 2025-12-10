import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { HTTP_STATUS } from '../constants/index.js';
export class CartController {
    // Get cart
    getCart = asyncHandler(async (req, res) => {
        let cart = null;
        if (req.user) {
            cart = await Cart.findOne({ user: req.user.id })
                .populate('items.product', 'name slug images basePrice salePrice stockQuantity status');
        }
        if (!cart) {
            return res.json({
                success: true,
                data: { items: [], subtotal: 0, itemCount: 0, id: null },
            });
        }
        // Filter out items where product is null (deleted)
        cart.items = cart.items.filter((item) => item.product);
        // Calculate subtotal
        const subtotal = cart.items.reduce((sum, item) => {
            const price = item.unitPrice || 0;
            return sum + price * item.quantity;
        }, 0);
        res.json({
            success: true,
            data: {
                id: cart._id,
                items: cart.items,
                subtotal,
                itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
            },
        });
    });
    // Add to cart
    addToCart = asyncHandler(async (req, res) => {
        const { productId, variantId, quantity = 1 } = req.body;
        if (!req.user) {
            throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Please login to add items to cart');
        }
        // Get or create cart
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }
        // Get product
        const product = await Product.findById(productId);
        if (!product) {
            throw new ApiError(404, 'Product not found');
        }
        if (product.status !== 'ACTIVE') {
            throw new ApiError(400, 'Product is not available');
        }
        let unitPrice = Number(product.salePrice || product.basePrice);
        if (variantId) {
            const variant = product.variants?.find((v) => v._id.toString() === variantId);
            if (!variant) {
                throw new ApiError(404, 'Variant not found');
            }
            unitPrice = Number(variant.price);
        }
        // Check if item exists in cart
        const existingItemIndex = cart.items.findIndex((item) => item.product.toString() === productId &&
            ((!item.variantId && !variantId) || item.variantId === variantId));
        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        }
        else {
            // Add new item
            cart.items.push({
                product: productId,
                variantId,
                quantity,
                unitPrice,
            });
        }
        await cart.save();
        res.json({ success: true, message: 'Item added to cart' });
    });
    // Update cart item
    updateCartItem = asyncHandler(async (req, res) => {
        const { productId } = req.params;
        const { quantity, variantId } = req.body;
        if (!req.user) {
            throw new ApiError(401, 'Please login');
        }
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            throw new ApiError(404, 'Cart not found');
        }
        if (quantity <= 0) {
            // Remove item
            cart.items = cart.items.filter((item) => !(item.product.toString() === productId &&
                ((!item.variantId && !variantId) || item.variantId === variantId)));
        }
        else {
            // Update quantity
            const item = cart.items.find((item) => item.product.toString() === productId &&
                ((!item.variantId && !variantId) || item.variantId === variantId));
            if (item) {
                item.quantity = quantity;
            }
        }
        await cart.save();
        res.json({ success: true, message: 'Cart updated' });
    });
    // Remove from cart
    removeFromCart = asyncHandler(async (req, res) => {
        const { productId } = req.params;
        const { variantId } = req.query;
        if (!req.user) {
            throw new ApiError(401, 'Please login');
        }
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            throw new ApiError(404, 'Cart not found');
        }
        cart.items = cart.items.filter((item) => !(item.product.toString() === productId &&
            ((!item.variantId && !variantId) || item.variantId === variantId)));
        await cart.save();
        res.json({ success: true, message: 'Item removed from cart' });
    });
    // Clear cart
    clearCart = asyncHandler(async (req, res) => {
        if (!req.user) {
            throw new ApiError(401, 'Please login');
        }
        await Cart.findOneAndUpdate({ user: req.user.id }, { $set: { items: [] } });
        res.json({ success: true, message: 'Cart cleared' });
    });
    // Merge guest cart with user cart
    mergeCart = asyncHandler(async (req, res) => {
        const { guestCartItems } = req.body;
        if (!guestCartItems || guestCartItems.length === 0) {
            return res.json({ success: true, message: 'No items to merge' });
        }
        // Get or create user cart
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }
        // Merge items
        for (const item of guestCartItems) {
            const product = await Product.findById(item.productId);
            if (!product || product.status !== 'ACTIVE')
                continue;
            let unitPrice = Number(product.salePrice || product.basePrice);
            if (item.variantId) {
                const variant = product.variants?.find((v) => v._id.toString() === item.variantId);
                if (variant)
                    unitPrice = Number(variant.price);
            }
            const existingItemIndex = cart.items.findIndex((cartItem) => cartItem.product.toString() === item.productId &&
                ((!cartItem.variantId && !item.variantId) || cartItem.variantId === item.variantId));
            if (existingItemIndex > -1) {
                cart.items[existingItemIndex].quantity += item.quantity;
            }
            else {
                cart.items.push({
                    product: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    unitPrice,
                });
            }
        }
        await cart.save();
        res.json({ success: true, message: 'Cart merged' });
    });
}
//# sourceMappingURL=cart.controller.js.map