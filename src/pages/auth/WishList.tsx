import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import { getBookmarks } from "../../api/Bookmarks.api.ts";
import Bookmark from "../components/Bookmark.tsx";
import useAuthStore from "../../stores/useAuthStore.ts";
import useCartStore from "../../stores/useCartStore.ts";
import { useOutletContext } from "react-router";
import { twMerge } from "tailwind-merge";
import useNotificationStore from "../../stores/useNotificationStore.ts";


const Wishlist = () => {
    const { onLoginClick } = useOutletContext<{ onLoginClick: () => void }>();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuthStore();
    const { addItem } = useCartStore();

    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { show } = useNotificationStore();

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
                        return [product.name, item]; // [Key, Value] 형태
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


        const targetItem = wishlist.find(item => {
            const p = item.product || item;
            return (p.id || item.productId) === productId;
        });

        if (!targetItem) return;
        const product = targetItem.product || targetItem;

        try {

            await addItem(productId, 1);


            show(product.name, {
                id: productId,
                name: product.name,
                price: product.price,
                image: product.images?.[0]?.url || product.image,
                isCart: true
            });

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

    if (wishlist.length === 0) {
        return (
            <div className="w-full h-screen flex flex-col items-center py-16">
                <div className="flex gap-6">
                    <button className="text-[15px] font-[#111]  h-[30px] px-[12px] rounded-lg">
                        위시리스트<sup>0</sup>
                    </button>
                </div>
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

    return (
        <div className="w-full min-h-screen pt-10 pb-20 px-[20px] md:px-[50px]">
            {/* 헤더 섹션 */}
            <div className="flex justify-center items-center relative mb-10">
                <div className="flex gap-6">
                    <button className="text-[15px] font-[#111]  h-[30px] px-[12px] rounded-lg">
                        위시리스트<sup>{wishlist.length}</sup>
                    </button>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-3xl md:mr-4">
                    <IoCloseOutline />
                </button>
            </div>

            {/* 위시리스트 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 ">
                {wishlist.map(item => {
                    const product = item.product || item;
                    const productId = product.id || item.productId;
                    return (
                        <div
                            key={productId}
                            className="flex flex-col group w-[350px] h-[650px] mx-auto">
                            {/* 상품 이미지 */}
                            <Link to={`/product/${productId}`}>
                                <div className="mb-6 bg-[#f5f5f5] aspect-[3/4] overflow-hidden relative">
                                    <img
                                        src={
                                            product.images?.[0]?.url ||
                                            product.image ||
                                            "/placeholder.jpg"
                                        }
                                        alt={product.name}
                                        className="w-full h-full object-cover scale-180"
                                    />
                                </div>

                                {/* 정보 영역 */}
                                <div className="flex justify-between items-start mb-2  px-1">
                                    <div className="flex flex-col  text-[11px]">
                                        <p className="font-medium text-[#111] uppercase tracking-tight">
                                            {product.name}
                                        </p>
                                        <p className="font-medium text-[#111]">
                                            ₩{product.price?.toLocaleString()}
                                        </p>
                                    </div>
                                    <Bookmark
                                        key={product.id}
                                        productId={product.id}
                                        productName={product.name}
                                        allProducts={[product]}
                                    />
                                </div>
                            </Link>

                            <button
                                onClick={() => handleAddToCart(Number(productId))}
                                className={twMerge(
                                    "bg-[#e3e5e6] ",
                                    "max-w-[80px]",
                                    "h-[30px]",
                                    "py-[5px]",
                                    "text-[#111]",
                                    " text-[9px]",
                                    "rounded-[8px]",
                                    " tracking-tight",
                                    "font-semibold",
                                    "cursor-pointer",
                                    [
                                        "hover:bg-black",
                                        "hover:text-white",
                                        "transition-all",
                                        "duration-300",
                                    ],
                                )}>
                                쇼핑백에 추가하기
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Wishlist;
