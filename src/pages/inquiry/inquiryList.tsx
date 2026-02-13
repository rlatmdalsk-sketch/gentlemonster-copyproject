import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchInquiryList } from "../../api/inquiry.api";
import type { InquiryItem, InquiryType, InquiryStatus } from "../../types/inquiry";

const InquiryList = () => {
    const navigate = useNavigate();


    const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        totalPage: 1,
        totalCount: 0,
    });


    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const limit = 5;


    const loadInquiries = async (page: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const { data, pagination: resPagination } = await fetchInquiryList(page, limit);
            setInquiries(data);
            setPagination({
                current: resPagination.currentPage,
                totalPage: resPagination.totalPages,
                totalCount: resPagination.total,
            });
        } catch (err: any) {
            setError(
                err.response?.status === 401
                    ? "로그인이 필요합니다."
                    : "내역을 불러오지 못했습니다.",
            );
            setInquiries([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadInquiries(1);
    }, []);

    const pageNumbers = useMemo(() => {
        const pages: number[] = [];
        const { current, totalPage } = pagination;
        const maxVisible = 5;

        let start = Math.max(1, current - Math.floor(maxVisible / 2));
        let end = Math.min(totalPage, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    }, [pagination]);

    // 핸들러
    const handlePageChange = (page: number) => {
        if (page < 1 || page > pagination.totalPage) return;
        loadInquiries(page);
        window.scrollTo({ top: 0, behavior: "instant" });
    };


    const labels = {
        type: (type: InquiryType) =>
            ({
                PRODUCT: "상품",
                DELIVERY: "배송",
                EXCHANGE_RETURN: "교환/반품",
                MEMBER: "회원",
                OTHER: "기타",
            })[type],
        status: (status: InquiryStatus) => (status === "ANSWERED" ? "답변 완료" : "답변 대기"),
        date: (str: string) => {
            const d = new Date(str);
            return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
        },
    };

    return (
        <div className="max-w-[1100px] mx-auto px-8 py-20 text-black tracking-tight overflow-hidden">
            <div className="flex justify-between items-baseline mb-6 border-b-[1.5px] border-black pb-3">
                <div className="flex items-baseline gap-4">
                    <h1 className="text-2xl font-[#111] font-[500]">문의내역</h1>
                    {!error && (
                        <span className="text-[11px] font-bold text-gray-400">
                            총 {pagination.totalCount}건
                        </span>
                    )}
                </div>
                <button
                    onClick={() => navigate("/inquiry/write")}
                    className="text-xs font-black border border-black px-10 py-3.5 cursor-pointer">
                    문의하기
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-40">
                    <div className="w-6 h-6 border-t-2 border-black rounded-full animate-spin" />
                </div>
            ) : error ? (
                <div className="text-center py-40">
                    <p className="text-[13px]  text-gray-400 tracking-widest">{error}</p>
                </div>
            ) : inquiries.length === 0 ? (
                <div className="text-center py-40 border-b border-gray-100">
                    <p className="text-[13px] font-bold text-gray-300 mb-10 tracking-widest">
                        등록된 문의가 없습니다
                    </p>
                </div>
            ) : (
                <>
                    <div className="w-full ">
                        <table className="w-full max-h-[300]">
                            <thead  >
                                <tr className="border-b mb-3border-black text-[11px] font-black text-left uppercase">
                                    <th className="pb-5 w-[80px]">번호</th>
                                    <th className="pb-5 w-[140px]">유형</th>
                                    <th className="pb-5">제목</th>
                                    <th className="pb-5 pl-3 w-[120px]">작성일</th>
                                    <th className="pb-5 pr-3.5 w-[100px] text-right">상태</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {inquiries.map((inquiry, index) => (
                                    <tr
                                        key={inquiry.id}
                                        onClick={() => navigate(`/inquiry/${inquiry.id}`)}
                                        className="group cursor-pointer">
                                        <td className="py-7 text-[11px] font-bold">
                                            {(
                                                pagination.totalCount -
                                                (pagination.current - 1) * limit -
                                                index
                                            )
                                                .toString()
                                                .padStart(2, "0")}
                                        </td>
                                        <td className="py-7 text-[11px] font-medium  ">
                                            {labels.type(inquiry.type)}
                                        </td>
                                        <td className="py-7 text-[14px] font-medium tracking-tighter">
                                            <span className="border-b border-transparent  pb-0.5">
                                                {inquiry.title}
                                            </span>
                                            {inquiry.images.length > 0 && (
                                                <span className="ml-2 text-[10px] text-gray-300 font-normal">
                                                    첨부파일
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-7 text-[11px]  font-medium">
                                            {labels.date(inquiry.createdAt)}
                                        </td>
                                        <td className="py-7 text-[11px]  font-black text-right">
                                            <span
                                                className={
                                                    inquiry.status === "ANSWERED"
                                                        ? "text-blue-500"
                                                        : "font-medium"
                                                }>
                                                {labels.status(inquiry.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pagination.totalPage >= 1 && (
                        <div className="flex justify-center items-center gap-12 mt-24">
                            <button
                                onClick={() => handlePageChange(pagination.current - 1)}
                                disabled={pagination.current === 1}
                                className="text-[11px] font-black disabled:opacity-10">
                                이전
                            </button>
                            <div className="flex gap-6">
                                {pageNumbers.map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`text-[11px] font-black transition-all ${page === pagination.current ? "text-black border-b-2 border-black" : "text-gray-300 hover:text-black"}`}>
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => handlePageChange(pagination.current + 1)}
                                disabled={pagination.current === pagination.totalPage}
                                className="text-[11px] font-black disabled:opacity-10">
                                다음
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default InquiryList;
