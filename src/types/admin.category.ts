import type { Category } from "./category";

export interface CreateCategoryInput {
    name: string;
    path: string;
    parentId?: number | null;
}

export interface UpdateCategoryInput {
    name?: string;
    path?: string;
    parentId?: number | null;
}

export interface AdminCategoryResponse {
    message: string;
    data: Category;
}

export interface FlatCategory extends Category {
    level: number;
}
