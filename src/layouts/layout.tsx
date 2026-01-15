import {Outlet} from "react-router";
import Header from "./header.tsx";
import Footer from "./footer.tsx";

function layout() {
    return <>
    <div>
        <Header />
        <div>
            <Outlet />
        </div>
        <Footer />
    </div>
    </>
}

export default layout;