import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Header from "./header.tsx";
import Footer from "./footer.tsx";
import LoginDrawer from "../pages/components/LoginDrawer.tsx";
import useAuthStore from "../stores/useAuthStore.ts";
import useBookmarkStore from "../stores/useBookMarkStore.ts";
import Notification from "../pages/components/Notification.tsx";

function Layout() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const { fetchBookmarks } = useBookmarkStore();
    const { isLoggedIn } = useAuthStore();

    useEffect(() => {
        if (isLoggedIn) {
            fetchBookmarks();
        }
    }, [isLoggedIn, fetchBookmarks]);

    return (
        <div className="relative flex flex-col min-h-screen">
            {/* Header에 함수 전달 */}
            <Notification />
            <Header onLoginClick={() => setIsLoginOpen(true)} />

            <div className="flex-1">
                {/* context props로 함수 전달 */}
                <Outlet context={{ onLoginClick: () => setIsLoginOpen(true) }} />
            </div>

            <Footer />

            {/* 사이드바 배치 */}
            <LoginDrawer
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
            />
        </div>
    );
}

export default Layout;