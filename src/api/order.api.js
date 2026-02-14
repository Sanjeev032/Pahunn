import api from './client';

export const orderApi = {
    checkout: (orderData) => api.post('/orders/checkout', orderData),
    verifyPayment: (paymentData) => api.post('/orders/payment-verification', paymentData),
    getMyOrders: () => api.get('/orders/my-orders'),
    getById: (id) => api.get(`/orders/${id}`),
    cancel: (id) => api.patch(`/orders/${id}/cancel`),
    getAllOrders: () => api.get('/orders/admin/all'),
    getStats: () => api.get('/orders/admin/stats'),
    updateStatus: (id, status) => api.patch(`/orders/admin/${id}/status`, { status }),
};
