import mongoose from 'mongoose';
export declare const Cart: mongoose.Model<{
    isActive: boolean;
    items: mongoose.Types.DocumentArray<{
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
    } & mongoose.DefaultTimestampProps> & {
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
    } & mongoose.DefaultTimestampProps>;
    user?: mongoose.Types.ObjectId | null | undefined;
    sessionId?: string | null | undefined;
    expiresAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    isActive: boolean;
    items: mongoose.Types.DocumentArray<{
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
    } & mongoose.DefaultTimestampProps> & {
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
    } & mongoose.DefaultTimestampProps>;
    user?: mongoose.Types.ObjectId | null | undefined;
    sessionId?: string | null | undefined;
    expiresAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    isActive: boolean;
    items: mongoose.Types.DocumentArray<{
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
    } & mongoose.DefaultTimestampProps> & {
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
    } & mongoose.DefaultTimestampProps>;
    user?: mongoose.Types.ObjectId | null | undefined;
    sessionId?: string | null | undefined;
    expiresAt?: NativeDate | null | undefined;
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
    items: mongoose.Types.DocumentArray<{
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
    } & mongoose.DefaultTimestampProps> & {
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
    } & mongoose.DefaultTimestampProps>;
    user?: mongoose.Types.ObjectId | null | undefined;
    sessionId?: string | null | undefined;
    expiresAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    isActive: boolean;
    items: mongoose.Types.DocumentArray<{
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
    } & mongoose.DefaultTimestampProps> & {
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
    } & mongoose.DefaultTimestampProps>;
    user?: mongoose.Types.ObjectId | null | undefined;
    sessionId?: string | null | undefined;
    expiresAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    isActive: boolean;
    items: mongoose.Types.DocumentArray<{
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
    } & mongoose.DefaultTimestampProps> & {
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
    } & mongoose.DefaultTimestampProps>;
    user?: mongoose.Types.ObjectId | null | undefined;
    sessionId?: string | null | undefined;
    expiresAt?: NativeDate | null | undefined;
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
        items: mongoose.Types.DocumentArray<{
            product: mongoose.Types.ObjectId;
            quantity: number;
            unitPrice: number;
            variantId?: string | null | undefined;
        } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            product: mongoose.Types.ObjectId;
            quantity: number;
            unitPrice: number;
            variantId?: string | null | undefined;
        } & mongoose.DefaultTimestampProps> & {
            product: mongoose.Types.ObjectId;
            quantity: number;
            unitPrice: number;
            variantId?: string | null | undefined;
        } & mongoose.DefaultTimestampProps>;
        user?: mongoose.Types.ObjectId | null | undefined;
        sessionId?: string | null | undefined;
        expiresAt?: NativeDate | null | undefined;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        isActive: boolean;
        items: mongoose.Types.DocumentArray<{
            product: mongoose.Types.ObjectId;
            quantity: number;
            unitPrice: number;
            variantId?: string | null | undefined;
        } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            product: mongoose.Types.ObjectId;
            quantity: number;
            unitPrice: number;
            variantId?: string | null | undefined;
        } & mongoose.DefaultTimestampProps> & {
            product: mongoose.Types.ObjectId;
            quantity: number;
            unitPrice: number;
            variantId?: string | null | undefined;
        } & mongoose.DefaultTimestampProps>;
        user?: mongoose.Types.ObjectId | null | undefined;
        sessionId?: string | null | undefined;
        expiresAt?: NativeDate | null | undefined;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    isActive: boolean;
    items: mongoose.Types.DocumentArray<{
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } | {
        product: string;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
        createdAt: NativeDate;
        updatedAt: NativeDate;
        _id: string;
    }, mongoose.Types.Subdocument<string | mongoose.mongo.BSON.ObjectId, unknown, {
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } | {
        product: string;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
        createdAt: NativeDate;
        updatedAt: NativeDate;
        _id: string;
    }> & ({
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } | {
        product: string;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
        createdAt: NativeDate;
        updatedAt: NativeDate;
        _id: string;
    })>;
    user?: mongoose.Types.ObjectId | null | undefined;
    sessionId?: string | null | undefined;
    expiresAt?: NativeDate | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    isActive: boolean;
    items: mongoose.Types.DocumentArray<{
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } | {
        product: string;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
        createdAt: NativeDate;
        updatedAt: NativeDate;
        _id: string;
    }, mongoose.Types.Subdocument<string | mongoose.mongo.BSON.ObjectId, unknown, {
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } | {
        product: string;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
        createdAt: NativeDate;
        updatedAt: NativeDate;
        _id: string;
    }> & ({
        product: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } | {
        product: string;
        quantity: number;
        unitPrice: number;
        variantId?: string | null | undefined;
        createdAt: NativeDate;
        updatedAt: NativeDate;
        _id: string;
    })>;
    user?: mongoose.Types.ObjectId | null | undefined;
    sessionId?: string | null | undefined;
    expiresAt?: NativeDate | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=cart.model.d.ts.map