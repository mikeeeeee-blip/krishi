# KRISHANSHECLAT AGROXGLOBAL Backend API

A robust, scalable backend API for the KRISHANSHECLAT AGROXGLOBAL e-commerce platform built with Express.js, TypeScript, and Prisma ORM.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Customer, Seller, Admin)
  - Password hashing with bcrypt
  - Refresh token support

- **Product Management**
  - Full CRUD operations
  - Product variants support
  - Category and brand management
  - Search and filtering
  - Pagination

- **Order Management**
  - Order creation and tracking
  - Multiple payment methods (COD, UPI, Cards)
  - Order status updates
  - Order history

- **Cart & Wishlist**
  - Add/remove items
  - Quantity management
  - Cart persistence

- **Reviews & Ratings**
  - Product reviews
  - Verified purchase badges
  - Review moderation

- **Payment Methods**
  - Cash on Delivery (COD)
  - Online payment methods (UPI, Cards, Net Banking)

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── lib/                # Shared libraries
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   └── index.ts            # Application entry point
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Validation**: express-validator

## 📦 Installation

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**
   ```bash
   # Copy the example env file and update values
   cp .env.example .env
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/eclat_agroxglobal?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login user |
| POST | `/api/v1/auth/refresh-token` | Refresh access token |
| POST | `/api/v1/auth/logout` | Logout user |
| GET | `/api/v1/auth/me` | Get current user profile |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/products` | Get all products |
| GET | `/api/v1/products/:id` | Get product by ID |
| GET | `/api/v1/products/search` | Search products |
| GET | `/api/v1/products/featured` | Get featured products |
| GET | `/api/v1/products/bestsellers` | Get bestsellers |
| POST | `/api/v1/products` | Create product (Seller/Admin) |
| PUT | `/api/v1/products/:id` | Update product (Seller/Admin) |
| DELETE | `/api/v1/products/:id` | Delete product (Seller/Admin) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/categories` | Get all categories |
| GET | `/api/v1/categories/tree` | Get category tree |
| GET | `/api/v1/categories/:id` | Get category by ID |
| GET | `/api/v1/categories/:id/products` | Get category products |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/orders/my-orders` | Get user's orders |
| GET | `/api/v1/orders/my-orders/:id` | Get order details |
| POST | `/api/v1/orders` | Create new order |
| POST | `/api/v1/orders/:id/cancel` | Cancel order |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/cart` | Get cart |
| POST | `/api/v1/cart/items` | Add item to cart |
| PUT | `/api/v1/cart/items/:productId` | Update cart item |
| DELETE | `/api/v1/cart/items/:productId` | Remove item from cart |
| DELETE | `/api/v1/cart` | Clear cart |


## 🧪 Scripts

```bash
# Development
npm run dev         # Start dev server with hot reload

# Build
npm run build       # Compile TypeScript

# Production
npm start           # Start production server

# Database
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate    # Run database migrations
npm run prisma:studio     # Open Prisma Studio
npm run prisma:push       # Push schema to database
npm run seed              # Seed database
```

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation
- SQL injection protection (via Prisma)
- XSS protection

## 🚀 Deployment

### Vercel Deployment

The backend is configured for Vercel serverless deployment. The setup includes:

- **Vercel Configuration**: `vercel.json` configures the serverless function
- **Serverless Entry Point**: `api/index.ts` serves as the Vercel serverless function handler
- **Automatic Detection**: The app automatically detects Vercel environment and runs as a serverless function

#### Deploying to Vercel

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm i -g vercel
   ```

2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Deploy to Vercel**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add all required environment variables from the `.env` file

5. **Build Configuration**
   - Vercel will automatically detect the `vercel.json` configuration
   - The build process will compile TypeScript and deploy the serverless function

#### Important Notes

- The backend runs as a serverless function on Vercel, not as a traditional server
- Make sure to set all required environment variables in Vercel dashboard
- Database connections should use connection pooling for serverless environments
- The `VERCEL` environment variable is automatically set by Vercel

#### Local Development vs Production

- **Local**: Runs as a traditional Express server on the configured port
- **Vercel**: Runs as a serverless function (no port binding needed)

## 📝 License

ISC

## 👨‍💻 Author

KRISHANSHECLAT AGROXGLOBAL Team

