const {
    checkout,
    paymentVerification,
    myOrders,
    getOrder,
    cancelOrder,
    getAllOrders,
    updateStatus,
    refundOrder,
    getAdminStats
} = require('../controllers/order');
const validate = require('../middlewares/validate');
const { checkoutSchema } = require('../utils/validationSchemas');

const router = express.Router();

const { protect, authorize } = require('../middlewares/auth');

router.use(protect);

router.route('/checkout').post(validate(checkoutSchema), checkout);
router.route('/payment-verification').post(paymentVerification);
router.route('/my-orders').get(myOrders);

// Admin Routes
router.route('/admin/stats').get(authorize('admin', 'super_admin'), getAdminStats);
router.route('/admin/all').get(authorize('admin', 'super_admin'), getAllOrders);
router.route('/admin/:id/status').patch(authorize('admin', 'super_admin'), updateStatus);
router.route('/admin/:id/refund').patch(authorize('admin', 'super_admin'), refundOrder);

router.route('/:id').get(getOrder);
router.route('/:id/cancel').patch(cancelOrder);

module.exports = router;
