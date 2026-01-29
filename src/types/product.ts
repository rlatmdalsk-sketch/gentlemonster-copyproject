export interface ProductImage {
    id: number;
    url: string;
    productId: number;
}

export interface SimpleCategory {
    id: number;
    name: string;
    path: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    material: string;
    summary: string;
    collection: string;
    lens: string;
    originCountry: string;
    Shape: string;
    sizeInfo: string;
    createdAt: string;
    updatedAt: string;
    images: ProductImage[];
    category: SimpleCategory;
}

export interface ProductListParams {
    page: number;
    limit: number;
    category?: string;
    sort?: "latest" | "lowPrice" | "highPrice";
}

export interface ProductListResponse {
    data: Product[];
    pagination: {
        total: number;
        totalPages: number;
        page: number;
        limit: number;
    };
}