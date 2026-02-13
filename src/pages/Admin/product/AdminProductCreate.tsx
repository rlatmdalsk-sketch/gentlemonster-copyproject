import { useEffect, useState, useRef, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdCloudUpload, MdClose } from "react-icons/md";
import { createProduct } from "../../../api/admin.product.api";
import { uploadImage } from "../../../api/upload.api";
import type { Category } from "../../../types/category";
import { getCategories } from "../../../api/category.api.ts";

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

    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        material: "",
        summary: "",
        collection: "",
        lens: "",
        originCountry: "",
        Shape: "",
        sizeInfo: "",
        categoryIds: [] as number[], // 배열로 변경!
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

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "price" ? Number(value) : value
        }));
    };

    // 카테고리 토글
    const handleCategoryToggle = (categoryId: number) => {
        setFormData(prev => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(categoryId)
                ? prev.categoryIds.filter(id => id !== categoryId)
                : [...prev.categoryIds, categoryId]
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...filesArray]);

            const newPreviews = filesArray.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedFiles.length === 0) {
            alert("최소 1개의 이미지를 등록해주세요.");
            return;
        }
        if (formData.categoryIds.length === 0) {
            alert("최소 1개의 카테고리를 선택해주세요.");
            return;
        }

        try {
            setIsLoading(true);

            // 이미지 업로드
            const uploadPromises = selectedFiles.map(file => uploadImage(file));
            const imageUrls = await Promise.all(uploadPromises);

            // 선택된 각 카테고리마다 상품 생성
            for (const categoryId of formData.categoryIds) {
                const submitData = {
                    name: formData.name,
                    price: formData.price,
                    material: formData.material,
                    summary: formData.summary,
                    collection: formData.collection,
                    lens: formData.lens,
                    originCountry: formData.originCountry,
                    Shape: formData.Shape,
                    sizeInfo: formData.sizeInfo,
                    categoryId,
                    imageUrls,
                };

                await createProduct(submitData);
            }

            alert(`${formData.categoryIds.length}개 카테고리에 상품이 성공적으로 등록되었습니다.`);
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

                    <div className="grid grid-cols-1 gap-8">
                        {/* 멀티 카테고리 선택 */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                Categories (Multiple Selection)
                            </label>

                            {/* 선택된 카테고리 태그 */}
                            <div className="flex flex-wrap gap-2 mb-3 min-h-[40px] p-3 border border-gray-200 rounded bg-gray-50">
                                {formData.categoryIds.length === 0 ? (
                                    <span className="text-xs text-gray-400">카테고리를 선택해주세요</span>
                                ) : (
                                    formData.categoryIds.map(id => {
                                        const cat = categories.find(c => c.id === id);
                                        return cat ? (
                                            <span
                                                key={id}
                                                className="px-3 py-1.5 bg-black text-white text-xs rounded-full flex items-center gap-2"
                                            >
                                                {cat.name}
                                                <button
                                                    type="button"
                                                    onClick={() => handleCategoryToggle(id)}
                                                    className="hover:text-red-300 text-base font-bold leading-none"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ) : null;
                                    })
                                )}
                            </div>

                            {/* 카테고리 체크박스 리스트 */}
                            <div className="border border-gray-300 rounded max-h-80 overflow-y-auto bg-white">
                                {categories.map((cat) => (
                                    <label
                                        key={cat.id}
                                        className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.categoryIds.includes(cat.id)}
                                            onChange={() => handleCategoryToggle(cat.id)}
                                            className="mr-3 w-4 h-4 cursor-pointer"
                                        />
                                        <span
                                            className="text-sm"
                                            style={{ paddingLeft: `${cat.level * 20}px` }}
                                        >
                                            {cat.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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