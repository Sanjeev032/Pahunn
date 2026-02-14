const express = require('express');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getNewArrivals,
    updateStock
} = require('../controllers/product');

const router = express.Router();

const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.route('/featured').get(getFeaturedProducts);
router.route('/new-arrivals').get(getNewArrivals);

router
    .route('/')
    .get(getProducts)
    .post(protect, authorize('admin', 'super_admin'), upload.array('images'), createProduct);

router
    .route('/:id')
    .get(getProduct)
    .put(protect, authorize('admin', 'super_admin'), upload.array('images'), updateProduct)
    .delete(protect, authorize('admin', 'super_admin'), deleteProduct);

router.route('/:id/stock').patch(protect, authorize('admin', 'super_admin'), updateStock);

module.exports = router;
