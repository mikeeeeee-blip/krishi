import { validationResult } from 'express-validator';
import { ApiError } from './errorHandler.js';
export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => {
            const field = 'path' in error ? String(error.path) : 'unknown';
            return {
                field,
                message: error.msg,
            };
        });
        // Create a more descriptive error message
        const errorMessages = formattedErrors.map((e) => `${e.field}: ${e.message}`).join('; ');
        throw new ApiError(400, `Validation failed: ${errorMessages}`, formattedErrors);
    }
    next();
};
//# sourceMappingURL=validateRequest.js.map