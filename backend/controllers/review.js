const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc      Get reviews for a product
// @route     GET /api/v1/reviews/:productId
// @access    Public
exports.getProductReviews = asyncHandler(async (req, res, next) => {
    const reviews = await Review.find({ product: req.params.productId })
        .populate('user', 'name')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
    });
});

// @desc      Add review
// @route     POST /api/v1/reviews
// @access    Private
exports.addReview = asyncHandler(async (req, res, next) => {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorResponse('Product not found', 404));
    }

    // Check if user already reviewed
    // (Handled by DB index, but could check explicitly for cleaner error)

    try {
        const review = await Review.create({
            user: req.user.id,
            product: productId,
            rating,
            comment
        });

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (err) {
        if (err.code === 11000) {
            return next(new ErrorResponse('You have already reviewed this product', 400));
        }
        next(err);
    }
});

// @desc      Delete review
// @route     DELETE /api/v1/reviews/:id
// @access    Private (Owner or Admin)
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponse('Review not found', 404));
    }

    // Make sure user is review owner or admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
        return next(new ErrorResponse('Not authorized to delete this review', 401));
    }

    await review.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
