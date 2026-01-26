import { useParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { CATEGORY_DATA } from "../components/CATEGORY_DATA.tsx";

const ProductListPage = () => {
    // 1. URL에서 category(sunglasses/glasses)와 id(2026-collection 등)를 모두 가져옵니다.
    const { category, id } = useParams<{ category: string; id: string }>();

    // 2. 2단 구조에 맞춰 데이터를 찾습니다.
    // CATEGORY_DATA["sunglasses"]["2026-collection"] 형태가 됩니다.
    const categoryGroup = category ? CATEGORY_DATA[category] : null;
    const currentCategory = (categoryGroup && id && categoryGroup[id]) || {
        title: "컬렉션",
        description: "젠틀몬스터의 새로운 라인업을 만나보세요."
    };

    return (
        <main className="relative">
            {/* 상단 고정 영역 */}
            <div className={twMerge(
                "flex flex-col items-center pt-25 pb-10 gap-5 w-full",
                "fixed top-22 left-0 z-40 " // 배경색이 있어야 상품 리스트와 겹치지 않아요!
            )}>
                {/* 🌟 동적 제목 출력 */}
                <h2 className={twMerge("text-[23px]", "font-[550]")}>
                    {currentCategory.title}
                </h2>

                {/* 🌟 동적 설명 출력 */}
                <p className={twMerge("text-[13px]", "font-bold", "text-center", "max-w-[800px] px-5 whitespace-pre-line")}>
                    {currentCategory.description}
                </p>
            </div>

            {/* 상품 리스트 영역 (위 영역에 가려지지 않게 여백 필요) */}
            <div className="pt-[300px] px-10">
                {/* 여기에 API로 불러온 상품들을 뿌려줄 예정입니다. */}
            </div>
        </main>
    );
};

export default ProductListPage;