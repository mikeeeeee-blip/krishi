import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    logoUrl: { type: String },
    websiteUrl: { type: String },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

export const Brand = mongoose.model('Brand', brandSchema);
