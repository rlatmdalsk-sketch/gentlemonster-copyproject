import { useNavigate } from "react-router-dom";

interface CartWishHeaderProps {
    totalCount: number;
    wishlistCount?: number;
    activeTab: "cart" | "wishlist";
}

const CartWishHeader = ({ totalCount, wishlistCount = 0, activeTab }: CartWishHeaderProps) => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center relative mb-16">
            <div className="flex gap-6 text-center">
                {/* 쇼핑백 버튼 */}
                <button
                    onClick={() => navigate("/shoppingBag")}
                    className={`text-[17px] h-[30px] px-[12px] rounded-lg font-[450] cursor-pointer transition-colors ${
                        activeTab === "cart" ? "bg-[#e2e4e5]" : "hover:bg-[#e2e4e5]"
                    }`}
                >
                    쇼핑백<sup>{totalCount}</sup>
                </button>

                {/* 위시리스트 버튼 */}
                <button
                    onClick={() => navigate("/wishlist")}
                    className={`text-[17px] h-[30px] px-[12px] rounded-lg font-[450] cursor-pointer transition-colors ${
                        activeTab === "wishlist" ? "bg-[#e2e4e5]" : "hover:bg-[#e2e4e5]"
                    }`}
                >
                    위시리스트<sup>{wishlistCount}</sup>
                </button>
            </div>


        </div>
    );
};

export default CartWishHeader;