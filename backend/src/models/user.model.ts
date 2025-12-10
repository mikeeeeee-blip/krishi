import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    addressType: { type: String, default: 'shipping' },
    isDefault: { type: Boolean, default: false },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    landmark: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'India' },
    pincode: { type: String, required: true },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true, sparse: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    displayName: { type: String },
    avatarUrl: { type: String },
    role: {
        type: String,
        enum: ['CUSTOMER', 'SELLER', 'ADMIN', 'SUPER_ADMIN'],
        default: 'CUSTOMER'
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'],
        default: 'PENDING_VERIFICATION'
    },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    deletedAt: { type: Date },
    addresses: [addressSchema]
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
