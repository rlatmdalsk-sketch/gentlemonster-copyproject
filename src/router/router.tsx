import {createBrowserRouter} from "react-router";
import Layout from "../layouts/layout.tsx";
import Home from "../pages/Home.tsx";
import Register from "../pages/auth/register.tsx";
import Stories from "../pages/Category/stories/stories.tsx";
import MyAccount from "../pages/auth/myaccount.tsx";
import ProfileEdit from "../pages/auth/profileEdit.tsx";
import ProductListPage from "../pages/Category/ProductListPage.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {index: true, element: <Home/>}, /*메인홈*/
            {path: "/register", element: <Register/>},
            {path: "/myaccount", element: <MyAccount/>},
            {path: "/myaccount/ProfileEdit", element: <ProfileEdit/>},
            /* 선글라스 카테고리 */
            {path: "category/:category/:id", element: <ProductListPage/>},


            /*stoires 카테고리*/

            {path: "/stories", element: <Stories/>},

        ]

    }
])

export default router;