const express = require('express');
const {
    getProductReviews,
    addReview,
    deleteReview
} = require('../controllers/review');
const validate = require('../middlewares/validate');
const { reviewSchema } = require('../utils/validationSchemas');

const router = express.Router();

const { protect } = require('../middlewares/auth');

router.route('/:productId').get(getProductReviews);
router.route('/').post(protect, validate(reviewSchema), addReview);
router.route('/:id').delete(protect, deleteReview);

module.exports = router;
