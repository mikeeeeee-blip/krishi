import { prisma } from '../lib/prisma.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
export class ReviewController {
    // Get product reviews
    getProductReviews = asyncHandler(async (req, res) => {
        const { productId } = req.params;
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const where = {
            productId,
            isApproved: true,
        };
        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                orderBy: { [sortBy]: sortOrder },
                include: {
                    user: { select: { firstName: true, lastName: true, avatarUrl: true } },
                },
            }),
            prisma.review.count({ where }),
        ]);
        // Get rating distribution
        const ratingDistribution = await prisma.review.groupBy({
            by: ['rating'],
            where: { productId, isApproved: true },
            _count: true,
        });
        res.json({
            success: true,
            data: {
                reviews,
                ratingDistribution,
            },
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    });
    // Create review
    createReview = asyncHandler(async (req, res) => {
        const { productId, rating, title, content, images } = req.body;
        // Check if user already reviewed this product
        const existingReview = await prisma.review.findFirst({
            where: { productId, userId: req.user.id },
        });
        if (existingReview) {
            throw new ApiError(400, 'You have already reviewed this product');
        }
        // Check if user has purchased this product
        const hasPurchased = await prisma.orderItem.findFirst({
            where: {
                productId,
                order: {
                    userId: req.user.id,
                    status: 'DELIVERED',
                },
            },
        });
        const review = await prisma.review.create({
            data: {
                productId,
                userId: req.user.id,
                rating,
                title,
                content,
                images: images || [],
                isVerifiedPurchase: !!hasPurchased,
                isApproved: true, // Auto-approve for now
            },
            include: {
                user: { select: { firstName: true, lastName: true } },
            },
        });
        // Update product rating
        const avgRating = await prisma.review.aggregate({
            where: { productId, isApproved: true },
            _avg: { rating: true },
            _count: true,
        });
        await prisma.product.update({
            where: { id: productId },
            data: {
                averageRating: avgRating._avg.rating || 0,
                reviewCount: avgRating._count,
            },
        });
        res.status(201).json({ success: true, data: review });
    });
    // Update review
    updateReview = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { rating, title, content, images } = req.body;
        const review = await prisma.review.findFirst({
            where: { id, userId: req.user.id },
        });
        if (!review) {
            throw new ApiError(404, 'Review not found');
        }
        const updated = await prisma.review.update({
            where: { id },
            data: { rating, title, content, images },
        });
        // Update product rating
        const avgRating = await prisma.review.aggregate({
            where: { productId: review.productId, isApproved: true },
            _avg: { rating: true },
        });
        await prisma.product.update({
            where: { id: review.productId },
            data: { averageRating: avgRating._avg.rating || 0 },
        });
        res.json({ success: true, data: updated });
    });
    // Delete review
    deleteReview = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const review = await prisma.review.findFirst({
            where: {
                id,
                OR: [
                    { userId: req.user.id },
                    { userId: req.user.role === 'ADMIN' ? undefined : req.user.id },
                ],
            },
        });
        if (!review) {
            throw new ApiError(404, 'Review not found');
        }
        await prisma.review.delete({ where: { id } });
        // Update product rating
        const avgRating = await prisma.review.aggregate({
            where: { productId: review.productId, isApproved: true },
            _avg: { rating: true },
            _count: true,
        });
        await prisma.product.update({
            where: { id: review.productId },
            data: {
                averageRating: avgRating._avg.rating || 0,
                reviewCount: avgRating._count,
            },
        });
        res.json({ success: true, message: 'Review deleted' });
    });
    // Mark review helpful
    markHelpful = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { helpful } = req.body;
        const review = await prisma.review.update({
            where: { id },
            data: {
                [helpful ? 'helpfulCount' : 'notHelpfulCount']: { increment: 1 },
            },
        });
        res.json({ success: true, data: review });
    });
    // Admin: Get all reviews
    getAllReviews = asyncHandler(async (req, res) => {
        const { page = 1, limit = 20, approved } = req.query;
        const where = {};
        if (approved !== undefined) {
            where.isApproved = approved === 'true';
        }
        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { firstName: true, lastName: true, email: true } },
                    product: { select: { name: true, slug: true } },
                },
            }),
            prisma.review.count({ where }),
        ]);
        res.json({
            success: true,
            data: reviews,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    });
    // Admin: Approve review
    approveReview = asyncHandler(async (req, res) => {
        const review = await prisma.review.update({
            where: { id: req.params.id },
            data: { isApproved: true },
        });
        res.json({ success: true, data: review });
    });
    // Admin: Reject review
    rejectReview = asyncHandler(async (req, res) => {
        const review = await prisma.review.update({
            where: { id: req.params.id },
            data: { isApproved: false },
        });
        res.json({ success: true, data: review });
    });
}
//# sourceMappingURL=review.controller.js.map