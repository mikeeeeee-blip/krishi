import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
import { userModel } from '../models/user.model.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { HTTP_STATUS } from '../constants/index.js';

export class CartController {
  // Helper function to get user information
  private async getUserInfo(userId: string) {
    const user = await userModel.findById(userId).select('id email firstName lastName displayName');
    if (!user) {
      return { userId: '', userName: '', userEmail: '' };
    }
    const userName = user.displayName || `${user.firstName} ${user.lastName || ''}`.trim() || user.email;
    return {
      userId: user.id,
      userName,
      userEmail: user.email,
    };
  }

  // Get cart
  getCart = asyncHandler(async (req: Request, res: Response) => {
    let cart: any = null;

    if (req.user) {
      cart = await Cart.findOne({ user: req.user.id })
        .populate('items.product', 'name slug images basePrice salePrice stockQuantity status');

      // If cart exists, ensure user information is up-to-date
      if (cart) {
        const userInfo = await this.getUserInfo(req.user.id);
        if (!cart.userId || !cart.userName || cart.userId !== userInfo.userId) {
          cart.userId = userInfo.userId;
          cart.userName = userInfo.userName;
          cart.userEmail = userInfo.userEmail;
          await cart.save();
        }
      }
    }

    if (!cart) {
      return res.json({
        success: true,
        data: {
          items: [],
          subtotal: 0,
          itemCount: 0,
          id: null,
          userId: req.user?.id || null,
          userName: null,
          userEmail: null,
        },
      });
    }

    // Filter out items where product is null (deleted)
    cart.items = cart.items.filter((item: any) => item.product);

    // Calculate subtotal
    const subtotal = cart.items.reduce((sum: number, item: any) => {
      const price = item.unitPrice || 0;
      return sum + price * item.quantity;
    }, 0);

    res.json({
      success: true,
      data: {
        id: cart._id,
        userId: cart.userId || cart.user?.toString() || req.user?.id || null,
        userName: cart.userName || null,
        userEmail: cart.userEmail || null,
        items: cart.items,
        subtotal,
        itemCount: cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
      },
    });
  });

  // Add to cart
  addToCart = asyncHandler(async (req: Request, res: Response) => {
    const { productId, variantId, variantName, quantity = 1 } = req.body;

    if (!req.user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Please login to add items to cart');
    }

    // Validate productId is a valid MongoDB ObjectId
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        'Invalid product ID. Product ID must be a valid MongoDB ObjectId.',
        undefined,
        true,
        false,
        'INVALID_PRODUCT_ID'
      );
    }

    // Get user information
    const userInfo = await this.getUserInfo(req.user.id);

