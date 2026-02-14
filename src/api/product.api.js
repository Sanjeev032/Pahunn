import api from './client';

export const productApi = {
    getAll: (params) => api.get('/products', { params }), // params for filters, search, page
    getById: (id) => api.get(`/products/${id}`),
    create: (productData) => api.post('/products', productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, productData) => api.put(`/products/${id}`, productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/products/${id}`),
    updateStock: (id, variants) => api.patch(`/products/${id}/stock`, { variants }),

    getReviews: (id) => api.get(`/reviews/${id}`),
    addReview: (reviewData) => api.post('/reviews', reviewData),
    deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
};
