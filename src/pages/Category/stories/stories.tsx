import {Link} from "react-router-dom";
import {twMerge} from "tailwind-merge";


const STORIES = [
    {
        id: 1,
        category: "COLLABORATION",
        title: "GENTLE MONSTER X TEKKEN 8",
        description: "젠틀몬스터와 철권 8의 협업을 통해 탄생한 독창적인 아이웨어 컬렉션을 만나보세요.",
        image: "https://gm-dev-resource.gentlemonster.com/service/story/image/5898ade5-1382-4c9f-a42a-b3dab5023f9e/2.tekken8_storylist_pc.jpg",
    },
    {
        id: 2,
        category: "COLLECTION",
        title: "2026 COLLECTION",
        description: "새로운 시각적 경험을 선사하는 2026 컬렉션의 캠페인과 아이웨어를 공개합니다.",
        image: "https://gm-prd-resource.gentlemonster.com/main/banner/undefined/e7257dc6-f4f7-4387-9b54-f1a893c42f95/storylist_pc_3840*-1800..jpg",
    },
    {
        id: 3,
        category: "COLLABORATION",
        title: "MAISON MARGIELA – EDITION 2",
        description: "메종 마르지엘라와 젠틀몬스터가 함께한 두 번째 협업 에디션.",
        image: "https://gm-prd-resource.gentlemonster.com/contents/story/14668cac-4a67-46c0-adba-6be7feaf62b5/Pc.jpg",
    },
    {
        id: 4,
        category: "COLLABORATION",
        title: "GENTLE SALON",
        description: "제니와 함께 상상력을 현실로 구현한 젠틀 살롱 컬렉션.",
        image: "https://gm-dev-resource.gentlemonster.com/service/story/image/2febe4ce-4dea-435b-bf10-2d05ea382762/8.jentlesalon_storylist_pc.jpg",
    },
    {
        id: 5,
        category: "COLLECTION",
        title: "2025 FALL COLLECTION",
        description: "가을의 서사를 담은 차분하고 정교한 디자인의 새로운 라인업.",
        image: "https://gm-prd-resource.gentlemonster.com/main/banner/undefined/e816e4bb-7d1e-460a-ba80-67a9aac83bd9/storylist_1_pc_3840-1800.jpg",
    },
    {
        id: 6,
        category: "COLLABORATION",
        title: "MUGLER X GENTLE MONSTER",
        description: "뮈글러의 아방가르드한 감성과 젠틀몬스터의 대담함이 만났습니다.",
        image: "https://gm-dev-resource.gentlemonster.com/service/story/image/a0d33e33-8783-4e5e-9231-3da11d82889d/5.mugler_storylist_pc.jpg",
    },
    {
        id: 7,
        category: "SPACE",
        title: "HAUS DOSAN",
        description: "미래지향적인 유통의 새로운 방향성을 제시하는 하우스 도산.",
        image: "https://gm-dev-resource.gentlemonster.com/service/story/image/b376ace0-37a7-4a6b-b37f-fe7f282fe5a3/4.hausnowhereshenzhen_storylist_pc.jpg",
    },
    {
        id: 8,
        category: "COLLECTION",
        title: "2025 BOLD COLLECTION",
        description: "은하계의 별들을 모티브로 한 대담한 실루엣의 볼드 컬렉션.",
        image: "https://gm-prd-resource.gentlemonster.com/main/banner/undefined/af252f9e-4d9b-4060-8fae-3fd4ead68a93/storylist_1_pc_3840*1800.jpg",
    }
];

export default function Stories() {
    return (
        <div className="  w-full">
            {/* 개별 캠페인 섹션 */}
            {STORIES.map((story) => (
                <Link to={""}>
                <section key={story.id} className="relative w-full border-b border-gray-100 last:border-none">
                    {/* 이미지 컨테이너: 가로 전체 차지 */}
                    <div className="w-full h-[80vh] min-h-[500px] overflow-hidden">
                        <img
                            src={story.image}
                            alt={story.title}
                            className="w-full h-full object-cover "
                        />
                    </div>

                    {/* 텍스트 정보: 이미지 바로 아래 혹은 위에 겹치게 설정 가능 */}
                    <div className="px-[60px] py-16 mobile:px-[20px] flex flex-col items-start">
                        <span className="text-[12px] font-bold tracking-[0.2em] text-gray-400 mb-4">
                            {story.category}
                        </span>
                        <h2 className="text-[28px] font-bold tracking-tighter mb-4">
                            {story.title}
                        </h2>
                        <p className="text-[14px] text-gray-600 max-w-xl leading-relaxed mb-6">
                            {story.description}
                        </p>
                        <button className="text-[13px] font-bold border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-all">
                            자세히 보기
                        </button>
                    </div>
                </section>
                </Link>
            ))}
        </div>
    );
}