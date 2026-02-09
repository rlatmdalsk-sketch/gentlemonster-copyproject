import { Link, useParams, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { getCategories } from "../../api/category.api.ts";

const ProductListHeader = () => {
    const params = useParams();
    const location = useLocation();
    const [currentSubMenus, setCurrentSubMenus] = useState<any[]>([]);

    const pathSegments = location.pathname.split("/").filter(Boolean);
    const urlParent = params.parentCategory || pathSegments[1];
    const urlSub = params.subCategory || pathSegments[2];

    useEffect(() => {
        const fetchAndFilter = async () => {
            try {
                const res = await getCategories();
                const rawData = Array.isArray(res) ? res : res.data;

                if (rawData && urlParent) {
                    const parent = rawData.find(
                        (cat: any) =>
                            cat.path.replace(/^\//, "").toLowerCase() === urlParent.toLowerCase(),
                    );

                    if (parent && parent.children) {
                        setCurrentSubMenus(parent.children);
                    }
                }
            } catch (error) {
                console.error("메뉴 로드 실패", error);
            }
        };
        fetchAndFilter();
    }, [urlParent]);

    if (currentSubMenus.length === 0) return null;

    return (
        <div className="z-40  ">
            <div className="max-w-[1600px] pl-[50px] mt-2 pr-[10px] h-[55px] flex items-center">
                <nav className="flex gap-3 h-full">
                    {currentSubMenus.map(sub => {
                        const subPath = sub.path.replace(/^\//, "");
                        const isActive = urlSub === subPath;

                        return (
                            <Link
                                key={sub.id}
                                to={`/category/${urlParent}/${subPath}`}
                                className={twMerge(
                                    "text-[12px]",
                                    "tracking-tight",
                                    "text-[#858585]",
                                    "relative",
                                    "h-[30px]",
                                    "flex",
                                    "items-center",
                                    "border",
                                    "border-[#dfe3e8]",
                                    "px-[12px]",
                                    "py-[7px]",
                                    "rounded-[35px]",
                                    isActive
                                        ? "text-[#111]  font-[700] bg-[#dfe3e8]"
                                        : ' text-[#858585] hover:bg-[#dfe3e8] transition duration-300',
                                )}>
                                {sub.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default ProductListHeader;
