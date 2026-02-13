import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OrderState {
    // 결제 과정에서 보관할 주문 관련 정보들
    orderId: string | null;
    orderNumber: string | null;
    totalAmount: number;

    // Actions
    setOrderInfo: (info: { orderId: string; orderNumber: string; totalAmount: number }) => void;
    clearOrder: () => void;
}

const useOrderStore = create<OrderState>()(
    persist(
        (set) => ({
            orderId: null,
            orderNumber: null,
            totalAmount: 0,

            // 주문 생성 시 정보를 저장하는 함수
            setOrderInfo: (info) => set({
                orderId: info.orderId,
                orderNumber: info.orderNumber,
                totalAmount: info.totalAmount
            }),

            // 결제 완료 후 또는 실패 시 데이터를 비우는 함수
            clearOrder: () => set({
                orderId: null,
                orderNumber: null,
                totalAmount: 0
            }),
        }),
        {
            name: "order-storage", // 로컬 스토리지에 저장될 키 이름
        }
    )
);

export default useOrderStore;