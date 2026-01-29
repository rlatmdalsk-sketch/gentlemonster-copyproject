export interface Category {
    id: number;
    name: string;
    path: string;
    parentId: number | null;
    children?: Category[];
    createdAt?: string;
    updatedAt?: string;
}

export interface Breadcrumb {
    id: number;
    name: string;
    path: string;
}

export interface CategoryDetailResponse {
    category: Category;
    breadcrumbs: Breadcrumb[];
}

export interface ProductImage {
    id: number;
    url: string;
    productId: number;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    summary: string;
    material: string;
    collection: string;
    lens: string;
    originCountry: string;
    Shape: string;
    sizeInfo: string;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
    images: ProductImage[];
}

export interface Pagination {
    totalProducts: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

// ---------------------------------------------------------
// 2. 실제 API 응답 구조 (JSON 상자 모양 그대로)
// ---------------------------------------------------------

// API 1: GET /categories (카테고리 목록만 올 때)
export interface CategoryResponse {
    data: Category[];
}

// API 2: GET /categories/{path} (상세 정보와 상품들이 한꺼번에 올 때)
export interface CategoryProductsResponse {
    data: {
        categoryInfo: Category;
        products: Product[];
        pagination: Pagination;
    };
}
