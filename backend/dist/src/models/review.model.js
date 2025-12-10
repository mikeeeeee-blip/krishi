import mongoose from 'mongoose';
const reviewSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    content: { type: String },
    images: [{ type: String }],
    isVerifiedPurchase: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
    notHelpfulCount: { type: Number, default: 0 },
    sellerResponse: { type: String },
    sellerResponseAt: { type: Date }
}, { timestamps: true });
export const Review = mongoose.model('Review', reviewSchema);
//# sourceMappingURL=review.model.js.map