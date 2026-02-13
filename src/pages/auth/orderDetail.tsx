import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchOrderList } from "../../api/order.api.ts";
import type { OrderSummary } from "../../types/order.ts";

function OrderDetail() {
    const [order, setOrder] = useState<OrderSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get("orderId");

    useEffect(() => {
        const loadOrderDetail = async () => {
            if (!orderId) {
                navigate("/myaccount/orders");
                return;
            }

            try {
                setIsLoading(true);
                const res = await fetchOrderList(1, 100);
                let allOrders: OrderSummary[] = Array.isArray(res.data)
                    ? res.data
                    : (res.data as any)?.data || (Array.isArray(res) ? res : []);

                const foundOrder = allOrders.find(o => o.id.toString() === orderId);

                if (!foundOrder) {
                    console.error("주문을 찾을 수 없습니다");
                    navigate("/myaccount/orders");
                    return;
                }

                setOrder(foundOrder);
            } catch (error) {
                console.error("주문 상세 로드 실패", error);
                navigate("/myaccount/orders");
            } finally {
                setIsLoading(false);
            }
        };
        loadOrderDetail();
    }, [orderId, navigate]);

    if (isLoading) return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="text-[11px] tracking-[0.2em] text-black animate-pulse">LOADING...</div>
        </div>
    );

    if (!order) return null;

    return (
        <div className="max-w-[1100px] mx-auto px-6 py-24 ">
            <button
                onClick={() => navigate(-1)}
                className="text-[10px] font-bold text-gray-500 hover:text-black mb-8 uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
                ← 주문 내역으로 돌아가기
            </button>

            <header className="mb-12">
                <h2 className="text-[22px] font-bold tracking-tight text-black mb-2">주문 상세</h2>
                <p className="text-[11px] text-gray-400 tracking-wider">ORDER #{order.id}</p>
                <div className="w-full h-[1px] bg-black mt-6" />
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* 왼쪽: 주문 상품 목록 */}
                <div className="lg:col-span-2">
                    <div className="mb-8">
                        <h3 className="text-[14px] font-bold uppercase tracking-widest mb-6">주문 상품</h3>
                        <div className="w-12 h-[2px] bg-black mb-8" />
                    </div>

                    <div className="flex flex-col gap-6">
                        {order.items?.map((item) => (
                            <div key={item.id} className="flex gap-6 pb-6 border-b border-gray-200 group">
                                <div className="w-[100px] h-[130px] overflow-hidden flex-shrink-0 border border-gray-100">
                                    <img
                                        src={item.product?.images?.[0]?.url}
                                        alt={item.product?.name}
                                        className="w-full h-full object-cover  transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                                <div className="flex flex-col justify-between flex-1">
                                    <div>
                                        <h4 className="text-[14px] font-bold text-black mb-2 uppercase tracking-tight">
                                            {item.product?.name}
                                        </h4>
                                        <div className="text-[11px] text-gray-500 space-y-1">
                                            <p>단가: ₩{item.price.toLocaleString()}</p>
                                            <p>수량: {item.quantity}개</p>
                                        </div>
                                    </div>
                                    <div className="text-[13px] font-semibold text-black">
                                        ₩{(item.price * item.quantity).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 오른쪽: 주문 정보 & 결제 정보 */}
                <div className="lg:col-span-1">
                    <div className="border border-gray-200 p-8 sticky top-24 ">
                        {/* 주문 정보 */}
                        <div className="mb-8 pb-8 border-b border-gray-200 ">
                            <h3 className="text-[12px] font-bold uppercase tracking-widest mb-6">주문 정보</h3>
                            <div className="space-y-3 text-[11px]">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">주문일자</span>
                                    <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">주문번호</span>
                                    <span className="font-medium">#{order.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">주문상태</span>
                                    <span className="font-semibold text-black">{order.status}</span>
                                </div>
                            </div>
                        </div>

                        {/* 배송 정보 */}
                        <div className="mb-8 pb-8 border-b border-gray-200">
                            <h3 className="text-[12px] font-bold uppercase tracking-widest mb-6">배송 정보</h3>
                            <div className="space-y-2 text-[11px]">
                                <p className="text-gray-600">{order.recipientName}</p>
                                <p className="text-gray-600 leading-relaxed">{order.address1}<span>{order.address2}</span>
                                </p>
                                <p className="text-gray-600">{order.recipientPhone}</p>
                            </div>
                        </div>

                        {/* 결제 정보 */}
                        <div>
                            <h3 className="text-[12px] font-bold uppercase tracking-widest mb-6">결제 정보</h3>
                            <div className="space-y-3 text-[11px]">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">상품 금액</span>
                                    <span>₩{order.totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">배송비</span>
                                    <span>₩0</span>
                                </div>
                                <div className="w-full h-[1px] bg-gray-200 my-4" />
                                <div className="flex justify-between text-[18px] font-bold">
                                    <span>총 결제금액</span>
                                    <span>₩{order.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;