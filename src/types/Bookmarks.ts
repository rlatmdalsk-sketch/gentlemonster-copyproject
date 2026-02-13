export interface BookmarkUpdate {
    productId: number;
}


export interface Bookmark {
    id: number;
    createdAt: string;
    product: {
        id: number;
        name: string;
        summary: string;
        price: number;
        images: {
            url: string;
        }[];
    };
}

export interface BookmarksResponse {
    data: Bookmark[];
    pagination: Pagination;
}

export interface Pagination {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}