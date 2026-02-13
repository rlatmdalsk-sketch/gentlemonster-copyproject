import { httpClient } from "./axios.ts";
import type { Product, ProductListParams, ProductListResponse } from "../types/product.ts";

export const fetchProducts = async (params: ProductListParams) => {
    const response = await httpClient.get<ProductListResponse>("/products", {
        params,
    });
    return response.data;
};

export const fetchProductDetail = async (id: number) => {
    const response = await httpClient.get<{ product: Product }>(`/products/${id}`);
    return response.data;
};

