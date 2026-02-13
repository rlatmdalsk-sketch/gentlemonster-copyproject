import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserDetail, updateUser } from "../../../api/admin.user.api";
import type { UpdateUserInput } from "../../../types/admin.user";
import { MdArrowBack } from "react-icons/md";
import {AxiosError} from "axios";

const AdminUserEdit = () => {
    const { id } = useParams<{ id: string }>(); // URL에서 ID 추출
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const [formData, setFormData] = useState<UpdateUserInput>({
        email: "",
        password: "",
        name: "",
        phone: "",
        birthdate: "",
        gender: "MALE",
        role: "USER",
    });

    useEffect(() => {
        const loadUser = async () => {
            if (!id) return;
            try {
                setIsFetching(true);
                const user = await fetchUserDetail(Number(id));
                setFormData({
                    email: user.email,
                    password: "", // 보안상 기존 비번은 불러오지 않음
                    name: user.name,
                    phone: user.phone,
                    birthdate: user.birthdate,
                    gender: user.gender as "MALE" | "FEMALE",
                    role: user.role as "USER" | "ADMIN",
                });
            } catch (error) {
                console.error("회원 정보 로딩 실패:", error);
                alert("회원 정보를 불러올 수 없습니다.");
                navigate("/admin/user");
            } finally {
                setIsFetching(false);
            }
        };
        loadUser();
    }, [id, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) return;

        try {
            setIsLoading(true);

            const submitData = { ...formData };
            if (!submitData.password) {
                delete submitData.password;
            }

            await updateUser(Number(id), submitData);
            alert("회원 정보가 수정되었습니다.");
            navigate("/admin/user");
        } catch (error) {
            console.error("수정 실패:", error);
            let message = "수정 중 오류가 발생했습니다.";
            if (error instanceof AxiosError) message = error.response?.data.message;
            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="p-10 text-center text-xs tracking-widest text-gray-400">LOADING USER DATA...</div>;
    }

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
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-[#111]">
                        Edit Member
                    </h1>
                    <span className="text-[10px] text-gray-400 tracking-widest mt-1">ID: #{id}</span>
                </div>
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
                                className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent text-gray-600 cursor-not-allowed"
                                disabled // 이메일은 보통 변경 불가 처리 (필요시 해제)
                            />
                            <p className="text-[9px] text-gray-400">Email cannot be changed.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Leave blank to keep current"
                                className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent placeholder:text-gray-300"
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
                            className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent"
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
                                className="w-full border-b border-gray-300 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent"
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
                        {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminUserEdit;