import mongoose from 'mongoose';
const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String },
    discountType: { type: String, required: true }, // percentage, fixed
    discountValue: { type: Number, required: true },
    maxDiscountAmount: { type: Number },
    minOrderAmount: { type: Number },
    maxUses: { type: Number },
    maxUsesPerUser: { type: Number, default: 1 },
    currentUses: { type: Number, default: 0 },
    startsAt: { type: Date },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
export const Coupon = mongoose.model('Coupon', couponSchema);
//# sourceMappingURL=coupon.model.js.map