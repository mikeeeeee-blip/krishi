import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
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

    // Build where clause with proper typing
    const where: Prisma.ProductWhereInput = { 
      deletedAt: null 
    };
    
    if (status) where.status = status as typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS];
    if (category) where.categoryId = category as string;
    if (brand) where.brandId = brand as string;
    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = Number(minPrice);
      if (maxPrice) where.basePrice.lte = Number(maxPrice);
    }

    // Get pagination metadata
    const total = await prisma.product.count({ where });
    const pagination = getPagination(total, Number(page) || PAGINATION.DEFAULT_PAGE, Number(limit) || PAGINATION.DEFAULT_LIMIT);

    // Build orderBy clause
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sortBy === 'price') orderBy.basePrice = sortOrder as 'asc' | 'desc';
    else if (sortBy === 'name') orderBy.name = sortOrder as 'asc' | 'desc';
    else if (sortBy === 'createdAt') orderBy.createdAt = sortOrder as 'asc' | 'desc';
    else orderBy.createdAt = 'desc';

    // Fetch products
    const products = await prisma.product.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take,
      orderBy,
      include: {
        category: { 
          select: { 
            id: true, 
            name: true, 
            slug: true 
          } 
        },
        brand: { 
          select: { 
            id: true, 
            name: true, 
            slug: true 
          } 
        },
        variants: { 
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            price: true,
            stockQuantity: true,
            isActive: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: products,
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
    const products = await prisma.product.findMany({
      where: { isFeatured: true, status: 'ACTIVE', deletedAt: null },
      take: 12,
      include: {
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true } },
      },
    });

    res.json({ success: true, data: products });
  });

  // Get bestsellers
  getBestsellers = asyncHandler(async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      where: { isBestseller: true, status: 'ACTIVE', deletedAt: null },
      take: 12,
      include: {
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true } },
      },
    });

    res.json({ success: true, data: products });
  });

  // Get new arrivals
  getNewArrivals = asyncHandler(async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      where: { isNewArrival: true, status: 'ACTIVE', deletedAt: null },
      take: 12,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true } },
      },
    });

    res.json({ success: true, data: products });
  });

  // Search products
  searchProducts = asyncHandler(async (req: Request, res: Response) => {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q) {
      throw new ApiError(400, 'Search query required');
    }

    const searchTerm = String(q);
    const where = {
      status: 'ACTIVE' as const,
      deletedAt: null,
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' as const } },
        { description: { contains: searchTerm, mode: 'insensitive' as const } },
        { tags: { has: searchTerm } },
        { searchKeywords: { has: searchTerm } },
      ],
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: {
          category: { select: { name: true, slug: true } },
          brand: { select: { name: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  });

  // Get product by ID
  getProductById = asyncHandler(async (req: Request, res: Response) => {
    const product = await prisma.product.findFirst({
      where: { id: req.params.id, deletedAt: null },
      include: {
        category: true,
        brand: true,
        variants: { where: { isActive: true }, orderBy: { displayOrder: 'asc' } },
        reviews: {
          where: { isApproved: true },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { firstName: true, lastName: true } } },
        },
      },
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Increment view count
    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    res.json({ success: true, data: product });
  });

  // Get product by slug
  getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
    const product = await prisma.product.findFirst({
      where: { slug: req.params.slug, deletedAt: null },
      include: {
        category: true,
        brand: true,
        variants: { where: { isActive: true }, orderBy: { displayOrder: 'asc' } },
        reviews: {
          where: { isApproved: true },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { firstName: true, lastName: true } } },
        },
      },
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    res.json({ success: true, data: product });
  });

  // Get similar products
  getSimilarProducts = asyncHandler(async (req: Request, res: Response) => {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      select: { categoryId: true, brandId: true },
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    const similar = await prisma.product.findMany({
      where: {
        id: { not: req.params.id },
        status: 'ACTIVE',
        deletedAt: null,
        OR: [
          { categoryId: product.categoryId },
          { brandId: product.brandId },
        ],
      },
      take: 8,
      include: {
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true } },
      },
    });

    res.json({ success: true, data: similar });
  });

  // Create product (seller/admin)
  createProduct = asyncHandler(async (req: Request, res: Response) => {
    const productData = {
      ...req.body,
      sellerId: req.user!.role === 'SELLER' ? req.user!.id : req.body.sellerId,
    };

    const product = await prisma.product.create({
      data: productData,
      include: { category: true, brand: true },
    });

    res.status(201).json({ success: true, data: product });
  });

  // Update product
  updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Product not found');
    }

    // Sellers can only update their own products
    if (req.user!.role === 'SELLER' && existing.sellerId !== req.user!.id) {
      throw new ApiError(403, 'Not authorized to update this product');
    }

    const product = await prisma.product.update({
      where: { id },
      data: req.body,
      include: { category: true, brand: true, variants: true },
    });

    res.json({ success: true, data: product });
  });

  // Delete product (soft delete)
  deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'DISCONTINUED' },
    });

    res.json({ success: true, message: 'Product deleted' });
  });

  // Add variant
  addVariant = asyncHandler(async (req: Request, res: Response) => {
    const variant = await prisma.productVariant.create({
      data: {
        productId: req.params.id,
        ...req.body,
      },
    });

    res.status(201).json({ success: true, data: variant });
  });

  // Update variant
  updateVariant = asyncHandler(async (req: Request, res: Response) => {
    const variant = await prisma.productVariant.update({
      where: { id: req.params.variantId },
      data: req.body,
    });

    res.json({ success: true, data: variant });
  });

  // Delete variant
  deleteVariant = asyncHandler(async (req: Request, res: Response) => {
    await prisma.productVariant.delete({
      where: { id: req.params.variantId },
    });

    res.json({ success: true, message: 'Variant deleted' });
  });
}

