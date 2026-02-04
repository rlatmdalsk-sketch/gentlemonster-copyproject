import { useEffect } from "react";
import { Link } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import useCartStore from "../../stores/useCartStore.ts"; // 닫기 아이콘 예시

const shoppingBag = () => {
    const { items, fetchCart, getTotalPrice, getTotalCount, updateQuantity, removeItem, loading } = useCartStore();

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    if (loading) return <div className="pt-60 text-center text-[10px] tracking-widest">LOADING...</div>;

    // 1. 쇼핑백에 상품이 없을 경우 (첫 번째 캡처)
    if (items.length === 0) {
        return (
            <div className="w-full  flex flex-col items-center mt-60">
                <p className="text-[14px] mb-10 font-[450]">쇼핑백에 추가된 제품이 없습니다.</p>
                <Link
                    to="/"
                    className="px-30 py-3 border text-[12px] rounded-lg border-gray-500 "
                >
                    쇼핑 계속하기
                </Link>
            </div>
        );
    }

    // 2. 쇼핑백에 상품이 있을 경우 (두 번째 캡처)
    return (
        <div className="w-full min-h-screen bg-[#f2f2f2] px-10 pt-10 relative">
            {/* 상단 탭 및 닫기 버튼 */}
            <div className="flex justify-center items-center relative mb-20">
                <div className="flex gap-10">
                    <button className="text-[13px] font-bold border-b-2 border-black pb-1">
                        쇼핑백<sup>{getTotalCount()}</sup>
                    </button>
                    <button className="text-[13px] text-gray-400">
                        위시리스트<sup>0</sup>
                    </button>
                </div>
                <Link to="/" className="absolute right-0 top-0 text-3xl">
                    <IoCloseOutline />
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-20 max-w-[1600px] mx-auto">
                {/* 좌측: 상품 리스트 */}
                <div className="flex-1 space-y-20">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-10 pb-10">
                            {/* 상품 이미지 */}
                            <div className="w-[300px] h-[300px] bg-transparent flex items-center justify-center">
                                <img
                                    src={item.product.images?.[0]?.url}
                                    alt={item.product.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>

                            {/* 상품 정보 */}
                            <div className="flex-1 flex flex-col gap-1">
                                <h3 className="text-[14px] font-bold">{item.product.name}</h3>
                                <p className="text-[12px] text-gray-600">블랙 / 블랙</p> {/* 하드코딩 예시 */}
                                <p className="text-[13px] mb-4">₩{item.product.price.toLocaleString()}</p>

                                <div className="flex items-center gap-4 text-[12px]">
                                    <span>수량</span>
                                    <select
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                        className="bg-transparent border-none outline-none cursor-pointer font-bold"
                                    >
                                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-[11px] underline text-left mt-4 text-gray-500"
                                >
                                    삭제하기
                                </button>
                            </div>
                            {/* 북마크 아이콘 */}
                            <button className="text-xl self-start mt-2">
                                <IoCloseOutline className="rotate-45" /> {/* 북마크 대신 임시 아이콘 */}
                            </button>
                        </div>
                    ))}
                </div>

                {/* 우측: 결제 요약 섹션 */}
                <div className="w-full lg:w-[400px] space-y-10">
                    <div className="space-y-4 text-[13px] border-b border-gray-200 pb-10">
                        <div className="flex justify-between">
                            <span>소계</span>
                            <span>₩{getTotalPrice().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>배송</span>
                            <span>무료</span>
                        </div>
                        <div className="flex justify-between font-bold text-[15px] pt-4">
                            <span>총계</span>
                            <div className="text-right">
                                <p>₩{getTotalPrice().toLocaleString()}</p>
                                <p className="text-[10px] font-normal text-gray-400">세금 포함</p>
                            </div>
                        </div>
                    </div>

                    <button className="w-full bg-black text-white py-4 rounded-xl text-[13px] font-bold">
                        결제하기 - ₩{getTotalPrice().toLocaleString()}
                    </button>

                    <Link to="/products" className="block w-full border border-gray-300 bg-white py-4 rounded-xl text-[13px] font-bold text-center">
                        쇼핑 계속하기
                    </Link>

                    {/* 아코디언 메뉴 예시 */}
                    <div className="pt-10 space-y-6">
                        <div className="flex justify-between items-center text-[12px] border-t border-gray-200 pt-6">
                            <span>무료 배송 & 반품</span>
                            <span>+</span>
                        </div>
                        <div className="flex justify-between items-center text-[12px] border-t border-gray-200 pt-6">
                            <span>무이자 할부 및 다양한 결제 옵션</span>
                            <span>+</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default shoppingBag;