import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCart, addToCart, updateCart, removeCart } from "../api/cart.api.ts";
import type { CartItem } from "../types/Cart.ts";

interface CartState {
    items: CartItem[];
    loading: boolean;
    fetchCart: () => Promise<void>;
    addItem: (productId: number, quantity: number) => Promise<void>;
    updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
    removeItem: (cartItemId: number) => Promise<void>;
    clearCart: () => void;
    getTotalCount: () => number;
    getTotalPrice: () => number;
}

const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            loading: false,

            fetchCart: async () => {
                set({ loading: true });
                try {
                    const result = await getCart();
                    const cartData = Array.isArray(result) ? result : (result as any).items || [];
                    set({ items: cartData });
                } catch (e) {
                    console.error("장바구니 로드 실패", e);
                } finally {
                    set({ loading: false });
                }
            },

            addItem: async (productId, quantity) => {
                try {
                    await addToCart(productId, quantity);
                    await get().fetchCart();
                } catch (e) {
                    console.error("장바구니 담기 실패", e);
                    throw e;
                }
            },

            updateQuantity: async (cartItemId, quantity) => {
                if (quantity < 1) return;
                const prevItems = get().items;
                set({
                    items: prevItems.map(item =>
                        item.id === cartItemId ? { ...item, quantity } : item,
                    ),
                });
                try {
                    await updateCart(cartItemId, quantity);
                } catch (e) {
                    console.error("수량 변경 실패", e);
                    set({ items: prevItems });
                }
            },

            removeItem: async (cartItemId) => {
                const prevItems = get().items;
                set({ items: prevItems.filter(item => item.id !== cartItemId) });
                try {
                    await removeCart(cartItemId);
                } catch (e) {
                    console.error("상품 삭제 실패", e);
                    set({ items: prevItems });
                }
            },


            clearCart: () => {
                set({ items: [] });
            },

            getTotalCount: () => {
                const items = get().items || [];
                return items.reduce((acc, item) => acc + (item.quantity || 0), 0);
            },

            getTotalPrice: () => {
                const items = get().items || [];
                return items.reduce((acc, item) => {
                    const price = item.product?.price || 0;
                    const qty = item.quantity || 0;
                    return acc + (price * qty);
                }, 0);
            },
        }),
        {
            name: "cart-storage",
        },
    ),
);

export default useCartStore;