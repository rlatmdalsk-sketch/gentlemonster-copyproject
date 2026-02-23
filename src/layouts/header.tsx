import { twMerge } from "tailwind-merge";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { LuUser, LuX, LuMenu } from "react-icons/lu";
import useAuthStore from "../stores/useAuthStore.ts";
import { Logo } from "../pages/components/Logo.tsx";
import { getCategories } from "../api/category.api.ts";
import SearchSlide from "../pages/components/SearchSlide.tsx";
import useCartStore from "../stores/useCartStore.ts";
import { LiaShoppingBagSolid } from "react-icons/lia";

export default function Header({ onLoginClick }: { onLoginClick: () => void }) {
    const [categories, setCategories] = useState<any[]>([]);
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
    const [menuPositions, setMenuPositions] = useState<{ [key: string]: number }>({});
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
    const location = useLocation();
    const { isLoggedIn } = useAuthStore();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { items: cartItems, clearCart, fetchCart } = useCartStore();

    const totalCount = isLoggedIn
        ? cartItems.reduce((acc, curr) => acc + (curr.quantity || 1), 0)
        : 0;

    useEffect(() => {
        if (isLoggedIn) fetchCart();
        else clearCart();
    }, [isLoggedIn, fetchCart, clearCart]);

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
                const rawData = Array.isArray(res) ? res : res.data;
                if (rawData) setCategories(rawData);
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
        setIsMobileMenuOpen(false);
        setExpandedMobile(null);
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
        if (isHome) window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleMenuHover = (menuName: string, event: React.MouseEvent<HTMLDivElement>) => {
        setHoveredMenu(menuName);
        const rect = event.currentTarget.getBoundingClientRect();
        setMenuPositions(prev => ({ ...prev, [menuName]: rect.left }));
    };

    const isVideoPassed = !isHome || isScrolled;

    const getFirstChildPath = (menu: any) => {
        const parentPath = menu.path.replace(/^\//, "");
        const isStoriesMenu = menu.name.includes("더 알아보기") || menu.path.includes("stories");
        if (isStoriesMenu) return "/stories";
        return menu.children?.length > 0
            ? `/category/${parentPath}/${menu.children[0].path.replace(/^\//, "")}`
            : fixPath(menu.path);
    };

    return (
        <>
            <div className="relative w-full">
                <SearchSlide isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

                <div
                    className={twMerge(
                        "fixed inset-0 z-[100] md:hidden transition-opacity duration-300",
                        isMobileMenuOpen
                            ? "opacity-100 pointer-events-auto "
                            : "opacity-0 pointer-events-none",
                    )}>
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    <div
                        className={twMerge(
                            "relative w-[75vw] max-w-[320px] h-full bg-white flex flex-col overflow-y-auto ",
                            "transition-transform duration-300 ease-in-out",
                            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
                        )}>
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 ">
                            <span className="text-[13px] font-semibold tracking-wide">MENU</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-1 hover:opacity-50 transition-opacity cursor-pointer">
                                <LuX className="text-[22px]  " />
                            </button>
                        </div>

                        <nav className="flex flex-col px-5 py-4 gap-1">
                            {displayMenu.map((menu, idx) => (
                                <div
                                    key={menu.id}
                                    className={twMerge(
                                        "transition-all duration-300 ",
                                        isMobileMenuOpen
                                            ? "opacity-100 translate-x-0"
                                            : "opacity-0 -translate-x-4",
                                    )}
                                    style={{
                                        transitionDelay: isMobileMenuOpen ? `${idx * 60}ms` : "0ms",
                                    }}>
                                    <button
                                        className="w-full flex items-center justify-between py-3 text-[14px] font-[500] text-left border-b border-gray-100 cursor-pointer"
                                        onClick={() =>
                                            setExpandedMobile(prev =>
                                                prev === menu.name ? null : menu.name,
                                            )
                                        }>
                                        {menu.name}
                                        <span
                                            className={twMerge(
                                                "text-gray-400 text-[10px] transition-transform duration-200",
                                                expandedMobile === menu.name
                                                    ? "rotate-180"
                                                    : "rotate-0",
                                            )}>
                                            ▼
                                        </span>
                                    </button>

                                    {/* 서브메뉴 아코디언 */}
                                    <div
                                        className={twMerge(
                                            "overflow-hidden transition-all duration-300 ease-in-out",
                                            expandedMobile === menu.name
                                                ? "max-h-[400px] opacity-100"
                                                : "max-h-0 opacity-0",
                                        )}>
                                        <div className="flex flex-col pl-3 py-2 gap-2">
                                            {menu.children?.map((subItem: any) => {
                                                const isStories =
                                                    menu.path.includes("stories") ||
                                                    subItem.path.includes("stories");
                                                const finalPath = isStories
                                                    ? "/stories"
                                                    : `/category/${menu.path.replace(/^\//, "")}/${subItem.path.replace(/^\//, "")}`;
                                                return (
                                                    <Link
                                                        key={subItem.id}
                                                        to={finalPath}
                                                        className="text-[13px] text-gray-500 hover:text-black transition-colors py-1">
                                                        {subItem.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </nav>
                    </div>
                </div>

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
                        <div className="relative flex items-center h-[60px] md:h-[90px] px-4 md:px-[60px] ">
                            <div className="flex-1 flex items-center h-full min-w-0">
                                <button
                                    className="md:hidden p-1 hover:opacity-50 transition-opacity"
                                    onClick={() => setIsMobileMenuOpen(prev => !prev)}>
                                    <span className="relative block w-6 h-6">
                                        <LuMenu
                                            className={twMerge(
                                                "absolute inset-0 text-[24px] transition-all duration-300",
                                                isMobileMenuOpen
                                                    ? "opacity-0 rotate-90 scale-50"
                                                    : "opacity-100 rotate-0 scale-100",
                                            )}
                                        />
                                        <LuX
                                            className={twMerge(
                                                "absolute inset-0 text-[24px] transition-all duration-300",
                                                isMobileMenuOpen
                                                    ? "opacity-100 rotate-0 scale-100"
                                                    : "opacity-0 -rotate-90 scale-50",
                                            )}
                                        />
                                    </span>
                                </button>

                                <nav className="hidden md:flex gap-5 lg:gap-7 h-full items-center cursor-pointer">
                                    {displayMenu.map(menu => (
                                        <div
                                            key={menu.id}
                                            onMouseEnter={e => handleMenuHover(menu.name, e)}
                                            className="relative h-full flex items-center cursor-pointer">
                                            <Link
                                                to={getFirstChildPath(menu)}
                                                className="text-[13px] font-[450] whitespace-nowrap cursor-pointer">
                                                {menu.name}
                                            </Link>
                                        </div>
                                    ))}
                                </nav>
                            </div>

                            <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none flex items-center ">
                                <Link
                                    to="/"
                                    onClick={handleLogoClick}
                                    className={twMerge(
                                        "pointer-events-auto w-[130px] md:w-[240px] sm:ml-20 md:ml-30  xl:ml-0 lg:w-[305px] transition-all duration-300 hover:opacity-70",
                                        logoColorClass,
                                    )}>
                                    <Logo className="w-full h-auto" />
                                </Link>
                            </div>

                            <div className="flex gap-1.5 md:gap-3 items-center shrink-0">
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="p-1 hover:opacity-50 transition-opacity cursor-pointer">
                                    <IoIosSearch className="text-[20px] md:text-[25px]" />
                                </button>

                                {isLoggedIn ? (
                                    <Link
                                        to="/myaccount"
                                        className="p-1 hover:opacity-50 transition-opacity">
                                        <LuUser className="text-[18px] md:text-[24px]" />
                                    </Link>
                                ) : (
                                    <button
                                        onClick={e => {
                                            e.preventDefault();
                                            onLoginClick();
                                        }}
                                        className="p-1 hover:opacity-50 transition-opacity cursor-pointer">
                                        <LuUser className="text-[20px] md:text-[25px]" />
                                    </button>
                                )}

                                <Link
                                    to="/shoppingBag"
                                    onClick={handleCartClick}
                                    className="p-1 hover:opacity-50 transition-opacity relative flex items-center justify-center">
                                    <LiaShoppingBagSolid className="text-[20px] md:text-[25px]" />
                                    {totalCount > 0 && (
                                        <span
                                            className={twMerge(
                                                "absolute pt-1 md:pt-1.5 text-[8px] md:text-[10px] font-[450] leading-none",
                                                !isHome || isScrolled ? "text-black" : "text-white",
                                            )}>
                                            {totalCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>

                        <div
                            className={twMerge(
                                "hidden md:block overflow-hidden transition-all duration-500 ",
                                hoveredMenu ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0",
                            )}>
                            <div className="py-2 px-[10px]">
                                {displayMenu.map(menu => (
                                    <div
                                        key={menu.id}
                                        className={twMerge(
                                            "flex flex-col gap-3",
                                            hoveredMenu === menu.name
                                                ? "opacity-100"
                                                : "opacity-0 hidden",
                                        )}
                                        style={{
                                            marginLeft: `${menuPositions[menu.name] || 0}px`,
                                        }}>
                                        {menu.children?.map((subItem: any) => {
                                            const isStories =
                                                menu.path.includes("stories") ||
                                                subItem.path.includes("stories");
                                            const finalPath = isStories
                                                ? "/stories"
                                                : `/category/${menu.path.replace(/^\//, "")}/${subItem.path.replace(/^\//, "")}`;
                                            return (
                                                <Link
                                                    key={subItem.id}
                                                    to={finalPath}
                                                    className={twMerge(
                                                        "text-[12.5px] font-[500] hover:opacity-70 whitespace-nowrap",
                                                        isVideoPassed ? "text-black" : "text-white",
                                                    )}>
                                                    {subItem.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {!isHome && <div className="h-[60px] md:h-[90px] w-full" />}
                </div>
            </div>
        </>
    );
}
