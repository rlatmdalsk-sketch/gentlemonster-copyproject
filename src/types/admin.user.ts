import type { User } from "./user";

export interface AdminUserParams {
    page: number;
    limit: number;
}

export interface AdminUserResponse {
    data: User[];
    pagination: {
        totalUsers: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}

export interface CreateUserInput {
    email: string;
    password: string;
    name: string;
    phone: string;
    birthdate: string;
    gender: "MALE" | "FEMALE";
    role: "USER" | "ADMIN";
}

export interface UpdateUserInput {
    email?: string;
    password?: string;
    name?: string;
    phone?: string;
    birthdate?: string;
    gender?: "MALE" | "FEMALE";
    role?: "USER" | "ADMIN";
}