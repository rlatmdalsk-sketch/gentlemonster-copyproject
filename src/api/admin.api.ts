
import { httpClient as api } from "./axios";

export const fetchAllUsers = async (page = 1) => {
    const response = await api.get("/admin/users", { // baseURL이 .../api 이면 자동 합산됨
        params: { page },
    });
    return response.data;
};