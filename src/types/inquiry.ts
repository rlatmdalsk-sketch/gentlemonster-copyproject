// 문의 유형 Enum (필터 및 등록 시 사용)
export type InquiryType =
    | "DELIVERY"          // 배송
    | "PRODUCT"           // 상품
    | "EXCHANGE_RETURN"   // 교환/반품
    | "MEMBER"            // 회원
    | "OTHER";            // 기타

//  답변 상태 Enum
export type InquiryStatus = "PENDING" | "ANSWERED";

// 공통 객체 타입
interface InquiryUser {
    id: number;
    name: string;
    email: string;
}

interface InquiryImage {
    url: string;
}

//  [조회] 문의 내역 단일 아이템 타입
export interface InquiryItem {
    id: number;
    type: InquiryType;
    title: string;
    content: string;
    status: InquiryStatus;
    answer: string | null;
    answeredAt: string | null;
    createdAt: string;
    user: InquiryUser;
    images: InquiryImage[];
}

//  [조회 응답] 전체 리스트 응답 구조
export interface InquiryListResponse {
    data: InquiryItem[];
    pagination: {
        total: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}

// [등록 요청] 문의 작성 시 서버로 보내는 데이터 타입
export interface CreateInquiryRequest {
    type: InquiryType;
    title: string;
    content: string;
    imageUrls: string[];
}

// 상세조회용 이미지 타입 (id가 포함됨)
interface InquiryDetailImage {
    id: number;
    url: string;
}

//  상세조회 문의 상세 아이템 타입
export interface InquiryDetailResponse {
    id: number;
    type: InquiryType;
    title: string;
    content: string;
    status: InquiryStatus;
    answer: string | null;
    answeredAt: string | null;
    createdAt: string;
    // 상세페이지 응답 데이터에 맞춰 이미지 타입 적용
    images: InquiryDetailImage[];
}

// 문의 내용 수정 시 서버로 보내는 데이터 타입
export interface UpdateInquiryRequest {
    type: InquiryType;
    title: string;
    content: string;
    imageUrls: string[];
}