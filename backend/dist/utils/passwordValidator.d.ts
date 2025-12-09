/**
 * Password validation utility
 * Enforces strong password requirements
 */
export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
}
/**
 * Validate password strength
 * @param password Password to validate
 * @returns Validation result with errors array
 */
export declare const validatePassword: (password: string) => PasswordValidationResult;
/**
 * Check if password is similar to user information
 * @param password Password to check
 * @param userInfo User information (email, name, etc.)
 */
export declare const isPasswordSimilarToUserInfo: (password: string, userInfo: {
    email?: string;
    firstName?: string;
    lastName?: string;
}) => boolean;
//# sourceMappingURL=passwordValidator.d.ts.map