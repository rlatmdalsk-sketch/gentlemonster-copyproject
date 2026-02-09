import { Outlet, useOutletContext } from "react-router";
import ProfileHeader from "../pages/components/profileHeader.tsx";

const ProfileLayout = () => {
    const context = useOutletContext();

    return (
        <div>
            <ProfileHeader />
            <main>
                <Outlet context={context} />
            </main>
        </div>
    );
};

export default ProfileLayout;