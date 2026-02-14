const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [
        {
            title: { type: String, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
                required: true
            },
            variant: {
                size: String,
                color: String
            }
        }
    ],
    shippingInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true }
    },
    paymentInfo: {
        id: { type: String },
        status: { type: String }
    },
    taxPrice: {
        type: Number,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        default: 0.0
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'pending_payment',
        enum: [
            'pending_payment',
            'paid',
            'packed',
            'shipped',
            'delivered',
            'cancelled',
            'returned',
            'refunded'
        ]
    },
    deliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);
