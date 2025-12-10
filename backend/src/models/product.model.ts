import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, unique: true, required: true },
    barcode: { type: String },
    attributes: { type: Map, of: String },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    stockQuantity: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    imageUrl: { type: String }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, unique: true, required: true },
    barcode: { type: String },
    shortDescription: { type: String },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    basePrice: { type: Number, required: true },
    salePrice: { type: Number },
    costPrice: { type: Number },
    discountPercent: { type: Number, default: 0 },
    taxRate: { type: Number, default: 18.00 },
    hsnCode: { type: String },
    stockQuantity: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    status: {
        type: String,
        enum: ['DRAFT', 'ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'DISCONTINUED'],
        default: 'DRAFT'
    },
    isFeatured: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    weight: { type: Number },
    weightUnit: { type: String, default: 'kg' },
    images: [{ type: String }],
    videos: [{ type: String }],
    technicalComposition: { type: String },
    keyFeatures: [{ type: String }],
    specifications: { type: Map, of: String },
    safetyTips: [{ type: String }],
    suitableCrops: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    viewCount: { type: Number, default: 0 },
    orderCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    searchKeywords: [{ type: String }],
    tags: [{ type: String }],
    publishedAt: { type: Date },
    deletedAt: { type: Date },
    variants: [variantSchema]
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
