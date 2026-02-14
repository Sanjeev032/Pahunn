import { create } from 'zustand';
import { productApi } from '../api/product.api';

export const useProductStore = create((set, get) => ({
    products: [],
    featuredProducts: [],
    newArrivals: [],
    currentProduct: null,
    loading: false,
    error: null,
    filters: {
        category: '',
        sort: '',
        search: '',
        priceRange: ''
    },
    pagination: {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
    },

    // Actions
    fetchProducts: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const res = await productApi.getAll(params);
            if (res.data.success) {
                set({
                    products: res.data.data,
                    pagination: res.data.pagination
                });
            }
        } catch (error) {
            set({ error: error.response?.data?.error || 'Failed to fetch products' });
        } finally {
            set({ loading: false });
        }
    },

    fetchProduct: async (id) => {
        set({ loading: true, error: null, currentProduct: null });
        try {
            const res = await productApi.getById(id);
            if (res.data.success) {
                set({ currentProduct: res.data.data });
            }
        } catch (error) {
            set({ error: error.response?.data?.error || 'Failed to fetch product' });
        } finally {
            set({ loading: false });
        }
    },

    fetchFeatured: async () => {
        // Assuming we have a 'featured' flag or just getting some products
        // If backend support 'featured=true', use it.
        // Otherwise, just fetch some.
        try {
            const res = await productApi.getAll({ featured: true, limit: 3 });
            if (res.data.success) {
                set({ featuredProducts: res.data.data });
            }
        } catch (error) {
            console.error("Failed to fetch featured", error);
        }
    },

    fetchNewArrivals: async () => {
        try {
            const res = await productApi.getAll({ sort: '-createdAt', limit: 4 });
            if (res.data.success) {
                set({ newArrivals: res.data.data });
            }
        } catch (error) {
            console.error("Failed to fetch new arrivals", error);
        }
    },

    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
            pagination: { ...state.pagination, page: 1 } // Reset to page 1 on filter change
        }));
    },

    clearFilters: () => {
        set({
            filters: { category: '', sort: '', search: '', priceRange: '' },
            pagination: { page: 1, limit: 12, total: 0, pages: 0 }
        });
    }
}));
