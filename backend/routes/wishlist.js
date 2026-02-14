const express = require('express');
const {
    getWishlist,
    addToWishlist,
    removeFromWishlist
} = require('../controllers/wishlist');

const router = express.Router();

const { protect } = require('../middlewares/auth');

router.use(protect);

router.route('/').get(getWishlist);
router.route('/:productId').post(addToWishlist).delete(removeFromWishlist);

module.exports = router;
