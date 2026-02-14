const express = require('express');
const {
    register,
    login,
    logout,
    getMe,
    refreshToken
} = require('../controllers/auth');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../utils/validationSchemas');

const router = express.Router();

const { protect } = require('../middlewares/auth');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/refresh-token', refreshToken);

module.exports = router;
