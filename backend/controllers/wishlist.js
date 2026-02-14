const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc      Get user wishlist
// @route     GET /api/v1/wishlist
// @access    Private
exports.getWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate('wishlist');

    res.status(200).json({
        success: true,
        count: user.wishlist.length,
        data: user.wishlist
    });
});

// @desc      Add product to wishlist
// @route     POST /api/v1/wishlist/:productId
// @access    Private
exports.addToWishlist = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.productId);

    if (!product) {
        return next(new ErrorResponse('Product not found', 404));
    }

    const user = await User.findById(req.user.id);

    // Check if already in wishlist
    if (user.wishlist.includes(req.params.productId)) {
        return next(new ErrorResponse('Product already in wishlist', 400));
    }

    user.wishlist.push(req.params.productId);
    await user.save();

    res.status(200).json({
        success: true,
        data: user.wishlist
    });
});

// @desc      Remove product from wishlist
// @route     DELETE /api/v1/wishlist/:productId
// @access    Private
exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
    await user.save();

    res.status(200).json({
        success: true,
        data: user.wishlist
    });
});
