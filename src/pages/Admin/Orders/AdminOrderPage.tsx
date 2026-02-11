import { useEffect, useState } from "react";
import { MdRefresh, MdChevronLeft, MdChevronRight } from "react-icons/md";
import type { OrderStatus } from "../../../types/order.ts";
import { fetchAdminOrderList, updateOrderStatus } from "../../../api/order.api.ts";

function AdminOrderPage() {
    const [orders, setOrders] = useState<any[]>([]); // items가 없으므로 임시로 any 처리
    const [loading, setLoading] = useState(true);
    const [totalOrders, setTotalOrders] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const statusList: OrderStatus[] = [
        "PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELED", "RETURN_REQUESTED", "RETURN_COMPLETED"
    ];

    const loadOrders = async (page: number) => {
        try {
            setLoading(true);
            const res = await fetchAdminOrderList(page, limit);

            const actualOrderArray = res?.data?.orders || [];
            setOrders(actualOrderArray);

            if (res?.data?.pagination) {
                setTotalPages(res.data.pagination.totalPages);
                setTotalOrders(res.data.pagination.totalUsers || res.data.pagination.total || 0);
            }
        } catch (error) {
            console.error("전체 주문 로드 실패:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders(currentPage);
    }, [currentPage]);

    const handleStatusUpdate = async (id: number, newStatus: OrderStatus) => {
        try {
            await updateOrderStatus(id, { status: newStatus });
            loadOrders(currentPage);
        } catch (error) {
            alert("변경 실패");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end pb-4 border-b border-black/10">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-[0.15em] text-[#111]">주문 관리</h1>
                    <p className="text-xs text-gray-500 mt-2 tracking-wider uppercase">
                        전체 사용자 주문 내역 조회 ({totalOrders} orders)
                    </p>
                </div>
                <button onClick={() => loadOrders(currentPage)} className="p-2 text-gray-400 hover:text-black transition-colors">
                    <MdRefresh className="text-xl" />
                </button>
            </div>

            {/* Table Area */}
            <div className="bg-white shadow-sm border border-gray-100 min-h-[500px]">
                {loading ? (
                    <div className="p-20 text-center text-xs text-gray-400 tracking-widest">LOADING...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-24">ID</th>
                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">주문 정보</th>
                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">수령인</th>
                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">결제금액</th>
                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">상태</th>
                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">상태 변경</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                                    <td className="p-4 font-mono text-[11px] font-bold text-gray-400">#{order.id}</td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                                <span className="text-[10px] text-gray-400 font-mono">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                            <span className="text-sm font-bold text-[#111]">
                                                    {order.recipientName}님의 주문
                                                {order._count?.items > 0 && (
                                                    <span className="text-gray-400 font-normal ml-1 text-xs">
                                                            (총 {order._count.items}건)
                                                        </span>
                                                )}
                                                </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs text-gray-600 font-medium">{order.recipientName}</td>
                                    <td className="p-4 text-xs text-[#111] font-mono font-bold">₩{order.totalPrice.toLocaleString()}</td>
                                    <td className="p-4">
                                            <span className={`inline-block px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-tighter border ${
                                                order.status === 'PAID' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    order.status === 'CANCELED' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                                            }`}>
                                                {order.status}
                                            </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                                            className="bg-white border border-gray-200 text-[10px] font-bold px-2 py-1 outline-none focus:border-black cursor-pointer"
                                        >
                                            {statusList.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-end gap-2 pt-4">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-400 hover:border-black disabled:opacity-20"><MdChevronLeft /></button>
                <div className="flex items-center gap-2 px-4 text-[11px] font-bold tracking-[0.2em] text-gray-300">
                    <span className="text-black">{currentPage}</span> / {totalPages}
                </div>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-400 hover:border-black disabled:opacity-20"><MdChevronRight /></button>
            </div>
        </div>
    );
}

export default AdminOrderPage;