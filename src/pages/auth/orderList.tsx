import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
                const res = await fetchOrderList(1, 10);
                let finalOrders: OrderSummary[] = Array.isArray(res.data)
                    ? res.data
                    : (res.data as any)?.data || (Array.isArray(res) ? res : []);
                setOrders(finalOrders);
            } catch (error) {
                console.error("데이터 로드 실패", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadOrders();
    }, []);

    if (isLoading) return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="text-[11px] tracking-[0.2em] text-black animate-pulse">LOADING...</div>
        </div>
    );

    return (
        <div className="max-w-[1100px] mx-auto px-6 py-3  shadow-md">
            <header className="mb-10">
                <h2 className="text-[22px] font-bold tracking-tight text-black mb-2">주문 내역</h2>
                <p className="text-[11px] text-gray-400 tracking-wider">ORDER HISTORY</p>
                <div className="w-full h-[1px] bg-black mt-6" />
            </header>

            {orders.length === 0 ? (
                <div className="w-full py-40 text-center ">
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-[2px] bg-gray-300 mx-auto mb-8" />
                        <p className="text-[13px] mb-3 font-medium text-gray-800">아직 구매한 제품이 없습니다.</p>
                        <p className="text-[11px] text-gray-400 mb-10">첫 주문을 시작해보세요</p>
                        <Link
                            to="/"
                            className="inline-block px-12 py-3.5 border border-black text-[10px] font-bold bg-white hover:bg-black hover:text-white transition-all uppercase tracking-widest">
                            쇼핑 시작하기
                        </Link>
                    </div>
                </div>
            ) : (
                <div className=" border-gray-200 p-4 flex flex-col gap-1">
                    {orders.map((order) => (
                        <div key={order.id} className="group">
                            {/* 주문 헤더 */}
                            <div className="flex justify-between items-start pt-8 border-t border-gray-200">
                                <div className="flex gap-12">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-2">주문일자</span>
                                        <span className="text-[12px] font-medium text-black">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-2">주문번호</span>
                                        <span className="text-[12px] font-medium tracking-tight text-black">#{order.id}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-2">주문상태</span>
                                        <span className="text-[12px] font-semibold   text-blue-600">{order.status}</span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block mb-2">총 결제금액</span>
                                    <span className="text-[18px] font-bold tracking-tight text-black">₩{order.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* 상품 리스트 */}
                            <div className="mt-8 space-y-6">
                                {order.items?.map((item, index) => (
                                    <div key={item.id} className="flex gap-8 pb-6 border-b border-gray-100 last:border-0">
                                        <div className="w-[110px] h-[140px] overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-50">
                                            <img
                                                src={item.product?.images?.[0]?.url}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>

                                        <div className="flex flex-col justify-between flex-1 py-1">
                                            <div>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="text-[9px] text-gray-400 font-bold">ITEM {String(index + 1).padStart(2, '0')}</span>
                                                    <div className="w-6 h-[1px] bg-gray-200" />
                                                </div>
                                                <h3 className="text-[14px] font-bold text-black mb-3 uppercase tracking-tight hover:text-gray-600 transition-colors cursor-pointer">
                                                    {item.product?.name}
                                                </h3>
                                                <div className="text-[11px] text-gray-500 space-y-1.5">
                                                    <p className="flex items-center gap-2">
                                                        <span className="text-gray-400">단가</span>
                                                        <span className="font-medium text-black">₩{item.price.toLocaleString()}</span>
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <span className="text-gray-400">수량</span>
                                                        <span className="font-medium text-black">{item.quantity}개</span>
                                                    </p>
                                                    <p className="flex items-center gap-2 pt-1">
                                                        <span className="text-gray-400">소계</span>
                                                        <span className="font-semibold text-[12px] text-black">₩{(item.price * item.quantity).toLocaleString()}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 하단 액션 버튼 */}
                            <div className="mb-10 pt-3 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={() => navigate(`/myaccount/orderDetail?orderId=${order.id}`)}
                                    className="px-8 py-2.5 border border-black text-[10px] font-bold uppercase tracking-widest cursor-pointer "
                                >
                                    주문 상세보기
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderList;