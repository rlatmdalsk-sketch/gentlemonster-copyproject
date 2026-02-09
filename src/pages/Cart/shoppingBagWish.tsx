import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router";
import { twMerge } from "tailwind-merge";

import useCartStore from "../../stores/useCartStore.ts";
import useAuthStore from "../../stores/useAuthStore.ts";
import { getBookmarks } from "../../api/Bookmarks.api.ts";

import CartWishHeader from "./CartWishHeader.tsx";
import Bookmark from "../components/Bookmark.tsx";
import useBookmarkStore from "../../stores/useBookmarkStore.ts";

function ShoppingBagWish() {
    const { getTotalCount, addItem } = useCartStore();
    const { bookmarkedNames } = useBookmarkStore();
    const { isLoggedIn } = useAuthStore();

    const navigate = useNavigate();
    const { onLoginClick } = useOutletContext<{ onLoginClick: () => void }>();

    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadWishlist = async () => {
        try {
            setLoading(true);
            const res = await getBookmarks(1);
            let list = [];

            if (res && (res as any).data && Array.isArray((res as any).data.data)) {
                list = (res as any).data.data;
            } else if (Array.isArray(res)) {
                list = res;
            }

            const uniqueList = Array.from(
                new Map(
                    list.map(item => {
                        const product = item.product || item;
                        return [product.name, item];
                    }),
                ).values(),
            );

            setWishlist(uniqueList);
        } catch (error) {
            console.error("위시리스트 로드 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) loadWishlist();
        else setLoading(false);
    }, [isLoggedIn]);

    const handleAddToCart = async (productId: number) => {
        if (!isLoggedIn) {
            onLoginClick();
            return;
        }
        try {
            await addItem(productId, 1);
            if (window.confirm("장바구니에 상품을 담았습니다. 장바구니로 이동하시겠습니까?")) {
                navigate("/shoppingBag");
            }
        } catch (e) {
            console.error(e);
            alert("장바구니 담기에 실패했습니다.");
        }
    };

    if (loading)
        return (
            <div className="pt-60 text-center text-[10px] tracking-widest animate-pulse">
                LOADING...
            </div>
        );

    // 1. 상품이 없을 때: ShoppingBag과 완벽 동일 레이아웃
    if (wishlist.length === 0) {
        return (
            <div className="w-full h-screen flex flex-col items-center py-16">
                <CartWishHeader
                    totalCount={getTotalCount()}
                    wishlistCount={0}
                    activeTab="wishlist"
                />
                <p className="text-[12px] mb-8 font-medium pt-56">
                    위시리스트에 추가된 제품이 없습니다.
                </p>
                <Link
                    to="/"
                    className="px-20 py-4 border border-gray-300 text-[12px] bg-white hover:bg-gray-50 transition-colors rounded-[5px]">
                    쇼핑 계속하기
                </Link>
            </div>
        );
    }

    // 2. 상품이 있을 때: ShoppingBag의 컨테이너 및 aside 공간 유지
    return (
        <div className="w-full min-h-screen pt-10 pb-20">
            <CartWishHeader
                totalCount={getTotalCount()}
                wishlistCount={bookmarkedNames.size}
                activeTab="wishlist"
            />

            <div className="flex flex-col lg:flex-row mx-auto items-start px-10">
                {/* 좌측 상품 영역: ShoppingBag의 ml-100과 동일한 여백 적용 */}
                <div className="flex-1 space-y-12 flex flex-col justify-center items-center overflow-hidden lg:ml-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16 py-10 w-full">
                        {wishlist.map((item) => {
                            const product = item.product || item;
                            const productId = product.id || item.productId;
                            return (
                                <div
                                    key={productId}
                                    className="flex flex-col group w-full max-w-[300px] mx-auto"
                                >
                                    <Link to={`/product/${productId}`}>
                                        <div className="mb-6 bg-[#f5f5f5] aspect-[3/4] overflow-hidden relative">
                                            <img
                                                src={product.images?.[0]?.url || product.image || "/placeholder.jpg"}
                                                alt={product.name}
                                                className="w-full h-full object-cover scale-180"
                                            />
                                        </div>
                                    </Link>

                                    <div className="flex justify-between items-start mb-4 px-1">
                                        <Link to={`/product/${productId}`} className="flex flex-col text-[11px]">
                                            <p className="font-medium text-[#111] uppercase tracking-tight">
                                                {product.name}
                                            </p>
                                            <p className="font-medium text-[#111]">
                                                ₩{product.price?.toLocaleString()}
                                            </p>
                                        </Link>
                                        <Bookmark
                                            productId={Number(productId)}
                                            productName={product.name}
                                            allProducts={wishlist}
                                        />
                                    </div>

                                    <button
                                        onClick={() => handleAddToCart(Number(productId))}
                                        className={twMerge(
                                            "bg-[#e3e5e6] w-[100px] h-[32px] text-[#111] text-[10px] rounded-[8px] tracking-tight font-semibold",
                                            "hover:bg-black hover:text-white transition-all duration-300"
                                        )}
                                    >
                                        쇼핑백에 추가하기
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 우측 aside 영역 대칭용: ShoppingBag의 aside 크기와 동일하게 비워둠 */}
                <aside className="hidden lg:block w-full md:w-[30%] lg:w-[420px] px-8 md:px-12 py-20"></aside>
            </div>
        </div>
    );
}

export default ShoppingBagWish;