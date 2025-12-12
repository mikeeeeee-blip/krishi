import mongoose from 'mongoose';
const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true }
}, { timestamps: true });
const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    userId: { type: String, required: true }, // Store user_id as string for easy access
    userName: { type: String }, // Store user's display name or full name
    userEmail: { type: String }, // Store user's email for reference
    sessionId: { type: String },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
    items: [cartItemSchema]
}, { timestamps: true });
export const Cart = mongoose.model('cart', cartSchema);
//# sourceMappingURL=cart.model.js.map