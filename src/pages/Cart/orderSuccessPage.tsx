import { useNavigate, useSearchParams } from "react-router-dom";
import useCartStore from "../../stores/useCartStore.ts";
import useOrderStore from "../../stores/useOrderStore.ts"; // ✅ 추가
import { useEffect, useState } from "react";
import { fetchOrderDetail } from "../../api/order.api.ts";
import type { OrderDetailResponse } from "../../types/order.ts";

function OrderSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { clearCart, fetchCart } = useCartStore();
    const { clearOrder } = useOrderStore(); // ✅ 주문 임시 정보 비우기용 추가

    const [isLoading, setIsLoading] = useState(true);
    const [orderData, setOrderData] = useState<OrderDetailResponse | null>(null);

    useEffect(() => {
        const orderIdParam = searchParams.get("orderId");

        if (!orderIdParam) {
            alert("잘못된 접근입니다.");
            navigate("/");
            return;
        }

        const loadOrderInfo = async () => {
            try {
                setIsLoading(true);
                const numericOrderId = parseInt(orderIdParam || "0", 10);

                // 1. 주문 상세 정보 가져오기
                const result = await fetchOrderDetail(numericOrderId);

                // ✅ 백엔드 응답 구조에 맞춰 실제 알맹이(data) 저장
                const actualData = result.data || result;
                setOrderData(actualData);

                // ✅ 2. 주문 완료 후 장바구니 및 주문 상태 초기화 (필수!)
                if (clearCart) clearCart();     // Zustand 장바구니 비우기
                if (fetchCart) await fetchCart(); // 서버 장바구니 개수 동기화 (헤더 0 처리)
                if (clearOrder) clearOrder();   // 진행 중인 주문 정보 초기화

            } catch (e: any) {
                console.error("주문 정보 로드 실패:", e);
                // navigate("/"); // 에러 시 홈으로 이동 (선택 사항)
            } finally {
                setIsLoading(false);
            }
        };

        loadOrderInfo();
    }, [searchParams, navigate]);

    if (isLoading) {
        return (
            <div className="h-[60dvh] flex flex-col items-center justify-center">
                <p className="text-xl font-medium">주문 정보를 확인 중입니다...</p>
                <p className="text-gray-500 mt-3">잠시만 기다려주세요.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            {/* 상단 디자인 유지 */}
            <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-3xl">✓</div>
            </div>
            <h2 className="text-2xl font-bold mb-2">주문이 완료되었습니다!</h2>
            <p className="text-gray-500 mb-10 text-[13px]">고객님의 주문이 정상적으로 접수되었습니다.</p>

            {orderData && (
                <div className="bg-gray-50 p-6 rounded-lg text-left mb-10 border border-gray-100">
                    <h3 className="font-bold border-b border-gray-200 pb-3 mb-4 text-[14px]">주문 정보</h3>
                    <div className="space-y-2 text-[12px]">
                        <div className="flex justify-between">
                            <span className="text-gray-500">주문 번호</span>
                            <span className="font-medium text-[#111]">
                                {orderData.orderNumber || orderData.id}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">받는 분</span>
                            <span className="font-medium text-[#111]">{orderData.recipientName}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">배송지</span>
                            <span className="font-medium text-[#111] truncate ml-4">
                                {orderData.address1} {orderData.address2}
                            </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-100 mt-2">
                            <span className="text-gray-500 font-bold">총 금액</span>
                            <span className="font-bold text-black text-[15px]">
                                ₩{(orderData.totalPrice || orderData.totalPrice || 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-3 justify-center">
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-3 border border-gray-300 rounded-md text-[12px] font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                    쇼핑 계속하기
                </button>
                <button
                    onClick={() => navigate("/myaccount/orderList")}
                    className="px-6 py-3 bg-black text-white rounded-md text-[12px] font-medium hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                    주문 내역 보기
                </button>
            </div>
        </div>
    );
}

export default OrderSuccessPage;