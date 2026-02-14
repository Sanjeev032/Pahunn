const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc      Get overall stats
// @route     GET /api/v1/analytics/stats
// @access    Private/Admin
exports.getStats = asyncHandler(async (req, res, next) => {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Order breakdown
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending_payment' });
    const paidOrders = await Order.countDocuments({ orderStatus: 'paid' });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'cancelled' });

    res.status(200).json({
        success: true,
        data: {
            users: totalUsers,
            products: totalProducts,
            orders: {
                total: totalOrders,
                pending: pendingOrders,
                paid: paidOrders,
                shipped: shippedOrders,
                delivered: deliveredOrders,
                cancelled: cancelledOrders
            }
        }
    });
});

// @desc      Get total revenue
// @route     GET /api/v1/analytics/revenue
// @access    Private/Admin
exports.getRevenue = asyncHandler(async (req, res, next) => {
    const revenue = await Order.aggregate([
        {
            $match: {
                orderStatus: { $in: ['paid', 'packed', 'shipped', 'delivered'] }
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$totalPrice' }
            }
        }
    ]);

    const totalRevenue = revenue.length > 0 ? revenue[0].totalRevenue : 0;

    res.status(200).json({
        success: true,
        data: {
            totalRevenue
        }
    });
});

// @desc      Get top selling products
// @route     GET /api/v1/analytics/top-products
// @access    Private/Admin
exports.getTopProducts = asyncHandler(async (req, res, next) => {
    // Requires unwinding orderItems and grouping
    const topProducts = await Order.aggregate([
        {
            $match: {
                orderStatus: { $in: ['paid', 'packed', 'shipped', 'delivered'] }
            }
        },
        { $unwind: '$orderItems' },
        {
            $group: {
                _id: '$orderItems.product',
                name: { $first: '$orderItems.title' },
                img: { $first: '$orderItems.image' },
                totalSold: { $sum: '$orderItems.quantity' },
                revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
            }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 10 }
    ]);

    res.status(200).json({
        success: true,
        count: topProducts.length,
        data: topProducts
    });
});

// @desc      Get low stock products
// @route     GET /api/v1/analytics/low-stock
// @access    Private/Admin
exports.getLowStock = asyncHandler(async (req, res, next) => {
    // Find products where ANY variant has stock < 5
    const products = await Product.find({
        'variants.stock': { $lt: 5 }
    }).select('title variants images');

    // Filter to return only specific low stock variants or just the product
    // For admin UI, returning the product + variants is fine.

    // Let's refine the data to show WHICH variant is low
    const lowStockItems = [];

    products.forEach(product => {
        product.variants.forEach(variant => {
            if (variant.stock < 5) {
                lowStockItems.push({
                    _id: product._id,
                    title: product.title,
                    image: product.images[0]?.url,
                    variant: `${variant.size} / ${variant.color}`,
                    stock: variant.stock
                });
            }
        });
    });

    res.status(200).json({
        success: true,
        count: lowStockItems.length,
        data: lowStockItems
    });
});
