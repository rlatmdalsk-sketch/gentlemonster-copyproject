import type {CategoryProductsResponse, CategoryResponse} from "../types/category.ts";
import {httpClient} from "./axios.ts";

export const getCategories = async() => {
    const response = await httpClient.get<CategoryResponse>("/categories");
    return response.data;
}

export const getCategoryById = async (path: string) => {
    const response = await httpClient.get<CategoryProductsResponse>(`/categories/${path}`);
    return response.data;
}

export const getCategoryByPath = async (path: string, page: number = 1) => {
    const response = await httpClient.get<CategoryProductsResponse>(`/categories/${path}`, {
        params: { page } // /categories/sunglasses?page=1 형태로 요청됨
    });
    return response.data.data;
}