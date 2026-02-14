const express = require('express');
const {
    getStats,
    getRevenue,
    getTopProducts,
    getLowStock
} = require('../controllers/analytics');

const router = express.Router();

const { protect, authorize } = require('../middlewares/auth');

router.use(protect);
router.use(authorize('admin', 'super_admin'));

router.get('/stats', getStats);
router.get('/revenue', getRevenue);
router.get('/top-products', getTopProducts);
router.get('/low-stock', getLowStock);

module.exports = router;
