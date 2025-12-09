# Order Management System Documentation

## Overview

A comprehensive web-based Order Management System with two dashboards:
1. **User Panel** - For customers to view and manage their orders
2. **Admin Panel** - For administrators to manage all orders with full control

## Features

### User Panel Features
- ✅ View all orders with status filtering
- ✅ Order details with full information
- ✅ Order cancellation (for pending/confirmed orders)
- ✅ Order tracking information
- ✅ Payment status and history
- ✅ Order statistics (total, pending, delivered, cancelled)
- ✅ Search by order number
- ✅ Pagination support

### Admin Panel Features
- ✅ Comprehensive order statistics dashboard
- ✅ View all orders with advanced filtering
- ✅ Search by order number, customer email, or name
- ✅ Date range filtering
- ✅ Status and payment status filters
- ✅ Update order status with tracking information
- ✅ Update payment status
- ✅ View customer information
- ✅ Order timeline tracking
- ✅ Real-time statistics (total orders, revenue, today's stats)

## File Structure

```
├── app/
│   ├── my-orders/
│   │   ├── page.tsx              # User order list page
│   │   └── [id]/
│   │       └── page.tsx          # User order detail page
│   └── admin/
│       └── orders/
│           ├── page.tsx          # Admin order list page
│           └── [id]/
│               └── page.tsx      # Admin order detail page
├── components/
│   └── orders/
│       ├── OrderCard.tsx         # Reusable order card component
│       ├── OrderStatusBadge.tsx  # Order status badge
│       └── PaymentStatusBadge.tsx # Payment status badge
└── lib/
    └── api/
        └── orders.ts             # Order API client functions
```

## API Endpoints

### User Endpoints
- `GET /api/v1/orders/my-orders` - Get user's orders
- `GET /api/v1/orders/my-orders/:id` - Get order details
- `POST /api/v1/orders/:id/cancel` - Cancel order

### Admin Endpoints
- `GET /api/v1/orders` - Get all orders (with filters)
- `GET /api/v1/orders/stats` - Get order statistics
- `GET /api/v1/orders/:id` - Get order details
- `PUT /api/v1/orders/:id/status` - Update order status
- `PUT /api/v1/orders/:id/payment-status` - Update payment status

## Order Status Flow

```
PENDING → CONFIRMED → PROCESSING → SHIPPED → OUT_FOR_DELIVERY → DELIVERED
                ↓
            CANCELLED
                ↓
            RETURNED → REFUNDED
```

## Payment Status Flow

```
PENDING → PAID
    ↓
FAILED
    ↓
REFUNDED / PARTIALLY_REFUNDED
```

## Usage

### User Dashboard

1. **Access User Orders**
   - Navigate to `/my-orders`
   - View all your orders with status badges
   - Filter by status (All, Pending, Confirmed, etc.)
   - Search by order number

2. **View Order Details**
   - Click "View Details" on any order
   - See complete order information:
     - Order items with images
     - Shipping address
     - Payment information
     - Order timeline
     - Tracking information (if shipped)

3. **Cancel Order**
   - Only available for PENDING or CONFIRMED orders
   - Click "Cancel Order" button
   - Provide cancellation reason
   - Order status updates to CANCELLED

### Admin Dashboard

1. **Access Admin Orders**
   - Navigate to `/admin/orders`
   - View comprehensive statistics:
     - Total orders
     - Pending orders
     - Delivered orders
     - Today's orders
     - Total revenue
     - Today's revenue

2. **Filter Orders**
   - Use advanced filters:
     - Order status
     - Payment status
     - Date range
     - Search by order number, email, or name

3. **Manage Orders**
   - Click "View Details" on any order
   - Update order status:
     - Select new status
     - Add tracking number (for SHIPPED status)
     - Add carrier name
   - Update payment status:
     - Select payment status
     - Add payment ID (transaction ID)

4. **View Customer Information**
   - See customer details:
     - Name
     - Email
     - Phone number
   - View shipping address

## Components

### OrderCard
Reusable component for displaying order information in a card format.

**Props:**
- `order` - Order object with all order data
- `isAdmin` - Boolean to show admin-specific information

### OrderStatusBadge
Displays order status with color-coded badges and icons.

**Status Colors:**
- PENDING: Yellow
- CONFIRMED: Blue
- PROCESSING: Indigo
- SHIPPED: Purple
- OUT_FOR_DELIVERY: Orange
- DELIVERED: Green
- CANCELLED: Red
- RETURNED: Pink
- REFUNDED: Gray

### PaymentStatusBadge
Displays payment status with color-coded badges.

**Status Colors:**
- PENDING: Yellow
- PAID: Green
- FAILED: Red
- REFUNDED: Blue
- PARTIALLY_REFUNDED: Orange

## API Client Functions

### User Functions
```typescript
// Get user orders
getUserOrders(filters?: OrderFilters): Promise<ApiResponse<Order[]>>

// Get order by ID
getUserOrderById(orderId: string): Promise<ApiResponse<Order>>

// Cancel order
cancelOrder(orderId: string, reason?: string): Promise<ApiResponse<Order>>
```

### Admin Functions
```typescript
// Get all orders
getAllOrders(filters?: OrderFilters): Promise<ApiResponse<Order[]>>

// Get order by ID
getOrderById(orderId: string): Promise<ApiResponse<Order>>

// Get order statistics
getOrderStats(dateFrom?: string, dateTo?: string): Promise<ApiResponse<OrderStats>>

// Update order status
updateOrderStatus(
  orderId: string,
  status: string,
  trackingNumber?: string,
  carrierName?: string
): Promise<ApiResponse<Order>>

// Update payment status
updatePaymentStatus(
  orderId: string,
  paymentStatus: string,
  paymentId?: string
): Promise<ApiResponse<Order>>
```

## Filter Options

### OrderFilters Interface
```typescript
interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

## Environment Variables

Add to your `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## Authentication

All order endpoints require authentication:
- User endpoints require user authentication
- Admin endpoints require admin role

The API client automatically includes the authentication token from:
1. `localStorage.getItem('accessToken')` (Bearer token)
2. httpOnly cookies (if using cookie-based auth)

## Error Handling

All API calls include error handling:
- Network errors
- Authentication errors
- Validation errors
- Server errors

Errors are displayed to users with appropriate messages and retry options.

## Responsive Design

All pages are fully responsive:
- Mobile-first design
- Tablet optimization
- Desktop layouts
- Touch-friendly interactions

## Future Enhancements

- [ ] Order export (CSV/PDF)
- [ ] Bulk order actions
- [ ] Order notes/comments
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Order analytics charts
- [ ] Customer order history
- [ ] Return/refund management
- [ ] Invoice generation
- [ ] Print order details

## Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **Authorization**: Admin endpoints check for admin role
3. **Input Validation**: All inputs are validated on both client and server
4. **XSS Protection**: All user inputs are sanitized
5. **CSRF Protection**: Using SameSite cookies and CSRF tokens

## Testing

To test the order management system:

1. **User Testing**:
   - Create a test order
   - View orders list
   - Filter by status
   - View order details
   - Cancel an order

2. **Admin Testing**:
   - View all orders
   - Filter and search orders
   - Update order status
   - Update payment status
   - View statistics

## Support

For issues or questions:
- Check API documentation
- Review error messages
- Check browser console for detailed errors
- Verify authentication tokens
- Ensure backend API is running

