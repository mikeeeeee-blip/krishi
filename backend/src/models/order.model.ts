import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    variant: { type: mongoose.Schema.Types.ObjectId }, // Variant is embedded in Product, so we just keep ID
    productName: { type: String, required: true },
    productSku: { type: String },
    variantName: { type: String },
    productImage: { type: String },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED'],
        default: 'PENDING'
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'],
        default: 'PENDING'
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'WALLET'],
        required: true
    },
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    shippingAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    couponCode: { type: String },
    shippingAddress: { type: Map, of: mongoose.Schema.Types.Mixed, required: true },
    billingAddress: { type: Map, of: mongoose.Schema.Types.Mixed },
    trackingNumber: { type: String },
    carrierName: { type: String },
    paymentId: { type: String },
    paymentGateway: { type: String },
    paidAt: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
    customerNotes: { type: String },
    internalNotes: { type: String },
    items: [orderItemSchema]
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
