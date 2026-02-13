import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdRefresh, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { fetchAdminInquiryList } from "../../../api/admin.inquiry.api.ts";
import type { AdminInquiryItem } from "../../../types/admin.inquiry.ts";

const AdminInquiryList = () => {
    const navigate = useNavigate();

    const [inquiries, setInquiries] = useState<AdminInquiryItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "ANSWERED">("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const limit = 10;

    const loadInquiries = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await fetchAdminInquiryList(page, limit);
            setInquiries(response.data);
            setTotalPages(response.pagination.totalPages);
            setTotalItems(response.pagination.total);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadInquiries(currentPage);
    }, [currentPage]);

    const filteredInquiries = useMemo(() => {
        let result = inquiries;
        if (filterStatus !== "ALL") {
            result = result.filter(item => item.status === filterStatus);
        }
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.user?.name.toLowerCase().includes(query)
            );
        }
        return result;
    }, [inquiries, filterStatus, searchQuery]);

    const labels = {
        PRODUCT: "상품",
        DELIVERY: "배송",
        EXCHANGE_RETURN: "교환/반품",
        MEMBER: "회원",
        OTHER: "기타",
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end pb-4 border-b border-black/10">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-[0.15em] text-[#111]">문의 내역 관리</h1>
                    <p className="text-xs text-gray-500 mt-2 tracking-wider uppercase">
                        전체 문의 조회 및 관리 /  ({totalItems} 개)
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest border-r border-gray-200 pr-6">
                        {(["ALL", "PENDING", "ANSWERED"] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => { setFilterStatus(s); setCurrentPage(1); }}
                                className={`transition-all ${filterStatus === s ? "text-black border-b border-black" : "text-gray-300 hover:text-black"}`}
                            >
                                {s === "ALL" ? "전체" : s === "PENDING" ? "답변대기" : "답변완료"}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border-b border-gray-300 pb-1 px-2 w-48">
                            <MdSearch className="text-gray-400 text-lg" />
                            <input
                                type="text"
                                placeholder="제목 혹은 작성자 검색"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none outline-none text-xs w-full"
                            />
                        </div>
                        <button onClick={() => loadInquiries(currentPage)} className="text-gray-400 hover:text-black transition-colors">
                            <MdRefresh className="text-xl" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-100 min-h-[500px]">
                {isLoading ? (
                    <div className="p-20 text-center text-[10px] text-gray-400 tracking-[0.2em] font-bold uppercase animate-pulse">Loading Admin Data...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-20">ID</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-24">유형</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-40">작성자</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">내용</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-32">작성일</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right w-24">상태</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredInquiries.map((item) => (
                                <tr
                                    key={item.id}
                                    onClick={() => navigate(`/admin/inquiry/${item.id}`)}
                                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors group cursor-pointer"
                                >
                                    <td className="p-4 text-[11px] font-mono text-gray-300">#{item.id}</td>
                                    <td className="p-4 text-[11px] font-bold text-[#111]">{labels[item.type]}</td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-[#111]">{item.user?.name || "Unknown"}</span>
                                            <span className="text-[9px] text-gray-400">{item.user?.email || "-"}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-[#333] group-hover:underline underline-offset-4">{item.title}</span>
                                            {item.images?.length > 0 && <span className="text-[10px] text-gray-200">📎</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-[11px] text-gray-400 font-mono font-bold">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === "PENDING" ? "text-red-500" : "text-blue-500"}`}>
                                                {item.status === "PENDING" ? "답변대기" : "답변완료"}
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="flex justify-center gap-4 pt-6">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-1 disabled:opacity-20 hover:text-black transition-colors text-gray-400">
                    <MdChevronLeft className="text-2xl" />
                </button>
                <div className="flex items-center gap-3 px-4 text-[11px] font-black tracking-widest">
                    <span className="text-black border-b border-black">{currentPage}</span>
                    <span className="text-gray-200">/</span>
                    <span className="text-gray-400">{totalPages}</span>
                </div>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-1 disabled:opacity-20 hover:text-black transition-colors text-gray-400">
                    <MdChevronRight className="text-2xl" />
                </button>
            </div>
        </div>
    );
};

export default AdminInquiryList;