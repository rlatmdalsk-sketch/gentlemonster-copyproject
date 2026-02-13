import { useState } from "react";
import { twMerge } from "tailwind-merge";
import useAuthStore from "../../stores/useAuthStore.ts";
import useCartStore from "../../stores/useCartStore.ts";
import {
    IoSearchOutline,
    IoChevronDownOutline,
    IoChevronUpOutline,
    IoCloseOutline,
} from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import DaumPostcodeEmbed from "react-daum-postcode";
import { createOrder } from "../../api/order.api.ts";
import useOrderStore from "../../stores/useOrderStore.ts";
import { removeCart } from "../../api/cart.api.ts";

function OrderPage() {
    const { user } = useAuthStore();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const navigate = useNavigate();
    const { setOrderInfo } = useOrderStore();

    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    const [openInfo, setOpenInfo] = useState<string | null>(null);
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

    const [formData, setFormData] = useState({
        recipientName: user?.name || "",
        recipientPhone: user?.phone || "",
        zipCode: "",
        address1: "",
        address2: "",
    });

    // 주소 찾기 완료 핸들러
    const handleComplete = (data: any) => {
        setFormData({
            ...formData,
            zipCode: data.zonecode,
            address1: data.address,
        });
        setIsPostcodeOpen(false);
    };

    // 결제하기(주문 생성) 핸들러
    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. 유효성 검사
        if (!formData.recipientName.trim()) {
            alert("수령인 이름을 입력해주세요.");
            return;
        }
        if (!formData.address1) {
            alert("배송지 주소를 선택해주세요.");
            return;
        }
        if (!formData.address2.trim()) {
            alert("상세 주소를 입력해주세요.");
            return;
        }
        if (!formData.recipientPhone.trim()) {
            alert("전화번호를 입력해주세요.");
            return;
        }

        try {
            // 2. 백엔드 CreateOrderRequest 타입에 맞춘 데이터 구성
            const orderData = {
                items: items.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                })),
                recipientName: formData.recipientName,
                recipientPhone: formData.recipientPhone,
                zipCode: formData.zipCode,
                address1: formData.address1,
                address2: formData.address2,
            };

            // 3. 서버에 주문 생성 (실제 DB에 저장됨)
            const res = await createOrder(orderData);

            // 현재 장바구니에 담긴 모든 아이템(items)을 순회하며 삭제 API 실행
            if (items.length > 0) {
                await Promise.all(items.map(item => removeCart(item.id)));
            }

            // 4. OrderStore에 서버 응답 데이터 저장 (성공 페이지용)
            setOrderInfo({
                orderId: String(res.id),
                orderNumber: res.orderNumber,
                totalAmount: res.totalAmount,
            });

            // ✅ 5. 장바구니 비우기
            // 주문이 성공했으므로 로컬 및 서버의 장바구니 상태를 초기화합니다.
            clearCart(); // Zustand 상태 비우기

            // 6. 성공 페이지로 이동
            alert("주문이 완료되었습니다!");
            navigate(`/order/success?orderId=${res.id}`);
        } catch (error: any) {
            console.error("주문 생성 실패:", error.response?.data || error.message);
            alert("주문 실패: " + (error.response?.data?.message || "서버 에러"));
        }
    };

    const toggleInfo = (id: string) => {
        setOpenInfo(openInfo === id ? null : id);
    };
    return (
        <>
            <h2 className={twMerge("text-center", "py-7", "text-[17px]", "text-[#111]")}>결제</h2>

            {isPostcodeOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white w-full max-w-[500px] rounded-lg overflow-hidden relative">
                        <button
                            onClick={() => setIsPostcodeOpen(false)}
                            className="absolute top-2 right-2 z-10 p-2 text-xl">
                            <IoCloseOutline />
                        </button>
                        <div className="p-4 border-b font-bold text-center">주소 찾기</div>
                        <DaumPostcodeEmbed onComplete={handleComplete} />
                    </div>
                </div>
            )}

            <div className={twMerge("flex", "justify-end", "mt-30")}>
                <main className={twMerge("flex", "w-[1300px]", "justify-between")}>
                    <div
                        className={twMerge(
                            "w-[650px]",
                            "flex",
                            "flex-col",
                            "gap-3",
                            "text-[12px]",
                        )}>
                        <div className={twMerge("flex")}>
                            <p className="font-[450]">1 이메일주소</p>
                        </div>
                        <div className={twMerge("pt-4")}>
                            <p className="text-gray-600">
                                {user?.email} 계정으로 로그인하셨습니다.
                            </p>
                        </div>
                        <div className={twMerge("border-b", "mt-3", "border-gray-200")} />

                        <form
                            onSubmit={handlePayment}
                            className={twMerge("flex", "flex-col", "gap-3", "mt-4")}>
                            <div className="flex justify-between items-center">
                                <p className="font-[450]">2 배송</p>
                                <p className="text-[10px] text-gray-400">*필수 입력 항목</p>
                            </div>

                            <div className="bg-[#fff] rounded-[8px] border border-gray-200 p-2 shadow-sm flex flex-col">
                                <span className="text-[10px] text-gray-400 mb-1">이름*</span>
                                <input
                                    value={formData.recipientName}
                                    onChange={e =>
                                        setFormData({ ...formData, recipientName: e.target.value })
                                    }
                                    className="outline-none text-[13px] font-[450]"
                                    placeholder="받으실 분 성함"
                                />
                            </div>

                            <div
                                onClick={() => setIsPostcodeOpen(true)}
                                className="bg-[#fff] rounded-[8px] flex items-center border border-gray-200 p-3.5 shadow-sm cursor-pointer">
                                <IoSearchOutline className="mr-2 text-gray-400" />
                                <span
                                    className={twMerge(
                                        "text-[13px]",
                                        formData.address1 ? "text-black" : "text-gray-400",
                                    )}>
                                    {formData.address1 || "주소 찾기*"}
                                </span>
                            </div>

                            {formData.address1 && (
                                <div className="bg-[#fff] rounded-[8px] flex flex-col border border-gray-200 p-2 shadow-sm">
                                    <span className="text-[10px] text-gray-400 mb-1">
                                        상세 주소*
                                    </span>
                                    <input
                                        value={formData.address2}
                                        onChange={e =>
                                            setFormData({ ...formData, address2: e.target.value })
                                        }
                                        placeholder="동, 호수 등을 입력해주세요"
                                        className="outline-none text-[13px]"
                                    />
                                </div>
                            )}

                            <div className="bg-[#fff] rounded-[8px] flex flex-col border border-gray-200 p-2 shadow-sm">
                                <span className="text-[10px] text-gray-400 mb-1">전화번호*</span>
                                <input
                                    value={formData.recipientPhone}
                                    onChange={e =>
                                        setFormData({ ...formData, recipientPhone: e.target.value })
                                    }
                                    className="outline-none text-[13px]"
                                    placeholder="010-0000-0000"
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-4 bg-black text-white text-[13px] h-[48px] rounded-[8px] font-bold cursor-pointer hover:bg-zinc-800 transition-colors">
                                주문하기 - ₩{getTotalPrice().toLocaleString()}
                            </button>
                        </form>
                    </div>

                    <div className={twMerge("w-[420px]", "self-start", "mr-15")}>
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[13px]">주문 요약</h3>
                                <button
                                    onClick={() => setIsSummaryOpen(!isSummaryOpen)}
                                    className="text-[11px] flex items-center gap-1 cursor-pointer">
                                    더 보기{" "}
                                    {isSummaryOpen ? (
                                        <IoChevronUpOutline />
                                    ) : (
                                        <IoChevronDownOutline />
                                    )}
                                </button>
                            </div>

                            <div
                                className={twMerge(
                                    "grid transition-[grid-template-rows] duration-300 ease-in-out",
                                    isSummaryOpen
                                        ? "grid-rows-[1fr] mb-6 border-b border-gray-100 pb-6"
                                        : "grid-rows-[0fr]",
                                )}>
                                <div className="overflow-hidden">
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 w-full">
                                        {items.map(item => (
                                            <div key={item.id} className="flex gap-4 items-center">
                                                <div className="h-20 bg-[#f7f7f7] rounded-[4px] flex-shrink-0 overflow-hidden w-[200px]">
                                                    <img
                                                        src={item.product.images[0]?.url}
                                                        alt=""
                                                        className="w-full h-full object-contain scale-400 translate-y-[-15px]"
                                                    />
                                                </div>
                                                <div className="flex-1 text-[11px]">
                                                    <p className="font-bold text-[#111]">
                                                        {item.product.name}
                                                    </p>
                                                    <p className="text-gray-400">
                                                        수량: {item.quantity}
                                                    </p>
                                                    <p className="mt-1 font-medium">
                                                        ₩{item.product.price.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Link to={"/shoppingBag"}>
                                        <button
                                            className={twMerge(
                                                "border",
                                                "py-3",
                                                "rounded-md",
                                                "border-[#d8d8d8]",
                                                "mt-13",
                                                "text-[13px]",
                                                "w-full",
                                                "cursor-pointer",
                                            )}>
                                            쇼핑백 편집하기
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-3 text-[12px] border-b border-gray-100 pb-6 mb-6 font-bold">
                                <div className="flex justify-between">
                                    <span>소계</span>
                                    <span>₩{getTotalPrice().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>배송</span>
                                    <span>무료</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[13px] font-bold">총계</span>
                                <div className="text-right">
                                    <p className="text-[18px] font-bold">
                                        ₩{getTotalPrice().toLocaleString()}
                                    </p>
                                    <p className="text-[10px] text-gray-400 leading-tight">
                                        세금 포함
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2 text-[12px]">
                                <div className="border-b border-gray-200">
                                    <button
                                        onClick={() => toggleInfo("shipping")}
                                        className="w-full flex justify-between items-center py-4 cursor-pointer">
                                        <span>무료 배송 & 반품</span>
                                        <span className="text-lg">
                                            {openInfo === "shipping" ? "-" : "+"}
                                        </span>
                                    </button>
                                    <div
                                        className={twMerge(
                                            "grid transition-[grid-template-rows] duration-300 ease-in-out",
                                            openInfo === "shipping"
                                                ? "grid-rows-[1fr]"
                                                : "grid-rows-[0fr]",
                                        )}>
                                        <div className="overflow-hidden">
                                            <div className="pb-4 font-bold leading-relaxed text-[11px]">
                                                젠틀몬스터 공식 온라인 스토어는 무료 배송 및 반품
                                                서비스를 제공합니다. 반품은 제품을 수령하신 날로부터
                                                7일 이내에 접수해 주셔야 합니다. 제품은 사용되지
                                                않은 상태여야 하며, 모든 구성품을 포함하고 있어야
                                                합니다.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-b border-gray-200">
                                    <button
                                        onClick={() => toggleInfo("payment")}
                                        className="w-full flex justify-between items-center py-4 cursor-pointer">
                                        <span>무이자 할부 및 다양한 결제 옵션</span>
                                        <span className="text-lg">
                                            {openInfo === "payment" ? "-" : "+"}
                                        </span>
                                    </button>
                                    <div
                                        className={twMerge(
                                            "grid transition-[grid-template-rows] duration-300 ease-in-out",
                                            openInfo === "payment"
                                                ? "grid-rows-[1fr]"
                                                : "grid-rows-[0fr]",
                                        )}>
                                        <div className="overflow-hidden">
                                            <div className="pb-4 font-bold leading-relaxed text-[11px] flex flex-col gap-4">
                                                <p>
                                                    무이자 할부 서비스
                                                    <br />
                                                    카드사에서 제공하는 무이자 할부 서비스는 아래
                                                    각각의 PG사를 클릭하여 확인하실 수 있습니다.
                                                    <br />
                                                    카카오페이 / / KCP(신용카드) / / 토스페이
                                                </p>

                                                <p>
                                                    후불 결제 서비스
                                                    <br />
                                                    토스페이로 결제하시는 경우 후불 결제 서비스를
                                                    이용하실 수 있습니다. 후불 결제와 관련된 자세한
                                                    내용은 토스 앱에서 확인하세요.
                                                </p>

                                                <p>
                                                    결제 수단
                                                    <br />
                                                    KCP(신용카드), 카카오페이, 네이버페이, 토스페이,
                                                    Apple Pay, 기프트 카드
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export default OrderPage;
