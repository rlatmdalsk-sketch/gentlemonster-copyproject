import type {
    CreateOrderRequest,
    OrderCancel,
    OrderConfirmRequest,
    OrderDetailResponse,
    OrderListResponse,
    OrderStatus,
    OrderStatusData,
} from "../types/order";
import { httpClient } from "./axios.ts";

/**
 * 1. 주문서 작성 API
 * 결제창을 띄우기 전, 서버에 주문 초안을 생성합니다.
 */
export const createOrder = async (data: CreateOrderRequest) => {
    const response = await httpClient.post<{ message: string; data: OrderDetailResponse }>("/orders/checkout", data);
    return response.data.data;
};

/**
 * 2. 결제 승인 및 주문 확정 API
 */
export const confirmOrder = async (data: OrderConfirmRequest) => {
    const response = await httpClient.post<OrderDetailResponse>("/orders/confirm", data);
    return response.data;
};

/**
 * 3. 주문 목록 조회 API
 */
export const fetchOrderList = async (page = 1, limit = 10) => {
    const response = await httpClient.get<OrderListResponse>(`/orders`, {
        params: {
            page,
            limit
        }
    });
    return response.data;
};

/**
 * 4. 주문 상세 조회 API
 */
export const fetchOrderDetail = async (orderId: number) => {
    const response = await httpClient.get<{ message: string; data: OrderDetailResponse }>(`/orders/${orderId}`);
    return response.data.data || response.data;
};

/**
 * 5. 주문 취소 API
 */
export const cancelOrder = async (id: number, reason?: string) => {
    const response = await httpClient.patch<OrderCancel>(`/orders/${id}/cancel`, {
        message: reason || "사용자 요청에 의한 취소"
    });
    return response.data;
};

/**
 * 6. 주문 상태 변경 API
 */
export const updateOrderStatus = async (id: number, data: OrderStatusData) => {
    const response = await httpClient.patch<{ message: string }>(
        `/admin/orders/${id}/status`,
        data
    );
    return response.data;
};

/**
 * 7.  전체 주문 목록 조회 API
 */
export const fetchAdminOrderList = async (page = 1, limit = 10, status?: OrderStatus) => {
    const response = await httpClient.get<OrderListResponse>(`/admin/orders`, {
        params: {
            page,
            limit,
            status
        }
    });
    return response.data;
};