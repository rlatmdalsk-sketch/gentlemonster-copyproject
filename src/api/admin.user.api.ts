import { httpClient } from "./axios";
import type { AdminUserResponse, CreateUserInput, UpdateUserInput} from "../types/admin.user";
import type {User} from "../types/user.ts";

export const fetchUsers = async (page: number, limit: number) => {
    const response = await httpClient.get<AdminUserResponse>("/admin/users", {
        params: { page, limit },
    });
    return response.data;
};

export const createUser = async (data: CreateUserInput) => {
    const response = await httpClient.post("/admin/users", data);
    return response.data;
};

export const updateUser = async (userId: number, data: UpdateUserInput) => {
    const response = await httpClient.put(`/admin/users/${userId}`, data);
    return response.data;
};

export const deleteUser = async (userId: number) => {
    const response = await httpClient.delete(`/admin/users/${userId}`);
    return response.data;
};

export const fetchUserDetail = async (userId: number) => {
    const response = await httpClient.get<{ data: User }>(`/admin/users/${userId}`);
    return response.data.data;
};