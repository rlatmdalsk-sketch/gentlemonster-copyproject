import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore.ts";
import useBookmarkStore from "../../stores/useBookMarkStore.ts";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { getBookmarks } from "../../api/Bookmarks.api.ts";

import { Swiper, SwiperSlide } from 'swiper/react';
import { fetchOrderList } from "../../api/order.api.ts";

function MyAccount() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { bookmarkedNames } = useBookmarkStore();

    const [wishlist, setWishlist] = useState<any[]>([]);
    const [orderList, setOrderList] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const wishRes = await getBookmarks(1);
                const wishData = (wishRes as any)?.data?.data || wishRes || [];
                setWishlist(wishData);

                const res = await fetchOrderList(1, 10);
                const finalOrders = Array.isArray(res.data)
                    ? res.data
                    : (res.data as any)?.data || (Array.isArray(res) ? res : []);

                const allOrderedProducts = finalOrders.flatMap((order: any) =>
                    (order.items || []).map((item: any) => ({
                        ...item.product,
                        price: item.price,
                        id: item.product?.id || item.productId
                    }))
                );

                setOrderList(allOrderedProducts.slice(0, 5));
            } catch (error) {
                console.error("데이터 로드 실패:", error);
            }
        };
        if (user) loadData();
    }, [user]);

    const handleProfileEditClick = () => {
        window.scrollTo(0, 0);
        navigate("/myaccount/profileEdit");
    };

    return (
        <div className={twMerge("max-w-[648px]", "mx-auto", "pt-17", "pb-20")}>
            <h2 className={twMerge("text-[17px]", "font-[400]", "text-center", "mb-16")}>
                {user ? `${user.name} 님, 안녕하세요` : "로그인이 필요합니다."}
            </h2>

            <div className="w-full mt-10">
                <div className="flex justify-between w-full text-[12px] pb-2 mb-8 border-b border-gray-100">
                    <p>최근 구매내역</p>
                    <button
                        onClick={() => navigate("/myaccount/orderList")}
                        className="cursor-pointer hover:underline"
                    >
                        더보기
                    </button>
                </div>

                {orderList.length > 0 ? (
                    <div className="grid grid-cols-5 gap-[15px]">
                        {orderList.map((product, index) => (
                            <Link key={`${product.id}-${index}`} to={`/product/${product.id}`} className="flex flex-col">
                                <div className="aspect-[3/4] overflow-hidden mb-2 bg-[#f5f5f5]">
                                    <img
                                        src={product.images?.[0]?.url || product.image || "/placeholder.jpg"}
                                        alt={product.name}
                                        className="w-full h-full object-cover scale-150"
                                    />
                                </div>
                                <p className="text-[11px] truncate uppercase font-medium">{product.name}</p>
                                <p className="text-[11px] text-[#858585] truncate uppercase font-semibold">
                                    ₩{product.price?.toLocaleString()}
                                </p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="h-[113px] flex items-center justify-center">
                        <p className="text-[11px] text-gray-400">최근 구매 내역이 없습니다.</p>
                    </div>
                )}
            </div>

            <div className="w-full mt-10">
                <div className="flex justify-between w-full text-[12px] pb-2 mb-8 border-b border-gray-100">
                    <p>위시리스트<sup>{bookmarkedNames.size}</sup></p>
                    <button
                        onClick={() => navigate("/myaccount/WishList")}
                        className="cursor-pointer hover:underline"
                    >
                        더보기
                    </button>
                </div>

                {wishlist.length > 0 ? (
                    <Swiper spaceBetween={15} slidesPerView={5} className="h-[200px]">
                        {wishlist.map((item) => {
                            const product = item.product || item;
                            return (
                                <SwiperSlide key={product.id}>
                                    <Link to={`/product/${product.id}`} className="flex flex-col">
                                        <div className="aspect-[3/4] bg-[#f5f5f5] overflow-hidden mb-2">
                                            <img
                                                src={product.images?.[0]?.url || product.image || "/placeholder.jpg"}
                                                alt={product.name}
                                                className="w-full h-full object-cover scale-150"
                                            />
                                        </div>
                                        <p className="text-[11px] truncate uppercase font-medium">{product.name}</p>
                                        <p className="text-[11px] text-[#858585] truncate uppercase font-semibold">
                                            ₩{product.price?.toLocaleString()}
                                        </p>
                                    </Link>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                ) : (
                    <div className="h-[113px] flex items-center justify-center">
                        <p className="text-[11px] text-gray-400">위시리스트에 담긴 제품이 없습니다.</p>
                    </div>
                )}
            </div>

            {/* 프로필 */}
            <div className="flex flex-col items-start mt-15 w-full">
                <div className="flex justify-between w-full text-[12px] border-b border-gray-100 pb-2">
                    <p>프로필</p>
                </div>
                <div className="w-full">
                    <p className="text-[17px] text-[#111] font-[550] my-6 leading-relaxed">
                        {user?.name}<br />
                        {user?.email}<br />
                        {user?.phone}
                    </p>
                    <button onClick={handleProfileEditClick} className="border w-full p-[10px] mt-5 text-[12px] rounded-[8px] cursor-pointer">
                        프로필 편집하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MyAccount;