const Razorpay = require('razorpay');
const crypto = require('crypto');

class PaymentService {
    constructor() {
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    }

    async createPaymentOrder(amount, currency = 'INR', receipt) {
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency,
            receipt,
            payment_capture: 1 // Auto capture
        };

        try {
            const order = await this.razorpay.orders.create(options);
            return order;
        } catch (error) {
            console.error('Razorpay Order Creation Failed:', error);
            throw new Error('Payment initialization failed');
        }
    }

    verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
        const body = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        return expectedSignature === razorpaySignature;
    }
}

module.exports = new PaymentService();
