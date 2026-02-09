import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { CATEGORY_DATA } from "../components/CATEGORY_DATA.tsx";
import { getCategoryByPath } from "../../api/category.api.ts";
import { fetchProducts } from "../../api/product.api.ts";
import type { Product } from "../../types/product.ts";
import ProductCard from "./ProductCard.tsx";
import ProductListHero from "../ProdcutListHero.tsx";
import ProductListHeader from "../components/ProductListHeader.tsx";

const ProductListPage = () => {
    const { category, id } = useParams<{ category: string; id: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const categoryGroup = category ? CATEGORY_DATA[category as keyof typeof CATEGORY_DATA] : null;
    const currentCategory = categoryGroup && id ? categoryGroup[id.replace(/^\//, "")] : null;

    useEffect(() => {
        const loadData = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const categoryPath = id.startsWith('/') ? id.substring(1) : id;


                // 1. 카테고리 정보 가져오기
                const categoryResponse = await getCategoryByPath(categoryPath);

                const categoryId = categoryResponse.category?.id;

                if (!categoryId) {
                    setProducts([]);
                    return;
                }

                const productsResponse = await fetchProducts({
                    page: 1,
                    limit: 100,
                    sort: "latest"
                });

                const allProducts = productsResponse.data || productsResponse || [];
                const filtered = allProducts.filter((p: Product) => {
                    if (p.categoryId === categoryId) return true;

                    if (p.category?.path && p.category.path.includes(categoryPath)) return true;

                    return false;
                });

                setProducts(filtered);

            } catch (error: any) {
                setError(error.response?.data?.message || "상품을 불러오는데 실패했습니다.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (!currentCategory) {
        return (
            <div className="pt-40 text-center">
                <p className="text-xs uppercase tracking-widest text-gray-400">
                    Category not found
                </p>
            </div>
        );
    }

    return (
        <>
            <ProductListHeader />
        <main className="relative w-full min-h-screen">
            <ProductListHero currentCategory={currentCategory as any} />

            {/* 상품 리스트 */}
            <div className={twMerge(
                "px-10 pb-20",
                "image" in currentCategory ? "pt-0" : "pt-10"
            )}>
                {loading ? (
                    <div className="text-center py-20 text-xs uppercase tracking-widest text-gray-400 animate-pulse">
                        Loading...
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-xs uppercase tracking-widest text-red-400 mb-2">
                            {error}
                        </p>
                        <p className="text-[10px] text-gray-400">
                            콘솔에서 에러 로그를 확인해주세요
                        </p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-3">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                            Coming Soon
                        </p>
                        <p className="text-[10px] text-gray-300">
                            새로운 제품이 곧 출시됩니다
                        </p>
                    </div>
                )}
            </div>
        </main>
        </>
    );
};

export default ProductListPage;