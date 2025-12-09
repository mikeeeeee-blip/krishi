import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { HTTP_STATUS } from '../constants/index.js';

export class CategoryController {
  // Get all categories
  getAllCategories = asyncHandler(async (req: Request, res: Response) => {
    const { active = 'true' } = req.query;

    const categories = await prisma.category.findMany({
      where: active === 'true' ? { isActive: true } : {},
      orderBy: { displayOrder: 'asc' },
    });

    res.json({ success: true, data: categories });
  });

  // Get category tree (hierarchical)
  getCategoryTree = asyncHandler(async (req: Request, res: Response) => {
    const categories = await prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { displayOrder: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
      },
    });

    res.json({ success: true, data: categories });
  });

  // Get category by ID
  getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: {
        parent: true,
        children: { where: { isActive: true } },
      },
    });

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    res.json({ success: true, data: category });
  });

  // Get category by slug
  getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: {
        parent: true,
        children: { where: { isActive: true } },
      },
    });

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    res.json({ success: true, data: category });
  });

  // Get products by category
  getCategoryProducts = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
    });

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    const childCategories = await prisma.category.findMany({
      where: { parentId: category.id },
      select: { id: true },
    });
    const categoryIds = [category.id, ...childCategories.map(c => c.id)];

    const where = {
      categoryId: { in: categoryIds },
      status: 'ACTIVE' as const,
      deletedAt: null,
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { [sortBy as string]: sortOrder },
        include: {
          category: { select: { name: true, slug: true } },
          brand: { select: { name: true } },
          variants: { where: { isActive: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: { category, products },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  });

  // Create category (admin)
  createCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await prisma.category.create({
      data: req.body,
    });

    res.status(201).json({ success: true, data: category });
  });

  // Update category (admin)
  updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json({ success: true, data: category });
  });

  // Delete category (admin)
  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const productCount = await prisma.product.count({
      where: { categoryId: req.params.id },
    });

    if (productCount > 0) {
      throw new ApiError(400, 'Cannot delete category with products');
    }

    await prisma.category.delete({ where: { id: req.params.id } });

    res.json({ success: true, message: 'Category deleted' });
  });
}

