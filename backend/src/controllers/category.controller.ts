import { Request, Response } from 'express';
import { Category } from '../models/category.model.js';
import { Product } from '../models/product.model.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';

export class CategoryController {
  // Get all categories
  getAllCategories = asyncHandler(async (req: Request, res: Response) => {
    const { active = 'true' } = req.query;

    const filter: any = {};
    if (active === 'true') filter.isActive = true;

    const categories = await Category.find(filter).sort({ displayOrder: 1 });

    res.json({ success: true, data: categories });
  });

  // Get category tree (hierarchical)
  getCategoryTree = asyncHandler(async (req: Request, res: Response) => {
    // Fetch all active categories
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1 }).lean();

    // Build tree
    const categoryMap = new Map();
    const roots: any[] = [];

    // Initialize map
    categories.forEach((cat: any) => {
      cat.children = [];
      categoryMap.set(cat._id.toString(), cat);
    });

    // Link children to parents
    categories.forEach((cat: any) => {
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId.toString());
        if (parent) {
          parent.children.push(cat);
        } else {
          // Parent might be inactive or missing, treat as root or orphan?
          // For now, if parent not found in active list, maybe don't show or show as root?
          // Prisma query was { isActive: true, parentId: null } for roots.
        }
      } else {
        roots.push(cat);
      }
    });

    res.json({ success: true, data: roots });
  });

  // Get category by ID
  getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const category: any = await Category.findById(req.params.id);

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    // Get children
    const children = await Category.find({ parentId: category._id, isActive: true });

    // Get parent
    const parent = category.parentId ? await Category.findById(category.parentId) : null;

    res.json({
      success: true,
      data: {
        ...category.toObject(),
        parent,
        children
      }
    });
  });

  // Get category by slug
  getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
    const category: any = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    // Get children
    const children = await Category.find({ parentId: category._id, isActive: true });

    // Get parent
    const parent = category.parentId ? await Category.findById(category.parentId) : null;

    res.json({
      success: true,
      data: {
        ...category.toObject(),
        parent,
        children
      }
    });
  });

  // Get products by category
  getCategoryProducts = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const category: any = await Category.findById(req.params.id);

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    // Get child categories for recursive fetch
    const childCategories = await Category.find({ parentId: category._id }).select('_id');
    const categoryIds = [category._id, ...childCategories.map(c => c._id)];

    const query = {
      category: { $in: categoryIds },
      status: 'ACTIVE',
      deletedAt: null,
    };

    const sortOptions: any = {};
    if (sortBy) {
      sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOptions)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate('category', 'name slug')
        .populate('brand', 'name'),
      Product.countDocuments(query),
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
    const category: any = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  });

  // Update category (admin)
  updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const category: any = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    res.json({ success: true, data: category });
  });

  // Delete category (admin)
  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    // Check for products
    const productCount = await Product.countDocuments({ category: req.params.id });

    if (productCount > 0) {
      throw new ApiError(400, 'Cannot delete category with products');
    }

    // Check for children
    const childCount = await Category.countDocuments({ parentId: req.params.id });
    if (childCount > 0) {
      throw new ApiError(400, 'Cannot delete category with subcategories');
    }

    const category: any = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    res.json({ success: true, message: 'Category deleted' });
  });
}
