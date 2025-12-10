import { Router } from 'express';
import { CartController } from '../controllers/cart.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = Router();
const cartController = new CartController();

// Cart routes
// GET cart - optional auth (for guest users)
router.get('/', optionalAuth, cartController.getCart);
// POST, PUT, DELETE - require authentication (users must be logged in)
router.post('/items', authenticate, cartController.addToCart);
router.put('/items/:productId', authenticate, cartController.updateCartItem);
router.delete('/items/:productId', authenticate, cartController.removeFromCart);
router.delete('/', authenticate, cartController.clearCart);

// Merge guest cart with user cart on login
router.post('/merge', authenticate, cartController.mergeCart);

export default router;

