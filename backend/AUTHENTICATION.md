# Authentication System Documentation

## Overview

This authentication system implements secure JWT-based authentication with support for both **httpOnly cookies** and **Bearer tokens** (for API clients). It includes comprehensive security measures to protect against common attacks.

## Security Features

### 1. Password Security
- **Bcrypt hashing** with configurable salt rounds (default: 12)
- **Strong password validation**:
  - Minimum 8 characters, maximum 128 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
  - Checks against common weak passwords
  - Prevents repeated characters
  - Prevents passwords similar to user information

### 2. JWT Token Management
- **Access tokens**: Short-lived (default: 7 days)
- **Refresh tokens**: Long-lived (default: 30 days)
- **Token rotation**: New refresh token issued on refresh
- **Token type verification**: Prevents access token being used as refresh token
- **Issuer and audience validation**: Prevents token reuse across different systems

### 3. Rate Limiting
- **Authentication endpoints**: 5 attempts per 15 minutes (prevents brute force)
- **Email + IP based**: Prevents distributed attacks
- **Other endpoints**: Configurable rate limits
- **Rate limit headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### 4. Security Headers
- **Helmet.js**: Sets security headers (XSS protection, content security policy, etc.)
- **CORS**: Configured with credentials support for cookies
- **SameSite cookies**: Set to 'strict' for CSRF protection

### 5. Account Protection
- **Account status checks**: Only ACTIVE accounts can authenticate
- **Soft deletes**: Deleted accounts cannot authenticate
- **Email enumeration prevention**: Generic error messages
- **Timing attack prevention**: Constant-time password comparison

## JWT Storage: httpOnly Cookies vs localStorage

### httpOnly Cookies (Recommended for Web Apps)

**Pros:**
- ✅ **XSS Protection**: JavaScript cannot access httpOnly cookies
- ✅ **Automatic sending**: Cookies are sent with every request automatically
- ✅ **CSRF protection**: Can use SameSite attribute
- ✅ **Secure by default**: Can set Secure flag for HTTPS-only
- ✅ **No manual token management**: Browser handles storage and expiration

**Cons:**
- ❌ **CSRF vulnerability**: Without proper SameSite/CSRF tokens, vulnerable to CSRF attacks
- ❌ **Larger request size**: Cookies add to every request header
- ❌ **CORS complexity**: Requires credentials: true
- ❌ **Not suitable for mobile apps**: Native apps don't use cookies

**Best for:**
- Web applications (React, Vue, Angular)
- Same-origin requests
- When you control both frontend and backend domains

### localStorage (Alternative for API Clients)

**Pros:**
- ✅ **No CSRF risk**: Not automatically sent with requests
- ✅ **Full control**: Frontend controls when to send token
- ✅ **Works with mobile apps**: Native apps can use secure storage
- ✅ **Smaller requests**: Only sent when needed (Authorization header)
- ✅ **Better for APIs**: Standard Bearer token approach

**Cons:**
- ❌ **XSS vulnerability**: JavaScript can access localStorage
- ❌ **Manual management**: Frontend must handle token storage and refresh
- ❌ **No automatic expiration**: Must implement token refresh logic
- ❌ **Larger attack surface**: If XSS occurs, tokens are immediately accessible

**Best for:**
- Mobile applications (React Native, Flutter)
- Third-party API clients
- SPAs that need fine-grained token control
- When frontend and backend are on different domains

## Implementation

### Current Implementation

The system supports **both methods**:

1. **httpOnly Cookies** (default for web):
   - Tokens are set as httpOnly cookies automatically
   - Cookies are sent with every request
   - Frontend doesn't need to manage tokens

2. **Bearer Tokens** (for API clients):
   - Tokens are also returned in response body
   - Client can store in localStorage/memory
   - Client sends in `Authorization: Bearer <token>` header

### Authentication Middleware

The `authenticate` middleware checks for tokens in this order:
1. `Authorization: Bearer <token>` header
2. `accessToken` httpOnly cookie

This allows flexibility for different client types.

## API Endpoints

### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890" // optional
}
```

**Response:**
- Sets `accessToken` and `refreshToken` as httpOnly cookies
- Returns tokens in response body (for localStorage option)
- Returns user data (without password hash)

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
- Sets `accessToken` and `refreshToken` as httpOnly cookies
- Returns tokens in response body
- Returns user data

### Refresh Token
```http
POST /api/v1/auth/refresh-token
Cookie: refreshToken=<token>
# OR
Content-Type: application/json
{
  "refreshToken": "<token>"
}
```

**Response:**
- Issues new access and refresh tokens
- Sets new cookies
- Returns new tokens in response body

### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
# OR
Cookie: accessToken=<token>
```

**Response:**
- Clears httpOnly cookies
- Returns success message

### Get Profile
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
# OR
Cookie: accessToken=<token>
```

## Frontend Integration Examples

### Using httpOnly Cookies (React)

```typescript
// Login
const login = async (email: string, password: string) => {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important: sends cookies
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  // Cookies are automatically set, no need to store tokens
  return data;
};

// Authenticated requests
const fetchUserData = async () => {
  const response = await fetch('/api/v1/auth/me', {
    credentials: 'include', // Sends cookies automatically
  });
  return response.json();
};
```

### Using Bearer Tokens (React)

```typescript
// Login
const login = async (email: string, password: string) => {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  // Store tokens in localStorage or memory
  localStorage.setItem('accessToken', data.data.tokens.accessToken);
  localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
  return data;
};

// Authenticated requests
const fetchUserData = async () => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch('/api/v1/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};
```

## Security Best Practices

1. **Always use HTTPS in production** - Required for secure cookies
2. **Implement CSRF protection** - Use CSRF tokens or SameSite cookies
3. **Token rotation** - Refresh tokens are rotated on each use
4. **Short token expiration** - Access tokens expire quickly
5. **Rate limiting** - Prevents brute force attacks
6. **Input validation** - All inputs are validated and sanitized
7. **Error messages** - Generic messages prevent user enumeration
8. **Password strength** - Enforced at registration and password change
9. **Account status checks** - Only active accounts can authenticate
10. **Audit logging** - Log authentication events (to be implemented)

## Environment Variables

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-token-secret-min-32-characters
JWT_REFRESH_EXPIRES_IN=30d

# Bcrypt
BCRYPT_SALT_ROUNDS=12

# CORS (must include credentials)
CORS_ORIGIN=https://your-frontend-domain.com
```

## Recommendations

### For Web Applications:
- ✅ Use **httpOnly cookies** (default implementation)
- ✅ Set `credentials: 'include'` in fetch requests
- ✅ Implement CSRF protection
- ✅ Use SameSite='strict' cookies
- ✅ Enable Secure flag in production

### For Mobile/API Clients:
- ✅ Use **Bearer tokens** in Authorization header
- ✅ Store tokens in secure storage (Keychain/Keystore)
- ✅ Implement token refresh logic
- ✅ Clear tokens on logout
- ✅ Handle token expiration gracefully

## Future Enhancements

1. **Token blacklisting** - Redis-based token revocation
2. **Multi-factor authentication** - 2FA/OTP support
3. **OAuth integration** - Social login (Google, Facebook)
4. **Session management** - Track active sessions
5. **Device fingerprinting** - Detect suspicious logins
6. **Password history** - Prevent password reuse
7. **Account lockout** - Temporary lock after failed attempts

