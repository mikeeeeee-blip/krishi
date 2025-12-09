import { Router } from 'express';
import { CartController } from '../controllers/cart.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = Router();
const cartController = new CartController();

// Cart routes (works for both authenticated and guest users)
router.get('/', optionalAuth, cartController.getCart);
router.post('/items', optionalAuth, cartController.addToCart);
router.put('/items/:productId', optionalAuth, cartController.updateCartItem);
router.delete('/items/:productId', optionalAuth, cartController.removeFromCart);
router.delete('/', optionalAuth, cartController.clearCart);

// Merge guest cart with user cart on login
router.post('/merge', authenticate, cartController.mergeCart);

export default router;

