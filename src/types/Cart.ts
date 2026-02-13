export interface CartItem {
    id: number;
    quantity: number;
    productId: number;
    product: {
        name: string;
        price: number;
        images: { url: string}[];

    }
}

export interface CartItemResponse {
    CartItems: CartItem[];
}