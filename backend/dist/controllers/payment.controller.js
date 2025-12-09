import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../config/index.js';
import { prisma } from '../lib/prisma.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: config.razorpay.keyId,
    key_secret: config.razorpay.keySecret,
});
export class PaymentController {
    // Create Razorpay order
    createPaymentOrder = asyncHandler(async (req, res) => {
        const { orderId, amount } = req.body;
        // Verify the order belongs to user
        const order = await prisma.order.findFirst({
            where: { id: orderId, userId: req.user.id },
        });
        if (!order) {
            throw new ApiError(404, 'Order not found');
        }
        if (order.paymentStatus === 'PAID') {
            throw new ApiError(400, 'Order already paid');
        }
        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(Number(amount || order.totalAmount) * 100), // Convert to paise
            currency: 'INR',
            receipt: order.orderNumber,
            notes: {
                orderId: order.id,
                userId: req.user.id,
            },
        });
        // Update order with payment gateway order ID
        await prisma.order.update({
            where: { id: order.id },
            data: { paymentId: razorpayOrder.id, paymentGateway: 'razorpay' },
        });
        res.json({
            success: true,
            data: {
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                keyId: config.razorpay.keyId,
            },
        });
    });
    // Verify payment
    verifyPayment = asyncHandler(async (req, res) => {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
        // Verify signature
        const expectedSignature = crypto
            .createHmac('sha256', config.razorpay.keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');
        if (expectedSignature !== razorpay_signature) {
            throw new ApiError(400, 'Invalid payment signature');
        }
        // Update order
        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                paymentStatus: 'PAID',
                paymentId: razorpay_payment_id,
                paidAt: new Date(),
                status: 'CONFIRMED',
            },
        });
        res.json({
            success: true,
            message: 'Payment verified successfully',
            data: order,
        });
    });
    // Webhook handler for Razorpay
    handleWebhook = asyncHandler(async (req, res) => {
        const webhookSecret = config.razorpay.keySecret;
        const webhookSignature = req.headers['x-razorpay-signature'];
        // Verify webhook signature
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(JSON.stringify(req.body))
            .digest('hex');
        if (expectedSignature !== webhookSignature) {
            throw new ApiError(400, 'Invalid webhook signature');
        }
        const event = req.body;
        switch (event.event) {
            case 'payment.captured':
                await this.handlePaymentCaptured(event.payload.payment.entity);
                break;
            case 'payment.failed':
                await this.handlePaymentFailed(event.payload.payment.entity);
                break;
            case 'refund.created':
                await this.handleRefundCreated(event.payload.refund.entity);
                break;
        }
        res.json({ success: true });
    });
    // Get payment status
    getPaymentStatus = asyncHandler(async (req, res) => {
        const { orderId } = req.params;
        const order = await prisma.order.findFirst({
            where: { id: orderId, userId: req.user.id },
            select: {
                id: true,
                orderNumber: true,
                paymentStatus: true,
                paymentMethod: true,
                paymentId: true,
                paidAt: true,
                totalAmount: true,
            },
        });
        if (!order) {
            throw new ApiError(404, 'Order not found');
        }
        res.json({ success: true, data: order });
    });
    // Private: Handle payment captured
    async handlePaymentCaptured(payment) {
        const orderId = payment.notes?.orderId;
        if (!orderId)
            return;
        await prisma.order.update({
            where: { id: orderId },
            data: {
                paymentStatus: 'PAID',
                paymentId: payment.id,
                paidAt: new Date(),
                status: 'CONFIRMED',
            },
        });
    }
    // Private: Handle payment failed
    async handlePaymentFailed(payment) {
        const orderId = payment.notes?.orderId;
        if (!orderId)
            return;
        await prisma.order.update({
            where: { id: orderId },
            data: {
                paymentStatus: 'FAILED',
                internalNotes: `Payment failed: ${payment.error_description}`,
            },
        });
    }
    // Private: Handle refund created
    async handleRefundCreated(refund) {
        const paymentId = refund.payment_id;
        const order = await prisma.order.findFirst({
            where: { paymentId },
        });
        if (!order)
            return;
        const isFullRefund = refund.amount === Number(order.totalAmount) * 100;
        await prisma.order.update({
            where: { id: order.id },
            data: {
                paymentStatus: isFullRefund ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
                status: 'REFUNDED',
            },
        });
    }
}
//# sourceMappingURL=payment.controller.js.map