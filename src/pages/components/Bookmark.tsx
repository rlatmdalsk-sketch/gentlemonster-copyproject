import { RxBookmark, RxBookmarkFilled } from "react-icons/rx";
import useBookmarkStore from "../../stores/useBookmarkStore";
import useAuthStore from "../../stores/useAuthStore";

interface BookmarkProps {
    productId: number;
    productName: string;
    allProducts?: any[]; // 현재 페이지의 상품들 (ID 추출용)
}

function Bookmark({ productId, productName, allProducts }: BookmarkProps) {
    const { isLoggedIn } = useAuthStore();
    const { bookmarkedNames, toggleBookmarkByName } = useBookmarkStore();

    // 내 이름이 스토어의 북마크 셋에 있는지 확인
    const isBookmarked = bookmarkedNames.has(productName);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            return;
        }

        // 1. 이름이 같은 모든 ID 찾기
        const targetIds = allProducts
            ? allProducts
                .filter((p: any) => (p.product?.name || p.name) === productName)
                .map((p: any) => p.product?.id || p.id)
            : [productId];

        // 2. 스토어의 일괄 처리 함수 호출
        await toggleBookmarkByName(productName, [...new Set(targetIds)]);
    };

    return (
        <button onClick={handleToggle} className="p-2 transition-transform active:scale-90">
            {isBookmarked ? (
                <RxBookmarkFilled className="text-[23px] text-black" />
            ) : (
                <RxBookmark className="text-[23px] text-gray-400 hover:text-black" />
            )}
        </button>
    );
}

export default Bookmark;