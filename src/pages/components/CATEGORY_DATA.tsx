export interface CategoryContent {
    title: string;
    description: string;
}

// Record 안에 또 Record가 들어가는 구조입니다.
export const CATEGORY_DATA: Record<string, Record<string, CategoryContent>> = {
    /* --- 선글라스 카테고리 --- */
    sunglasses: {
        "s-2026-collection": {
            title: "2026 컬렉션 선글라스",
            description:
                "2026 부케 컬렉션 선글라스는 식물 줄기의 디테일을 우아한 미적 감각으로 재해석한 프레임을 제안합니다.",
        },
        "s-2025-fall-collection": {
            title: "2025 FALL 컬렉션 선글라스",
            description:
                "2025 FALL 컬렉션 제품은 더욱 가볍고 섬세해진 실루엣을 강조해 새로운 고급스러움을 제안합니다.",
        },
        "s-2025-bold-collection": {
            title: "2025 볼드 컬렉션 선글라스",
            description:
                "볼드 컬렉션 제품의 브릿지 디테일은 현대적으로 재해석한 방패의 구조를 형상화하며 미래적 감각을 강화합니다.",
        },
        "s-pocket-collection": {
            title: "포켓 컬렉션 선글라스",
            description: "휴대성을 높인 컴팩트한 디자인의 폴딩 선글라스 라인입니다.",
        },
        "s-bestsellers": {
            title: "선글라스 베스트셀러",
            description: "가장 사랑받는 아이코닉한 선글라스 컬렉션을 확인해 보세요.",
        },
    },

    /* --- 안경 카테고리 --- */
    glasses: {
        "g-2026-collection": {
            title: "2026 컬렉션 안경",
            description:
                "비즈 디테일이 더해진 스테이트먼트 피스와 따뜻한 감각을 담은 2026 부케 컬렉션 안경을 만나보세요.",
        },
        "g-2025-fall-collection": {
            title: "2025 FALL 컬렉션 안경",
            description:
                "더욱 가볍고 섬세해진 실루엣으로 세련되고 절제된 미학을 표현한 안경 컬렉션입니다.",
        },
        "g-2025-bold-collection": {
            title: "2025 볼드 컬렉션 안경",
            description:
                "현대적으로 재해석한 방패 구조의 브릿지와 뉴 퓨처리즘을 제안하는 안경 컬렉션입니다.",
        },
        "g-pocket-collection": {
            title: "포켓 컬렉션 안경",
            description:
                "감각적인 디자인과 컴팩트한 폴딩 구조를 통해 아이웨어의 새로운 비전을 제안합니다.",
        },
        "g-bestsellers": {
            title: "안경 베스트셀러",
            description: "지금 가장 인기가 많은 안경들을 확인해 보세요.",
        },
    },
    /*컬렉션 카테고리*/
    collections: {
        "c-2026-collection": {
            title: "2026 컬렉션",
            description:
                "식물의 줄기를 형상화한 매듭의 고급스러운 디테일로 정제된 우아함을 드러내는 제품 라인업과 풍부하면서도 사랑스러운 활기를 표현한 비즈 디테일이 더해진 스테이트먼트 피스에 이르기까지 부드러우면서도 따뜻한 감각을 담은 2026 부케 컬렉션을 선보입니다.",
            image: "/images/stories/2026C.avif",
        },
        "c-2025-fall-collection": {
            title: "2025 FALL 컬렉션",
            description:
                "2025 FALL 컬렉션은 미니멀한 실루엣과 정제된 디테일의 프레임으로 확장된 미학을 제시합니다. 얇아진 프레임에 과하지 않은 디테일을 더하여 세련되고 절제된 미학으로 승화하며, 에너지가 느껴지는 메탈릭한 컬러웨이로 감각적인 조화를 형성합니다.",
            image: "/images/stories/2025FC.avif",
        },
        "c-2025-bold-collection": {
            title: "2025 볼드 컬렉션",
            description:
                "볼드 컬렉션 제품의 브릿지 디테일은 현대적으로 재해석한 방패의 구조를 형상화했으며, 노즈패드를 삭제하는 구조의 혁신을 통해 뉴 퓨처리즘을 제안합니다. 메탈 프레임 제품은 가벼운 렌즈와 대비되는 묵직하고 정교한 브릿지 디자인으로 기존에 볼 수 없던 대비가 표현되었고, 아세테이트 프레임 제품은 속도감이 강조된 시그니처 심볼과 과장된 볼륨의 프론트와 밸런스를 형성하며 미래적 감각을 강화합니다.",
            image: "/images/stories/2025B.avif",
        },
        "c-pocket-collection": {
            title: "포켓 컬렉션",
            description:
                "젠틀몬스터 포켓 컬렉션은 휴대할 수 있는 컴팩트한 구조의 폴딩 아이웨어를 젠틀몬스터의 대담하고 현대적인 미학으로 완성시킨 새로운 아이웨어 라인입니다. 컬렉션은 총 21개의 디자인으로 구성되며, 브랏츠 협업 아이웨어 1종과 특별한 브랏츠 인형을 함께 선보입니다.",
            image: "/images/stories/pocket.avif",
        },
        "c-maison-margiela": {
            title: "메종 마르지엘라 X 젠틀몬스터",
            description:
                "3월 6일 세 번째 협업 컬렉션 출시. 고전주의와 미래주의의 교차점에 대한 탐구를 통해 선보이는 이번 컬렉션은 사이버코어 미학을 담은 메탈릭 소재, 케이블 템플, 그리고 메종 마르지엘라의 아이코닉한 4개의 화이트 스티치가 어우러진 20가지 특색 있는 디자인으로 이루어져 있습니다. 미래주의와 재창조에 대한 두 브랜드의 깊은 탐구를 담아낸 컬렉션을 만나보세요.",
            image: "/images/stories/marg.avif",
        },
        "c-2025-collection": {
            title: "2025 컬렉션",
            description:
                "젠틀몬스터의 2025 주얼리 컬렉션을 소개합니다. 주얼리 디테일이 템플에 장식된 제품부터 진주 목걸이를 연상시키는 스테이트먼트 피스에 이르기까지 주얼리의 화려함을 통해 젠틀몬스터만의 독창적인 미적 감각을 드러내는 2025 컬렉션을 만나보세요",
            image: "/images/stories/2025C.avif",
        },
        "c-jentle-salon": {
            title: "젠틀 살롱",
            description:
                "젠틀몬스터와 제니가 함께 상상한 세번째 프로젝트 ‘젠틀살롱 (JENTLE SALON)’을 소개합니다. 아이코닉한 디자인의 참(Charm)으로 다채로운 연출이 가능한 아이웨어를 통해 상상을 뛰어넘은 협업 컬렉션을 선보입니다.",
            image: "/images/stories/jennie.jpg",
        },
        "bestseller":{
            title: "베스트 셀러",
            description:"시간이 흘러도 변치 않는 가치를 지닌 젠틀몬스터의 아이코닉한 베스트셀러 컬렉션을 만나보세요. 대중에게 가장 사랑받는 실루엣에 브랜드 고유의 실험적인 디테일을 더해 완성된 독보적인 라인업을 제안합니다.",
            image: "/images/stories/best.jpg"
        }
    },
};
