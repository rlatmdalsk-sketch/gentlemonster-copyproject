import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchInquiryDetail, updateInquiry } from "../../api/inquiry.api";
import type { InquiryType, UpdateInquiryRequest } from "../../types/inquiry";

const InquiryEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [formData, setFormData] = useState<UpdateInquiryRequest>({
        type: "PRODUCT",
        title: "",
        content: "",
        imageUrls: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({ title: "", content: "" });

    const inquiryTypes: { value: InquiryType; label: string }[] = [
        { value: "PRODUCT", label: "상품" },
        { value: "DELIVERY", label: "배송" },
        { value: "EXCHANGE_RETURN", label: "교환/반품" },
        { value: "MEMBER", label: "회원" },
        { value: "OTHER", label: "기타" },
    ];

    useEffect(() => {
        if (!id) return;

        fetchInquiryDetail(Number(id))
            .then((data) => {
                // 답변 완료된 글은 수정 불가 로직 유지
                if (data.status === "ANSWERED") {
                    alert("답변 완료된 문의는 수정할 수 없습니다.");
                    navigate(`/inquiry/${id}`);
                    return;
                }

                setFormData({
                    type: data.type,
                    title: data.title,
                    content: data.content,
                    imageUrls: [], // 이미지는 필요시 추가 구현
                });
            })
            .catch(() => {
                alert("문의 내용을 불러오는데 실패했습니다.");
                navigate("/inquiry");
            })
            .finally(() => setIsLoading(false));
    }, [id, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // 제목 30자 제한 (Write와 동일하게)
        if (name === "title" && value.length > 30) return;

        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = { title: "", content: "" };
        if (!formData.title.trim()) newErrors.title = "제목을 입력해주세요.";
        if (formData.content.trim().length < 10) newErrors.content = "내용은 10자 이상 입력해주세요.";
        setErrors(newErrors);
        return !newErrors.title && !newErrors.content;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !id || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await updateInquiry(Number(id), formData);
            alert("수정되었습니다.");
            navigate(`/inquiry/${id}`);
        } catch (error: any) {
            alert(error.response?.data?.message || "수정에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-[900px] mx-auto px-8 py-20 flex justify-center items-center">
                <div className="w-6 h-6 border-t-2 border-black rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-[900px] mx-auto px-8 py-16 text-black tracking-tight font-medium">
            <div className="flex justify-between items-baseline mb-10 border-b-[1.5px] border-black pb-3">
                <h1 className="text-2xl font-[#111] font-[500]">문의 수정</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* 문의 유형 */}
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 items-start border-b border-gray-100 pb-6">
                    <label className="text-[11px] font-black uppercase pt-1.5">문의유형</label>
                    <div className="flex gap-2 flex-wrap">
                        {inquiryTypes.map((type) => (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                                className={`px-4 py-1.5 text-[11px] font-bold border cursor-pointer transition-all ${
                                    formData.type === type.value
                                        ? "border-black text-black"
                                        : "border-gray-200 text-gray-400 hover:border-black hover:text-black"
                                }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 제목 */}
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 items-center border-b border-gray-100 pb-6">
                    <label className="text-[11px] font-black uppercase">제목</label>
                    <div className="w-full flex items-center justify-between  bg-white rounded-lg p-3">
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="제목을 입력하세요 (최대 30자)"
                            className="w-full bg-transparent text-[13px] outline-none placeholder:text-gray-300"
                        />
                        <span className="text-[10px] text-gray-300 font-bold whitespace-nowrap ml-4">
                            {formData.title.length}/30
                        </span>
                    </div>
                </div>

                {/* 내용 */}
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 items-start border-b border-gray-100 pb-6">
                    <label className="text-[11px] font-black uppercase pt-1.5">내용</label>
                    <div className="w-full  bg-white rounded-lg p-3">
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            rows={12}
                            placeholder="내용을 10자 이상 입력해주세요."
                            className="w-full bg-transparent text-[13px] outline-none resize-none placeholder:text-gray-300 leading-relaxed"
                        />
                        <div className="flex justify-between items-center mt-2">
                            {errors.content ? (
                                <p className="text-[11px] text-red-500">{errors.content}</p>
                            ) : (
                                <div className="w-full flex justify-end">
                                    <span className="text-[10px] text-gray-300 font-bold">{formData.content.length}자</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 하단 버튼 */}
                <div className="flex gap-3 max-w-[400px] mx-auto pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(`/inquiry/${id}`)}
                        className="flex-1 py-4 text-[11px] font-black border border-gray-200 text-gray-400 hover:border-black hover:text-black transition-all cursor-pointer"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-4 text-[11px] font-black bg-black text-white hover:bg-gray-800 disabled:bg-gray-100 transition-all cursor-pointer"
                    >
                        {isSubmitting ? "수정 중" : "수정 완료"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InquiryEdit;