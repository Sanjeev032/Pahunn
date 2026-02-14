import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartApi } from '../api/cart.api';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Helper to format backend item to frontend structure
    const formatCartItem = (item) => ({
        id: item.product._id,
        title: item.product.title,
        price: item.product.finalPrice || item.product.price,
        image: item.product.images[0]?.url,
        size: item.variant.size,
        color: item.variant.color,
        quantity: item.quantity,
        slug: item.product.slug,
        stock: item.product.variants.find(v => v.size === item.variant.size && v.color === item.variant.color)?.stock || 0
    });

    // Load cart on mount or user change
    useEffect(() => {
        const initCart = async () => {
            if (authLoading) return;

            setLoading(true);

            if (user) {
                // Check for guest cart to merge
                const localData = localStorage.getItem('pahunn_cart');
                if (localData) {
                    const guestItems = JSON.parse(localData);
                    if (guestItems.length > 0) {
                        // Merge strategy: Add all guest items to backend
                        // We use Promise.allSettled to try adding all, ignoring duplicates/errors for now
                        await Promise.allSettled(guestItems.map(item =>
                            cartApi.add({
                                productId: item.id,
                                variant: { size: item.size, color: item.color },
                                quantity: item.quantity
                            })
                        ));
                        // Clear local cart after merge attempt
                        localStorage.removeItem('pahunn_cart');
                    }
                }

                // Fetch latest cart from backend
                try {
                    const res = await cartApi.get();
                    if (res.data.success) {
                        setCartItems(res.data.data.map(formatCartItem));
                    }
                } catch (err) {
                    console.error("Failed to fetch cart", err);
                }
            } else {
                // Guest: Load from Local Storage
                const localData = localStorage.getItem('pahunn_cart');
                if (localData) {
                    setCartItems(JSON.parse(localData));
                } else {
                    setCartItems([]);
                }
            }
            setLoading(false);
        };

        initCart();
    }, [user, authLoading]);

    // Persist to Local Storage (Guest Only)
    useEffect(() => {
        if (!user && !authLoading) {
            localStorage.setItem('pahunn_cart', JSON.stringify(cartItems));
        }
    }, [cartItems, user, authLoading]);

    const addToCart = async (product, size, color) => {
        const newItem = {
            id: product.id || product._id,
            title: product.title,
            price: product.finalPrice || product.price,
            image: product.image || product.images?.[0]?.url,
            size,
            color,
            quantity: 1,
            slug: product.slug
        };

        // Optimistic Update
        const prevCart = [...cartItems];
        setCartItems(prev => {
            const existing = prev.find(item => item.id === newItem.id && item.size === size && item.color === color);
            if (existing) {
                return prev.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, newItem];
        });

        if (user) {
            try {
                await cartApi.add({
                    productId: newItem.id,
                    variant: { size, color },
                    quantity: 1
                });
                // Optional: Fetch fresh cart to ensure sync? 
                // For now, trust optimistic. If error, we revert.
            } catch (err) {
                console.error("Add to cart failed", err);
                setCartItems(prevCart); // Revert
                alert(err.response?.data?.error || "Failed to add to cart");
            }
        }
    };

    const removeFromCart = async (itemId, size, color) => {
        // Optimistic Update
        const prevCart = [...cartItems];
        setCartItems(prev => prev.filter(item => !(item.id === itemId && item.size === size && item.color === color)));

        if (user) {
            try {
                await cartApi.remove(itemId, size, color);
            } catch (err) {
                console.error("Remove failed", err);
                setCartItems(prevCart); // Revert
                alert("Failed to remove item");
            }
        }
    };

    const updateQuantity = async (itemId, size, color, delta) => {
        const currentItem = cartItems.find(item => item.id === itemId && item.size === size && item.color === color);
        if (!currentItem) return;

        const newQuantity = currentItem.quantity + delta;
        if (newQuantity < 1) return removeFromCart(itemId, size, color);

        // Optimistic Update
        const prevCart = [...cartItems];
        setCartItems(prev => prev.map(item =>
            (item.id === itemId && item.size === size && item.color === color)
                ? { ...item, quantity: newQuantity }
                : item
        ));

        if (user) {
            try {
                await cartApi.update(itemId, size, color, newQuantity);
            } catch (err) {
                console.error("Update failed", err);
                setCartItems(prevCart); // Revert
                // alert("Failed to update quantity"); // annoying to alert on rapid clicks
            }
        }
    };

    const clearCart = async () => {
        setCartItems([]);
        if (user) {
            try {
                await cartApi.clear();
            } catch (err) {
                console.error("Clear failed", err);
                // No easy revert for clear, assume success or refresh
            }
        }
    };

    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal,
        loading
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
