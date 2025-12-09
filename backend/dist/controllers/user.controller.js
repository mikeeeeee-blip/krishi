import { prisma } from '../lib/prisma.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
export class UserController {
    // Get user addresses
    getAddresses = asyncHandler(async (req, res) => {
        const addresses = await prisma.address.findMany({
            where: { userId: req.user.id },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        });
        res.json({ success: true, data: addresses });
    });
    // Add address
    addAddress = asyncHandler(async (req, res) => {
        const { fullName, phone, addressLine1, addressLine2, landmark, city, state, pincode, isDefault } = req.body;
        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: req.user.id },
                data: { isDefault: false },
            });
        }
        const address = await prisma.address.create({
            data: {
                userId: req.user.id,
                fullName,
                phone,
                addressLine1,
                addressLine2,
                landmark,
                city,
                state,
                pincode,
                isDefault: isDefault || false,
            },
        });
        res.status(201).json({ success: true, data: address });
    });
    // Update address
    updateAddress = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const updateData = req.body;
        const address = await prisma.address.findFirst({
            where: { id, userId: req.user.id },
        });
        if (!address) {
            throw new ApiError(404, 'Address not found');
        }
        const updated = await prisma.address.update({
            where: { id },
            data: updateData,
        });
        res.json({ success: true, data: updated });
    });
    // Delete address
    deleteAddress = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const address = await prisma.address.findFirst({
            where: { id, userId: req.user.id },
        });
        if (!address) {
            throw new ApiError(404, 'Address not found');
        }
        await prisma.address.delete({ where: { id } });
        res.json({ success: true, message: 'Address deleted' });
    });
    // Set default address
    setDefaultAddress = asyncHandler(async (req, res) => {
        const { id } = req.params;
        await prisma.address.updateMany({
            where: { userId: req.user.id },
            data: { isDefault: false },
        });
        await prisma.address.update({
            where: { id },
            data: { isDefault: true },
        });
        res.json({ success: true, message: 'Default address updated' });
    });
    // Admin: Get all users
    getAllUsers = asyncHandler(async (req, res) => {
        const { page = 1, limit = 20, role, status } = req.query;
        const where = { deletedAt: null };
        if (role)
            where.role = role;
        if (status)
            where.status = status;
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                select: {
                    id: true,
                    email: true,
                    phone: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    status: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count({ where }),
        ]);
        res.json({
            success: true,
            data: users,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    });
    // Admin: Get user by ID
    getUserById = asyncHandler(async (req, res) => {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            include: { addresses: true },
        });
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        res.json({ success: true, data: user });
    });
    // Admin: Update user status
    updateUserStatus = asyncHandler(async (req, res) => {
        const { status } = req.body;
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { status },
            select: { id: true, email: true, status: true },
        });
        res.json({ success: true, data: user });
    });
}
//# sourceMappingURL=user.controller.js.map