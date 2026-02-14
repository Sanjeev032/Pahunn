import api from './client';

export const wishlistApi = {
    getAll: () => api.get('/wishlist'),
    add: (productId) => api.post(`/wishlist/${productId}`),
    remove: (productId) => api.delete(`/wishlist/${productId}`),
};
