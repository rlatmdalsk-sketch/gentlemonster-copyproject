import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../../stores/useAuthStore";
import type { UserData } from "../../types/admin";
import {fetchAllUsers} from "../../api/admin.api.ts";

export default function Dashboard() {
    const navigate = useNavigate();

    const { user: adminInfo } = useAuthStore();

    const [userList, setUserList] = useState<UserData[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);

    // 기본 날짜 포맷 함수
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric', month: '2-digit', day: '2-digit'
        }).replace(/\. /g, '.').replace('.', '');
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const result = await fetchAllUsers(1);

                const actualData = result.data || [];
                const total = result.pagination?.totalUsers || 0;

                setUserList(actualData);
                setTotalUsers(total);
            } catch (error) {
                console.error("대시보드 데이터 로드 실패:", error);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    if (loading) return (
        <div className="min-h-screen  flex items-center justify-center tracking-[0.2em] text-[10px] uppercase">
            Loading...
        </div>
    );

    return (
        <div className="min-h-screen  flex font-sans text-black">

            <main className="flex-1 p-12 space-y-12">
                <div className="flex justify-between items-end border-b border-black pb-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tighter uppercase font-serif">Admin Overview</h1>
                        <p className="text-[10px] text-gray-400 font-mono italic">
                            {new Date().toLocaleDateString('ko-KR')}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[11px] font-bold uppercase tracking-widest">{adminInfo?.name} 관리자</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{adminInfo?.email}</p>
                        </div>
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-[10px] border border-black/10">
                            {adminInfo?.name?.[0] || "A"}
                        </div>
                    </div>
                </div>

                {/* 통계 지표: pagination.totalUsers 반영 */}
                <div className="grid grid-cols-2 gap-8">
                    <div className="bg-white p-10 border border-black/5 flex justify-between items-center group hover:border-black transition-all">
                        <div className="space-y-2">
                            <p className="text-[11px] text-gray-400 font-bold tracking-widest uppercase font-sans">Total Members</p>
                            <h3 className="text-5xl font-light tracking-tighter italic">
                                {totalUsers.toLocaleString()} <span className="text-sm font-normal not-italic tracking-normal">명</span>
                            </h3>
                        </div>
                        <div className="text-3xl opacity-20 group-hover:opacity-100 transition-opacity">👤</div>
                    </div>

                    <div className="bg-white p-10 border border-black/5 flex justify-between items-center group hover:border-black transition-all">
                        <div className="space-y-2">
                            <p className="text-[11px] text-gray-400 font-bold tracking-widest uppercase">System Status</p>
                            <h3 className="text-5xl font-light tracking-tighter uppercase text-green-600 italic">Stable</h3>
                        </div>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-100"></div>
                    </div>
                </div>

                {/* 최근 가입 회원 리스트: API의 data 배열 사용 */}
                <section className="space-y-6">
                    <div className="flex justify-between items-baseline border-b border-black/10 pb-2">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Recently Joined</h3>
                        <button
                            onClick={() => navigate("/admin/user")}
                            className="text-[10px] text-gray-400 hover:text-black uppercase underline underline-offset-4 tracking-widest cursor-pointer"
                        >
                            View All
                        </button>
                    </div>

                    <div className="grid gap-px bg-black/5 border border-black/5 overflow-hidden">
                        {userList.length > 0 ? (
                            userList.slice(0, 5).map((user, idx) => (
                                <div key={user.id} className="bg-white p-5 flex items-center justify-between hover:bg-black hover:text-white transition-all group">
                                    <div className="flex items-center gap-6">
                                        <span className="text-[10px] font-mono text-gray-300 group-hover:text-white/30 italic">0{idx + 1}</span>
                                        <div>
                                            {/* nickname 대신 name 필드 사용 */}
                                            <p className="text-xs font-bold uppercase tracking-tight">{user.name}</p>
                                            <p className="text-[10px] text-gray-400 group-hover:text-gray-200 font-mono tracking-tighter">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right hidden md:block">
                                            <p className="text-[9px] text-gray-400 uppercase tracking-tighter group-hover:text-gray-300">{user.phone}</p>
                                        </div>
                                        <div className="text-[10px] font-mono opacity-40 uppercase transition-opacity">
                                            {formatDate(user.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white p-20 text-center text-[10px] text-gray-400 uppercase tracking-widest">
                                No Member Data Found
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}