import { createBrowserRouter, redirect } from "react-router"; // react-router 7/v6.4+ 기준
import Layout from "../layouts/layout.tsx";
import Home from "../pages/Home.tsx";
import Register from "../pages/auth/register.tsx";
import Stories from "../pages/Category/stories/stories.tsx";
import MyAccount from "../pages/auth/myaccount.tsx";
import ProfileEdit from "../pages/auth/profileEdit.tsx";
import ProductListPage from "../pages/Category/ProductListPage.tsx";
import Dashboard from "../pages/Admin/Dashboard.tsx";
import useAuthStore from "../stores/useAuthStore.ts";
import AdminLayout from "../layouts/AdminLayout.tsx";
import AdminUserList from "../pages/Admin/users/AdminUserList.tsx";
import AdminUserCreate from "../pages/Admin/users/AdminUserCreate.tsx";
import AdminUserEdit from "../pages/Admin/users/AdminUserEdit.tsx";
import AdminCategoryList from "../pages/Admin/categories/AdminCategoryList.tsx";
import AdminProductCreate from "../pages/Admin/product/AdminProductCreate.tsx";
import AdminProductList from "../pages/Admin/product/AdminProductList.tsx";
import AdminProductEdit from "../pages/Admin/product/AdminProductEdit.tsx";
import ProductDetail from "../pages/Category/ProducDetail.tsx";
import ShoppingBag from "../pages/Cart/shoppingBag.tsx";
import ProfileLayout from "../layouts/ProfileLayout.tsx";
import OrderList from "../pages/auth/orderList.tsx";
import OrderPage from "../pages/Cart/orderPage.tsx";
import OrderSuccessPage from "../pages/Cart/orderSuccessPage.tsx";
import OrderFailPage from "../pages/Cart/orderFailPage.tsx";
import OrderDetail from "../pages/auth/orderDetail.tsx";
import Search from "../pages/Search.tsx"; //

export const adminOnlyLoader = () => {
    const { isLoggedIn, user } = useAuthStore.getState();
    if (!isLoggedIn) {
        alert("관리자 로그인이 필요합니다.");
        return redirect("/"); // 비로그인 시 리다이렉트 추가
    }
    if (user?.role !== "ADMIN") {
        alert("접근 권한이 없습니다.");
        return redirect("/");
    }
    return null;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: "register", element: <Register /> },
            {
                path: "myaccount",
                element: <ProfileLayout />, // 여기에 ProfileHeader가 포함되어 있음
                children: [
                    { index: true, element: <MyAccount /> },
                    { path: "profileEdit", element: <ProfileEdit /> },
                    { path: "orderList", element: <OrderList /> },
                    { path: "orderDetail", element: <OrderDetail />},
                ],
            },

            { path: "category/:category", element: <ProductListPage /> },
            { path: "category/:category/:id", element: <ProductListPage /> },

            { path: "stories", element: <Stories /> },
            { path: "product/:id", element: <ProductDetail /> },

            { path: "shoppingBag", element: <ShoppingBag />},
            {
                path: "order",
                children: [
                    { index: true, element: <OrderPage /> },
                    { path: "success", element: <OrderSuccessPage /> },
                    { path: "fail", element: <OrderFailPage /> },
                ],
            },
            {path: "search/:keyword", element: <Search />}

        ],
    },


    {
        path: "/admin",
        loader: adminOnlyLoader,
        element: <AdminLayout />,
        children: [
            { index: true, element: <Dashboard /> },
            {
                path: "user",
                children: [
                    { index: true, element: <AdminUserList /> },
                    { path: "create", element: <AdminUserCreate /> },
                    { path: ":id", element: <AdminUserEdit /> },
                ],
            },
            { path: "category", children: [{ index: true, element: <AdminCategoryList /> }] },
            {
                path: "product",
                children: [
                    { index: true, element: <AdminProductList /> },
                    { path: "create", element: <AdminProductCreate /> },
                    { path: "edit/:id", element: <AdminProductEdit /> },
                ],
            },
        ],
    },
]);

export default router;