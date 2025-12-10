import mongoose from 'mongoose';
export declare const Brand: mongoose.Model<{
    name: string;
    isActive: boolean;
    slug: string;
    isFeatured: boolean;
    description?: string | null | undefined;
    logoUrl?: string | null | undefined;
    websiteUrl?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    isActive: boolean;
    slug: string;
    isFeatured: boolean;
    description?: string | null | undefined;
    logoUrl?: string | null | undefined;
    websiteUrl?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    isActive: boolean;
    slug: string;
    isFeatured: boolean;
    description?: string | null | undefined;
    logoUrl?: string | null | undefined;
    websiteUrl?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    isActive: boolean;
    slug: string;
    isFeatured: boolean;
    description?: string | null | undefined;
    logoUrl?: string | null | undefined;
    websiteUrl?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    isActive: boolean;
    slug: string;
    isFeatured: boolean;
    description?: string | null | undefined;
    logoUrl?: string | null | undefined;
    websiteUrl?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    name: string;
    isActive: boolean;
    slug: string;
    isFeatured: boolean;
    description?: string | null | undefined;
    logoUrl?: string | null | undefined;
    websiteUrl?: string | null | undefined;
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
        name: string;
        isActive: boolean;
        slug: string;
        isFeatured: boolean;
        description?: string | null | undefined;
        logoUrl?: string | null | undefined;
        websiteUrl?: string | null | undefined;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        name: string;
        isActive: boolean;
        slug: string;
        isFeatured: boolean;
        description?: string | null | undefined;
        logoUrl?: string | null | undefined;
        websiteUrl?: string | null | undefined;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    name: string;
    isActive: boolean;
    slug: string;
    isFeatured: boolean;
    description?: string | null | undefined;
    logoUrl?: string | null | undefined;
    websiteUrl?: string | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    isActive: boolean;
    slug: string;
    isFeatured: boolean;
    description?: string | null | undefined;
    logoUrl?: string | null | undefined;
    websiteUrl?: string | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=brand.model.d.ts.map