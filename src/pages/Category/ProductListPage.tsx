import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { CATEGORY_DATA } from "../components/CATEGORY_DATA.tsx";
import { fetchProducts } from "../../api/product.api.ts";
import type { Product } from "../../types/product.ts";
import ProductCard from "./ProductCard.tsx";


const ProductListPage = () => {
    const { category, id } = useParams<{ category: string; id: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const categoryGroup = category ? CATEGORY_DATA[category as keyof typeof CATEGORY_DATA] : null;
    const currentCategory = categoryGroup && id ? categoryGroup[id.replace(/^\//, "")] : null;

    useEffect(() => {
        const loadData = async () => {
            if (!currentCategory) return;
            try {
                setLoading(true);
                // 🌟 관리자 리스트처럼 API 호출
                const response = await fetchProducts({
                    page: 1,
                    limit: 50, // 넉넉하게 가져옴
                    sort: "latest"
                });

                // 현재 카테고리에 맞는 상품만 맵 돌리기 위해 필터
                const filtered = response.data.filter((p: Product) =>
                    p.category?.path?.includes(id || "")
                );

                setProducts(filtered);
            } catch (error) {
                console.error("데이터 로드 실패", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, currentCategory]);

    if (!currentCategory) return <div className="pt-40 text-center">데이터 없음</div>;

    const isCollection = "image" in currentCategory;

    return (
        <main className="relative w-full min-h-screen">
            {/* 상단 Hero (기존과 동일) */}
            {isCollection ? (
                <section className="relative w-full h-screen">
                    <img src={(currentCategory as any).image} className="w-full h-full object-cover" alt="hero" />
                    <div className="absolute inset-0 bg-black/10 flex flex-col justify-end pb-24 px-10">
                        <h2 className="text-white text-[24px] font-bold uppercase">{currentCategory.title}</h2>
                        <p className="text-white text-[12px] opacity-90">{currentCategory.description}</p>
                    </div>
                </section>
            ) : (
                <section className="pt-24 pb-12 text-center">
                    <h2 className="text-[18px] font-bold uppercase tracking-widest">{currentCategory.title}</h2>
                    <p className="text-[11px] text-gray-500 mt-4">{currentCategory.description}</p>
                </section>
            )}

            {/* 🌟 맵 돌리는 구간 */}
            <div className={twMerge("px-10 pb-20", isCollection ? "pt-20" : "pt-10")}>
                {loading ? (
                    <div className="text-center py-20 text-xs text-gray-400 uppercase tracking-widest">Loading...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-16">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default ProductListPage;