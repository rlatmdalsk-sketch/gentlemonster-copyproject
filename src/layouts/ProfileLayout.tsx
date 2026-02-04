
import { Outlet } from "react-router";
import ProfileHeader from "../pages/components/profileHeader.tsx";

const ProfileLayout = () => {
    return (
        <div>
            <ProfileHeader />
            <main>

                        <Outlet />
            </main>
        </div>
    );
};

export default ProfileLayout;