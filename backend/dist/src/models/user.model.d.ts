import mongoose from 'mongoose';
export declare const User: mongoose.Model<{
    email: string;
    passwordHash: string;
    firstName: string;
    role: "CUSTOMER" | "SELLER" | "ADMIN" | "SUPER_ADMIN";
    status: "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
    emailVerified: boolean;
    phoneVerified: boolean;
    addresses: mongoose.Types.DocumentArray<{
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
    } & mongoose.DefaultTimestampProps> & {
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
    } & mongoose.DefaultTimestampProps>;
    phone?: string | null | undefined;
    lastName?: string | null | undefined;
    displayName?: string | null | undefined;
    avatarUrl?: string | null | undefined;
    lastLoginAt?: NativeDate | null | undefined;
    deletedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    email: string;
    passwordHash: string;
    firstName: string;
    role: "CUSTOMER" | "SELLER" | "ADMIN" | "SUPER_ADMIN";
    status: "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
    emailVerified: boolean;
    phoneVerified: boolean;
    addresses: mongoose.Types.DocumentArray<{
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
    } & mongoose.DefaultTimestampProps> & {
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
    } & mongoose.DefaultTimestampProps>;
    phone?: string | null | undefined;
    lastName?: string | null | undefined;
    displayName?: string | null | undefined;
    avatarUrl?: string | null | undefined;
    lastLoginAt?: NativeDate | null | undefined;
    deletedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    email: string;
    passwordHash: string;
    firstName: string;
    role: "CUSTOMER" | "SELLER" | "ADMIN" | "SUPER_ADMIN";
    status: "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
    emailVerified: boolean;
    phoneVerified: boolean;
    addresses: mongoose.Types.DocumentArray<{
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
    } & mongoose.DefaultTimestampProps> & {
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
    } & mongoose.DefaultTimestampProps>;
    phone?: string | null | undefined;
    lastName?: string | null | undefined;
    displayName?: string | null | undefined;
    avatarUrl?: string | null | undefined;
    lastLoginAt?: NativeDate | null | undefined;
    deletedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    email: string;
    passwordHash: string;
    firstName: string;
    role: "CUSTOMER" | "SELLER" | "ADMIN" | "SUPER_ADMIN";
    status: "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
    emailVerified: boolean;
    phoneVerified: boolean;
    addresses: mongoose.Types.DocumentArray<{
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
    } & mongoose.DefaultTimestampProps> & {
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
    } & mongoose.DefaultTimestampProps>;
    phone?: string | null | undefined;
    lastName?: string | null | undefined;
    displayName?: string | null | undefined;
    avatarUrl?: string | null | undefined;
    lastLoginAt?: NativeDate | null | undefined;
    deletedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    email: string;
    passwordHash: string;
    firstName: string;
    role: "CUSTOMER" | "SELLER" | "ADMIN" | "SUPER_ADMIN";
    status: "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
    emailVerified: boolean;
    phoneVerified: boolean;
    addresses: mongoose.Types.DocumentArray<{
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
    } & mongoose.DefaultTimestampProps> & {
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
    } & mongoose.DefaultTimestampProps>;
    phone?: string | null | undefined;
    lastName?: string | null | undefined;
    displayName?: string | null | undefined;
    avatarUrl?: string | null | undefined;
    lastLoginAt?: NativeDate | null | undefined;
    deletedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    email: string;
    passwordHash: string;
    firstName: string;
    role: "CUSTOMER" | "SELLER" | "ADMIN" | "SUPER_ADMIN";
    status: "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
    emailVerified: boolean;
    phoneVerified: boolean;
    addresses: mongoose.Types.DocumentArray<{
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
    } & mongoose.DefaultTimestampProps> & {
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
    } & mongoose.DefaultTimestampProps>;
    phone?: string | null | undefined;
    lastName?: string | null | undefined;
    displayName?: string | null | undefined;
    avatarUrl?: string | null | undefined;
    lastLoginAt?: NativeDate | null | undefined;
    deletedAt?: NativeDate | null | undefined;
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
        email: string;
        passwordHash: string;
        firstName: string;
        role: "CUSTOMER" | "SELLER" | "ADMIN" | "SUPER_ADMIN";
        status: "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
        emailVerified: boolean;
        phoneVerified: boolean;
        addresses: mongoose.Types.DocumentArray<{
            addressType: string;
            isDefault: boolean;
            fullName: string;
            phone: string;
            addressLine1: string;
            city: string;
            state: string;
            country: string;
            pincode: string;
            addressLine2?: string | null | undefined;
            landmark?: string | null | undefined;
        } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            addressType: string;
            isDefault: boolean;
            fullName: string;
            phone: string;
            addressLine1: string;
            city: string;
            state: string;
            country: string;
            pincode: string;
            addressLine2?: string | null | undefined;
            landmark?: string | null | undefined;
        } & mongoose.DefaultTimestampProps> & {
            addressType: string;
            isDefault: boolean;
            fullName: string;
            phone: string;
            addressLine1: string;
            city: string;
            state: string;
            country: string;
            pincode: string;
            addressLine2?: string | null | undefined;
            landmark?: string | null | undefined;
        } & mongoose.DefaultTimestampProps>;
        phone?: string | null | undefined;
        lastName?: string | null | undefined;
        displayName?: string | null | undefined;
        avatarUrl?: string | null | undefined;
        lastLoginAt?: NativeDate | null | undefined;
        deletedAt?: NativeDate | null | undefined;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        email: string;
        passwordHash: string;
        firstName: string;
        role: "CUSTOMER" | "SELLER" | "ADMIN" | "SUPER_ADMIN";
        status: "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
        emailVerified: boolean;
        phoneVerified: boolean;
        addresses: mongoose.Types.DocumentArray<{
            addressType: string;
            isDefault: boolean;
            fullName: string;
            phone: string;
            addressLine1: string;
            city: string;
            state: string;
            country: string;
            pincode: string;
            addressLine2?: string | null | undefined;
            landmark?: string | null | undefined;
        } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            addressType: string;
            isDefault: boolean;
            fullName: string;
            phone: string;
            addressLine1: string;
            city: string;
            state: string;
            country: string;
            pincode: string;
            addressLine2?: string | null | undefined;
            landmark?: string | null | undefined;
        } & mongoose.DefaultTimestampProps> & {
            addressType: string;
            isDefault: boolean;
            fullName: string;
            phone: string;
            addressLine1: string;
            city: string;
            state: string;
            country: string;
            pincode: string;
            addressLine2?: string | null | undefined;
            landmark?: string | null | undefined;
        } & mongoose.DefaultTimestampProps>;
        phone?: string | null | undefined;
        lastName?: string | null | undefined;
        displayName?: string | null | undefined;
        avatarUrl?: string | null | undefined;
        lastLoginAt?: NativeDate | null | undefined;
        deletedAt?: NativeDate | null | undefined;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    email: string;
    passwordHash: string;
    firstName: string;
    role: "CUSTOMER" | "SELLER" | "ADMIN" | "SUPER_ADMIN";
    status: "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
    emailVerified: boolean;
    phoneVerified: boolean;
    addresses: mongoose.Types.DocumentArray<{
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }> & {
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }>;
    phone?: string | null | undefined;
    lastName?: string | null | undefined;
    displayName?: string | null | undefined;
    avatarUrl?: string | null | undefined;
    lastLoginAt?: NativeDate | null | undefined;
    deletedAt?: NativeDate | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    email: string;
    passwordHash: string;
    firstName: string;
    role: "CUSTOMER" | "SELLER" | "ADMIN" | "SUPER_ADMIN";
    status: "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
    emailVerified: boolean;
    phoneVerified: boolean;
    addresses: mongoose.Types.DocumentArray<{
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }> & {
        addressType: string;
        isDefault: boolean;
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine2?: string | null | undefined;
        landmark?: string | null | undefined;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }>;
    phone?: string | null | undefined;
    lastName?: string | null | undefined;
    displayName?: string | null | undefined;
    avatarUrl?: string | null | undefined;
    lastLoginAt?: NativeDate | null | undefined;
    deletedAt?: NativeDate | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=user.model.d.ts.map