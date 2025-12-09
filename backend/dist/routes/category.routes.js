import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
const router = Router();
const categoryController = new CategoryController();
// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/tree', categoryController.getCategoryTree);
router.get('/:id', categoryController.getCategoryById);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/:id/products', categoryController.getCategoryProducts);
// Admin routes
router.post('/', authenticate, adminOnly, categoryController.createCategory);
router.put('/:id', authenticate, adminOnly, categoryController.updateCategory);
router.delete('/:id', authenticate, adminOnly, categoryController.deleteCategory);
export default router;
//# sourceMappingURL=category.routes.js.map