import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOrderList } from "../../api/order.api.ts";
import type { OrderSummary } from "../../types/order.ts";

function OrderList() {
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadOrders = async () => {
            try {
                setIsLoading(true);
                // 1. API 호출 시 인자 전달 (Prisma skip 에러 방지)
                const res = await fetchOrderList(1, 10);

                console.log("✅ 서버 응답 성공:", res);

                // 2. 승민님 타입 OrderListResponse { data: OrderSummary[] } 구조 확인
                if (res && Array.isArray(res.data)) {
                    setOrders(res.data);
                } else {
                    console.error("❌ 데이터 구조가 예상과 다름:", res);
                }
            } catch (error: any) {
                // 3. 에러 상세 분석 로그
                if (error.response) {
                    // 서버가 응답을 줬으나 에러인 경우 (401, 404, 500 등)
                    console.error("❌ 서버 에러 (Status):", error.response.status);
                    console.error("❌ 서버 에러 (Data):", error.response.data);

                    if (error.response.status === 401) {
                        alert("로그인이 필요하거나 세션이 만료되었습니다.");
                        navigate("/login");
                    }
                } else if (error.request) {
                    // 서버에 요청은 보냈으나 응답이 없는 경우 (네트워크 끊김, 서버 죽음)
                    console.error("❌ 응답 없음 (Network Error):", error.request);
                } else {
                    console.error("❌ 요청 설정 에러:", error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };
        loadOrders();
    }, [navigate]);

    if (isLoading) return <div className="py-20 text-center">주문 내역 로딩 중...</div>;

    return (
        <div className="max-w-[1000px] mx-auto px-4 py-16">
            <h2 className="text-[24px] font-bold mb-10">주문 내역</h2>
            {orders.length === 0 ? (
                <div className="py-24 text-center border-t">
                    <p className="text-gray-400">주문 내역이 없습니다.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between mb-4 pb-4 border-b">
                                <div className="text-[13px] text-gray-500">
                                    주문번호: ORD-{order.id} | 날짜: {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                                <div className="font-bold text-blue-600">{order.status}</div>
                            </div>
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center mb-4 last:mb-0">
                                    <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden">
                                        <img src={item.product.images[0]?.url} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-[14px]">{item.product.name}</div>
                                        <div className="text-[12px] text-gray-500">수량: {item.quantity}개</div>
                                    </div>
                                    <div className="font-bold">₩{item.price.toLocaleString()}</div>
                                </div>
                            ))}
                            <div className="mt-4 pt-4 border-t text-right">
                                <span className="text-gray-500 mr-2">총 결제 금액:</span>
                                <span className="text-lg font-bold">₩{order.totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderList;