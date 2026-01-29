import type { Product } from "./product.ts";

// 생성 시 입력 데이터 (이미지는 URL 배열)
export interface CreateProductInput {
    name: string;
    price: number;
    material: string;
    summary: string;
    collection: string;
    lens: string;
    originCountry: string;
    Shape: string;
    sizeInfo: string;
    categoryId: number;
    imageUrls: string[];
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export interface AdminProductResponse {
    message: string;
    data: Product;
}