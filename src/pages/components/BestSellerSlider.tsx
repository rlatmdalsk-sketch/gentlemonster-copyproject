import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from "swiper/modules";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../api/product.api.ts";
import { getCategories } from "../../api/category.api.ts";
import type { Product } from "../../types/product.ts";

function BestSellerSlider() {
    const [bestProducts, setBestProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const categories = await getCategories();

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

                const categoryData = Array.isArray(categories) ? categories : (categories as any).data;
                const bestCategory = findBestCategory(categoryData || []);

                if (bestCategory) {
                    const targetCategoryId = bestCategory.id;
                    const productsResponse = await fetchProducts({ page: 1, limit: 100 });
                    const allProducts = Array.isArray(productsResponse)
                        ? productsResponse
                        : (productsResponse.data || []);

                    const filtered = allProducts.filter((p: Product) =>
                        String(p.categoryId) === String(targetCategoryId)
                    );

                    setBestProducts(filtered);
                }
            } catch (error) {
                // Error handled silently
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="text-center py-20 text-[10px]">LOADING...</div>;

    return (
        <div className="w-full">
            <section className="w-full">
                {bestProducts.length > 0 ? (
                    <Swiper
                        modules={[FreeMode]}
                        slidesPerView={4.2}
                        spaceBetween={10}
                        loop={true}
                        grabCursor={true}
                        freeMode={{ enabled: true, sticky: true, momentum: false }}
                        speed={800}
                        className="w-full h-[550px]"
                    >
                        {bestProducts.map((item) => (
                            <SwiperSlide key={item.id}>
                                <Link to={`/product/${item.id}`} className="block w-full h-full">
                                    <div className="w-full h-full flex flex-col pt-10">
                                        <div className="w-full h-[75%] overflow-hidden relative">
                                            <img
                                                src={item.images?.[0]?.url}
                                                alt={item.name}
                                                className="w-full h-full object-contain scale-200"
                                            />
                                        </div>

                                        <div className="mt-4 px-4 ml-[50px] text-[11px] leading-tight text-black text-left flex justify-between items-start">
                                            <div>
                                                <p className="font-bold mb-1 uppercase tracking-tighter">{item.name}</p>
                                                <p className="text-gray-600">₩{item.price?.toLocaleString()}</p>
                                            </div>
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