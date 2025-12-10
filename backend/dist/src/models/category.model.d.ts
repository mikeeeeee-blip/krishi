import mongoose from 'mongoose';
export declare const Category: mongoose.Model<{
    name: string;
    isActive: boolean;
    displayOrder: number;
    slug: string;
    isFeatured: boolean;
    parentId: mongoose.Types.ObjectId;
    productCount: number;
    description?: string | null | undefined;
    imageUrl?: string | null | undefined;
    metaTitle?: string | null | undefined;
    metaDescription?: string | null | undefined;
    iconName?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    isActive: boolean;
    displayOrder: number;
    slug: string;
    isFeatured: boolean;
    parentId: mongoose.Types.ObjectId;
    productCount: number;
    description?: string | null | undefined;
    imageUrl?: string | null | undefined;
    metaTitle?: string | null | undefined;
    metaDescription?: string | null | undefined;
    iconName?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    isActive: boolean;
    displayOrder: number;
    slug: string;
    isFeatured: boolean;
    parentId: mongoose.Types.ObjectId;
    productCount: number;
    description?: string | null | undefined;
    imageUrl?: string | null | undefined;
    metaTitle?: string | null | undefined;
    metaDescription?: string | null | undefined;
    iconName?: string | null | undefined;
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
    displayOrder: number;
    slug: string;
    isFeatured: boolean;
    parentId: mongoose.Types.ObjectId;
    productCount: number;
    description?: string | null | undefined;
    imageUrl?: string | null | undefined;
    metaTitle?: string | null | undefined;
    metaDescription?: string | null | undefined;
    iconName?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    isActive: boolean;
    displayOrder: number;
    slug: string;
    isFeatured: boolean;
    parentId: mongoose.Types.ObjectId;
    productCount: number;
    description?: string | null | undefined;
    imageUrl?: string | null | undefined;
    metaTitle?: string | null | undefined;
    metaDescription?: string | null | undefined;
    iconName?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    name: string;
    isActive: boolean;
    displayOrder: number;
    slug: string;
    isFeatured: boolean;
    parentId: mongoose.Types.ObjectId;
    productCount: number;
    description?: string | null | undefined;
    imageUrl?: string | null | undefined;
    metaTitle?: string | null | undefined;
    metaDescription?: string | null | undefined;
    iconName?: string | null | undefined;
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
        displayOrder: number;
        slug: string;
        isFeatured: boolean;
        parentId: mongoose.Types.ObjectId;
        productCount: number;
        description?: string | null | undefined;
        imageUrl?: string | null | undefined;
        metaTitle?: string | null | undefined;
        metaDescription?: string | null | undefined;
        iconName?: string | null | undefined;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        name: string;
        isActive: boolean;
        displayOrder: number;
        slug: string;
        isFeatured: boolean;
        parentId: mongoose.Types.ObjectId;
        productCount: number;
        description?: string | null | undefined;
        imageUrl?: string | null | undefined;
        metaTitle?: string | null | undefined;
        metaDescription?: string | null | undefined;
        iconName?: string | null | undefined;
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
    displayOrder: number;
    slug: string;
    isFeatured: boolean;
    parentId: mongoose.Types.ObjectId;
    productCount: number;
    description?: string | null | undefined;
    imageUrl?: string | null | undefined;
    metaTitle?: string | null | undefined;
    metaDescription?: string | null | undefined;
    iconName?: string | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    isActive: boolean;
    displayOrder: number;
    slug: string;
    isFeatured: boolean;
    parentId: mongoose.Types.ObjectId;
    productCount: number;
    description?: string | null | undefined;
    imageUrl?: string | null | undefined;
    metaTitle?: string | null | undefined;
    metaDescription?: string | null | undefined;
    iconName?: string | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=category.model.d.ts.map