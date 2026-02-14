const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const paymentService = require('../services/paymentService');

// @desc      Get all orders (Admin)
// @route     GET /api/v1/orders/admin/all
// @access    Private/Admin
exports.getAllOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt');

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});

// @desc      Update order status (Admin)
// @route     PATCH /api/v1/orders/admin/:id/status
// @access    Private/Admin
exports.updateStatus = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorResponse('Order not found', 404));
    }

    // Status transition validation
    const currentStatus = order.orderStatus;
    const newStatus = req.body.status;

    // Cannot change if already delivered or cancelled/refunded (unless specific case)
    if (currentStatus === 'delivered' && newStatus !== 'returned') {
        return next(new ErrorResponse('Order is already delivered', 400));
    }

    if (currentStatus === 'cancelled' || currentStatus === 'refunded') {
        return next(new ErrorResponse('Order is already cancelled or refunded', 400));
    }

    order.orderStatus = newStatus;

    if (newStatus === 'delivered') {
        order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
        success: true,
        data: order
    });
});

// @desc      Refund order (Admin)
// @route     PATCH /api/v1/orders/admin/:id/refund
// @access    Private/Admin
exports.refundOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorResponse('Order not found', 404));
    }

    if (order.orderStatus === 'refunded') {
        return next(new ErrorResponse('Order is already refunded', 400));
    }

    // TODO: Integrate Razorpay Refund API if paymentId exists
    // await paymentService.refund(order.paymentInfo.id, amount);

    order.orderStatus = 'refunded';

    // Restore stock
    for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
            const variantIndex = product.variants.findIndex(v => v.size === item.variant.size && v.color === item.variant.color);
            if (variantIndex > -1) {
                product.variants[variantIndex].stock += item.quantity;
                await product.save();
            }
        }
    }

    await order.save();

    res.status(200).json({
        success: true,
        data: order
    });
});
// @desc      Checkout (Create Order + Payment Intent)
// @route     POST /api/v1/orders/checkout
// @access    Private
exports.checkout = asyncHandler(async (req, res, next) => {
    const {
        items, // Expecting [{ product, variant, quantity }] from frontend or use cart
        shippingInfo
    } = req.body;

    // 1. Validate Items & Calculate Price
    // Ideally fetch from DB to prevent tampering
    // Start with empty array
    let orderItems = [];
    let totalPrice = 0;

    // Use user cart if items not provided? 
    // Let's assume we use the cart from DB for security if items are not explicit,
    // OR we validate the items sent. 
    // Best practice: Use server-side cart.
    const user = await User.findById(req.user.id).populate('cart.product');

    // If frontend sends specific items (e.g. "Buy Now" single item), use that. 
    // Else use cart.
    // For now, let's look at the cart.
    const cartItems = user.cart;

    if (!cartItems || cartItems.length === 0) {
        return next(new ErrorResponse('Cart is empty', 400));
    }

    for (const item of cartItems) {
        const product = item.product;
        // Product is populated
        if (!product) continue;

        // Check Stock
        const variant = product.variants.find(v => v.size === item.variant.size && v.color === item.variant.color);
        if (!variant || variant.stock < item.quantity) {
            return next(new ErrorResponse(`Insufficient stock for ${product.title}`, 400));
        }

        const price = product.finalPrice || product.price;

        orderItems.push({
            product: product._id,
            title: product.title,
            quantity: item.quantity,
            image: product.images[0]?.url,
            price: price,
            variant: item.variant
        });

        totalPrice += price * item.quantity;
    }

    // Shipping & Tax
    const shippingPrice = totalPrice > 1000 ? 0 : 100;
    const taxPrice = totalPrice * 0.18;
    const finalTotal = totalPrice + shippingPrice + taxPrice;

    // 2. Create Pending Order in DB
    const order = await Order.create({
        user: req.user.id,
        orderItems,
        shippingInfo,
        shippingPrice,
        taxPrice,
        totalPrice: finalTotal,
        paymentInfo: {
            status: 'pending'
        },
        orderStatus: 'pending_payment'
    });

    // 3. Create Payment Order (Razorpay)
    const paymentOrder = await paymentService.createPaymentOrder(finalTotal, 'INR', order._id.toString());

    // 4. Update local order with payment order ID
    order.paymentInfo.id = paymentOrder.id;
    await order.save();

    res.status(200).json({
        success: true,
        order,
        paymentOrder
    });
});

