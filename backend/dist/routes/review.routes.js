import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller.js';
import { authenticate, adminOnly, optionalAuth } from '../middleware/auth.js';
const router = Router();
const reviewController = new ReviewController();
// Public routes
router.get('/product/:productId', optionalAuth, reviewController.getProductReviews);
// Authenticated routes
router.post('/', authenticate, reviewController.createReview);
router.put('/:id', authenticate, reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);
router.post('/:id/helpful', authenticate, reviewController.markHelpful);
// Admin routes
router.get('/', adminOnly, reviewController.getAllReviews);
router.put('/:id/approve', adminOnly, reviewController.approveReview);
router.put('/:id/reject', adminOnly, reviewController.rejectReview);
export default router;
//# sourceMappingURL=review.routes.js.map