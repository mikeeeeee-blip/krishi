import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    imageUrl: { type: String },
    iconName: { type: String },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    metaTitle: { type: String },
    metaDescription: { type: String },
    productCount: { type: Number, default: 0 }
}, { timestamps: true });

export const Category = mongoose.model('Category', categorySchema);
