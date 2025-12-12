import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { authenticate, adminOnly, optionalAuth } from '../middleware/auth.js';

const router = Router();
const orderController = new OrderController();

// Public route - Track order by order number (no authentication required)
router.get('/track', orderController.trackOrder);

// All other routes require authentication
router.use(authenticate);

// Customer routes
router.get('/my-orders', orderController.getMyOrders);
router.get('/my-orders/:id', orderController.getOrderById);
router.get('/track/:id', orderController.trackOrderById); // Track own order by ID
router.post('/', orderController.createOrder);
router.post('/:id/cancel', orderController.cancelOrder);
router.put('/my-orders/:id/address', orderController.updateCustomerOrderAddress);

// Admin routes
router.get('/stats', adminOnly, orderController.getOrderStats);
router.get('/admin/track', adminOnly, orderController.adminTrackOrder);
router.get('/', adminOnly, orderController.getAllOrders);
router.get('/:id', adminOnly, orderController.getOrderByIdAdmin);
router.put('/:id/status', adminOnly, orderController.updateOrderStatus);
router.put('/:id/payment-status', adminOnly, orderController.updatePaymentStatus);
router.put('/:id/shipping-address', adminOnly, orderController.updateShippingAddress);
router.put('/:id/internal-notes', adminOnly, orderController.updateInternalNotes);

export default router;

