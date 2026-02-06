import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Product } from "../types/product.ts";
import { fetchProducts } from "../api/product.api.ts";
import { IoIosSearch } from "react-icons/io";
import ProductCard from "./Category/ProductCard.tsx";

function Search() {
    const { keyword } = useParams<{ keyword: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (keyword) {
            setSearchInput(decodeURIComponent(keyword));
        }
    }, [keyword]);

    useEffect(() => {
        const loadSearchResults = async () => {
            if (!keyword) return;

            try {
                setIsLoading(true);
                const decodedKeyword = decodeURIComponent(keyword);

                const res = await fetchProducts({
                    page: currentPage,
                    limit: 100,
                    keyword: decodedKeyword,
                });

                // 중복 제거 로직
                const uniqueProducts = res.data.reduce((acc: Product[], current: Product) => {
                    const isExist = acc.find(item => item.name === current.name);
                    if (!isExist) {
                        acc.push(current);
                    }
                    return acc;
                }, []);

                setProducts(uniqueProducts);
            } catch (error: any) {
                console.error("검색 실패", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSearchResults();
    }, [keyword, currentPage]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = searchInput.trim();
        if (trimmed) {
            navigate(`/search/${encodeURIComponent(trimmed)}`);
        }
    };

    if (isLoading)
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-[11px] tracking-[0.2em] text-black animate-pulse uppercase">
                    Searching...
                </div>
            </div>
        );

    return (
        <>
            <div className="max-w-[648px]  mt-20 mx-auto ">
                <form
                    className="flex border-b border-black items-center pb-2"
                    onSubmit={handleSearch}>
                    <IoIosSearch size={24} className="text-black" />
                    <input
                        type="text"
                        placeholder="검색어를 입력하세요"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        className="w-full text-[13x] font-[400] outline-none px-4 placeholder:text-gray-200"
                    />
                </form>
            </div>
            <div className="mx-auto px-10 mt-3">
                {products.length === 0 ? (
                    <div className="w-full py-40 text-center">
                        <p className="text-[13px] mb-3 font-medium text-gray-800 uppercase tracking-widest">
                            No results found.
                        </p>
                        <p className="text-[11px] text-gray-400 uppercase tracking-tighter">
                            Please try another keyword.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-16">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default Search;
