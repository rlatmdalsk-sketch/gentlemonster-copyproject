export interface AdminInquiryUser {
    id: number;
    name: string;
    email: string;
}

export interface AdminInquiryImage {
    url: string;
}

export interface AdminInquiryItem {
    id: number;
    type: "DELIVERY" | "PRODUCT" | "EXCHANGE_RETURN" | "MEMBER" | "OTHER";
    title: string;
    content: string;
    status: "PENDING" | "ANSWERED";
    answer: string | null;
    answeredAt: string | null;
    createdAt: string;
    user: AdminInquiryUser;
    images: AdminInquiryImage[];
}

export interface AdminInquiryListResponse {
    data: AdminInquiryItem[];
    pagination: {
        total: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}

export interface AdminAnswerRequest {
    answer: string;
}