// @desc      Verify Payment & Confirm Order
// @route     POST /api/v1/orders/payment-verification
// @access    Private
exports.paymentVerification = asyncHandler(async (req, res, next) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;

    const order = await Order.findOne({ 'paymentInfo.id': razorpay_order_id });

    if (!order) {
        return next(new ErrorResponse('Order not found', 404));
    }

    const isAuthentic = paymentService.verifyPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    );

    if (isAuthentic) {
        // Update Order
        order.orderStatus = 'paid'; // Or 'packed' if fully automated
        order.paymentInfo = {
            id: razorpay_payment_id,
            status: 'succeeded'
        };
        order.paidAt = Date.now();
        await order.save();

        // Deduct Stock
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            const variantIndex = product.variants.findIndex(v => v.size === item.variant.size && v.color === item.variant.color);
            if (variantIndex > -1) {
                product.variants[variantIndex].stock -= item.quantity;
                await product.save();
            }
        }

        // Clear Cart
        const user = await User.findById(req.user.id);
        user.cart = [];
        await user.save();

        res.status(200).json({
            success: true,
            data: order
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'Payment verification failed'
        });
    }
});

// @desc      Get logged in user orders
// @route     GET /api/v1/orders/my-orders
// @access    Private
exports.myOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});

// @desc      Get single order
// @route     GET /api/v1/orders/:id
// @access    Private
exports.getOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (!order) {
        return next(
            new ErrorResponse(`No order found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is order owner or admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
        return next(
            new ErrorResponse(`Not authorized to view this order`, 401)
        );
    }

    res.status(200).json({
        success: true,
        data: order
    });
});

// @desc      Cancel order
// @route     PATCH /api/v1/orders/:id/cancel
// @access    Private
exports.cancelOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(
            new ErrorResponse(`No order found with id of ${req.params.id}`, 404)
        );
    }

    // Check ownership
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
        return next(
            new ErrorResponse(`Not authorized to update this order`, 401)
        );
    }

    // Check status
    if (order.orderStatus !== 'pending_payment' && order.orderStatus !== 'paid' && order.orderStatus !== 'packed') {
        return next(
            new ErrorResponse(`Order cannot be cancelled at this stage (${order.orderStatus})`, 400)
        );
    }

    order.orderStatus = 'cancelled';
    await order.save();

    // Restore stock?
    // Yes, if cancelled, restore stock.
    for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
            const variantIndex = product.variants.findIndex(v => v.size === item.variant.size && v.color === item.variant.color);
            if (variantIndex > -1) {
                product.variants[variantIndex].stock += item.quantity;
                await product.save();
            }
        }
    }

    res.status(200).json({
        success: true,
        data: order
    });
});

// @desc      Get Admin Stats (Revenue, Stock, Graph)
// @route     GET /api/v1/orders/admin/stats
// @access    Private/Admin
exports.getAdminStats = asyncHandler(async (req, res, next) => {
    // 1. Total Revenue & Orders
    const orders = await Order.find({ orderStatus: { $nin: ['cancelled', 'returned', 'refunded'] } });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const totalOrders = await Order.countDocuments();

    // 2. Product Stats (Total Products, Total Stock, Low Stock)
    const products = await Product.find();
    const totalProducts = products.length;

    let totalStock = 0;
    let lowStockItems = 0;

    products.forEach(product => {
        const productStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
        totalStock += productStock;
        if (productStock < 20) lowStockItems++;
    });

    // 3. Sales Last 7 Days (Graph Data)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const salesGraph = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: last7Days },
                orderStatus: { $nin: ['cancelled', 'returned', 'refunded'] }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                sales: { $sum: "$totalPrice" },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // 4. Category Sales (Aggregation)
    const categorySales = await Order.aggregate([
        { $match: { orderStatus: { $nin: ['cancelled', 'returned', 'refunded'] } } },
        { $unwind: "$orderItems" },
        {
            $lookup: {
                from: "products",
                localField: "orderItems.product",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        { $unwind: "$productDetails" },
        {
            $group: {
                _id: "$productDetails.category",
                sales: { $sum: "$orderItems.quantity" },
                revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
            }
        }
    ]);

    const formattedCategorySales = categorySales.map(item => ({
        name: item._id || 'Uncategorized',
        sales: item.sales,
        revenue: item.revenue
    }));

    res.status(200).json({
        success: true,
        data: {
            totalRevenue,
            totalOrders,
            totalProducts,
            totalStock,
            lowStockItems,
            salesGraph,
            categorySales: formattedCategorySales
        }
    });
});
