import { httpClient } from "./axios";
import type {
    AdminProductResponse,
    CreateProductInput,
    UpdateProductInput,
} from "../types/admin.product";

export const createProduct = async (data: CreateProductInput) => {
    const response = await httpClient.post<AdminProductResponse>("/admin/products", data);
    return response.data;
};

export const deleteProduct = async (id: number) => {
    const response = await httpClient.delete(`/admin/products/${id}`);
    return response.data;
};

export const updateProduct = async (id: number, data: UpdateProductInput) => {
    const response = await httpClient.put<AdminProductResponse>(`/admin/products/${id}`, data);
    return response.data;
};