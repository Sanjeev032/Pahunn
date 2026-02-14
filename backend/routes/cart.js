const express = require('express');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    mergeCart
} = require('../controllers/cart');

const router = express.Router();

const { protect } = require('../middlewares/auth');

// All cart routes are protected
router.use(protect);

router.route('/')
    .get(getCart);

router.route('/add')
    .post(addToCart);

router.route('/update')
    .patch(updateCartItem);

router.route('/remove')
    .delete(removeFromCart); // Requires body with productId, size, color

router.route('/clear')
    .delete(clearCart);

router.route('/merge')
    .post(mergeCart);

module.exports = router;
