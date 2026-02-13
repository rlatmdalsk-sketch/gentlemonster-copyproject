import { httpClient } from "./axios.ts";
import type { CartItemResponse } from "../types/Cart.ts";

export const getCart = async () => {
    const response = await httpClient.get<CartItemResponse>("/cart");
    return response.data;
};

export const addToCart = async ( productId: number, quantity: number  ) => {
    return httpClient.post("/cart", {
        productId,
        quantity,
    });
};

export const updateCart = async (cartItemId: number, quantity: number) => {
    return httpClient.put(`/cart/${cartItemId}`, { quantity });
};

export const removeCart = async (cartItemId: number) => {
    return httpClient.delete(`/cart/${cartItemId}`);
};
