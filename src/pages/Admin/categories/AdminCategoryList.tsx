import { useEffect, useState } from "react";
import { MdAdd, MdEdit, MdDelete, MdSubdirectoryArrowRight, MdRefresh, MdArrowForward } from "react-icons/md";
import { createCategory, updateCategory, deleteCategory } from "../../../api/admin.category.api";
import type { Category } from "../../../types/category";
import type { CreateCategoryInput, FlatCategory } from "../../../types/admin.category";
import {getCategories} from "../../../api/category.api.ts";

const AdminCategoryList = () => {
    const [flatCategories, setFlatCategories] = useState<FlatCategory[]>([]);
    const [loading, setLoading] = useState(true);

    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<CreateCategoryInput>({
        name: "",
        path: "",
        parentId: null,
    });

    const flattenCategories = (list: Category[], level = 0, result: FlatCategory[] = []) => {
        list.forEach((cat) => {
            result.push({ ...cat, level });
            if (cat.children && cat.children.length > 0) {
                flattenCategories(cat.children, level + 1, result);
            }
        });
        return result;
    };

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories();
            setFlatCategories(flattenCategories(data));
        } catch (error) {
            console.error("카테고리 로딩 실패", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories().then(() => {});
    }, []);

    const resetForm = () => {
        setIsEditMode(false);
        setEditingId(null);
        setFormData({ name: "", path: "", parentId: null });
    };

    const handleEditClick = (category: FlatCategory) => {
        setIsEditMode(true);
        setEditingId(category.id);
        setFormData({
            name: category.name,
            path: category.path,
            parentId: category.parentId,
        });
    };

    const handleDeleteClick = async (id: number) => {
        if (window.confirm("정말 이 카테고리를 삭제하시겠습니까?")) {
            try {
                await deleteCategory(id);
                loadCategories();
                if (editingId === id) resetForm(); // 삭제된 항목을 수정 중이었다면 폼 초기화
            } catch (error: any) {
                alert(error.response?.data?.message || "삭제에 실패했습니다.");
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "parentId" ? (value ? Number(value) : null) : value,
        }));
    };

    const handleNameBlur = () => {
        // 이름 입력 후 포커스 잃으면 Path 자동 생성 (생성 모드일 때만)
        if (!isEditMode && !formData.path && formData.name) {
            const autoPath = formData.name.trim().toLowerCase().replace(/\s+/g, "-");
            setFormData((prev) => ({ ...prev, path: autoPath }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditMode && editingId) {
                await updateCategory(editingId, formData);
                alert("수정되었습니다.");
            } else {
                await createCategory(formData);
                alert("생성되었습니다.");
            }
            loadCategories();
            resetForm(); // 저장 후 폼 초기화
        } catch (error: any) {
            alert(error.response?.data?.message || "작업 처리에 실패했습니다.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end pb-4 border-b border-black/10">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-[0.15em] text-[#111]">
                        카테고리 관리
                    </h1>
                    <p className="text-xs text-gray-500 mt-2 tracking-wider uppercase">
                        상품 분류 구조를 관리합니다
                    </p>
                </div>
                <button
                    onClick={loadCategories}
                    className="p-2 text-gray-400 hover:text-black transition-colors"
                    title="목록 새로고침"
                >
                    <MdRefresh className="text-xl" />
                </button>
            </div>

            {/* Main Layout: 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* [Left Column] Category List Table */}
                <div className="lg:col-span-2">
                    <div className="bg-white shadow-sm border border-gray-100 min-h-[500px]">
                        {loading ? (
                            <div className="p-10 text-center text-xs text-gray-400 tracking-widest">로딩 중...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">카테고리명 (계층구조)</th>
                                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">URL 경로</th>
                                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">관리</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {flatCategories.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="p-8 text-center text-xs text-gray-400">
                                                등록된 카테고리가 없습니다. 우측에서 생성해주세요.
                                            </td>
                                        </tr>
                                    ) : (
                                        flatCategories.map((cat) => (
                                            <tr
                                                key={cat.id}
                                                className={`
                                                        border-b border-gray-50 transition-colors group
                                                        ${editingId === cat.id ? "bg-black/5" : "hover:bg-gray-50"}
                                                    `}
                                            >
                                                <td className="p-4">
                                                    <div
                                                        className="flex items-center"
                                                        style={{ paddingLeft: `${cat.level * 24}px` }}
                                                    >
                                                        {cat.level > 0 && <MdSubdirectoryArrowRight className="text-gray-300 mr-2" />}
                                                        <span className={`text-sm ${cat.level === 0 ? "font-bold text-[#111]" : "text-gray-600"}`}>
                                                                {cat.name}
                                                            </span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-xs text-gray-400 font-mono tracking-wide">
                                                    /{cat.path}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEditClick(cat)}
                                                            className={`p-2 rounded-full transition-colors ${editingId === cat.id ? "text-black bg-white shadow-sm" : "text-gray-300 hover:text-black hover:bg-white"}`}
                                                            title="수정"
                                                        >
                                                            <MdEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(cat.id)}
                                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-white rounded-full transition-colors"
                                                            title="삭제"
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* [Right Column] Create/Edit Form (Sticky) */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 shadow-sm border border-gray-100 sticky top-6">
                        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
                            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[#111]">
                                {isEditMode ? "카테고리 수정" : "새 카테고리"}
                            </h2>
                            {isEditMode && (
                                <button
                                    onClick={resetForm}
                                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                                >
                                    <MdAdd /> 초기화
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Parent Select */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                    상위 카테고리
                                </label>
                                <div className="relative">
                                    <select
                                        name="parentId"
                                        value={formData.parentId || ""}
                                        onChange={handleChange}
                                        className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent appearance-none cursor-pointer"
                                    >
                                        <option value="">(없음 - 최상위 카테고리)</option>
                                        {flatCategories.map((cat) => (
                                            // 자기 자신은 부모로 선택 불가
                                            editingId !== cat.id && (
                                                <option key={cat.id} value={cat.id}>
                                                    {"\u00A0".repeat(cat.level * 4) + cat.name}
                                                </option>
                                            )
                                        ))}
                                    </select>
                                    <div className="absolute right-0 top-3 pointer-events-none text-gray-400">
                                        <MdArrowForward className="text-xs rotate-90" />
                                    </div>
                                </div>
                            </div>

                            {/* Name Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                    카테고리 이름
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={handleNameBlur}
                                    placeholder="예) 선글라스"
                                    className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent placeholder:text-gray-300"
                                    required
                                />
                            </div>

                            {/* Path Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                    URL 경로 (Path)
                                </label>
                                <input
                                    type="text"
                                    name="path"
                                    value={formData.path}
                                    onChange={handleChange}
                                    placeholder="예) sunglasses"
                                    className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent placeholder:text-gray-300"
                                    required
                                />
                                <p className="text-[9px] text-gray-400 mt-1">
                                    영문 소문자, 숫자, 하이픈(-)만 사용 가능합니다.
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className={`
                                        w-full py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-colors
                                        ${isEditMode ? "bg-black hover:bg-black/80" : "bg-[#111] hover:bg-black/90"}
                                    `}
                                >
                                    {isEditMode ? "수정사항 저장" : "카테고리 생성"}
                                </button>

                                {isEditMode && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="w-full mt-2 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                                    >
                                        수정 취소
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCategoryList;