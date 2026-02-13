import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchProductDetail, fetchProducts } from "../../api/product.api.ts";
import type { Product } from "../../types/product";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { twMerge } from "tailwind-merge";
import useAuthStore from "../../stores/useAuthStore.ts";
import useCartStore from "../../stores/useCartStore.ts";
import { useOutletContext } from "react-router";
import Bookmark from "../components/Bookmark.tsx";
import useNotificationStore from "../../stores/useNotificationStore.ts";


const ProductDetailPage = () => {
    const { onLoginClick } = useOutletContext<{ onLoginClick: () => void }>();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuthStore();
    const { addItem } = useCartStore();
    const { show } = useNotificationStore();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);


    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const response = await fetchProductDetail(Number(id));
                const currentProduct = response.product;
                setProduct(currentProduct);

                const targetMaterial = currentProduct.material;

                if (targetMaterial) {
                    const productsResponse = await fetchProducts({ page: 1, limit: 100 });
                    const allProducts = Array.isArray(productsResponse)
                        ? productsResponse
                        : productsResponse.data || [];

                    const uniqueByName = new Map();

                    allProducts.forEach((p: Product) => {
                        if (p.name === currentProduct.name) return;

                        const pMaterial = p.material?.toString().trim().toLowerCase();
                        const tMaterial = targetMaterial.toString().trim().toLowerCase();

                        if (pMaterial === tMaterial && !uniqueByName.has(p.name)) {
                            uniqueByName.set(p.name, p);
                        }
                    });

                    setRelatedProducts(Array.from(uniqueByName.values()));
                }
            } catch (error) {
                console.error("데이터 로드 실패", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            onLoginClick();
            return;
        }

        if (!product) return;

        try {
            await addItem(Number(id), 1);

           /* if (window.confirm("장바구니에 상품을 담았습니다. 장바구니로 이동하시겠습니까?")) {
                navigate("/shoppingBag");
            }*/
            show(product.name, {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0]?.url,
                isCart: true
            });

        } catch (e) {
            console.error(e);
            alert("장바구니 담기에 실패했습니다.");
        }
    };

    const toggleAccordion = (section: string) => {
        setOpenAccordion(prev => (prev === section ? null : section));
    };

    if (loading)
        return (
            <div className="pt-60 text-center text-[10px] tracking-widest animate-pulse">
                LOADING...
            </div>
        );
    if (!product) return <div className="pt-60 text-center text-[10px]">PRODUCT NOT FOUND</div>;


    return (
        <>
            <div className="flex flex-col md:flex-row w-full min-h-screen">
                {/* 좌측: 이미지 상세탭 */}
                <div className="w-full md:w-[70%] lg:w-[75%] flex flex-col">
                    {product.images?.map((img, index) => (
                        <div
                            key={index}
                            className="w-full h-[60vh] md:h-screen overflow-hidden flex justify-center items-center">
                            <img
                                src={img.url}
                                alt={`${product.name}-${index}`}
                                className="w-full h-full object-contain scale-[1.5] translate-x-[15%] translate-y-[-10%] "
                            />
                        </div>
                    ))}
                </div>

                {/* 우측: 상품 정보탭 */}
                <div className="w-full md:w-[30%] lg:w-[25%] px-8 md:px-12 py-20 md:sticky md:top-0 md:h-screen flex flex-col justify-start md:justify-center overflow-y-auto">
                    <div className="max-w-[340px] w-full ml-auto">
                        <div className="flex justify-between items-start mb-1">
                            <h1 className="text-[16px] font-medium tracking-tight text-[#111]">
                                {product.name}
                            </h1>
                            <Bookmark
                                key={product.id}
                                productId={product.id}
                                productName={product.name}
                                allProducts={[product]}
                            />
                        </div>

                        <p className="text-[13px] font-normal text-[#111] mb-6">
                            ₩{product.price?.toLocaleString("ko-KR")}
                        </p>

                        <button
                            className="w-full bg-black text-white py-4 text-[12px] font-bold rounded-[11px] mb-5 tracking-tight hover:bg-[#333] transition-colors cursor-pointer"
                            onClick={handleAddToCart}>
                            쇼핑백에 추가하기
                        </button>

                        <div className="space-y-0 border-t border-gray-200">
                            {/* 무료 배송 & 반품 */}
                            <div className="border-b border-gray-200">
                                <button
                                    onClick={() => toggleAccordion("shipping")}
                                    className="w-full flex justify-between font-[550] items-center py-5 text-[13px] text-[#111] cursor-pointer">
                                    <span>무료 배송 & 반품</span>
                                    <span
                                        className={`text-xl transition-transform duration-300 ${openAccordion === "shipping" ? "rotate-45" : ""}`}>
                                        +
                                    </span>
                                </button>
                                {/* Grid Transition 적용 */}
                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${
                                        openAccordion === "shipping"
                                            ? "grid-rows-[1fr] opacity-100"
                                            : "grid-rows-[0fr] opacity-0"
                                    }`}>
                                    <div className="overflow-hidden">
                                        <div className="pb-6 text-[12px] font-[550] leading-relaxed">
                                            <p>
                                                젠틀몬스터 공식 온라인 스토어는 무료 배송 및 반품
                                                서비스를 제공합니다. 반품은 제품을 수령하신 날로부터 7일
                                                이내에 접수해 주셔야 합니다. 제품은 사용되지 않은
                                                상태여야 하며, 모든 구성품을 포함하고 있어야 합니다.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 세부 정보 */}
                            <div className="border-b border-gray-200">
                                <button
                                    onClick={() => toggleAccordion("details")}
                                    className="w-full flex justify-between items-center py-5 text-[13px] font-[550] text-[#111] cursor-pointer">
                                    <span>세부 정보</span>
                                    <span
                                        className={`text-xl transition-transform duration-300 ${openAccordion === "details" ? "rotate-45" : ""}`}>
                                        +
                                    </span>
                                </button>
                                {/* Grid Transition 적용 */}
                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${
                                        openAccordion === "details"
                                            ? "grid-rows-[1fr] opacity-100"
                                            : "grid-rows-[0fr] opacity-0"
                                    }`}>
                                    <div className="overflow-hidden">
                                        <div className="pb-6 text-[12px] flex flex-col leading-relaxed font-[550] space-y-1">
                                            <p className="pb-4 font-medium">{product.summary}</p>
                                            <p>{product.collection}</p>
                                            <p>{product.material}</p>
                                            <p>{product.lens}</p>
                                            <p>{product.Shape}</p>
                                            <p>{product.originCountry}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 사이즈 및 핏 */}
                            <div className="border-b border-gray-200">
                                <button
                                    onClick={() => toggleAccordion("size")}
                                    className="w-full flex justify-between items-center py-5 text-[13px] font-[550] text-[#111] cursor-pointer">
                                    <span>사이즈 및 핏</span>
                                    <span
                                        className={`text-xl transition-transform duration-300 ${openAccordion === "size" ? "rotate-45" : ""}`}>
                                        +
                                    </span>
                                </button>
                                {/* Grid Transition 적용 */}
                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${
                                        openAccordion === "size"
                                            ? "grid-rows-[1fr] opacity-100"
                                            : "grid-rows-[0fr] opacity-0"
                                    }`}>
                                    <div className="overflow-hidden">
                                        <div className="pb-6 text-[12px] leading-relaxed font-[550]">
                                            <p>{product.sizeInfo || "사이즈 정보가 없습니다."}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full ">
                {/* 헤더: BestSeller와 동일한 패딩 및 폰트 설정 */}
                <div className={twMerge("pt-[55px]", "px-[50px]", "w-full")}>
                    <p className={twMerge("text-[#111]", "text-[17px]", "font-[550]")}>
                        유사한 프레임
                    </p>
                </div>

                <div className="w-full">
                    {relatedProducts.length > 0 ? (
                        <Swiper
                            modules={[FreeMode]}
                            slidesPerView={4.5}
                            spaceBetween={25}
                            grabCursor={true}
                            freeMode={{
                                enabled: true,
                                sticky: true,
                                momentum: false,
                            }}
                            speed={800}
                            breakpoints={{
                                768: { slidesPerView: 4.5 },
                                1024: { slidesPerView: 4.5 },
                                1440: { slidesPerView: 4.5 },
                            }}
                            className="w-full h-[663px]">
                            {relatedProducts.map(item => (
                                <SwiperSlide key={item.id}>
                                    <Link
                                        to={`/product/${item.id}`}
                                        className="block w-full h-full">
                                        {/* justify-between을 제거하여 요소들이 위에서부터 차례대로 쌓이게 합니다 */}
                                        <div className="w-full h-full flex flex-col ml-10">
                                            {/* 이미지 영역: 높이를 고정하거나 비율을 조정하여 텍스트가 올라올 공간을 줍니다 */}
                                            <div className="w-full h-[500px] overflow-hidden relative">
                                                <img
                                                    src={item.images?.[0]?.url}
                                                    alt={item.name}
                                                    className="w-full h-[150%] object-cover"
                                                    style={{ transform: "translateY(-160px)" }}
                                                />
                                            </div>

                                            <div className="mt-4 text-[11px] leading-relaxed w-full px-[50px] text-left text-black">
                                                <p className="font-bold">{item.name}</p>
                                                <p>₩{item.price?.toLocaleString("ko-KR")}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="text-center py-20 text-[10px] text-gray-400 uppercase tracking-widest">
                            유사한 상품이 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductDetailPage;
