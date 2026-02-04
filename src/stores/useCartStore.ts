import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCart, addToCart } from "../api/cart.api.ts";
import type { CartItem } from "../types/Cart.ts";

interface CartState {
    items: CartItem[];
    loading: boolean;

    // 장바구니 목록 불러오기
    fetchCart: () => Promise<void>;

    // 장바구니 상품 추가
    addItem: (productId: number, quantity: number) => Promise<void>;

    // [미구현 API] 수량 변경 (현재는 로컬 상태만 변경하도록 설정 가능)
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;

    // [미구현 API] 상품 삭제
    removeItem: (itemId: number) => Promise<void>;

    // 총 수량 계산
    getTotalCount: () => number;

    // 총 결제 금액 계산
    getTotalPrice: () => number;
}

const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            loading: false,

            // 1. 장바구니 데이터 로드
            fetchCart: async () => {
                set({ loading: true });
                try {
                    const result = await getCart();
                    // 서버 응답이 배열이면 result 그대로, { items: [] } 형식이면 result.items 사용
                    set({ items: Array.isArray(result) ? result : (result as any).items || [] });
                } catch (e) {
                    console.error("장바구니 로드 실패", e);
                } finally {
                    set({ loading: false });
                }
            },

            // 2. 상품 추가
            addItem: async (productId, quantity) => {
                try {
                    await addToCart(productId, quantity);
                    // 추가 후 최신 목록을 서버에서 다시 받아옴
                    await get().fetchCart();
                } catch (e) {
                    console.error("장바구니 담기 실패", e);
                    throw e;
                }
            },

            // 3. 수량 변경 (API 미구현으로 로컬에서만 동작하거나 대기)
            updateQuantity: async (itemId, quantity) => {
                if (quantity < 1) return;

                // API가 없으므로 로컬 UI만 우선 변경 (새로고침 시 복구됨)
                const prevItems = get().items;
                set({
                    items: prevItems.map(item =>
                        item.id === itemId ? { ...item, quantity } : item,
                    ),
                });

                console.warn("수량 변경 API가 아직 구현되지 않았습니다.");
                // try { await updateCartItem(itemId, quantity); } catch (e) { set({ items: prevItems }); }
            },

            // 4. 상품 삭제 (API 미구현으로 로컬에서만 동작)
            removeItem: async (itemId) => {
                const prevItems = get().items;
                set({ items: prevItems.filter(item => item.id !== itemId) });

                console.warn("삭제 API가 아직 구현되지 않았습니다.");
                // try { await removeCartItem(itemId); } catch (e) { set({ items: prevItems }); }
            },

            // 5. 총 아이템 개수 계산
            getTotalCount: () => {
                return get().items.reduce((acc, item) => acc + item.quantity, 0);
            },

            // 6. 총 가격 계산 (현재 product 구조에 맞춤: item.product.price)
            getTotalPrice: () => {
                return get().items.reduce(
                    (acc, item) => acc + item.product.price * item.quantity,
                    0,
                );
            },
        }),
        {
            name: "cart-storage", // 로컬 스토리지에 저장될 이름
        },
    ),
);

export default useCartStore;