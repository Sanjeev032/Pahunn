const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Product = require('../models/Product');
const APIFeatures = require('../utils/apiFeatures');

// @desc      Get all products
// @route     GET /api/v1/products
// @access    Public
exports.getProducts = asyncHandler(async (req, res, next) => {
    const features = new APIFeatures(Product.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const products = await features.query;

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});

// @desc      Get single product
// @route     GET /api/v1/products/:id
// @access    Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name email');

    if (!product) {
        return next(
            new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc      Get featured products
// @route     GET /api/v1/products/featured
// @access    Public
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find({ featured: true }).limit(5);

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});

// @desc      Get new arrivals
// @route     GET /api/v1/products/new-arrivals
// @access    Public
exports.getNewArrivals = asyncHandler(async (req, res, next) => {
    const products = await Product.find({ newArrival: true }).sort('-createdAt').limit(10);

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});


// @desc      Create new product
// @route     POST /api/v1/products
// @access    Private/Admin
exports.createProduct = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    // Handle Image Uploads
    if (req.files && req.files.length > 0) {
        const { uploadToCloudinary } = require('../utils/cloudinary');
        const imagePromises = req.files.map(file => uploadToCloudinary(file.buffer));
        const uploadedImages = await Promise.all(imagePromises);

        req.body.images = uploadedImages;
    }

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        data: product
    });
});

// @desc      Update product
// @route     PUT /api/v1/products/:id
// @access    Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
        );
    }

    // Handle Image Updates
    if (req.files && req.files.length > 0) {
        const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

        // Delete old images if replacing entirely (strategy depends on requirement)
        // For simplicity: If new images are uploaded, append them. 
        // If user wants to delete specific images, that should be a separate logic or endpoint.
        // Let's assume we append new images to existing ones unless specified.

        // OR: A simpler approach for "Update Product" often implies "Here is the new state".
        // But uploading files via multipart usually means "Here are NEW files".
        // Let's implement: Upload new files, add to existing images array.

        const imagePromises = req.files.map(file => uploadToCloudinary(file.buffer));
        const newImages = await Promise.all(imagePromises);

        // Using $push to append. If you want to replace, use: req.body.images = newImages;
        // However, Mongoose findByIdAndUpdate with req.body containing 'images' will replace the array.
        // So we need to decide: replace or append? 
        // Typically PUT replaces. Let's assume req.body.existingImages is sent for images to keep?
        // Simpler implementation for now: If images are uploaded, add them to req.body.images.
        // If the FE sends `images` field with old images data, Mongoose handles it? No, multipart doesn't send JSON objects easily.

        // Strategy: Append new images to the list.
        // If you want to delete images, implement a separate "DELETE /products/:id/images/:public_id" or handle it via a `deletedImages` field.

        // Let's go with: Append new uploads.
        const currentImages = product.images || [];
        req.body.images = [...currentImages, ...newImages];
    } else {
        // If no files, ensure we don't overwrite images with undefined unless explicitly meant to
        // But wait, req.body might not have 'images' if it's unrelated update.
        delete req.body.images;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc      Update stock
// @route     PATCH /api/v1/products/:id/stock
// @access    Private/Admin
exports.updateStock = asyncHandler(async (req, res, next) => {
    const { variants } = req.body;

    // Check if variants array is provided
    if (!variants || !Array.isArray(variants)) {
        return next(new ErrorResponse('Please provide variants array to update stock', 400));
    }

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
        );
    }

    // This is a naive replacement. In a real app, you might want to match SKU and update specific variant stock.
    // For now, we will assume the admin sends the full variants array or we implement logic to find and update.
    // To keep it simple and consistent with the requirement "PATCH /products/:id/stock", 
    // let's assume we are updating the entire variants list or specific variants if the body structure allows.
    // Given Mongoose, updating nested arrays can be tricky without specific logic. 
    // Let's rely on the user sending the updated variants list for this simplified endpoint.
    // OR we can merge. Let's do a direct update of the variants field for simplicity unless detailed logic specified.

    product.variants = variants;
    await product.save();

    res.status(200).json({
        success: true,
        data: product
    });
});


// @desc      Delete product
// @route     DELETE /api/v1/products/:id
// @access    Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
        );
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
