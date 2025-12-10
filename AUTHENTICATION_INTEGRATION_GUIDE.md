# Authentication Integration Guide

Complete guide for integrating frontend and backend authentication with proper CORS settings.

## Table of Contents
1. [Overview](#overview)
2. [CORS Explanation](#cors-explanation)
3. [Folder Structure](#folder-structure)
4. [Environment Variables](#environment-variables)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [Running the Project](#running-the-project)
8. [API Endpoints](#api-endpoints)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This authentication system provides:
- **Backend**: Node.js + Express + MongoDB with JWT authentication
- **Frontend**: React (Next.js) with localStorage token storage
- **Security**: bcrypt password hashing, JWT tokens, CORS protection
- **Features**: User registration, login, JWT token management

---

## CORS Explanation

### What is CORS?

**CORS (Cross-Origin Resource Sharing)** is a security mechanism implemented by web browsers that restricts web pages from making requests to a different domain, protocol, or port than the one serving the web page.

### Why is CORS Needed?

When your React frontend (running on `http://localhost:3000`) tries to make API calls to your backend (running on `http://localhost:5000`), the browser blocks these requests by default because they're from different origins (different ports).

### How CORS Works

1. **Browser sends a preflight request** (OPTIONS) before the actual request
2. **Server responds with CORS headers** indicating which origins are allowed
3. **Browser checks** if the frontend origin matches the allowed origins
4. **If allowed**, the browser proceeds with the actual request

### Our CORS Configuration

```javascript
// backend/src/index.ts
const corsOptions = {
  origin: ['http://localhost:3000'],  // Allow frontend origin
  credentials: true,                   // Allow cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400,                      // Cache preflight for 24 hours
};
```

**Key Settings:**
- `origin`: Specifies which frontend URLs can access the API
- `credentials: true`: Allows sending cookies and authorization headers
- `methods`: HTTP methods allowed
- `allowedHeaders`: Headers the frontend can send

---

## Folder Structure

### Backend Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── db.ts              # MongoDB connection
│   │   └── index.ts           # Configuration (env vars, JWT, etc.)
│   ├── controllers/
│   │   └── auth.controller.ts # Authentication logic (register, login)
│   ├── middleware/
│   │   ├── auth.ts            # JWT authentication middleware
│   │   ├── errorHandler.ts    # Error handling
│   │   └── validateRequest.ts # Request validation
│   ├── models/
│   │   └── user.model.ts      # User MongoDB schema
│   ├── routes/
│   │   ├── auth.routes.ts     # Auth route definitions
│   │   └── index.ts           # Route aggregator
│   ├── utils/
│   │   ├── tokenManager.ts    # JWT token generation/verification
│   │   └── passwordValidator.ts # Password validation
│   └── index.ts               # Express app setup & server start
├── .env                       # Environment variables (create this)
├── example.env                # Example environment file
├── package.json
└── tsconfig.json
```

### Frontend Structure
```
krishi/ (root)
├── app/
│   ├── login/
│   │   └── page.tsx           # Login page component
│   └── register/
│       └── page.tsx           # Register page component
├── components/                # Reusable components
├── contexts/
│   └── AuthContext.tsx        # Authentication context provider
├── lib/
│   └── api/
│       └── auth.ts            # API client for auth endpoints
├── .env.local                 # Frontend environment variables (create this)
├── package.json
└── next.config.ts
```

---

## Environment Variables

### Backend `.env` File Location

**Location**: `backend/.env`

Create this file in the `backend/` directory (copy from `backend/example.env`):

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database Configuration (MongoDB)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/krishi_backend?retryWrites=true&w=majority

# Security (JWT)
JWT_SECRET=your_jwt_secret_key_change_me_in_prod
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_change_me_in_prod
JWT_REFRESH_EXPIRES_IN=30d

# Security (Bcrypt)
BCRYPT_SALT_ROUNDS=12

# CORS - Allow frontend origin
CORS_ORIGIN=http://localhost:3000
```

**Important Notes:**
- Replace `<username>` and `<password>` with your MongoDB credentials
- Use a strong, random `JWT_SECRET` in production
- `CORS_ORIGIN` should match your frontend URL

### Frontend `.env.local` File Location

**Location**: `krishi/.env.local` (root directory, same level as `package.json`)

Create this file in the root directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

**Important Notes:**
- `NEXT_PUBLIC_` prefix makes the variable available in the browser
- Update the port if your backend runs on a different port
- In production, use your deployed backend URL

---

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp example.env .env
   ```

2. Edit `.env` and set:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong random secret (use `openssl rand -base64 32`)
   - `JWT_REFRESH_SECRET`: Another strong random secret
   - `CORS_ORIGIN`: `http://localhost:3000` (or your frontend URL)

### 3. Start MongoDB

Ensure MongoDB is running:
- **Local**: Start MongoDB service
- **Atlas**: Use your connection string in `MONGODB_URI`

### 4. Run Backend

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

Backend will run on `http://localhost:5000` (or the port in `.env`)

---

## Frontend Setup

### 1. Install Dependencies

```bash
# From root directory
npm install
```

### 2. Configure Environment Variables

1. Create `.env.local` in the root directory:
   ```bash
   # Create file
   touch .env.local
   ```

2. Add:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

### 3. Run Frontend

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

Frontend will run on `http://localhost:3000`

---

## Running the Project

### Step-by-Step Instructions

1. **Start MongoDB**
   - Local MongoDB: Ensure service is running
   - MongoDB Atlas: Verify connection string is correct

2. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   npm install          # If not already installed
   npm run dev
   ```
   You should see:
   ```
   🌱 KRISHANSHECLAT AGROXGLOBAL Backend API
   Server running on: http://localhost:5000
   MongoDB Connected: ...
   ```

3. **Start Frontend** (Terminal 2)
   ```bash
   # From root directory
   npm install          # If not already installed
   npm run dev
   ```
   You should see:
   ```
   ▲ Next.js 16.0.7
   - Local:        http://localhost:3000
   ```

4. **Test Authentication**
   - Open `http://localhost:3000/register`
   - Create an account
   - Login at `http://localhost:3000/login`

---

## API Endpoints

### POST `/api/v1/auth/register`

Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "username": "johndoe",        // Optional
  "firstName": "John",
  "lastName": "Doe",            // Optional
  "phone": "+1234567890"        // Optional
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CUSTOMER",
      "emailVerified": false
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Response (Error - 400/409):**
```json
{
  "success": false,
  "message": "An account with this email or phone already exists",
  "errors": []
}
```

### POST `/api/v1/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CUSTOMER",
      "emailVerified": false
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## Testing

### Manual Testing

1. **Register a New User**
   - Go to `http://localhost:3000/register`
   - Fill in the form
   - Submit
   - Check browser console for success/error
   - Check `localStorage` for `accessToken` and `refreshToken`

2. **Login**
   - Go to `http://localhost:3000/login`
   - Enter credentials
   - Submit
   - Verify redirect and token storage

3. **Check Network Tab**
   - Open browser DevTools → Network
   - Look for requests to `/api/v1/auth/register` or `/api/v1/auth/login`
   - Verify CORS headers in response:
     - `Access-Control-Allow-Origin: http://localhost:3000`
     - `Access-Control-Allow-Credentials: true`

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!",
    "firstName": "Test",
    "username": "testuser"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!"
  }'
```

---

## Troubleshooting

### CORS Errors

**Error**: `Access to fetch at 'http://localhost:5000/api/v1/auth/login' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solutions:**
1. Verify `CORS_ORIGIN` in `backend/.env` matches frontend URL exactly
2. Check backend is running and CORS middleware is configured
3. Ensure `credentials: true` is set in both backend CORS config and frontend fetch calls
4. Restart backend after changing `.env`

### Connection Refused

**Error**: `Failed to fetch` or `ECONNREFUSED`

**Solutions:**
1. Verify backend is running on the correct port
2. Check `NEXT_PUBLIC_API_URL` in frontend `.env.local` matches backend URL
3. Ensure no firewall is blocking the connection

### JWT Token Not Stored

**Issue**: Tokens not appearing in `localStorage`

**Solutions:**
1. Check browser console for errors
2. Verify `AuthContext` is properly storing tokens (see `contexts/AuthContext.tsx`)
3. Check API response includes `tokens` object
4. Verify `localStorage` is available (not in SSR context)

### MongoDB Connection Error

**Error**: `MongoServerError: Authentication failed`

**Solutions:**
1. Verify `MONGODB_URI` in `backend/.env` is correct
2. Check MongoDB credentials
3. Ensure MongoDB is running (local) or accessible (Atlas)
4. Whitelist your IP in MongoDB Atlas if using cloud

### Password Validation Errors

**Error**: `Password validation failed`

**Solutions:**
1. Password must be at least 8 characters
2. Should contain uppercase, lowercase, number, and special character
3. Check `backend/src/utils/passwordValidator.ts` for exact requirements

---

## Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use strong JWT secrets** - Generate with `openssl rand -base64 32`
3. **Use HTTPS in production** - Never send tokens over HTTP
4. **Set secure cookie flags** - `httpOnly`, `secure`, `sameSite` in production
5. **Validate all inputs** - Both frontend and backend
6. **Rate limiting** - Implement to prevent brute force attacks
7. **Password requirements** - Enforce strong passwords

---

## Code Structure Explanation

### Backend Flow

1. **Request arrives** → Express middleware stack
2. **CORS middleware** → Checks origin and sets headers
3. **Validation middleware** → Validates request body
4. **Controller** → Business logic (hash password, create user, generate tokens)
5. **Response** → JSON with user data and tokens

### Frontend Flow

1. **User submits form** → React component
2. **API call** → `lib/api/auth.ts` using axios
3. **Response handling** → `contexts/AuthContext.tsx`
4. **Token storage** → `localStorage.setItem('accessToken', ...)`
5. **State update** → User state updated, redirect to home

### JWT Storage

Tokens are stored in `localStorage`:
- `accessToken`: Short-lived (7 days), used for API authentication
- `refreshToken`: Long-lived (30 days), used to get new access tokens

**Note**: For production, consider using httpOnly cookies instead of localStorage for better XSS protection.

---

## Additional Resources

- [CORS MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [JWT.io](https://jwt.io/) - JWT token decoder
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Express CORS Middleware](https://expressjs.com/en/resources/middleware/cors.html)

---

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify all environment variables are set correctly
3. Check backend and frontend console logs
4. Verify MongoDB connection
5. Ensure both servers are running on correct ports

---

**Last Updated**: 2024
**Version**: 1.0.0

