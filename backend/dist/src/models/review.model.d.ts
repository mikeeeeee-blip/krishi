import mongoose from 'mongoose';
export declare const Review: mongoose.Model<{
    images: string[];
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    rating: number;
    isVerifiedPurchase: boolean;
    isApproved: boolean;
    helpfulCount: number;
    notHelpfulCount: number;
    order?: mongoose.Types.ObjectId | null | undefined;
    title?: string | null | undefined;
    content?: string | null | undefined;
    sellerResponse?: string | null | undefined;
    sellerResponseAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    images: string[];
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    rating: number;
    isVerifiedPurchase: boolean;
    isApproved: boolean;
    helpfulCount: number;
    notHelpfulCount: number;
    order?: mongoose.Types.ObjectId | null | undefined;
    title?: string | null | undefined;
    content?: string | null | undefined;
    sellerResponse?: string | null | undefined;
    sellerResponseAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    images: string[];
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    rating: number;
    isVerifiedPurchase: boolean;
    isApproved: boolean;
    helpfulCount: number;
    notHelpfulCount: number;
    order?: mongoose.Types.ObjectId | null | undefined;
    title?: string | null | undefined;
    content?: string | null | undefined;
    sellerResponse?: string | null | undefined;
    sellerResponseAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    images: string[];
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    rating: number;
    isVerifiedPurchase: boolean;
    isApproved: boolean;
    helpfulCount: number;
    notHelpfulCount: number;
    order?: mongoose.Types.ObjectId | null | undefined;
    title?: string | null | undefined;
    content?: string | null | undefined;
    sellerResponse?: string | null | undefined;
    sellerResponseAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    images: string[];
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    rating: number;
    isVerifiedPurchase: boolean;
    isApproved: boolean;
    helpfulCount: number;
    notHelpfulCount: number;
    order?: mongoose.Types.ObjectId | null | undefined;
    title?: string | null | undefined;
    content?: string | null | undefined;
    sellerResponse?: string | null | undefined;
    sellerResponseAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    images: string[];
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    rating: number;
    isVerifiedPurchase: boolean;
    isApproved: boolean;
    helpfulCount: number;
    notHelpfulCount: number;
    order?: mongoose.Types.ObjectId | null | undefined;
    title?: string | null | undefined;
    content?: string | null | undefined;
    sellerResponse?: string | null | undefined;
    sellerResponseAt?: NativeDate | null | undefined;
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
        images: string[];
        product: mongoose.Types.ObjectId;
        user: mongoose.Types.ObjectId;
        rating: number;
        isVerifiedPurchase: boolean;
        isApproved: boolean;
        helpfulCount: number;
        notHelpfulCount: number;
        order?: mongoose.Types.ObjectId | null | undefined;
        title?: string | null | undefined;
        content?: string | null | undefined;
        sellerResponse?: string | null | undefined;
        sellerResponseAt?: NativeDate | null | undefined;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        images: string[];
        product: mongoose.Types.ObjectId;
        user: mongoose.Types.ObjectId;
        rating: number;
        isVerifiedPurchase: boolean;
        isApproved: boolean;
        helpfulCount: number;
        notHelpfulCount: number;
        order?: mongoose.Types.ObjectId | null | undefined;
        title?: string | null | undefined;
        content?: string | null | undefined;
        sellerResponse?: string | null | undefined;
        sellerResponseAt?: NativeDate | null | undefined;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    images: string[];
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    rating: number;
    isVerifiedPurchase: boolean;
    isApproved: boolean;
    helpfulCount: number;
    notHelpfulCount: number;
    order?: mongoose.Types.ObjectId | null | undefined;
    title?: string | null | undefined;
    content?: string | null | undefined;
    sellerResponse?: string | null | undefined;
    sellerResponseAt?: NativeDate | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    images: string[];
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    rating: number;
    isVerifiedPurchase: boolean;
    isApproved: boolean;
    helpfulCount: number;
    notHelpfulCount: number;
    order?: mongoose.Types.ObjectId | null | undefined;
    title?: string | null | undefined;
    content?: string | null | undefined;
    sellerResponse?: string | null | undefined;
    sellerResponseAt?: NativeDate | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=review.model.d.ts.map