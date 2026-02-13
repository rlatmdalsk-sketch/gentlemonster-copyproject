import useNotificationStore from "../../stores/useNotificationStore";
import useBookmarkStore from "../../stores/useBookMarkStore";
import useCartStore from "../../stores/useCartStore";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBookmarks } from "../../api/Bookmarks.api";

function Notification() {
    const { isOpen, message, item, hide } = useNotificationStore();
    const { bookmarkedNames } = useBookmarkStore();
    const { items: cartItems } = useCartStore();
    const [previewList, setPreviewList] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            const loadPreview = async () => {
                try {
                    // 🌟 1. 쇼핑백에 담았을 때 (isCart 플래그가 있을 때)
                    if (item?.isCart) {
                        // 스토어의 쇼핑백 리스트를 최신순으로 3개 보여줌
                        const sortedCart = [...cartItems].reverse();
                        setPreviewList(sortedCart.slice(0, 3));
                        return;
                    }

                    // 🌟 2. 위시리스트에 담았을 때
                    const res = await getBookmarks(1);
                    const serverList = (res as any)?.data?.data || res || [];
                    let combinedList = [...serverList];

                    if (item && !item.isCart) {
                        const exists = serverList.some((p: any) => (p.product?.id || p.id) === item.id);
                        if (!exists) combinedList = [item, ...serverList];
                    }
                    setPreviewList(combinedList.slice(0, 3));

                } catch (error) {
                    console.error("미리보기 로드 실패", error);
                }
            };
            loadPreview();
        }
    }, [isOpen, item, cartItems]);

    return (
        <div
            className={twMerge(
                "fixed top-4 right-4 w-[400px] bg-[#f2f3f5] h-[470px] z-[10000] shadow-xl transition-all duration-500 ease-in-out transform p-8",
                isOpen ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0 pointer-events-none"
            )}
        >
            <button
                onClick={hide}
                className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
            >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                </svg>
            </button>

            <div className="mb-10 mt-4">
                <p className="text-[13px] font-normal leading-relaxed">
                    <span className="font-semibold">{message}</span> 을(를)
                    {item?.isCart ? " 쇼핑백에 담았습니다." : " 위시리스트에 저장했습니다."}
                </p>
            </div>

            <div className="mb-7">
                <p className="text-[12px] font-[500]">
                    {item?.isCart ? "쇼핑백" : "위시리스트"}
                    <sup className="ml-0.5">
                        {item?.isCart ? cartItems.length : bookmarkedNames.size}
                    </sup>
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-14">
                {previewList.map((productItem, idx) => {
                    const p = productItem.product || productItem;
                    const displayImg = p?.images?.[0]?.url || p?.image || productItem?.image;
                    const displayPrice = p?.price || productItem?.price;

                    return (
                        <div key={`${p?.id || idx}-${idx}`} className="flex flex-col">
                            <div className="aspect-[3/4] flex items-center justify-center bg-transparent">
                                {displayImg ? (
                                    <img
                                        src={displayImg}
                                        alt=""
                                        className="w-full h-auto object-contain mix-blend-multiply"
                                        key={displayImg}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 animate-pulse" />
                                )}
                            </div>
                            <p className="text-[10px] truncate font-medium mb- uppercase">{p?.name}</p>
                            <p className="text-[10px] font-semibold">
                                {displayPrice ? `₩${displayPrice.toLocaleString()}` : ""}
                            </p>
                        </div>
                    );
                })}
            </div>

            <Link to={item?.isCart ? "/shoppingBag" : "/myaccount/WishList"} onClick={hide}>
                <button className="w-full py-4 border border-gray-400 rounded-[8px] text-[13px] font-[400] transition-colors cursor-pointer uppercase bg-white">
                    {item?.isCart ? "쇼핑백 보기" : "위시리스트 보기"}
                </button>
            </Link>
        </div>
    );
}

export default Notification;