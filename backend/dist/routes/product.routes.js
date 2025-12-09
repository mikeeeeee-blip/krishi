import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { authenticate, sellerOnly, optionalAuth } from '../middleware/auth.js';
const router = Router();
const productController = new ProductController();
// Public routes
router.get('/', optionalAuth, productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/bestsellers', productController.getBestsellers);
router.get('/new-arrivals', productController.getNewArrivals);
router.get('/search', productController.searchProducts);
router.get('/:id', optionalAuth, productController.getProductById);
router.get('/slug/:slug', optionalAuth, productController.getProductBySlug);
router.get('/:id/similar', productController.getSimilarProducts);
// Protected routes (sellers/admins only)
router.post('/', authenticate, sellerOnly, productController.createProduct);
router.put('/:id', authenticate, sellerOnly, productController.updateProduct);
router.delete('/:id', authenticate, sellerOnly, productController.deleteProduct);
router.post('/:id/variants', authenticate, sellerOnly, productController.addVariant);
router.put('/:id/variants/:variantId', authenticate, sellerOnly, productController.updateVariant);
router.delete('/:id/variants/:variantId', authenticate, sellerOnly, productController.deleteVariant);
export default router;
//# sourceMappingURL=product.routes.js.map