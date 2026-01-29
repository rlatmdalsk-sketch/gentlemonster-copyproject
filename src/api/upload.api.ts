// src/api/upload.api.ts
import { httpClient } from "./axios";

export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "products");

    const response = await httpClient.post<{ url: string }>("/uploads", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data.url;
};