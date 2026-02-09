import { create } from "zustand";
import { addBookmark, deleteBookmark, getBookmarks } from "../api/Bookmarks.api.ts";

interface BookmarkState {
    bookmarkedNames: Set<string>; // 중복 체크를 위해 Set 사용
    loading: boolean;
    fetchBookmarks: () => Promise<void>;
    toggleBookmarkByName: (productName: string, targetIds: number[]) => Promise<void>;
}

const useBookmarkStore = create<BookmarkState>((set, get) => ({
    bookmarkedNames: new Set(),
    // 🌟 추가: 이름별로 서버에 등록된 실제 ID들을 저장 (해제할 때 사용)
    idMapByName: new Map<string, number[]>(),
    loading: false,

    fetchBookmarks: async () => {
        set({ loading: true });
        try {
            const res = await getBookmarks(1);
            let list: any[] = [];
            if (Array.isArray(res)) list = res;
            else if (res?.data?.data) list = res.data.data;

            const names = new Set<string>();
            const idMap = new Map<string, number[]>();

            list.forEach((item: any) => {
                const name = item.product?.name || item.name;
                const id = item.product?.id || item.productId || item.id;

                if (name) {
                    names.add(name);
                    // 이름별로 ID 리스트 생성
                    const existingIds = idMap.get(name) || [];
                    idMap.set(name, [...existingIds, Number(id)]);
                }
            });

            set({ bookmarkedNames: names, idMapByName: idMap });
        } catch (error) {
            console.error(error);
        } finally {
            set({ loading: false });
        }
    },

    // 이름 기반 일괄 토글
    toggleBookmarkByName: async (productName, targetIdsFromProps) => {
        const { bookmarkedNames, idMapByName } = get();
        const isCurrentlyMarked = bookmarkedNames.has(productName);

        // 🌟 해제할 때는 스토어가 기억하는 모든 ID + 현재 props로 들어온 ID 합치기
        const savedIds = idMapByName.get(productName) || [];
        const finalTargetIds = [...new Set([...savedIds, ...targetIdsFromProps])];

        // UI 즉시 반영
        const newNames = new Set(bookmarkedNames);
        if (isCurrentlyMarked) newNames.delete(productName);
        else newNames.add(productName);
        set({ bookmarkedNames: newNames });

        try {
            if (isCurrentlyMarked) {
                // 저장된 모든 ID 해제 요청 (404 에러 방지를 위해 개별 에러 제어)
                await Promise.all(
                    finalTargetIds.map(id =>
                        deleteBookmark(id).catch(err => console.warn(`${id} 해제 무시`, err))
                    )
                );
            } else {
                await Promise.all(finalTargetIds.map(id => addBookmark({ productId: id })));
            }
            // 🌟 성공 후 서버 상태와 동기화 위해 fetch 호출 (권장)
            get().fetchBookmarks();
        } catch (error) {
            set({ bookmarkedNames: bookmarkedNames }); // 롤백
            alert("북마크 처리에 실패했습니다.");
        }
    },
}));

export default useBookmarkStore;