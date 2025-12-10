import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
const router = Router();
const orderController = new OrderController();
// All routes require authentication
router.use(authenticate);
// Customer routes
router.get('/my-orders', orderController.getMyOrders);
router.get('/my-orders/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.post('/:id/cancel', orderController.cancelOrder);
// Admin routes
router.get('/stats', adminOnly, orderController.getOrderStats);
router.get('/', adminOnly, orderController.getAllOrders);
router.get('/:id', adminOnly, orderController.getOrderByIdAdmin);
router.put('/:id/status', adminOnly, orderController.updateOrderStatus);
router.put('/:id/payment-status', adminOnly, orderController.updatePaymentStatus);
export default router;
//# sourceMappingURL=order.routes.js.map