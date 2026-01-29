import { useEffect, useState, useRef, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdCloudUpload, MdClose, MdArrowForward } from "react-icons/md";
import { createProduct } from "../../../api/admin.product.api";
import { uploadImage } from "../../../api/upload.api";
import type { CreateProductInput } from "../../../types/admin.product";
import type { Category } from "../../../types/category";
import {getCategories} from "../../../api/category.api.ts";

interface FlatCategory extends Category {
    level: number;
}

const AdminProductCreate = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<FlatCategory[]>([]);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<Omit<CreateProductInput, "imageUrls">>({
        name: "",
        price: 0,
        material: "",
        summary: "",
        collection: "",
        lens: "",
        originCountry: "",
        Shape: "",
        sizeInfo: "",
        categoryId: 0,
    });

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getCategories();
                const flattened: FlatCategory[] = [];

                const flatten = (list: Category[], level = 0) => {
                    list.forEach(cat => {
                        flattened.push({ ...cat, level });
                        if (cat.children) flatten(cat.children, level + 1);
                    });
                };
                flatten(data);
                setCategories(flattened);
            } catch (error) {
                console.error("카테고리 로딩 실패", error);
            }
        };
        loadCategories();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "price" || name === "categoryId" ? Number(value) : value
        }));
    };

    // 3. 핸들러: 이미지 선택 및 미리보기
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...filesArray]);

            // 미리보기 URL 생성
            const newPreviews = filesArray.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newPreviews]);
        }
    };

    // 4. 핸들러: 선택된 이미지 삭제
    const removeImage = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => {
            // 메모리 누수 방지: URL 해제
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    // 5. 최종 제출 (이미지 업로드 -> 상품 생성)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedFiles.length === 0) {
            alert("최소 1개의 이미지를 등록해주세요.");
            return;
        }
        if (formData.categoryId === 0) {
            alert("카테고리를 선택해주세요.");
            return;
        }

        try {
            setIsLoading(true);

            // A. 이미지 순차 업로드 (병렬 처리 가능하지만 순서 보장을 위해 순차 혹은 Promise.all)
            const uploadPromises = selectedFiles.map(file => uploadImage(file));
            const imageUrls = await Promise.all(uploadPromises);

            // B. 상품 생성 API 호출
            const submitData: CreateProductInput = {
                ...formData,
                imageUrls,
            };

            await createProduct(submitData);
            alert("상품이 성공적으로 등록되었습니다.");
            navigate("/admin/product");

        } catch (error: any) {
            console.error("상품 등록 실패", error);
            alert(error.response?.data?.message || "상품 등록 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 mb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-10 border-b border-black/10 pb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <MdArrowBack className="text-xl" />
                </button>
                <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-[#111]">
                    Create Product
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">

                {/* Section 1: Image Upload */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                        Product Images
                    </h2>

                    <div className="flex flex-wrap gap-4">
                        {/* Upload Button */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-32 h-32 border border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-colors"
                        >
                            <MdCloudUpload className="text-2xl text-gray-400 mb-2" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Upload</span>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                multiple
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        {/* Previews */}
                        {previewUrls.map((url, index) => (
                            <div key={index} className="relative w-32 h-32 border border-gray-100 bg-gray-50">
                                <img src={url} alt="preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
                                >
                                    <MdClose className="text-xs" />
                                </button>
                                {index === 0 && (
                                    <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[8px] text-center py-1 uppercase tracking-widest font-bold">
                                        Main
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 2: Basic Info */}
                <div className="space-y-6">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                        Basic Info
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Category</label>
                            <div className="relative">
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent appearance-none cursor-pointer"
                                    required
                                >
                                    <option value={0}>Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {"\u00A0".repeat(cat.level * 4) + cat.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-0 top-3 pointer-events-none text-gray-400">
                                    <MdArrowForward className="text-xs rotate-90" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="ex) Lilit 01"
                                className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent placeholder:text-gray-300"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Price (KRW)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent placeholder:text-gray-300"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Summary</label>
                            <input
                                type="text"
                                name="summary"
                                value={formData.summary}
                                onChange={handleChange}
                                placeholder="Short description"
                                className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent placeholder:text-gray-300"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: Detail Specs */}
                <div className="space-y-6">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                        Detail Specs
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Collection</label>
                            <input type="text" name="collection" value={formData.collection} onChange={handleChange} placeholder="ex) 2024 Collection" className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none bg-transparent placeholder:text-gray-300" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Material</label>
                            <input type="text" name="material" value={formData.material} onChange={handleChange} placeholder="ex) Acetate" className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none bg-transparent placeholder:text-gray-300" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Lens</label>
                            <input type="text" name="lens" value={formData.lens} onChange={handleChange} placeholder="ex) Black Lens" className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none bg-transparent placeholder:text-gray-300" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Shape</label>
                            <input type="text" name="Shape" value={formData.Shape} onChange={handleChange} placeholder="ex) Square" className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none bg-transparent placeholder:text-gray-300" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Origin</label>
                            <input type="text" name="originCountry" value={formData.originCountry} onChange={handleChange} placeholder="ex) China" className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none bg-transparent placeholder:text-gray-300" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Size Info</label>
                            <input type="text" name="sizeInfo" value={formData.sizeInfo} onChange={handleChange} placeholder="Frame Front: 145mm..." className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none bg-transparent placeholder:text-gray-300" required />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-10 flex justify-end gap-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 bg-[#111] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black/80 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Uploading..." : "Save Product"}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AdminProductCreate;