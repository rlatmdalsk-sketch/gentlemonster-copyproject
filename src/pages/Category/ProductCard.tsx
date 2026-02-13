import { Link, useParams } from "react-router-dom";
import type { Product } from "../../types/product";
import Bookmark from "../components/Bookmark.tsx";


interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const mainImage = product.images?.[0]?.url || "/placeholder-image.jpg";
    const formattedPrice = product.price.toLocaleString("ko-KR");

    return (
        <div className="group relative w-full">
            <Link to={`/product/${product.id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden mb-4">
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-[751px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* 미세한 호버 오버레이 */}
                    <div className="absolute inset-0 bg-black/0  transition-colors duration-300" />
                </div>
            </Link>

            <div className="flex justify-between items-start px-0.5">
                <div className="flex flex-col ml-[60px] mr-[60px]">
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

                <Bookmark
                    key={product.id}
                    productId={product.id}
                    productName={product.name}
                    allProducts={[product]}
                />
            </div>
        </div>
    );
};

export default ProductCard;