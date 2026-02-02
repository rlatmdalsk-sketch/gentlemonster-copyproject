import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from "swiper/modules";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../api/product.api.ts";
import { getCategories } from "../../api/category.api.ts"; // 🌟 전체 카테고리 가져오기로 변경
import type { Product } from "../../types/product.ts";

function BestSellerSlider() {
    const [bestProducts, setBestProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                console.group("🚀 베스트셀러 로드 디버깅");

                // 1. 전체 카테고리를 가져와서 '베스트셀러'라는 이름을 가진 카테고리 찾기
                const categories = await getCategories();
                console.log("1. 전체 카테고리 데이터:", categories);

                // 재귀적으로 자식까지 뒤져서 '베스트 셀러' 또는 '베스트셀러' 찾기
                const findBestCategory = (list: any[]): any => {
                    for (const cat of list) {
                        if (cat.name.replace(/\s/g, "") === "베스트셀러") return cat;
                        if (cat.children) {
                            const found = findBestCategory(cat.children);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                const bestCategory = findBestCategory(Array.isArray(categories) ? categories : (categories as any).data);
                console.log("2. 찾은 베스트셀러 카테고리 객체:", bestCategory);

                if (bestCategory) {
                    const targetCategoryId = bestCategory.id;

                    // 2. 전체 상품 가져오기
                    const productsResponse = await fetchProducts({ page: 1, limit: 100 });
                    const allProducts = Array.isArray(productsResponse)
                        ? productsResponse
                        : (productsResponse.data || []);

                    console.log("3. 전체 상품 수:", allProducts.length);

                    // 3. 필터링 (ID 매칭)
                    const filtered = allProducts.filter((p: Product) =>
                        String(p.categoryId) === String(targetCategoryId)
                    );

                    console.log("4. 필터링된 결과:", filtered.length);
                    setBestProducts(filtered);
                } else {
                    console.error("❌ '베스트셀러'라는 이름의 카테고리를 찾을 수 없습니다.");
                }

                console.groupEnd();
            } catch (error) {
                console.error("❌ 에러 발생:", error);
                console.groupEnd();
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="text-center py-20 text-[10px]">LOADING...</div>;

    return (
        <div className="w-full">
            <section className="w-full flex flex-col items-center">
                {bestProducts.length > 0 ? (
                    <Swiper
                        modules={[FreeMode]}
                        slidesPerView={5.5}
                        spaceBetween={25}
                        grabCursor={true}
                        freeMode={{ enabled: true, sticky: true, momentum: false }}
                        speed={800}
                        className="w-full h-[663px]"
                    >
                        {bestProducts.map((item) => (
                            <SwiperSlide key={item.id}>
                                <Link to={`/product/${item.id}`} className="block w-full h-full">
                                    <div className="w-full h-full flex flex-col justify-between ml-[50px]">
                                        <div className="w-full h-full overflow-hidden relative">
                                            <img
                                                src={item.images?.[0]?.url || item.image}
                                                alt={item.name}
                                                className="w-full h-[150%] object-cover"
                                                style={{transform: 'translateY(-160px)'}}
                                            />
                                        </div>
                                        <div className="p-6 text-[11px] leading-relaxed w-[85%] ml-auto text-black text-left">
                                            <p className="font-bold">{item.name}</p>
                                            <p>₩{item.price?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="py-20 text-center text-[10px] text-gray-400">
                        베스트셀러 상품이 없습니다.
                    </div>
                )}
            </section>
        </div>
    );
}

export default BestSellerSlider;