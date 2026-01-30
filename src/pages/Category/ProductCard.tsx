import { Link } from "react-router-dom";
import { MdBookmarkBorder } from "react-icons/md";
import type { Product } from "../../types/product";

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    // 이미지가 없을 경우를 대비한 방어 코드
    const mainImage = product.images?.[0]?.url || "/placeholder-image.jpg";
    const formattedPrice = product.price.toLocaleString("ko-KR");

    return (
        <div className="group relative w-full">
            {/* 1. 이미지 영역: 3:4 비율 유지 */}
            <Link to={`/product/${product.id}`} className="block">
                <div className="relative aspect-[3/4] bg-[#f7f7f7] overflow-hidden mb-4">
                    <img
                        src={mainImage}
                        alt={product.name}
                        // 고정 픽셀 대신 부모 박스에 꽉 차도록 수정
                        className="w-full h-[751px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* 미세한 호버 오버레이 */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.03] transition-colors duration-300" />
                </div>
            </Link>

            {/* 2. 정보 영역: flex를 이용해 텍스트와 북마크 분리 */}
            <div className="flex justify-between items-start px-0.5">
                <div className="flex flex-col">
                    {/* 젠틀몬스터 특유의 미니멀 라인 */}
                    <div className="w-3 h-[1.2px] bg-black mb-2.5" />

                    <Link to={`/product/${product.id}`} className="inline-block">
                        <h3 className="text-[13px] font-medium tracking-tight text-[#111] leading-tight mb-1">
                            {product.name}
                        </h3>
                    </Link>

                    <p className="text-[12px] text-[#111] font-normal tracking-tight">
                        ₩{formattedPrice}
                    </p>

                </div>

                {/* 북마크 아이콘: 캡처본처럼 얇고 깔끔하게 배치 */}
                <button
                    className="mt-[15px] p-1 text-black/80 hover:text-black transition-colors"
                    onClick={(e) => {
                        e.preventDefault();
                        console.log(`${product.name} 북마크 클릭`);
                    }}
                >
                    <MdBookmarkBorder className="text-xl" />
                </button>
            </div>
        </div>
    );
};

export default ProductCard;