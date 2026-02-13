import { Outlet } from "react-router";
import AdminSideBar from "./AdminSideBar.tsx";

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-[#F8F8F8] font-sans">
            <AdminSideBar />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="flex-1 px-8 overflow-y-auto">
                    <div className="w-full">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;