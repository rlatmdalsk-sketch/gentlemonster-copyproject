import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../../api/admin.user.api";
import type { CreateUserInput } from "../../../types/admin.user";
import { MdArrowBack } from "react-icons/md";
import {AxiosError} from "axios";

const AdminUserCreate = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // 초기 상태
    const [formData, setFormData] = useState<CreateUserInput>({
        email: "",
        password: "",
        name: "",
        phone: "",
        birthdate: "",
        gender: "MALE",
        role: "USER",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 간단한 유효성 검사
        if (!formData.email || !formData.password || !formData.name) {
            alert("필수 정보를 입력해주세요.");
            return;
        }

        try {
            setIsLoading(true);
            await createUser(formData);
            alert("회원이 성공적으로 생성되었습니다.");
            navigate("/admin/user"); // 목록으로 이동
        } catch (error) {
            console.error("회원 생성 실패:", error);
            let message = "회원 생성 중 오류가 발생했습니다.";
            if (error instanceof AxiosError) message = error.response?.data?.message;
            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            {/* 헤더 */}
            <div className="flex items-center gap-4 mb-10 border-b border-black/10 pb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <MdArrowBack className="text-xl" />
                </button>
                <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-[#111]">
                    Create New Member
                </h1>
            </div>

            {/* 폼 영역 */}
            <form onSubmit={handleSubmit} className="space-y-8">

                {/* 섹션 1: 계정 정보 */}
                <div className="space-y-6">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                        Account Info
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent placeholder:text-gray-300"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Min. 8 characters"
                                className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent placeholder:text-gray-300"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* 섹션 2: 개인 정보 */}
                <div className="space-y-6">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                        Personal Info
                    </h2>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Hong Gil Dong"
                            className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent placeholder:text-gray-300"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="010-0000-0000"
                                className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent placeholder:text-gray-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Birthdate</label>
                            <input
                                type="date"
                                name="birthdate"
                                value={formData.birthdate}
                                onChange={handleChange}
                                className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent text-gray-600"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent"
                            >
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent"
                            >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 버튼 영역 */}
                <div className="pt-6 flex justify-end gap-4">
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
                        {isLoading ? "Creating..." : "Create Member"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminUserCreate;