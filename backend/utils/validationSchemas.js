const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const updateDetailsSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional()
});

const updatePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
});

const checkoutSchema = Joi.object({
    items: Joi.array().items(
        Joi.object({
            product: Joi.string().required(), // Product ID
            variant: Joi.object({
                size: Joi.string().required(),
                color: Joi.string().required()
            }).required(),
            quantity: Joi.number().integer().min(1).required()
        })
    ).optional(), // Optional because it might use cart from DB
    shippingInfo: Joi.object({
        address: Joi.string().required(),
        city: Joi.string().required(),
        postalCode: Joi.string().required(),
        country: Joi.string().required(),
        phone: Joi.string().required()
    }).required()
});

const reviewSchema = Joi.object({
    productId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required()
});

const productSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    brand: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().required(),
    discountPrice: Joi.number().optional(),
    variants: Joi.array().items(
        Joi.object({
            size: Joi.string().required(),
            color: Joi.string().required(),
            stock: Joi.number().integer().min(0).required(),
            sku: Joi.string().required()
        })
    ).required(),
    images: Joi.array().items(
        Joi.object({
            url: Joi.string().required(),
            public_id: Joi.string().required()
        })
    ).required(),
    featured: Joi.boolean().optional(),
    newArrival: Joi.boolean().optional(),
    sale: Joi.boolean().optional()
});

module.exports = {
    registerSchema,
    loginSchema,
    updateDetailsSchema,
    updatePasswordSchema,
    checkoutSchema,
    reviewSchema,
    productSchema
};
