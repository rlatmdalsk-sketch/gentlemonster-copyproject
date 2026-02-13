import { useEffect, useState } from "react";
import { MdEdit, MdDelete, MdSearch, MdChevronLeft, MdChevronRight, MdAdd} from "react-icons/md";
import { fetchUsers, deleteUser } from "../../../api/admin.user.api";
import type { User } from "../../../types/user";
import {useNavigate} from "react-router-dom";

const AdminUserList = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const loadUsers = async (page: number) => {
        try {
            setLoading(true);
            const data = await fetchUsers(page, limit);

            setUsers(data.data);
            setTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error("회원 목록 로딩 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId: number) => {
        if (window.confirm("정말로 이 회원을 삭제하시겠습니까?")) {
            try {
                await deleteUser(userId);
                alert("삭제되었습니다.");
                loadUsers(currentPage).then(() => {});
            } catch (error) {
                console.error("삭제 실패:", error);
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    useEffect(() => {
        loadUsers(currentPage).then(() => {});
    }, [currentPage]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end pb-4 border-b border-black/10">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-[0.15em] text-[#111]">
                        Member List
                    </h1>
                    <p className="text-xs text-gray-500 mt-2 tracking-wider uppercase">
                        Manage your registered users
                    </p>
                </div>

                <div className="flex items-center gap-2 border-b border-gray-300 pb-1 px-2 w-64">
                    <MdSearch className="text-gray-400 text-lg" />
                    <input
                        type="text"
                        placeholder="SEARCH EMAIL OR NAME"
                        className="bg-transparent border-none outline-none text-xs w-full placeholder:text-[10px] placeholder:tracking-wider"
                    />
                </div>

                <button
                    onClick={() => navigate("/admin/user/create")}
                    className="flex items-center gap-2 bg-[#111] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-black/80 transition-colors"
                >
                    <MdAdd className="text-sm" />
                    <span>Create</span>
                </button>
            </div>

            <div className="bg-white shadow-sm border border-gray-100">
                {loading ? (
                    <div className="p-10 text-center text-xs text-gray-400 tracking-widest">LOADING...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b border-gray-100">
                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-16">ID</th>
                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Info</th>
                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact</th>
                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined</th>
                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                                    <td className="p-4 text-xs font-medium text-gray-500">#{user.id}</td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-[#111]">{user.name}</span>
                                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">{user.gender || '-'} / {user.birthdate}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs text-gray-600 font-medium">
                                        <div className="flex flex-col gap-1">
                                            <span>{user.email}</span>
                                            <span className="text-[10px] text-gray-400">{user.phone}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                            <span className={`
                                                text-[9px] px-2 py-1 uppercase tracking-widest font-bold border
                                                ${user.role === 'ADMIN'
                                                ? 'border-black text-black bg-black/5'
                                                : 'border-gray-200 text-gray-500'}
                                            `}>
                                                {user.role}
                                            </span>
                                    </td>
                                    <td className="p-4 text-xs text-gray-400 tracking-wide font-mono">
                                        {formatDate(user.createdAt)}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {/* 수정 기능은 추후 구현 */}
                                            <button className="p-2 hover:bg-black hover:text-white rounded-full transition-colors text-gray-400"
                                            onClick={() => navigate(`/admin/user/${user.id}`)}>
                                                <MdEdit />
                                            </button>
                                            {/* 삭제 버튼 연결 */}
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 hover:bg-red-500 hover:text-white rounded-full transition-colors text-gray-400"
                                            >
                                                <MdDelete />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-end gap-2 pt-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-black hover:text-black disabled:opacity-30 disabled:hover:border-gray-200 transition-colors"
                >
                    <MdChevronLeft />
                </button>
                <div className="flex items-center gap-2 px-4 text-xs font-medium tracking-widest text-gray-500">
                    <span className="text-black">{currentPage}</span> / {totalPages}
                </div>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-black hover:text-black disabled:opacity-30 disabled:hover:border-gray-200 transition-colors"
                >
                    <MdChevronRight />
                </button>
            </div>
        </div>
    );
};

export default AdminUserList;