import { validationResult } from 'express-validator';
import { ApiError } from './errorHandler.js';
export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => ({
            field: 'path' in error ? error.path : 'unknown',
            message: error.msg,
        }));
        throw new ApiError(400, 'Validation failed', formattedErrors);
    }
    next();
};
//# sourceMappingURL=validateRequest.js.map