/**
 *  주문 항목 인터페이스
 */
export interface OrderItem {
    productId: number;
    quantity: number;
}

/**
 *  주문서 작성 요청 데이터 인터페이스 (Request Body)
 */
export interface CreateOrderRequest {
    items: OrderItem[];          // 주문할 상품 리스트
    recipientName: string;       // 수령인 성함
    recipientPhone: string;      // 수령인 연락처
    zipCode: string;             // 우편번호
    address1: string;            // 기본 주소
    address2: string;            // 상세 주소
    gatePassword?: string;       // 공동현관 비밀번호
    deliveryRequest?: string;    // 배송 요청사항
}

export type OrderStatus =
    | "PENDING"
    | "PAID"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELED"
    | "RETURN_REQUESTED"
    | "RETURN_COMPLETED";

export interface OrderStatusData {
    status: OrderStatus;
    trackingNumber?: string;
    carrier?: string;
}

/**
 * [기존 유지] 결제 승인 요청 데이터
 */
export interface OrderConfirmRequest {
    orderId: number;
    paymentKey: string;
    amount: number;
}

/**
 * [수정] 주문 상세 조회 응답 (백엔드 실제 구조 맞춤)
 */
export interface OrderDetailResponse {
    id: number;
    createdAt: string;
    totalPrice: number;
    status: string;
    recipientName: string;
    address1: string;
    address2: string;
    items: OrderListItem[];
}

/**
 * [신규] 주문 목록 전체 응답 구조
 */
export interface OrderListResponse {
    data: OrderSummary[];      // 실제 주문 목록 배열
    pagination: {
        total: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}

export interface OrderSummary {
    id: number;
    createdAt: string;
    totalPrice: number;
    status: string;
    recipientName: string;
    trackingNumber: string | null;
    items: OrderListItem[];
}

/**
 * [수정] 주문 목록 내의 개별 상품 정보
 */

export interface OrderListItem {
    id: number;
    quantity: number;
    price: number;
    product: {
        name: string;
        images: { url: string }[];
    };
}

export interface OrderCancel {
    message: string;
    orderId: number;
    status: string;
}

