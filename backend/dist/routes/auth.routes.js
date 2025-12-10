import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate, verifyRefreshToken } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
const router = Router();
const authController = new AuthController();
// Validation rules
const registerValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required')
        .isLength({ max: 255 })
        .withMessage('Email must be less than 255 characters'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters'),
    body('username')
        .trim()
        .optional()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ max: 100 })
        .withMessage('First name must be less than 100 characters'),
    body('lastName')
        .trim()
        .optional()
        .isLength({ max: 100 })
        .withMessage('Last name must be less than 100 characters'),
    body('phone')
        .optional({ values: 'falsy' }) // Allow empty strings, null, undefined
        .custom((value) => {
        // If phone is provided, validate it; otherwise allow empty
        if (value && value.trim() !== '') {
            // Use a more lenient phone validation
            const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
            if (!phoneRegex.test(value.trim())) {
                throw new Error('Valid phone number required');
            }
        }
        return true;
    })
        .withMessage('Valid phone number required'),
];
const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];
const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 8, max: 128 })
        .withMessage('New password must be between 8 and 128 characters'),
];
// Auth routes
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.post('/refresh-token', verifyRefreshToken, authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.post('/forgot-password', body('email').isEmail().normalizeEmail(), validateRequest, authController.forgotPassword);
router.post('/reset-password', body('token').notEmpty().withMessage('Reset token is required'), body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters'), validateRequest, authController.resetPassword);
router.get('/me', authenticate, authController.getProfile);
router.put('/me', authenticate, authController.updateProfile);
router.put('/change-password', authenticate, changePasswordValidation, validateRequest, authController.changePassword);
export default router;
//# sourceMappingURL=auth.routes.js.map