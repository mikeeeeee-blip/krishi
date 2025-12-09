import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { HTTP_STATUS } from '../constants/index.js';

export class CartController {
  // Get cart
  getCart = asyncHandler(async (req: Request, res: Response) => {
    let cart = null;

    if (req.user) {
      cart = await prisma.cart.findUnique({
        where: { userId: req.user.id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: true,
                  basePrice: true,
                  salePrice: true,
                  stockQuantity: true,
                  status: true,
                },
              },
              variant: true,
            },
          },
        },
      });
    }

    if (!cart) {
      return res.json({
        success: true,
        data: { items: [], subtotal: 0, itemCount: 0 },
      });
    }

    // Calculate subtotal
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + Number(item.unitPrice) * item.quantity;
    }, 0);

    res.json({
      success: true,
      data: {
        id: cart.id,
        items: cart.items,
        subtotal,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  });

  // Add to cart
  addToCart = asyncHandler(async (req: Request, res: Response) => {
    const { productId, variantId, quantity = 1 } = req.body;

    if (!req.user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Please login to add items to cart');
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
      });
    }

    // Get product/variant price
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    if (product.status !== 'ACTIVE') {
      throw new ApiError(400, 'Product is not available');
    }

    let unitPrice = product.salePrice || product.basePrice;

    if (variantId) {
      const variant = product.variants.find(v => v.id === variantId);
      if (!variant) {
        throw new ApiError(404, 'Variant not found');
      }
      unitPrice = variant.price;
    }

    // Check if item exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId_variantId: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId,
          quantity,
          unitPrice,
        },
      });
    }

    res.json({ success: true, message: 'Item added to cart' });
  });

  // Update cart item
  updateCartItem = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { quantity, variantId } = req.body;

    if (!req.user) {
      throw new ApiError(401, 'Please login');
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (!cart) {
      throw new ApiError(404, 'Cart not found');
    }

    if (quantity <= 0) {
      // Remove item
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
        },
      });
    } else {
      // Update quantity
      await prisma.cartItem.updateMany({
        where: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
        },
        data: { quantity },
      });
    }

    res.json({ success: true, message: 'Cart updated' });
  });

  // Remove from cart
  removeFromCart = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { variantId } = req.query;

    if (!req.user) {
      throw new ApiError(401, 'Please login');
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (!cart) {
      throw new ApiError(404, 'Cart not found');
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
        variantId: (variantId as string) || null,
      },
    });

    res.json({ success: true, message: 'Item removed from cart' });
  });

  // Clear cart
  clearCart = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, 'Please login');
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    res.json({ success: true, message: 'Cart cleared' });
  });

  // Merge guest cart with user cart
  mergeCart = asyncHandler(async (req: Request, res: Response) => {
    const { guestCartItems } = req.body;

    if (!guestCartItems || guestCartItems.length === 0) {
      return res.json({ success: true, message: 'No items to merge' });
    }

    // Get or create user cart
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user!.id },
      });
    }

    // Merge items
    for (const item of guestCartItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product || product.status !== 'ACTIVE') continue;

      let unitPrice = product.salePrice || product.basePrice;
      if (item.variantId) {
        const variant = product.variants.find(v => v.id === item.variantId);
        if (variant) unitPrice = variant.price;
      }

      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId_variantId: {
            cartId: cart.id,
            productId: item.productId,
            variantId: item.variantId || null,
          },
        },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + item.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice,
          },
        });
      }
    }

    res.json({ success: true, message: 'Cart merged' });
  });
}

