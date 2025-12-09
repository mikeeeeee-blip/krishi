# Frontend-Backend Integration Guide

This guide explains how the frontend and backend are integrated and how to set them up.

## Overview

The frontend (Next.js) communicates with the backend (Express.js) through a centralized API client system. All API calls are handled through the `lib/api/` directory.

## Architecture

```
Frontend (Next.js)          Backend (Express.js)
├── lib/api/                ├── src/
│   ├── client.ts          │   ├── routes/
│   ├── auth.ts            │   ├── controllers/
│   ├── cart.ts            │   ├── middleware/
│   ├── orders.ts          │   └── config/
│   ├── products.ts        └── .env
│   └── categories.ts
├── contexts/
│   ├── AuthContext.tsx
│   └── CartContext.tsx
└── .env.local
```

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Or use the generator script
   # Windows:
   .\generate-env.ps1
   # Linux/Mac:
   ./generate-env.sh
   ```

4. Update `.env` file with your database connection:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   CORS_ORIGIN=http://localhost:3000
   ```

5. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

6. Start the backend server:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   npm start
   ```

The backend will run on `http://localhost:5000` by default.

### 2. Frontend Setup

1. Navigate to the project root:
   ```bash
   cd ..
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Create `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` with your backend URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

5. Start the frontend development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000` by default.

## API Client Architecture

### Centralized Client (`lib/api/client.ts`)

All API calls go through the centralized client which provides:
- Automatic authentication header injection
- Token refresh handling
- Error handling and response parsing
- CORS support with credentials

### API Modules

- **`auth.ts`**: Authentication (login, register, logout, profile)
- **`cart.ts`**: Shopping cart operations
- **`orders.ts`**: Order management (user and admin)
- **`products.ts`**: Product listing and details
- **`categories.ts`**: Category management

## Authentication Flow

1. User logs in through `AuthContext`
2. Tokens are stored in `localStorage`:
   - `accessToken`: Short-lived token (7 days)
   - `refreshToken`: Long-lived token (30 days)
3. All authenticated requests include `Authorization: Bearer <token>` header
4. On 401 errors, the client attempts to refresh the token
5. If refresh fails, user is redirected to login

## Cart Synchronization

The cart system works in two modes:

1. **Guest Mode**: Cart stored in `localStorage` only
2. **Authenticated Mode**: Cart synced with backend database

When a user logs in:
- Local cart items are synced to backend
- Future cart operations use backend API
- Cart persists across devices

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (development)
- Your production domain (configured in `CORS_ORIGIN`)

Make sure `CORS_ORIGIN` in backend `.env` matches your frontend URL.

## Environment Variables

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Backend (`.env`)

```env
NODE_ENV=development
PORT=5000
API_VERSION=v1
DATABASE_URL=postgresql://...
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=...
JWT_REFRESH_SECRET=...
```

## Testing the Integration

1. **Start both servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   ```

2. **Test Authentication**:
   - Navigate to `/login`
   - Register a new user or login
   - Check browser console for API calls

3. **Test Cart**:
   - Add items to cart
   - Login to sync cart with backend
   - Check cart persists after refresh

4. **Test Orders**:
   - Add items to cart
   - Proceed to checkout
   - Place an order
   - Check order appears in "My Orders"

## Troubleshooting

### CORS Errors

If you see CORS errors:
1. Check `CORS_ORIGIN` in backend `.env` matches frontend URL
2. Ensure backend is running
3. Check browser console for specific error

### Authentication Issues

If login fails:
1. Check backend is running on correct port
2. Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`
3. Check browser console for API errors
4. Verify database connection in backend

### Cart Not Syncing

If cart doesn't sync:
1. Ensure user is logged in
2. Check browser console for API errors
3. Verify cart API endpoints in backend
4. Check network tab for failed requests

## Production Deployment

### Backend

1. Set `NODE_ENV=production` in `.env`
2. Update `CORS_ORIGIN` to production frontend URL
3. Use secure JWT secrets
4. Configure database connection string
5. Set up reverse proxy (nginx) if needed

### Frontend

1. Update `NEXT_PUBLIC_API_URL` to production backend URL
2. Build the application: `npm run build`
3. Deploy to your hosting platform

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh-token` - Refresh access token

### Cart
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart/items` - Add item to cart
- `PUT /api/v1/cart/items/:productId` - Update cart item
- `DELETE /api/v1/cart/items/:productId` - Remove cart item
- `DELETE /api/v1/cart` - Clear cart

### Orders
- `GET /api/v1/orders/my-orders` - Get user orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/my-orders/:id` - Get order details
- `POST /api/v1/orders/:id/cancel` - Cancel order

### Products
- `GET /api/v1/products` - List products
- `GET /api/v1/products/:id` - Get product by ID
- `GET /api/v1/products/slug/:slug` - Get product by slug
- `GET /api/v1/products/featured` - Get featured products
- `GET /api/v1/products/bestsellers` - Get bestseller products
- `GET /api/v1/products/search` - Search products

### Categories
- `GET /api/v1/categories` - List categories
- `GET /api/v1/categories/tree` - Get category tree
- `GET /api/v1/categories/:id` - Get category by ID
- `GET /api/v1/categories/slug/:slug` - Get category by slug

## Support

For issues or questions:
1. Check the backend logs
2. Check browser console for frontend errors
3. Verify environment variables are set correctly
4. Ensure both servers are running

