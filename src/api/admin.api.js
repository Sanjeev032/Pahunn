import api from './client';

export const adminApi = {
    getStats: () => api.get('/analytics/stats'),
    getRevenue: () => api.get('/analytics/revenue'),
    getTopProducts: () => api.get('/analytics/top-products'),
    getLowStock: () => api.get('/analytics/low-stock'),

    getAllOrders: () => api.get('/orders/admin/all'),
    updateOrderStatus: (id, status) => api.patch(`/orders/admin/${id}/status`, { status }),
    refundOrder: (id) => api.patch(`/orders/admin/${id}/refund`),

    // Product Management (assuming endpoints exist or will exist)
    createProduct: (productData) => api.post('/products', productData),
    updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
    deleteProduct: (id) => api.delete(`/products/${id}`),
};
