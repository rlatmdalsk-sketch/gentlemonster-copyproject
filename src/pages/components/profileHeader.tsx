import { twMerge } from "tailwind-merge";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore.ts";

function ProfileHeader() {
    const { logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("로그아웃 하시겠습니까?")) {
            logout();
            navigate(-1);
        }
    };

    const getButtonStyle = (path: string) => {
        const isActive = location.pathname === path;

        return twMerge(
            "border cursor-pointer text-[12px] px-[11px] py-[7px] rounded-[20px] transition-colors border-[#dfe3e8]",
            isActive
                ? "bg-[#DFE3E8] text-[#111]" // 현재 페이지일 때 (고정)
                : "text-[#858585] bg-none hover:bg-[#DFE3E8] hover:text-[#111]" // 평상시 + 호버
        );
    };

    return (
        <div className={twMerge("ml-[60px]","flex", "justify-between")}>
            <div className={twMerge("flex", "gap-3")}>
                <Link to="/myaccount">
                    <button className={getButtonStyle("/myaccount")}>
                        계정
                    </button>
                </Link>

                <Link to="/myaccount/orderList">
                    <button className={getButtonStyle("/myaccount/orderList")}>
                        구매한 제품
                    </button>
                </Link>

                <Link to="/myaccount/WishList">
                    <button className={getButtonStyle("/myaccount/WishList")}>
                        위시 리스트
                    </button>
                </Link>
                <Link to="/myaccount/profileEdit">
                    <button className={getButtonStyle("/myaccount/profileEdit")}>
                        프로필
                    </button>
                </Link>
            </div>

            <button
                onClick={handleLogout}
                className={twMerge(
                    "text-[13px]",
                    "px-[11px]",
                    "py-[7px]",
                    "font-semibold",
                    "mr-[60px]",
                    "cursor-pointer",
                    "hover:text-[#111] transition-colors text-[#858585]"
                )}
            >
                로그아웃
            </button>
        </div>
    );
}

export default ProfileHeader;