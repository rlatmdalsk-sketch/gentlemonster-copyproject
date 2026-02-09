import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import useCartStore from "../../stores/useCartStore.ts";
import { twMerge } from "tailwind-merge";

const ShoppingBag = () => {
    const { items, fetchCart, getTotalPrice, getTotalCount, updateQuantity, removeItem, loading } =
        useCartStore();
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const toggleAccordion = (section: string) => {
        setOpenAccordion(prev => (prev === section ? null : section));
    };



    if (loading)
        return (
            <div className="pt-60 text-center text-[10px] tracking-widest animate-pulse">
                LOADING...
            </div>
        );

    if (items.length === 0) {
        return (
            <div className="w-full h-screen flex flex-col items-center py-16 ">
                <div className="flex gap-6 text-center">
                    <button className="text-[17px] font-[450] bg-[#e2e4e5] h-[30px] px-[12px] rounded-lg ">
                        쇼핑백<sup>{getTotalCount()}</sup>
                    </button>
                    <button onClick={()=>navigate("/s-WishList")} className="text-[17px] font-[#111]  h-[30px] px-[12px] rounded-lg hover:bg-[#e2e4e5] font-[450] cursor-pointer">
                        위시리스트<sup>0</sup>
                    </button>
                </div>
                <p className="text-[12px] mb-8 font-medium pt-56">쇼핑백에 추가된 제품이 없습니다.</p>
                <Link
                    to="/"
                    className="px-20 py-4 border border-gray-300 text-[12px] bg-white hover:bg-gray-50 transition-colors rounded-[5px]">
                    쇼핑 계속하기
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen pt-10 pb-20">
            {/* 헤더 섹션 */}
            <div className="flex justify-center items-center relative mb-16">
                <div className="flex gap-6">
                    <button className="text-[17px] font-[450] bg-[#e2e4e5] h-[30px] px-[12px] rounded-lg">
                        쇼핑백<sup>{getTotalCount()}</sup>
                    </button>
                    <button onClick={()=>navigate("/s-WishList")} className="text-[17px] font-[#111]  h-[30px] px-[12px] rounded-lg hover:bg-[#e2e4e5] font-[450] cursor-pointer">
                        위시리스트<sup>0</sup>
                    </button>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-3xl mr-9">
                    <IoCloseOutline />
                </button>
            </div>

            <div className="flex flex-col lg:flex-row mx-auto items-start px-10">
                {/* 좌측: 상품 리스트 영역 */}
                <div className="flex-1 space-y-12 flex flex-col justify-center items-center overflow-hidden ml-100">
                    {items.map(item => (
                        <div
                            key={item.id}
                            className="flex md:flex-row items-center gap-10 pb-12 m-auto overflow-hidden px-50 pt-40">

                            {/* 🌟 이미지 클릭 시 상세페이지 이동 */}
                            <Link
                                to={`/product/${item.product.id}`}
                                className="w-[280px] h-[280px] flex items-center justify-center bg-transparent cursor-pointer hover:opacity-90 transition-opacity"
                            >
                                <img
                                    src={item.product.images?.[0]?.url}
                                    alt={item.product.name}
                                    className={twMerge("scale-280", "mb-30")}
                                />
                            </Link>

                            <div className="flex-1 flex flex-col w-full z-20 pl-5 pb-15">
                                <h3 className="text-[11px] font-[450] text-[#111]">
                                    {item.product.name}
                                </h3>
                                <p className="text-[11px] text-[#111] font-medium">
                                    ₩{item.product.price.toLocaleString()}
                                </p>

                                <div className="mt-2 text-[11px]">
                                    <div className="flex items-center gap-2 justify-center text-center">
                                        <span>수량</span>
                                        <select
                                            value={item.quantity}
                                            onChange={e =>
                                                updateQuantity(item.id, Number(e.target.value))
                                            }
                                            className="flex border-none outline-none font-[450] -4 px-4 text-[12px] py-1 mx-auto text-center">
                                            {Array.from({ length: 10 }, (_, i) => i + 1).map(
                                                num => (
                                                    <option key={num} value={num}>
                                                        {num}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        if (window.confirm("상품을 삭제하시겠습니까?"))
                                            removeItem(item.id);
                                    }}
                                    className="text-111 text-[10px] mt-2 p-2 bg-[#e2e4e5] rounded-md mr-auto font-semibold">
                                    삭제하기
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 우측: 결제 요약 섹션 - 아코디언 수정 */}
                <aside className="w-full md:w-[30%] lg:w-[420px] px-8 md:px-12 py-20 md:sticky md:top-20 md:self-start">
                    <div className="w-full flex flex-col">
                        {/* 결제 요약 정보 (생략 - 기존 유지) */}
                        <div className="text-[12px] border-b border-gray-200 pb-10">
                            <div className="flex justify-between text-[#111] font-[450]">
                                <span>소계</span>
                                <span>₩{getTotalPrice().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[#111] font-[450]">
                                <span>배송</span>
                                <span>무료</span>
                            </div>
                            <div className="flex justify-between font-[450] text-[12px] pt-4 text-[#111]">
                                <span>총계</span>
                                <div className="text-right">
                                    <p className={twMerge("text-[18px]")}>
                                        ₩{getTotalPrice().toLocaleString()}
                                    </p>
                                    <p className="text-[10px] font-normal text-gray-400">
                                        세금 포함
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="py-8 space-y-3">
                            <button className="w-full bg-black text-white py-4 text-[12px] font-bold rounded-[11px] tracking-tight hover:bg-[#333] transition-colors cursor-pointer"
                                    onClick={() => navigate("/order")}
                            >
                                결제하기 - ₩{getTotalPrice().toLocaleString()}
                            </button>
                            <button
                                onClick={() => navigate(-1)}
                                className="block w-full border border-gray-300 bg-white py-4 text-[12px] font-bold rounded-[11px] text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                쇼핑 계속하기
                            </button>
                        </div>

                        {/* 수정된 아코디언 영역 */}
                        <div className="space-y-0 border-t border-gray-200">
                            {/* 1. 무료 배송 & 반품 */}
                            <div className="border-b border-gray-200">
                                <button
                                    onClick={() => toggleAccordion("shipping")}
                                    className="w-full flex justify-between font-[550] items-center py-5 text-[13px] cursor-pointer ">
                                    <span>무료 배송 & 반품</span>
                                    <span
                                        className={`text-xl transition-transform duration-300 ${openAccordion === "shipping" ? "rotate-45" : ""}`}>
                                        +
                                    </span>
                                </button>
                                {/* Grid Transition 적용 */}
                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${
                                        openAccordion === "shipping" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                    }`}>
                                    <div className="overflow-hidden">
                                        <div className="pb-6 text-[12px] font-[550] leading-relaxed">
                                            <p>
                                                젠틀몬스터 공식 온라인 스토어는 무료 배송 및 반품
                                                서비스를 제공합니다. 반품은 제품을 수령하신 날로부터 7일
                                                이내에 접수해 주셔야 합니다. 제품은 사용되지 않은
                                                상태여야 하며, 모든 구성품을 포함하고 있어야 합니다.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. 결제 옵션 */}
                            <div className="border-b border-gray-200">
                                <button
                                    onClick={() => toggleAccordion("payment")}
                                    className="w-full flex justify-between items-center py-5 text-[13px] font-[550] cursor-pointer ">
                                    <span>무이자 할부 및 다양한 결제 옵션</span>
                                    <span
                                        className={`text-xl transition-transform duration-300  ${openAccordion === "payment" ? "rotate-45" : ""}`}>
                                        +
                                    </span>
                                </button>
                                {/* Grid Transition 적용 */}
                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${
                                        openAccordion === "payment" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                    }`}>
                                    <div className="overflow-hidden">
                                        <div className="flex flex-col pb-6 text-[12px] font-[550] leading-relaxed gap-5">
                                            <p>
                                                무이자 할부 서비스<br /> 카드사에서 제공하는 무이자 할부
                                                서비스는 아래 각각의 PG사를 클릭하여 확인하실 수
                                                있습니다. 카카오페이 / / KCP(신용카드) / / 토스페이
                                            </p>
                                            <p>
                                                후불 결제 서비스<br /> 토스페이로 결제하시는 경우 후불 결제
                                                서비스를 이용하실 수 있습니다. 후불 결제와 관련된 자세한
                                                내용은 토스 앱에서 확인하세요.
                                            </p>
                                            <p>
                                                결제 수단 <br /> KCP(신용카드), 카카오페이, 네이버페이,
                                                토스페이, Apple Pay, 기프트 카드
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ShoppingBag;