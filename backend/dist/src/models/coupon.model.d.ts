import mongoose from 'mongoose';
export declare const Coupon: mongoose.Model<{
    isActive: boolean;
    code: string;
    discountType: string;
    discountValue: number;
    maxUsesPerUser: number;
    currentUses: number;
    description?: string | null | undefined;
    expiresAt?: NativeDate | null | undefined;
    maxDiscountAmount?: number | null | undefined;
    minOrderAmount?: number | null | undefined;
    maxUses?: number | null | undefined;
    startsAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    isActive: boolean;
    code: string;
    discountType: string;
    discountValue: number;
    maxUsesPerUser: number;
    currentUses: number;
    description?: string | null | undefined;
    expiresAt?: NativeDate | null | undefined;
    maxDiscountAmount?: number | null | undefined;
    minOrderAmount?: number | null | undefined;
    maxUses?: number | null | undefined;
    startsAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    isActive: boolean;
    code: string;
    discountType: string;
    discountValue: number;
    maxUsesPerUser: number;
    currentUses: number;
    description?: string | null | undefined;
    expiresAt?: NativeDate | null | undefined;
    maxDiscountAmount?: number | null | undefined;
    minOrderAmount?: number | null | undefined;
    maxUses?: number | null | undefined;
    startsAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    isActive: boolean;
    code: string;
    discountType: string;
    discountValue: number;
    maxUsesPerUser: number;
    currentUses: number;
    description?: string | null | undefined;
    expiresAt?: NativeDate | null | undefined;
    maxDiscountAmount?: number | null | undefined;
    minOrderAmount?: number | null | undefined;
    maxUses?: number | null | undefined;
    startsAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    isActive: boolean;
    code: string;
    discountType: string;
    discountValue: number;
    maxUsesPerUser: number;
    currentUses: number;
    description?: string | null | undefined;
    expiresAt?: NativeDate | null | undefined;
    maxDiscountAmount?: number | null | undefined;
    minOrderAmount?: number | null | undefined;
    maxUses?: number | null | undefined;
    startsAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    isActive: boolean;
    code: string;
    discountType: string;
    discountValue: number;
    maxUsesPerUser: number;
    currentUses: number;
    description?: string | null | undefined;
    expiresAt?: NativeDate | null | undefined;
    maxDiscountAmount?: number | null | undefined;
    minOrderAmount?: number | null | undefined;
    maxUses?: number | null | undefined;
    startsAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        isActive: boolean;
        code: string;
        discountType: string;
        discountValue: number;
        maxUsesPerUser: number;
        currentUses: number;
        description?: string | null | undefined;
        expiresAt?: NativeDate | null | undefined;
        maxDiscountAmount?: number | null | undefined;
        minOrderAmount?: number | null | undefined;
        maxUses?: number | null | undefined;
        startsAt?: NativeDate | null | undefined;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        isActive: boolean;
        code: string;
        discountType: string;
        discountValue: number;
        maxUsesPerUser: number;
        currentUses: number;
        description?: string | null | undefined;
        expiresAt?: NativeDate | null | undefined;
        maxDiscountAmount?: number | null | undefined;
        minOrderAmount?: number | null | undefined;
        maxUses?: number | null | undefined;
        startsAt?: NativeDate | null | undefined;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    isActive: boolean;
    code: string;
    discountType: string;
    discountValue: number;
    maxUsesPerUser: number;
    currentUses: number;
    description?: string | null | undefined;
    expiresAt?: NativeDate | null | undefined;
    maxDiscountAmount?: number | null | undefined;
    minOrderAmount?: number | null | undefined;
    maxUses?: number | null | undefined;
    startsAt?: NativeDate | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    isActive: boolean;
    code: string;
    discountType: string;
    discountValue: number;
    maxUsesPerUser: number;
    currentUses: number;
    description?: string | null | undefined;
    expiresAt?: NativeDate | null | undefined;
    maxDiscountAmount?: number | null | undefined;
    minOrderAmount?: number | null | undefined;
    maxUses?: number | null | undefined;
    startsAt?: NativeDate | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=coupon.model.d.ts.map