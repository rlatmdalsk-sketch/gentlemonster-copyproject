import {
    MdDashboard,
    MdPeople,
    MdInventory,
    MdLogout,
    MdArrowForward,
    MdCategory,
} from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router";
import useAuthStore from "../stores/useAuthStore.ts";
import { twMerge } from "tailwind-merge";
import { AiOutlineProduct, AiOutlineSolution } from "react-icons/ai";
import AdminInquiryList from "../pages/Admin/inquiry/AdminInquiryList.tsx";

const AdminSideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const isActive = (path: string) => {
        if (path === "/admin") return location.pathname === "/admin";
        return location.pathname.startsWith(path);
    };

    const getMenuClass = (path: string) => {
        const baseClass =
            "flex items-center gap-3 p-3 rounded-sm cursor-pointer transition-all uppercase tracking-widest text-[11px]";
        return isActive(path)
            ? `${baseClass} bg-white text-black font-bold shadow-md`
            : `${baseClass} text-gray-500 hover:text-white hover:bg-white/5 font-medium`;
    };

    return (
        <aside className="w-64 bg-[#111111] text-white flex flex-col shrink-0 max-h-screen sticky top-0">
            <div className="p-8 text-white font-bold text-xl tracking-[0.2em] uppercase border-b border-white/5">
                Gentle Admin
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                <Link to="/admin" className="block text-decoration-none">
                    <div className={getMenuClass("/admin")}>
                        <MdDashboard className="text-xl" />
                        <span>대시보드</span>
                    </div>
                </Link>

                <Link to="/admin/user" className="block text-decoration-none">
                    <div className={getMenuClass("/admin/user")}>
                        <MdPeople className="text-xl" />
                        <span>회원 관리</span>
                    </div>
                </Link>

                <Link to={"/admin/category"} className={twMerge(["block", "text-decoration-none"])}>
                    <div className={getMenuClass("/admin/category")}>
                        <MdCategory className="text-xl" />
                        <span>카테고리 관리</span>
                    </div>
                </Link>

                <Link to="/admin/product" className="block text-decoration-none">
                    <div className={getMenuClass("/admin/product")}>
                        <MdInventory className="text-xl" />
                        <span>상품 관리</span>
                    </div>
                </Link>
                <Link to="/admin/orderpage" className="block text-decoration-none">
                    <div className={getMenuClass("/admin/orderpage")}>
                        <AiOutlineProduct className="text-xl" />
                        <span>주문 상태 관리</span>
                    </div>
                </Link>
                <Link to="/admin/inquiry" className="block text-decoration-none">
                    <div className={getMenuClass("/admin/inquiry")}>
                        <AiOutlineSolution className="text-xl" />
                        <span>문의 관리</span>
                    </div>
                </Link>
            </nav>

            <div className="p-8 border-t border-white/10 space-y-4">
                <Link to="/" className="block text-decoration-none">
                    <div className="flex items-center justify-between text-[10px] text-white hover:text-white cursor-pointer tracking-widest transition-colors uppercase font-bold">
                        메인 사이트 이동 <MdArrowForward className="text-sm" />
                    </div>
                </Link>

                <button
                    onClick={handleLogout}
                    className="w-full border-none bg-transparent p-0 flex items-center justify-between text-[10px] text-red-500/80 hover:text-red-500 cursor-pointer tracking-widest transition-colors uppercase font-bold focus:outline-none">
                    로그아웃 <MdLogout className="text-sm" />
                </button>
            </div>
        </aside>
    );
};

export default AdminSideBar;
