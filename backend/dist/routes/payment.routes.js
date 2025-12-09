import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
const paymentController = new PaymentController();
// Create payment order (Razorpay)
router.post('/create-order', authenticate, paymentController.createPaymentOrder);
// Verify payment
router.post('/verify', authenticate, paymentController.verifyPayment);
// Webhook for payment updates (no auth - verified by signature)
router.post('/webhook', paymentController.handleWebhook);
// Get payment status
router.get('/:orderId/status', authenticate, paymentController.getPaymentStatus);
export default router;
//# sourceMappingURL=payment.routes.js.map