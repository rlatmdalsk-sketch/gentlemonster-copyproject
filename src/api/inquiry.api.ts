/*내 문의 내역 조회*/
import { httpClient } from "./axios.ts";
import type {
    CreateInquiryRequest,
    InquiryDetailResponse,
    InquiryListResponse,
    UpdateInquiryRequest,
} from "../types/inquiry.ts";

export const fetchInquiryList = async (page = 1, limit = 10) => {
    const response = await httpClient.get<InquiryListResponse>(`/inquiries`, {
        params: {
            page,
            limit
        }
    });
    return response.data;
};

/*문의 작성*/
export const createInquiry = async (data: CreateInquiryRequest) => {
    const response = await httpClient.post<InquiryDetailResponse>(`/inquiries`, data);
    return response.data;
};

/* 문의 상세 조회 */
export const fetchInquiryDetail = async (id: number) => {
    const response = await httpClient.get<{ message: string; data: InquiryDetailResponse }>(`/inquiries/${id}`);
    return response.data.data;
};

/* 문의 수정 */
export const updateInquiry = async (id: number, data: UpdateInquiryRequest) => {
    const response = await httpClient.put<InquiryDetailResponse>(`/inquiries/${id}`, data);
    return response.data;
};

/* 문의 삭제 */
export const deleteInquiry = async (id: number) => {
    const response = await httpClient.delete(`/inquiries/${id}`);
    return response.data;
};