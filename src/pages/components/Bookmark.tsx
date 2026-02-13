import { RxBookmark, RxBookmarkFilled } from "react-icons/rx";
import { useOutletContext } from "react-router-dom"; // context를 쓰기 위해 추가
import useAuthStore from "../../stores/useAuthStore";
import useBookmarkStore from "../../stores/useBookMarkStore.ts";
import useNotificationStore from "../../stores/useNotificationStore.ts";

interface BookmarkProps {
    productId: number;
    productName: string;
    allProducts?: any[];
}

interface ContextType {
    onLoginClick: () => void;
}

function Bookmark({ productId, productName, allProducts }: BookmarkProps) {
    const { isLoggedIn } = useAuthStore();
    const { bookmarkedNames, toggleBookmarkByName } = useBookmarkStore();
    const { show } = useNotificationStore();

    const { onLoginClick } = useOutletContext<ContextType>();

    const isBookmarked = bookmarkedNames.has(productName);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            onLoginClick();
            return;
        }

        if (!isBookmarked) {
            const currentProduct = allProducts?.length === 1
                ? allProducts[0]
                : allProducts?.find((p: any) => (p.product?.name || p.name) === productName);

            const pData = currentProduct?.product || currentProduct;
            const imgUrl = pData?.images?.[0]?.url || pData?.image;
            const price = pData?.price;

            if (imgUrl) {
                const img = new Image();
                img.src = imgUrl;
            }

            show(productName, {
                id: productId,
                name: productName,
                price: price,
                image: imgUrl,
                images: imgUrl ? [{ url: imgUrl }] : []
            });
        }

        const targetIds = allProducts
            ? allProducts
                .filter((p: any) => (p.product?.name || p.name) === productName)
                .map((p: any) => p.product?.id || p.id)
            : [productId];

        await toggleBookmarkByName(productName, [...new Set(targetIds)]);
    };

    return (
        <button onClick={handleToggle} className="p-2 transition-transform active:scale-90 cursor-pointer">
            {isBookmarked ? (
                <RxBookmarkFilled className="text-[23px] text-black" />
            ) : (
                <RxBookmark className="text-[23px] text-gray-400 hover:text-black" />
            )}
        </button>
    );
}

export default Bookmark;