import { useEffect, useState } from "react";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface SearchSlideProps {
    isOpen: boolean;
    onClose: () => void;
}

function SearchSlide({ isOpen, onClose }: SearchSlideProps) {
    const location = useLocation();
    const navigate = useNavigate();

    const [isNavigating, setIsNavigating] = useState(false); // 페이지 이동 감지 (트랜지션 제어)
    const [searchKeyword, setSearchKeyword] = useState(""); // 검색어 입력값

    useEffect(() => {
        if (isOpen) {
            setIsNavigating(true);
            onClose();
            const timer = setTimeout(() => setIsNavigating(false), 500);
            return () => clearTimeout(timer);
        }

        if (!isOpen) {
            setSearchKeyword("");
        }
    }, [location.pathname]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = searchKeyword.trim();
        if (trimmed) {
            navigate(`/search/${encodeURIComponent(trimmed)}`);
        }
    };

    return (
        <div
            className={twMerge(
                "fixed top-0 left-0 w-full bg-white z-[100] transform border-b border-gray-100",
                // 페이지 이동 시에는 transition을 꺼서 즉시 사라지게 함
                isNavigating ? "transition-none" : "transition-all duration-500 ease-in-out",
                isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
            )}
        >
            <div className="max-w-[1200px] mx-auto px-6 py-20 relative">
                <button
                    onClick={onClose}
                    className="absolute top-8 right-6 text-3xl cursor-pointer text-gray-400 hover:text-black transition-colors"
                >
                    <IoCloseOutline />
                </button>

                <div className="flex flex-col items-center justify-center">
                    <form onSubmit={handleSearch} className="w-full max-w-[800px]">
                        <div className="relative border-b border-black pb-2 flex items-center">
                            <input
                                type="text"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                placeholder="검색어를 입력하세요"
                                className="w-full text-[24px] font-[450] outline-none placeholder:text-gray-200"
                                autoFocus={isOpen}
                            />
                            <button type="submit" className="p-2">
                                <IoSearchOutline className="text-2xl hover:opacity-50 transition-opacity cursor-pointer" />
                            </button>
                        </div>
                    </form>

                    {/* 추천 검색어 (Quick Links) */}
                    <div className="mt-10 flex gap-6 text-[12px] text-gray-400 uppercase tracking-widest">
                        <Link
                            to={`/category/collections/c-2026-collection`}
                            className="hover:text-black transition-colors"
                        >
                            #2026-COLLECTIONS
                        </Link>
                        <Link
                            to={`/category/collections/bestseller`}
                            className="hover:text-black transition-colors"
                        >
                            #Best Sellers
                        </Link>
                        <Link
                            to={`/stories`}
                            className="hover:text-black transition-colors"
                        >
                            #Stories
                        </Link>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div
                    className={twMerge(
                        "fixed top-full left-0 w-full h-screen bg-black/10 backdrop-blur-[2px]",
                        isNavigating ? "transition-none" : "transition-opacity duration-500"
                    )}
                    onClick={onClose}
                />
            )}
        </div>
    );
}

export default SearchSlide;