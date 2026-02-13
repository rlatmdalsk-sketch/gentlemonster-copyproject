export interface RegisterFormType {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
    phone: string;
    gender: "MALE" | "FEMALE";
    birthdate: string;
}

export interface LoginFormType {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    user: User;
}

export interface User {
    id: number;
    email: string;
    name: string;
    phone: string;
    birthdate: string;
    gender?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserProfileResponse {
    message: string;
    data: User;
}

export interface UpdateProfileDto {
    name?: string;
    phone?: string;
    birthdate?: string;
    gender?: string;
}