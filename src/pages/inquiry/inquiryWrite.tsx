import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createInquiry } from "../../api/inquiry.api";
import type { InquiryType, CreateInquiryRequest } from "../../types/inquiry";

const InquiryWrite = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreateInquiryRequest>({
        type: "PRODUCT",
        title: "",
        content: "",
        imageUrls: [],
    });
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
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
        return () => previewUrls.forEach(url => URL.revokeObjectURL(url));
    }, [previewUrls]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;


        if (name === "title" && value.length > 30) return;

        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files);
        const newImages = [...images, ...fileArray].slice(0, 5);
        setImages(newImages);

        const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setPreviewUrls(newPreviewUrls);
    };

    const handleImageRemove = (index: number) => {
        URL.revokeObjectURL(previewUrls[index]);
        setImages(images.filter((_, i) => i !== index));
        setPreviewUrls(previewUrls.filter((_, i) => i !== index));
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
        if (!validateForm() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await createInquiry({ ...formData, imageUrls: [] });
            alert("등록되었습니다.");
            navigate("/inquiry");
        } catch (error: any) {
            alert(error.response?.data?.message || "등록에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-[900px] mx-auto px-8 py-16 text-black tracking-tight font-medium">
            <div className="flex justify-between items-baseline mb-10 border-b-[1.5px] border-black pb-3">
                <h1 className="text-2xl font-[#111] font-[500]">문의하기</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10   ">
                {/* 문의 유형 */}
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 items-start border-b border-gray-100 pb-6">
                    <label className="text-[11px] font-black uppercase pt-1.5">문의유형</label>
                    <div className="flex gap-2 flex-wrap">
                        {inquiryTypes.map((type) => (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                                className={`px-4 py-1.5 text-[11px] font-bold border  cursor-pointer ${
                                    formData.type === type.value
                                        ? "border-black  text-black"
                                        : "border-gray-200 text-gray-400 hover:border-black hover:text-black"
                                }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 items-center border-b border-gray-100 pb-6 ">
                    <label className="text-[11px] font-black uppercase ">제목</label>
                    <div className="w-full flex items-center justify-between  bg-white rounded-lg p-2">
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
                    <div className="w-full bg-white rounded-lg p-3 ">
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            rows={8}
                            placeholder="내용을 10자 이상 입력해주세요."
                            className="w-full  text-[13px] outline-none resize-none placeholder:text-gray-300 leading-relaxed "
                        />
                        <div className="flex justify-end mt-2">
                            <span className="text-[10px] text-gray-300 font-bold">{formData.content.length}자</span>
                        </div>
                    </div>
                </div>

                {/* 파일첨부 */}
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 items-start border-b border-gray-100 pb-10">
                    <label className="text-[11px] font-black uppercase pt-1.5">파일첨부</label>
                    <div>
                        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" id="file-upload" />
                        <label htmlFor="file-upload" className="inline-block text-[10px] font-black border border-black px-5 py-2.5 cursor-pointer hover:bg-black hover:text-white transition-all">
                            파일 선택 ({images.length}/5)
                        </label>

                        {previewUrls.length > 0 && (
                            <div className="mt-6 flex gap-3 flex-wrap">
                                {previewUrls.map((url, index) => (
                                    <div key={index} className="relative w-20 h-20 border border-gray-100 shadow-sm">
                                        <img src={url} alt="미리보기" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleImageRemove(index)}
                                            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-black text-white text-[8px] flex items-center justify-center"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 하단 버튼 */}
                <div className="flex gap-3 max-w-[400px] mx-auto pt-4 ">
                    <button
                        type="button"
                        onClick={() => navigate("/inquiry")}
                        className="flex-1 py-4 text-[11px] font-black border border-gray-200 text-gray-400 hover:border-black hover:text-black transition-all cursor-pointer"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-4 text-[11px] font-black bg-black text-white hover:bg-gray-800 disabled:bg-gray-100 transition-all cursor-pointer"
                    >
                        {isSubmitting ? "등록 중" : "등록하기"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InquiryWrite;