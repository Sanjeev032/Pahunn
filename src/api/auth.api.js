import api from './client';

export const authApi = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
    updateDetails: (details) => api.put('/auth/updatedetails', details),
    updatePassword: (passwords) => api.put('/auth/updatepassword', passwords),
};
