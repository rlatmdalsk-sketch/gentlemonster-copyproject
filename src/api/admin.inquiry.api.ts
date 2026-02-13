import { httpClient } from "./axios.ts";
import type {
    AdminAnswerRequest,
    AdminInquiryItem,
    AdminInquiryListResponse,
} from "../types/admin.inquiry.ts";

/* 전체 문의 내역 조회 */
export const fetchAdminInquiryList = async (page = 1, limit = 10) => {
    const response = await httpClient.get<AdminInquiryListResponse>(`/admin/inquiries`, {
        params: {
            page,
            limit
        }
    });
    return response.data;
};

/*  문의 상세 조회 */
export const fetchAdminInquiryDetail = async (id: number) => {
    const response = await httpClient.get<AdminInquiryItem>(`/admin/inquiries/${id}`);
    return response.data.data;
};

/* 문의 답변 등록 및 수정 */
export const answerInquiry = async (id: number, data: AdminAnswerRequest) => {
    const response = await httpClient.patch<AdminInquiryItem>(`/admin/inquiries/${id}/answer`, data);
    return response.data.data;
};


/* 문의 삭제 */
export const deleteInquiryByAdmin = async (id: number) => {
    const response = await httpClient.delete(`/admin/inquiries/${id}`);
    return response.data;
};