import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
const router = Router();
const userController = new UserController();
// All routes require authentication
router.use(authenticate);
// User addresses
router.get('/addresses', userController.getAddresses);
router.post('/addresses', userController.addAddress);
router.put('/addresses/:id', userController.updateAddress);
router.delete('/addresses/:id', userController.deleteAddress);
router.put('/addresses/:id/default', userController.setDefaultAddress);
// Admin routes
router.get('/', adminOnly, userController.getAllUsers);
router.get('/:id', adminOnly, userController.getUserById);
router.put('/:id/status', adminOnly, userController.updateUserStatus);
export default router;
//# sourceMappingURL=user.routes.js.map