    // Get or create cart
    let cart: any = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      // Create new cart with user information
      cart = await Cart.create({
        user: req.user.id,
        userId: userInfo.userId,
        userName: userInfo.userName,
        userEmail: userInfo.userEmail,
        items: [],
      });
    } else {
      // Update user information if cart exists but user info is missing or outdated
      if (!cart.userId || !cart.userName || cart.userId !== userInfo.userId) {
        cart.userId = userInfo.userId;
        cart.userName = userInfo.userName;
        cart.userEmail = userInfo.userEmail;
      }
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
    let resolvedVariantId: string | undefined = variantId;

    // If variantId is provided, use it; otherwise try to find by variantName
    if (variantId) {
      const variant = product.variants?.find((v: any) => v._id.toString() === variantId);
      if (!variant) {
        throw new ApiError(404, 'Variant not found');
      }
      unitPrice = Number(variant.price);
    } else if (variantName && product.variants && product.variants.length > 0) {
      // Find variant by name
      const variant = product.variants.find((v: any) => v.name === variantName);
      if (variant) {
        resolvedVariantId = variant._id.toString();
        unitPrice = Number(variant.price);
      }
    }

    // Check if item exists in cart
    const existingItemIndex = cart.items.findIndex((item: any) =>
      item.product.toString() === productId &&
      ((!item.variantId && !resolvedVariantId) || item.variantId === resolvedVariantId)
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        variantId: resolvedVariantId,
        quantity,
        unitPrice,
      });
    }

    await cart.save();

    res.json({ success: true, message: 'Item added to cart' });
  });

  // Update cart item
  updateCartItem = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { quantity, variantId } = req.body;

    if (!req.user) {
      throw new ApiError(401, 'Please login');
    }

    // Get user information
    const userInfo = await this.getUserInfo(req.user.id);

    const cart: any = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      throw new ApiError(404, 'Cart not found');
    }

    // Update user information if missing or outdated
    if (!cart.userId || !cart.userName || cart.userId !== userInfo.userId) {
      cart.userId = userInfo.userId;
      cart.userName = userInfo.userName;
      cart.userEmail = userInfo.userEmail;
    }

    if (quantity <= 0) {
      // Remove item
      cart.items = cart.items.filter((item: any) =>
        !(item.product.toString() === productId &&
          ((!item.variantId && !variantId) || item.variantId === variantId))
      );
    } else {
      // Update quantity
      const item = cart.items.find((item: any) =>
        item.product.toString() === productId &&
        ((!item.variantId && !variantId) || item.variantId === variantId)
      );

      if (item) {
        item.quantity = quantity;
      }
    }

    await cart.save();

    res.json({ success: true, message: 'Cart updated' });
  });

  // Remove from cart
  removeFromCart = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { variantId } = req.query;

    if (!req.user) {
      throw new ApiError(401, 'Please login');
    }

    // Get user information
    const userInfo = await this.getUserInfo(req.user.id);

    const cart: any = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      throw new ApiError(404, 'Cart not found');
    }

    // Update user information if missing or outdated
    if (!cart.userId || !cart.userName || cart.userId !== userInfo.userId) {
      cart.userId = userInfo.userId;
      cart.userName = userInfo.userName;
      cart.userEmail = userInfo.userEmail;
    }

    cart.items = cart.items.filter((item: any) =>
      !(item.product.toString() === productId &&
        ((!item.variantId && !variantId) || item.variantId === variantId))
    );

    await cart.save();

    res.json({ success: true, message: 'Item removed from cart' });
  });

  // Clear cart
  clearCart = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, 'Please login');
    }

    // Get user information
    const userInfo = await this.getUserInfo(req.user.id);

    // Update cart - clear items and ensure user info is saved
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          items: [],
          userId: userInfo.userId,
          userName: userInfo.userName,
          userEmail: userInfo.userEmail,
        },
      }
    );

    res.json({ success: true, message: 'Cart cleared' });
  });

  // Merge guest cart with user cart
  mergeCart = asyncHandler(async (req: Request, res: Response) => {
    const { guestCartItems } = req.body;

    if (!guestCartItems || guestCartItems.length === 0) {
      return res.json({ success: true, message: 'No items to merge' });
    }

    // Get user information
    const userInfo = await this.getUserInfo(req.user!.id);

    // Get or create user cart
    let cart: any = await Cart.findOne({ user: req.user!.id });

    if (!cart) {
      // Create new cart with user information
      cart = await Cart.create({
        user: req.user!.id,
        userId: userInfo.userId,
        userName: userInfo.userName,
        userEmail: userInfo.userEmail,
        items: [],
      });
    } else {
      // Update user information if cart exists but user info is missing or outdated
      if (!cart.userId || !cart.userName || cart.userId !== userInfo.userId) {
        cart.userId = userInfo.userId;
        cart.userName = userInfo.userName;
        cart.userEmail = userInfo.userEmail;
      }
    }

    // Merge items
    for (const item of guestCartItems) {
      const product = await Product.findById(item.productId);

      if (!product || product.status !== 'ACTIVE') continue;

      let unitPrice = Number(product.salePrice || product.basePrice);
      if (item.variantId) {
        const variant = product.variants?.find((v: any) => v._id.toString() === item.variantId);
        if (variant) unitPrice = Number(variant.price);
      }

      const existingItemIndex = cart.items.findIndex((cartItem: any) =>
        cartItem.product.toString() === item.productId &&
        ((!cartItem.variantId && !item.variantId) || cartItem.variantId === item.variantId)
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += item.quantity;
      } else {
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
