import { twMerge } from "tailwind-merge";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { RiShoppingBagLine } from "react-icons/ri";
import { LuUser } from "react-icons/lu";
import useAuthStore from "../stores/useAuthStore.ts";
import { Logo } from "../pages/components/Logo.tsx";
import { getCategories } from "../api/category.api.ts";
import SearchSlide from "../pages/components/SearchSlide.tsx";

export default function Header({ onLoginClick }: { onLoginClick: () => void }) {
    const [categories, setCategories] = useState<any[]>([]);
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
    const [menuPositions, setMenuPositions] = useState<{ [key: string]: number }>({});
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const { isLoggedIn } = useAuthStore();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const displayMenu = categories.length > 0 ? categories : [];

    const handleCartClick = (e: React.MouseEvent) => {
        if (!isLoggedIn) {
            e.preventDefault();
            onLoginClick();
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories();
                console.log("실제 데이터:", res);

                const rawData = Array.isArray(res) ? res : res.data;

                if (rawData) {
                    setCategories(rawData);
                }
            } catch (error) {
                console.error("메뉴 로드 실패", error);
            }
        };
        fetchCategories();
    }, []);

    const fixPath = (path: string) => (path.startsWith("/") ? path : `/${path}`);

    const isHome = location.pathname === "/" || location.pathname === "/home";

    const logoColorClass = !isHome || isScrolled ? "text-black" : "text-white";

    useEffect(() => {
        setHoveredMenu(null);
    }, [location.pathname]);

    useEffect(() => {
        if (!isHome) {
            setIsScrolled(false);
            return;
        }
        const handleScroll = () => {
            const triggerPoint = window.innerHeight * 0.8;
            setIsScrolled(window.scrollY >= triggerPoint);
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isHome]);

    const handleLogoClick = () => {
        if (isHome) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleMenuHover = (menuName: string, event: React.MouseEvent<HTMLDivElement>) => {
        setHoveredMenu(menuName);
        const rect = event.currentTarget.getBoundingClientRect();
        setMenuPositions(prev => ({ ...prev, [menuName]: rect.left }));
    };

    const isVideoPassed = !isHome || isScrolled;

    return (
        <>
            <div className="relative w-full">
                <SearchSlide
                    isOpen={isSearchOpen}
                    onClose={() => setIsSearchOpen(false)}
                />
                <div className="relative w-full">
                    <div
                        onMouseLeave={() => setHoveredMenu(null)}
                        className={twMerge(
                            "left-0 right-0 z-50 transition-all duration-300",
                            isHome ? "fixed" : "absolute",
                            !isHome
                                ? "bg-[#f2f3f5] text-black"
                                : isScrolled
                                    ? "bg-[#f2f3f5]/60 backdrop-blur-xl text-black"
                                    : "bg-transparent text-white",
                        )}>
                        <div className="grid grid-cols-3 items-center h-[90px] px-[60px]">
                            <nav className="flex gap-5 h-full items-center">
                                {displayMenu.map(menu => {
                                    const parentPath = menu.path.replace(/^\//, "");
                                    const firstChildPath = menu.children && menu.children.length > 0
                                        ? `/category/${parentPath}/${menu.children[0].path.replace(/^\//, "")}`
                                        : fixPath(menu.path);

                                    const isStoriesMenu = menu.name.includes("더 알아보기") || menu.path.includes("stories");
                                    const topMenuLink = isStoriesMenu ? "/stories" : firstChildPath;

                                    return (
                                        <div
                                            key={menu.id}
                                            onMouseEnter={e => handleMenuHover(menu.name, e)}
                                            className="relative h-full flex items-center cursor-pointer ">
                                            <Link to={topMenuLink} className="text-[14px] font-[550] ">
                                                {menu.name}
                                            </Link>
                                        </div>
                                    );
                                })}
                            </nav>

                            <div className="flex justify-center items-center">
                                <Link
                                    to="/"
                                    onClick={handleLogoClick}
                                    className={twMerge(
                                        "w-[280px] md:w-[305px] transition-all duration-300 hover:opacity-70",
                                        logoColorClass,
                                    )}>
                                    <Logo className="w-full h-auto" />
                                </Link>
                            </div>

                            <div className="flex gap-3 justify-end items-center">
                                <div className="flex items-center">
                                    <button
                                        onClick={() => setIsSearchOpen(true)}
                                        className="p-1 hover:opacity-50 transition-opacity cursor-pointer"
                                    >
                                        <IoIosSearch size={24} />
                                    </button>
                                </div>
                                {isLoggedIn ? (
                                    <Link to="/myaccount" className="p-1 hover:opacity-50 transition-opacity">
                                        <LuUser size={24} />
                                    </Link>
                                ) : (
                                    <button
                                        onClick={e => {
                                            e.preventDefault();
                                            onLoginClick();
                                        }}
                                        className="p-1 hover:opacity-50 transition-opacity">
                                        <LuUser size={24} />
                                    </button>
                                )}

                                <Link
                                    to="/shoppingBag"
                                    onClick={handleCartClick}
                                    className="p-1 hover:opacity-50 transition-opacity"
                                >
                                    <RiShoppingBagLine size={24} />
                                </Link>
                            </div>
                        </div>

                        <div
                            className={twMerge(
                                "overflow-hidden transition-all duration-500",
                                hoveredMenu ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0",
                            )}>
                            <div className="py-2 px-[10px]">
                                {displayMenu.map(menu => (
                                    <div
                                        key={menu.id}
                                        className={twMerge(
                                            "flex flex-col gap-3",
                                            hoveredMenu === menu.name ? "opacity-100" : "opacity-0 hidden",
                                        )}
                                        style={{ marginLeft: `${menuPositions[menu.name] || 0}px` }}>
                                        {menu.children?.map((subItem: any) => {
                                            const isStories = menu.path.includes("stories") || subItem.path.includes("stories");

                                            const finalPath = isStories
                                                ? "/stories"
                                                : `/category/${menu.path.replace(/^\//, "")}/${subItem.path.replace(/^\//, "")}`;

                                            return (
                                                <Link
                                                    key={subItem.id}
                                                    to={finalPath}
                                                    className={twMerge(
                                                        "text-[13px] font-[500] hover:opacity-70 whitespace-nowrap",
                                                        isVideoPassed ? "text-black" : "text-white"
                                                    )}
                                                >
                                                    {subItem.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {!isHome && <div className="h-[90px] mobile:h-[56px] w-full" />}
                </div>
            </div>
        </>
    );
}