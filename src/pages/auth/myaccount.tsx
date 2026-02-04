import {Link, useNavigate} from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore.ts";
import {twMerge} from "tailwind-merge";

function MyAccount() {
    const navigate = useNavigate();

    // 🌟 수정 1: 스토어에서 user 객체와 logout 함수를 꺼냅니다.
    const {user, logout} = useAuthStore();

    const handleLogout = () => {
        logout();
        // 🌟 수정 2: 로그아웃 후 홈으로 보내면서 새로고침하고 싶다면:
        window.location.href = "/";
    };

    return (
        <>
           

            <div
                className={twMerge("flex", "flex-col", "items-start", "max-h-full", "mt-10", "gap-4", "max-w-[680px]", "m-auto")}>
                {/* 🌟 수정 3: user가 있을 때만 이름을 출력하도록 방어 코드를 넣는 것이 안전합니다. */}
                <h2 className={twMerge("text-[17px]", "font-[500]", "self-center")}>
                    {user ? `${user.name} 님, 안녕하세요` : "로그인이 필요합니다."}
                </h2>
                <div className={twMerge("w-full", "mt-10")}>
                    <div className={twMerge("flex", "justify-between", "w-full", "text-[12px]")}>
                        <p>프로필</p>
                    </div>
                    <p className={twMerge("text-[17px]", "text-[#111]", "font-[550]", "my-4")}>
                        {user?.name}<br/>
                        {user?.email}<br/>
                        {user?.phone}<br/>
                    </p>
                    <Link to={"/myaccount/profileEdit"}>
                        <button className={twMerge("border", "w-full", "p-[10px]", "mt-5", "text-[12px]", "rounded-lg","hover:cursor-pointer")}>
                            프로필 편집하기
                        </button>
                    </Link>

                </div>
            </div>
        </>
    );
}

export default MyAccount;