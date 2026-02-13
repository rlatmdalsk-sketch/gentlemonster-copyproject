import { httpClient } from "./axios";
import type {
    CreateCategoryInput,
    UpdateCategoryInput,
    AdminCategoryResponse,
} from "../types/admin.category.ts";

export const createCategory = async (data: CreateCategoryInput) => {
    const response = await httpClient.post<AdminCategoryResponse>("/admin/categories", data);
    return response.data;
};

export const updateCategory = async (id: number, data: UpdateCategoryInput) => {
    const response = await httpClient.put<AdminCategoryResponse>(`/admin/categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id: number) => {
    const response = await httpClient.delete(`/admin/categories/${id}`);
    return response.data;
};

