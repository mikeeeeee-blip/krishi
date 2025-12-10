import { Request, Response } from 'express';
import { Product } from '../models/product.model.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { getPagination } from '../utils/helpers.js';
import { PRODUCT_STATUS, PAGINATION } from '../constants/index.js';

export class ProductController {
  /**
   * Get all products with pagination and filters
   * GET /api/v1/products
   */
  getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const {
      page,
      limit,
      category,
      brand,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status = PRODUCT_STATUS.ACTIVE
    } = req.query;

    const query: any = { deletedAt: null };

    if (status) query.status = status;
    if (category) query.category = category;
    if (brand) query.brand = brand;

    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    const sortOptions: any = {};
    if (sortBy === 'price') sortOptions.basePrice = sortOrder === 'desc' ? -1 : 1;
    else if (sortBy === 'name') sortOptions.name = sortOrder === 'desc' ? -1 : 1;
    else sortOptions.createdAt = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const pageNum = Number(page) || PAGINATION.DEFAULT_PAGE;
    const limitNum = Number(limit) || PAGINATION.DEFAULT_LIMIT;
    const skip = (pageNum - 1) * limitNum;

    // Parallel execution for count and find
    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .populate('category', 'name slug')
        .populate('brand', 'name slug')
        .lean()
    ]);

    // Filter variants in memory to only show active ones
    const processedProducts = products.map((p: any) => ({
      ...p,
      variants: p.variants?.filter((v: any) => v.isActive).map((v: any) => ({
        id: v._id,
        name: v.name,
        price: v.price,
        stockQuantity: v.stockQuantity,
        isActive: v.isActive
      }))
    }));

    const pagination = getPagination(total, pageNum, limitNum);

    res.json({
      success: true,
      data: processedProducts,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        pages: pagination.pages,
      },
    });
  });

  // Get featured products
  getFeaturedProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await Product.find({
      isFeatured: true,
      status: 'ACTIVE',
      deletedAt: null
    })
      .limit(12)
      .populate('category', 'name slug')
      .populate('brand', 'name')
      .lean();

    res.json({ success: true, data: products });
  });

  // Get bestsellers
  getBestsellers = asyncHandler(async (req: Request, res: Response) => {
    const products = await Product.find({
      isBestseller: true,
      status: 'ACTIVE',
      deletedAt: null
    })
      .limit(12)
      .populate('category', 'name slug')
      .populate('brand', 'name')
      .lean();

    res.json({ success: true, data: products });
  });

  // Get new arrivals
  getNewArrivals = asyncHandler(async (req: Request, res: Response) => {
    const products = await Product.find({
      isNewArrival: true,
      status: 'ACTIVE',
      deletedAt: null
    })
      .sort({ createdAt: -1 })
      .limit(12)
      .populate('category', 'name slug')
      .populate('brand', 'name')
      .lean();

    res.json({ success: true, data: products });
  });

  // Search products
  searchProducts = asyncHandler(async (req: Request, res: Response) => {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q) {
      throw new ApiError(400, 'Search query required');
    }

    const searchTerm = String(q);
    const regex = new RegExp(searchTerm, 'i');

    const query = {
      status: 'ACTIVE',
      deletedAt: null,
      $or: [
        { name: regex },
        { description: regex },
        { tags: searchTerm }, // Exact match in array
        { searchKeywords: searchTerm }, // Exact match in array
      ]
    };

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;

    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('category', 'name slug')
        .populate('brand', 'name')
        .lean()
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  });

  // Get product by ID
  getProductById = asyncHandler(async (req: Request, res: Response) => {
    const product: any = await Product.findOne({ _id: req.params.id, deletedAt: null })
      .populate('category')
      .populate('brand')
      .populate('seller', 'firstName lastName') // Assuming seller is User
      .lean();

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Increment view count (fire and forget)
    Product.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } }).exec();

    // Since we need sorted variants and filtered reviews which are not simple refs:
    // Mongoose population for reviews might need a separate Review model query if Reviews are separate collection.
    // Yes, Review IS a separate model.
    // So we fetch reviews separately or use virtual populate if setup.
    // In migration, I created `Review` model. Product model doesn't have `reviews` array of IDs unless I added it.
    // I did NOT add `reviews` array to Product schema. So I must query Review model.

    // But wait, existing code expected `product.reviews`.
    // I should query reviews by productId.
    const { Review } = await import('../models/review.model.js');
    const reviews = await Review.find({ product: product._id, isApproved: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'firstName lastName')
      .lean();

    // Sort variants
    if (product.variants) {
      (product as any).variants = (product as any).variants
        .filter((v: any) => v.isActive)
        .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
    }

    res.json({ success: true, data: { ...product, reviews } });
  });

  // Get product by slug
  getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
    const product: any = await Product.findOne({ slug: req.params.slug, deletedAt: null })
      .populate('category')
      .populate('brand')
      .populate('seller', 'firstName lastName')
      .lean();

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    const { Review } = await import('../models/review.model.js');
    const reviews = await Review.find({ product: product._id, isApproved: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'firstName lastName')
      .lean();

    if (product.variants) {
      (product as any).variants = (product as any).variants
        .filter((v: any) => v.isActive)
        .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
    }

    res.json({ success: true, data: { ...product, reviews } });
  });

  // Get similar products
  getSimilarProducts = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id).select('category brand');

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    const similar = await Product.find({
      _id: { $ne: req.params.id },
      status: 'ACTIVE',
      deletedAt: null,
      $or: [
        { category: product.category },
        { brand: product.brand },
      ],
    })
      .limit(8)
      .populate('category', 'name slug')
      .populate('brand', 'name')
      .lean();

    res.json({ success: true, data: similar });
  });

  // Create product (seller/admin)
  createProduct = asyncHandler(async (req: Request, res: Response) => {
    const productData = {
      ...req.body,
      seller: req.user!.role === 'SELLER' ? req.user!.id : req.body.sellerId,
    };

    const product: any = await Product.create(productData);

    // Populate for response
    const populatedProduct: any = await Product.findById(product._id)
      .populate('category')
      .populate('brand');

    res.status(201).json({ success: true, data: populatedProduct });
  });

  // Update product
  updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existing = await Product.findById(id);
    if (!existing) {
      throw new ApiError(404, 'Product not found');
    }

    // Sellers can only update their own products
    if (req.user!.role === 'SELLER' && existing.seller?.toString() !== req.user!.id) {
      throw new ApiError(403, 'Not authorized to update this product');
    }

    const product = await Product.findByIdAndUpdate(id, req.body, { new: true })
      .populate('category')
      .populate('brand');

    res.json({ success: true, data: product });
  });

  // Delete product (soft delete)
  deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await Product.findByIdAndUpdate(id, {
      deletedAt: new Date(),
      status: 'DISCONTINUED'
    });

    res.json({ success: true, message: 'Product deleted' });
  });

  // Add variant
  addVariant = asyncHandler(async (req: Request, res: Response) => {
    const product: any = await Product.findByIdAndUpdate(
      req.params.id,
      { $push: { variants: req.body } },
      { new: true }
    );

    if (!product) throw new ApiError(404, 'Product not found');

    const variant = product.variants[product.variants.length - 1]; // Last added

    res.status(201).json({ success: true, data: variant });
  });

  // Update variant
  updateVariant = asyncHandler(async (req: Request, res: Response) => {
    const { variantId } = req.params;
    const updateData = req.body;

    const setOptions: any = {};
    for (const key in updateData) {
      setOptions[`variants.$.${key}`] = updateData[key];
    }

    const product: any = await Product.findOneAndUpdate(
      { 'variants._id': variantId },
      { $set: setOptions },
      { new: true }
    );

    if (!product) throw new ApiError(404, 'Variant or Product not found');

    const variant = product.variants.find((v: any) => v._id.toString() === variantId);

    res.json({ success: true, data: variant });
  });

  // Delete variant
  deleteVariant = asyncHandler(async (req: Request, res: Response) => {
    const { variantId } = req.params;

    await Product.findOneAndUpdate(
      { 'variants._id': variantId },
      { $pull: { variants: { _id: variantId } } }
    );

    res.json({ success: true, message: 'Variant deleted' });
  });
}
