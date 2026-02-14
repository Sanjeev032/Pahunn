const mongoose = require('mongoose');
const slugify = require('slugify');

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a product title'],
        trim: true,
        maxlength: [100, 'Product title cannot exceed 100 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    brand: {
        type: String,
        required: [true, 'Please add a brand'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        trim: true,
        enum: [
            'Tops',
            'Bottoms',
            'Outerwear',
            'Accessories',
            'Sneakers',
            'Sets',
            'Utility'
        ]
    },
    tags: [String],
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    discountPrice: {
        type: Number,
        default: 0
    },
    variants: [
        {
            size: {
                type: String,
                required: true
            },
            color: {
                type: String,
                required: true,
                default: 'Default'
            },
            stock: {
                type: Number,
                required: true,
                default: 0
            },
            sku: {
                type: String,
                required: true
            }
        }
    ],
    images: [
        {
            url: {
                type: String,
                required: true
            },
            public_id: {
                type: String,
                required: true
            },
            isMain: {
                type: Boolean,
                default: false
            }
        }
    ],
    featured: {
        type: Boolean,
        default: false
    },
    newArrival: {
        type: Boolean,
        default: false
    },
    sale: {
        type: Boolean,
        default: false
    },
    ratingsAverage: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must can not be more than 5'],
        default: 0
    },
    ratingsCount: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create product slug from the title
ProductSchema.pre('save', function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

// Virtual for final price (price - discount)
ProductSchema.virtual('finalPrice').get(function () {
    if (this.discountPrice > 0 && this.discountPrice < this.price) {
        return this.discountPrice;
    }
    return this.price;
});

// Index for search
ProductSchema.index({
    title: 'text',
    description: 'text',
    brand: 'text',
    tags: 'text'
});

module.exports = mongoose.model('Product', ProductSchema);
