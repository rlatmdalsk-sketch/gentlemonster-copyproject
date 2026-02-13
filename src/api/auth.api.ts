import type {
    LoginFormType,
    LoginResponse,
    RegisterFormType,
    UpdateProfileDto,
    User,
    UserProfileResponse
} from "../types/user.ts";
import {httpClient} from "./axios.ts";

export const registerUser = async(data: RegisterFormType) => {
    const response = await httpClient.post<{message: string, data:User}>
    ("/auth/register",data);
    return response.data;
};

export const loginUser = async(data:LoginFormType) => {
    const response = await httpClient.post<LoginResponse>("/auth/login",data);
    return response.data;
}

export const updateProfile = async (data: UpdateProfileDto): Promise<User> => {
    const response = await httpClient.put<UserProfileResponse>("/users/profile", data);
    return response.data.data;
};