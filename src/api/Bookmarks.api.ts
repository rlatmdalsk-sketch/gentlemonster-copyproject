import { httpClient } from "./axios.ts";
import type { BookmarksResponse, BookmarkUpdate } from "../types/Bookmarks.ts";

/**
 * 북마크 목록 조회
 */
export const getBookmarks = async (page: number = 1): Promise<BookmarksResponse> => {
    const res = await httpClient.get(`/bookmarks`, {
        params: { page, limit: 10 }
    });
    return res.data;
};

/**
 * 북마크 등록
 */
export const addBookmark = async (data: BookmarkUpdate) => {
    // data는 { productId: number } 형태
    const res = await httpClient.post("/bookmarks", data);
    return res.data;
};

/**
 * 북마크 삭제
 */
export const deleteBookmark = async (productId: number) => {
    // 상품 ID를 경로에 넣어 삭제하는 일반적인 패턴
    const res = await httpClient.delete(`/bookmarks/${productId}`);
    return res.data;
};