import { userModel } from '../models/user.model.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
export class UserController {
    /**
     * Get user addresses
     */
    getAddresses = asyncHandler(async (req, res) => {
        const user = await userModel.findById(req.user.id).select('addresses');
        // Sort addresses: default first, then by creation date descending
        const sortedAddresses = user?.addresses.sort((a, b) => {
            if (a.isDefault && !b.isDefault)
                return -1;
            if (!a.isDefault && b.isDefault)
                return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        res.json({ success: true, data: sortedAddresses || [] });
    });
    /**
     * Add address
     */
    addAddress = asyncHandler(async (req, res) => {
        const { fullName, phone, addressLine1, addressLine2, landmark, city, state, pincode, isDefault } = req.body;
        // If setting as default, unset other defaults
        if (isDefault) {
            await userModel.updateOne({ _id: req.user.id, 'addresses.isDefault': true }, { $set: { 'addresses.$.isDefault': false } });
        }
        const newAddress = {
            fullName,
            phone,
            addressLine1,
            addressLine2,
            landmark,
            city,
            state,
            pincode,
            isDefault: isDefault || false,
        };
        const user = await userModel.findByIdAndUpdate(req.user.id, { $push: { addresses: newAddress } }, { new: true, runValidators: true });
        // Get the added address (last one)
        const addedAddress = user?.addresses[user.addresses.length - 1];
        res.status(201).json({ success: true, data: addedAddress });
    });
    /**
     * Update address
     */
    updateAddress = asyncHandler(async (req, res) => {
        const { id } = req.params; // address id
        const updateData = req.body;
        // Check if address exists
        const user = await userModel.findOne({ _id: req.user.id, 'addresses._id': id });
        if (!user) {
            throw new ApiError(404, 'Address not found');
        }
        // If setting as default, unset other defaults
        if (updateData.isDefault) {
            await userModel.updateOne({ _id: req.user.id, 'addresses.isDefault': true }, { $set: { 'addresses.$.isDefault': false } });
        }
        // Construct update object
        const setOptions = {};
        for (const key in updateData) {
            setOptions[`addresses.$.${key}`] = updateData[key];
        }
        const updateduserModel = await userModel.findOneAndUpdate({ _id: req.user.id, 'addresses._id': id }, { $set: setOptions }, { new: true, runValidators: true });
        const updatedAddress = updateduserModel?.addresses.find((addr) => addr._id.toString() === id);
        res.json({ success: true, data: updatedAddress });
    });
    /**
     * Delete address
     */
    deleteAddress = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const user = await userModel.findOneAndUpdate({ _id: req.user.id, 'addresses._id': id }, { $pull: { addresses: { _id: id } } }, { new: true });
        if (!user) {
            throw new ApiError(404, 'Address not found');
        }
        res.json({ success: true, message: 'Address deleted' });
    });
    /**
     * Set default address
     */
    setDefaultAddress = asyncHandler(async (req, res) => {
        const { id } = req.params;
        // Unset current default
        await userModel.updateOne({ _id: req.user.id, 'addresses.isDefault': true }, { $set: { 'addresses.$.isDefault': false } });
        // Set new default
        const user = await userModel.findOneAndUpdate({ _id: req.user.id, 'addresses._id': id }, { $set: { 'addresses.$.isDefault': true } }, { new: true });
        if (!user) {
            throw new ApiError(404, 'Address not found');
        }
        res.json({ success: true, message: 'Default address updated' });
    });
    /**
     * Admin: Get all users
     */
    getAllUsers = asyncHandler(async (req, res) => {
        const { page = 1, limit = 20, role, status } = req.query;
        const query = { deletedAt: null };
        if (role)
            query.role = role;
        if (status)
            query.status = status;
        const skip = (Number(page) - 1) * Number(limit);
        const [users, total] = await Promise.all([
            userModel.find(query)
                .select('id email phone firstName lastName role status createdAt')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            userModel.countDocuments(query),
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
    /**
     * Admin: Get user by ID
     */
    getUserById = asyncHandler(async (req, res) => {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        res.json({ success: true, data: user });
    });
    /**
     * Admin: Update user status
     */
    updateUserStatus = asyncHandler(async (req, res) => {
        const { status } = req.body;
        const user = await userModel.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('id email status');
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        res.json({ success: true, data: user });
    });
}
//# sourceMappingURL=user.controller.js.map