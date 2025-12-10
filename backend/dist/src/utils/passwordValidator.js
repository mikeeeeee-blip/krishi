/**
 * Password validation utility
 * Enforces strong password requirements
 */
/**
 * Validate password strength
 * @param password Password to validate
 * @returns Validation result with errors array
 */
export const validatePassword = (password) => {
    const errors = [];
    if (!password) {
        errors.push('Password is required');
        return { isValid: false, errors };
    }
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (password.length > 128) {
        errors.push('Password must be less than 128 characters');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }
    // Check for common weak passwords
    const commonPasswords = [
        'password',
        'password123',
        '12345678',
        'qwerty',
        'abc123',
        'letmein',
        'welcome',
    ];
    if (commonPasswords.includes(password.toLowerCase())) {
        errors.push('Password is too common. Please choose a stronger password');
    }
    // Check for repeated characters (e.g., "aaaaaa")
    if (/(.)\1{3,}/.test(password)) {
        errors.push('Password contains too many repeated characters');
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
};
/**
 * Check if password is similar to user information
 * @param password Password to check
 * @param userInfo User information (email, name, etc.)
 */
export const isPasswordSimilarToUserInfo = (password, userInfo) => {
    const lowerPassword = password.toLowerCase();
    const lowerEmail = userInfo.email?.toLowerCase() || '';
    const lowerFirstName = userInfo.firstName?.toLowerCase() || '';
    const lowerLastName = userInfo.lastName?.toLowerCase() || '';
    // Check if password contains significant parts of user info
    if (lowerEmail && lowerEmail.length > 3) {
        const emailParts = lowerEmail.split('@')[0];
        if (lowerPassword.includes(emailParts) && emailParts.length > 3) {
            return true;
        }
    }
    if (lowerFirstName && lowerFirstName.length > 2 && lowerPassword.includes(lowerFirstName)) {
        return true;
    }
    if (lowerLastName && lowerLastName.length > 2 && lowerPassword.includes(lowerLastName)) {
        return true;
    }
    return false;
};
//# sourceMappingURL=passwordValidator.js.map