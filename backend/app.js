const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/error');

// Route files
const auth = require('./routes/auth');
const products = require('./routes/product');
const cart = require('./routes/cart');
const orders = require('./routes/order');
const reviews = require('./routes/review');
const wishlist = require('./routes/wishlist');
const analytics = require('./routes/analytics');

// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security headers
app.use(helmet());

// Compress all responses
app.use(compression());

// Enable CORS
app.use(cors());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});
app.use(limiter);

// Prevent Mongo Injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Health Check
app.get('/health', (req, res) => res.status(200).send('OK'));

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/products', products);
app.use('/api/v1/cart', cart);
app.use('/api/v1/orders', orders);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/wishlist', wishlist);
app.use('/api/v1/analytics', analytics);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handler
app.use(errorHandler);

module.exports = app;
