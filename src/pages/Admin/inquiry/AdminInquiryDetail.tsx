import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAdminInquiryDetail, answerInquiry, deleteInquiryByAdmin } from "../../../api/admin.inquiry.api";
import type { AdminInquiryItem } from "../../../types/admin.inquiry";
import { MdArrowBack, MdDelete, MdEdit } from "react-icons/md";

const AdminInquiryDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [inquiry, setInquiry] = useState<AdminInquiryItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [answer, setAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;
        loadData(Number(id));
    }, [id]);

    const loadData = async (inquiryId: number) => {
        setIsLoading(true);
        try {
            const data = await fetchAdminInquiryDetail(inquiryId);
            setInquiry(data);
            setAnswer(data.answer || "");
        } catch (error) {
            console.error("로드 실패", error);
            alert("문의 내용을 불러오지 못했습니다.");
            navigate("/admin/inquiry");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteInquiry = async () => {
        if (!window.confirm("정말 이 문의를 삭제하시겠습니까?")) return;
        try {
            if (inquiry) {
                await deleteInquiryByAdmin(inquiry.id);
                alert("삭제되었습니다.");
                navigate("/admin/inquiry");
            }
        } catch (error) {
            console.error(error);
            alert("삭제에 실패했습니다.");
        }
    };

    const handleSubmitAnswer = async () => {
        if (!inquiry || !answer.trim()) {
            alert("답변 내용을 입력해주세요.");
            return;
        }

        setIsSubmitting(true);
        try {
            await answerInquiry(inquiry.id, { answer });
            alert("답변이 등록되었습니다.");
            loadData(inquiry.id);
        } catch (error) {
            console.error(error);
            alert("답변 등록에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (str: string) => {
        const d = new Date(str);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
    };

    const formatDateTime = (str: string) => {
        const d = new Date(str);
        const date = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
        const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
        return `${date} ${time}`;
    };

    const labels = {
        type: (type: string) =>
            ({
                PRODUCT: "상품",
                DELIVERY: "배송",
                EXCHANGE_RETURN: "교환/반품",
                MEMBER: "회원",
                OTHER: "기타",
            })[type] || type,
        status: (status: string) => (status === "ANSWERED" ? "답변완료" : "답변대기"),
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-40">
                <div className="w-6 h-6 border-t-2 border-black rounded-full animate-spin" />
            </div>
        );
    }

    if (!inquiry) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-black/10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/admin/inquiry")}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <MdArrowBack className="text-xl" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold uppercase tracking-[0.15em] text-[#111]">
                            문의 상세
                        </h1>
                        <p className="text-xs text-gray-500 mt-2 tracking-wider uppercase">
                            ID #{inquiry.id}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleDeleteInquiry}
                    className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 border border-red-500 hover:bg-red-50 transition-colors"
                >
                    <MdDelete /> 삭제
                </button>
            </div>

            {/* 문의 정보 */}
            <div className="bg-white border border-gray-100 shadow-sm">
                {/* 메타 정보 */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 ${
                                inquiry.status === "ANSWERED"
                                    ? "bg-blue-500 text-white"
                                    : "bg-red-500 text-white"
                            }`}>
                                {labels.status(inquiry.status)}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {labels.type(inquiry.type)}
                            </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">
                            {formatDate(inquiry.createdAt)}
                        </span>
                    </div>
                </div>

                {/* 제목 & 내용 */}
                <div className="px-6 py-6">
                    <h2 className="text-xl font-bold mb-4">{inquiry.title}</h2>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                        {inquiry.content}
                    </p>
                </div>

                {/* 작성자 정보 */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                    <div className="flex items-center gap-6 text-xs">
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">
                                작성자
                            </span>
                            <span className="font-medium">
                                {inquiry.user?.name || `User ID: ${inquiry.userId}`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 답변 영역 */}
            <div className="bg-white border border-gray-100 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 bg-blue-50/30">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                            <MdEdit className="text-lg" />
                            관리자 답변
                        </h3>
                        {inquiry.answeredAt && (
                            <span className="text-[10px] text-gray-500 font-mono">
                                {formatDateTime(inquiry.answeredAt)}
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="답변 내용을 입력해주세요..."
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-200 text-sm leading-relaxed resize-none focus:outline-none focus:border-black"
                    />

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={() => setAnswer(inquiry.answer || "")}
                            className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            초기화
                        </button>
                        <button
                            onClick={handleSubmitAnswer}
                            disabled={isSubmitting || !answer.trim()}
                            className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? "등록 중..." : inquiry.status === "ANSWERED" ? "답변 수정" : "답변 등록"}
                        </button>
                    </div>
                </div>
            </div>

            {/* 기존 답변 (있는 경우) */}
            {inquiry.status === "ANSWERED" && inquiry.answer && (
                <div className="bg-blue-50/50 border border-blue-100 p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-900">
                            현재 답변
                        </h4>
                        {inquiry.answeredAt && (
                            <span className="text-[10px] text-blue-700 font-mono">
                                {formatDateTime(inquiry.answeredAt)}
                            </span>
                        )}
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {inquiry.answer}
                    </p>
                </div>
            )}
        </div>
    );
};

export default AdminInquiryDetail;