import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdBookmarkBorder, MdBookmark } from "react-icons/md";
import { fetchProductDetail } from "../../api/product.api.ts";
import type { Product } from "../../types/product";

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const response = await fetchProductDetail(Number(id));
                setProduct(response.product);
            } catch (error) {
                console.error("데이터 로드 실패", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const toggleAccordion = (section: string) => {
        setOpenAccordion(prev => prev === section ? null : section);
    };

    if (loading)
        return (
            <div className="pt-60 text-center text-[10px] tracking-widest animate-pulse">
                LOADING...
            </div>
        );
    if (!product) return <div className="pt-60 text-center text-[10px]">PRODUCT NOT FOUND</div>;

    return (
        <main className="flex flex-col md:flex-row w-full min-h-screen">
            {/* 좌측: 거대 이미지 영역 (스크롤) */}
            <div className="w-full md:w-[70%] lg:w-[75%]">
                {product.images?.map((img, index) => (
                    <div
                        key={index}
                        className="w-full bg-[#f9f9f9] flex justify-center items-center overflow-hidden">
                        <img
                            src={img.url}
                            alt={`${product.name}-${index}`}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                ))}
                <div className="py-10 flex justify-center text-gray-400">
                    <span className="text-2xl animate-bounce">↓</span>
                </div>
            </div>

            {/* 우측: 정보 고정 영역 */}
            <div className="w-full md:w-[30%] lg:w-[25%] px-8 md:px-12 py-20 md:sticky md:top-0 md:h-screen flex flex-col justify-start md:justify-center overflow-y-auto">
                <div className="max-w-[340px] w-full ml-auto">
                    {/* 상품명과 북마크 아이콘 */}
                    <div className="flex justify-between items-start mb-1">
                        <h1 className="text-[16px] font-medium tracking-tight text-[#111]">
                            {product.name}
                        </h1>
                        <button
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className="text-black hover:opacity-70 transition-opacity pt-1 flex-shrink-0">
                            {isBookmarked ? (
                                <MdBookmark className="text-xl" />
                            ) : (
                                <MdBookmarkBorder className="text-xl" />
                            )}
                        </button>
                    </div>

                    {/* 가격 */}
                    <p className="text-[13px] font-normal text-[#111] mb-6">
                        ₩{product.price?.toLocaleString("ko-KR")}
                    </p>

                    {/* 쇼핑백 버튼 */}
                    <button className="w-full bg-black text-white py-4 text-[12px] font-bold hover:bg-[#333] transition-colors rounded-[11px] mb-5 tracking-tight">
                        쇼핑백에 추가하기
                    </button>

                    {/* 아코디언 리스트 */}
                    <div className="space-y-0">
                        {/* 무료 배송 & 반품 */}
                        <div>
                            <button
                                onClick={() => toggleAccordion('shipping')}
                                className="w-full list-none flex justify-between font-[400] items-center cursor-pointer py-5 text-[13px] text-[#111]">
                                <span>무료 배송 & 반품</span>
                                <span
                                    className={`text-xl transition-transform duration-300 ${
                                        openAccordion === 'shipping' ? 'rotate-45' : ''
                                    }`}>
                                    +
                                </span>
                            </button>
                            <div
                                className={`overflow-hidden transition-all ease-out ${
                                    openAccordion === 'shipping'
                                        ? 'max-h-96 opacity-100 duration-1000'
                                        : 'max-h-0 opacity-0 duration-400'
                                }`}>
                                <div className="pb-6 text-[12px] font-[400] leading-relaxed">
                                    <p>
                                        젠틀몬스터 공식 온라인 스토어는 무료 배송 및 반품 서비스를
                                        제공합니다. 반품은 제품을 수령하신 날로부터 7일 이내에 접수해
                                        주셔야 합니다. 제품은 사용되지 않은 상태여야 하며, 모든 구성품을
                                        포함하고 있어야 합니다.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 세부 정보 */}
                        <div>
                            <button
                                onClick={() => toggleAccordion('details')}
                                className="w-full list-none flex justify-between items-center cursor-pointer py-5 text-[13px] font-[400] text-[#111]">
                                <span>세부 정보</span>
                                <span
                                    className={`text-xl transition-transform duration-300 ${
                                        openAccordion === 'details' ? 'rotate-45' : ''
                                    }`}>
                                    +
                                </span>
                            </button>
                            <div
                                className={`overflow-hidden transition-all ease-out ${
                                    openAccordion === 'details'
                                        ? 'max-h-96 opacity-100 duration-1000'
                                        : 'max-h-0 opacity-0 duration-400'
                                }`}>
                                <div className="pb-6 text-[12px] flex flex-col leading-relaxed">
                                    <p className={"pb-5"}>{product.summary}</p>
                                    <p>{product.collection}</p>
                                    <p>{product.material}</p>
                                    <p>{product.lens}</p>
                                    <p>{product.Shape}</p>
                                    <p>{product.originCountry}</p>
                                </div>
                            </div>
                        </div>

                        {/* 사이즈 및 핏 */}
                        <div>
                            <button
                                onClick={() => toggleAccordion('size')}
                                className="w-full list-none flex justify-between items-center cursor-pointer py-5 text-[13px] text-[#111]">
                                <span>사이즈 및 핏</span>
                                <span
                                    className={`text-xl transition-transform duration-300 ${
                                        openAccordion === 'size' ? 'rotate-45' : ''
                                    }`}>
                                    +
                                </span>
                            </button>
                            <div
                                className={`overflow-hidden transition-all ease-out ${
                                    openAccordion === 'size'
                                        ? 'max-h-96 opacity-100 duration-1000'
                                        : 'max-h-0 opacity-0 duration-400'
                                }`}>
                                <div className="pb-6 text-[12px] leading-relaxed">
                                    <p className="mb-3">
                                        {product.sizeInfo || "사이즈 정보가 없습니다."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductDetailPage;