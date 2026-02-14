import axios from 'axios';

// Create Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    withCredentials: true, // Send cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        // Access token is automatically handled via cookies or we can attach it here if using localStorage
        // For this implementation, we assume we might store accessToken in memory or localStorage
        // However, the backend implementation I saw uses cookies for refresh token and returns accessToken in JSON.
        // Let's check where the frontend stores the accessToken.
        // If we store it in localStorage/context, we attach it.
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Toast Error Message
        if (error.response?.data?.error) {
            // Avoid toasting for 401s that are about to be retried or are just session checks
            if (error.response.status !== 401) {
                import('react-hot-toast').then(({ toast }) => {
                    toast.error(error.response.data.error);
                });
            }
        } else if (error.message && error.code !== "ERR_CANCELED") {
            // Network errors
            import('react-hot-toast').then(({ toast }) => {
                toast.error(error.message);
            });
        }

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                if (res.data.success) {
                    const { accessToken } = res.data;
                    localStorage.setItem('accessToken', accessToken);

                    // Update header and retry original request
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed - logout user
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
