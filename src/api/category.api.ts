import type { Category, CategoryDetailResponse } from "../types/category.ts";
import { httpClient } from "./axios.ts";

export const getCategories = async () => {
    const response = await httpClient.get<Category[]>("/categories");
    return response.data;
};

export const getCategoryByPath = async (path: string) => {
    const response = await httpClient.get<CategoryDetailResponse>(`/categories/${path}`);
    return response.data;
};
