import { twMerge } from "tailwind-merge";
import { Link } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore.ts";

function ProfileHeader() {
    // 🌟 Hook(useAuthStore)은 반드시 컴포넌트 함수 내부에서 호출해야 합니다.
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        window.location.href = "/";
    };

    return (
        <>
            <div className={twMerge("ml-[60px]", "mt-5", "flex", "justify-between")}>
                <div className={twMerge("flex", "gap-2")}>
                    <Link to={"/myaccount"}>
                        <button
                            className={twMerge(
                                "border cursor-pointer text-[12px] px-[11px] py-[7px] text-[#858585] bg-none rounded-[20px] border-[#dfe3e8] hover:bg-[#DFE3E8] hover:text-[#111] transition-colors"
                            )}
                        >
                            계정
                        </button>
                    </Link>
                    <Link to={"/myaccount/orderList"}>
                        <button
                            className={twMerge(
                                "border cursor-pointer text-[12px] px-[11px] py-[7px] text-[#858585] bg-none rounded-[20px] border-[#dfe3e8] hover:bg-[#DFE3E8] hover:text-[#111] transition-colors"
                            )}
                        >
                        구매한 제품
                        </button>
                    </Link>
                </div>

                <button
                    onClick={handleLogout}
                    className={twMerge("text-[13px]", "px-[11px]", "py-[7px]", "font-semibold", "mr-[60px]")}
                >
                    로그아웃
                </button>
            </div>
        </>
    );
}

export default ProfileHeader;