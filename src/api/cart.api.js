import api from './client';

export const cartApi = {
    get: () => api.get('/cart'),
    add: (item) => api.post('/cart', item), // { productId, variant, quantity }
    update: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }), // Note: Valid check needed if backend uses PATCH /update
    // My backend uses PATCH /update with body { productId, variant, quantity }
    // So update needs to match too!

    // Let's correct update as well based on backend controller I saw
    update: (productId, size, color, quantity) => api.patch('/cart/update', { productId, variant: { size, color }, quantity }),

    remove: (productId, size, color) => api.delete('/cart/remove', { data: { productId, size, color } }),
    clear: () => api.delete('/cart/clear'),
    sync: (localCart) => api.post('/cart/sync', { cart: localCart }), // If implemented
};
