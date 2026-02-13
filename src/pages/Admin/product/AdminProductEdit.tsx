// AdminProductEdit.tsx 수정 - categoryIds로 변경하고 안전성 강화

import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdCloudUpload, MdClose, MdArrowForward } from "react-icons/md";
import { fetchProductDetail } from "../../../api/product.api";
import { updateProduct } from "../../../api/admin.product.api";
import { uploadImage } from "../../../api/upload.api";
import type { Category } from "../../../types/category";
import { getCategories } from "../../../api/category.api.ts";

interface FlatCategory extends Category {
    level: number;
}

type ImageItem =
    | { type: "EXISTING"; url: string }
    | { type: "NEW"; file: File; previewUrl: string };

const AdminProductEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [categories, setCategories] = useState<FlatCategory[]>([]);

    const [imageList, setImageList] = useState<ImageItem[]>([]);
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
        categoryId: 0, // Edit는 단일 카테고리만
    });

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                setIsFetching(true);

                const categoryData = await getCategories();
                const flattened: FlatCategory[] = [];
                const flatten = (list: Category[], level = 0) => {
                    list.forEach(cat => {
                        flattened.push({ ...cat, level });
                        if (cat.children) flatten(cat.children, level + 1);
                    });
                };
                flatten(categoryData);
                setCategories(flattened);

                const { product } = await fetchProductDetail(Number(id));

                setFormData({
                    name: product.name,
                    price: product.price,
                    material: product.material,
                    summary: product.summary,
                    collection: product.collection,
                    lens: product.lens,
                    originCountry: product.originCountry,
                    Shape: product.Shape,
                    sizeInfo: product.sizeInfo,
                    categoryId: product.categoryId,
                });

                const existingImages: ImageItem[] = (product.images || []).map(img => ({
                    type: "EXISTING",
                    url: img.url
                }));
                setImageList(existingImages);

            } catch (error) {
                console.error("데이터 로딩 실패", error);
                alert("상품 정보를 불러올 수 없습니다.");
                navigate("/admin/product");
            } finally {
                setIsFetching(false);
            }
        };

        loadData();
    }, [id, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "price" || name === "categoryId" ? Number(value) : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const newImages: ImageItem[] = filesArray.map(file => ({
                type: "NEW",
                file,
                previewUrl: URL.createObjectURL(file)
            }));

            setImageList(prev => [...prev, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        setImageList(prev => {
            const target = prev[index];
            if (target.type === "NEW") {
                URL.revokeObjectURL(target.previewUrl);
            }
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) return;
        if (imageList.length === 0) {
            alert("최소 1개의 이미지가 필요합니다.");
            return;
        }
        if (formData.categoryId === 0) {
            alert("카테고리를 선택해주세요.");
            return;
        }

        try {
            setIsLoading(true);

            const imageUrls = await Promise.all(
                imageList.map(async (item) => {
                    if (item.type === "EXISTING") {
                        return item.url;
                    } else {
                        return await uploadImage(item.file);
                    }
                })
            );

            const submitData = {
                ...formData,
                imageUrls,
            };

            await updateProduct(Number(id), submitData);
            alert("상품 정보가 수정되었습니다.");
            navigate("/admin/product");

        } catch (error: any) {
            console.error("상품 수정 실패", error);
            alert(error.response?.data?.message || "수정 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="p-20 text-center text-xs tracking-widest text-gray-400">데이터 로딩 중...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-8 mb-20">
            <div className="flex items-center gap-4 mb-10 border-b border-black/10 pb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <MdArrowBack className="text-xl" />
                </button>
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-[#111]">
                        Edit Product
                    </h1>
                    <span className="text-[10px] text-gray-400 tracking-widest mt-1">ID: #{id}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">

                {/* Image Upload */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                        Product Images
                    </h2>

                    <div className="flex flex-wrap gap-4">
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

                        {imageList.map((item, index) => {
                            const displayUrl = item.type === "EXISTING" ? item.url : item.previewUrl;

                            return (
                                <div key={index} className="relative w-32 h-32 border border-gray-100 bg-gray-50 group">
                                    <img src={displayUrl} alt={`img-${index}`} className="w-full h-full object-cover" />

                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <MdClose className="text-xs" />
                                    </button>

                                    {index === 0 && (
                                        <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[8px] text-center py-1 uppercase tracking-widest font-bold">
                                            Main
                                        </span>
                                    )}

                                    {item.type === "NEW" && (
                                        <span className="absolute top-1 left-1 bg-blue-500 text-white text-[8px] px-1 rounded uppercase font-bold">
                                            New
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Basic Info */}
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
                                className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent"
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
                                className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent"
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
                                className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Detail Specs */}
                <div className="space-y-6">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                        Detail Specs
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Collection</label>
                            <input type="text" name="collection" value={formData.collection} onChange={handleChange} className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none bg-transparent" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Material</label>
                            <input type="text" name="material" value={formData.material} onChange={handleChange} className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none bg-transparent" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Lens</label>
                            <input type="text" name="lens" value={formData.lens} onChange={handleChange} className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none bg-transparent" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Shape</label>
                            <input type="text" name="Shape" value={formData.Shape} onChange={handleChange} className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none bg-transparent" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Origin</label>
                            <input type="text" name="originCountry" value={formData.originCountry} onChange={handleChange} className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none bg-transparent" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Size Info</label>
                            <input type="text" name="sizeInfo" value={formData.sizeInfo} onChange={handleChange} className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none bg-transparent" required />
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
                        {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AdminProductEdit;