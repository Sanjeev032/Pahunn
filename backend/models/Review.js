const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please add a rating between 1 and 5']
    },
    comment: {
        type: String,
        required: [true, 'Please add a comment']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent user from submitting more than one review per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
ReviewSchema.statics.getAverageRating = async function (productId) {
    const obj = await this.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                numOfReviews: { $sum: 1 }
            }
        }
    ]);

    try {
        await this.model('Product').findByIdAndUpdate(productId, {
            ratingsAverage: obj[0] ? obj[0].averageRating : 0,
            ratingsCount: obj[0] ? obj[0].numOfReviews : 0
        });
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageRating after save
ReviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.product);
});

// Call getAverageRating before remove
// Note: In Mongoose, document middleware for 'remove' is distinct from query middleware.
// If we use findByIdAndDelete in controller, we need access to the doc to call constructor.
// Better to use post 'findOneAndDelete' query middleware or keep simple:
// We'll trust the controller to use findById then .remove() (if supported) or findByIdAndDelete.
// Actually, for query middleware `post('findOneAndDelete')` we might not have easy access to the document ID if not returned.
// Let's stick to document middleware `post('remove')` and ensure controller uses `review.remove()` (deprecated in Mongoose 6+? No, doc.remove() is gone, use doc.deleteOne()).

ReviewSchema.post('deleteOne', { document: true, query: false }, function () {
    this.constructor.getAverageRating(this.product);
});

module.exports = mongoose.model('Review', ReviewSchema);
