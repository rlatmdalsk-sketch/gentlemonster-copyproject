export interface CategoryContent {
    title: string;
    description: string;
}

// Record 안에 또 Record가 들어가는 구조입니다.
export const CATEGORY_DATA: Record<string, Record<string, CategoryContent>> = {
    /* --- 선글라스 카테고리 --- */
    "sunglasses": {
        "2026-collection": {
            title: "2026 컬렉션 선글라스",
            description: "2026 부케 컬렉션 선글라스는 식물 줄기의 디테일을 우아한 미적 감각으로 재해석한 프레임을 제안합니다."
        },
        "2025-fall-collection": {
            title: "2025 FALL 컬렉션 선글라스",
            description: "2025 FALL 컬렉션 제품은 더욱 가볍고 섬세해진 실루엣을 강조해 새로운 고급스러움을 제안합니다."
        },
        "2025-bold-collection": {
            title: "2025 볼드 컬렉션 선글라스",
            description: "볼드 컬렉션 제품의 브릿지 디테일은 현대적으로 재해석한 방패의 구조를 형상화하며 미래적 감각을 강화합니다."
        },
        "pocket-collection": {
            title: "포켓 컬렉션 선글라스",
            description: "휴대성을 높인 컴팩트한 디자인의 폴딩 선글라스 라인입니다."
        },
        "bestsellers": {
            title: "선글라스 베스트셀러",
            description: "가장 사랑받는 아이코닉한 선글라스 컬렉션을 확인해 보세요."
        },
        "tinted-lenses": {
            title: "틴트 렌즈 선글라스",
            description: "다채로운 컬러 렌즈로 유니크한 룩을 완성해 보세요."
        }
    },

    /* --- 안경 카테고리 --- */
    "glasses": {
        "2026-collection": {
            title: "2026 컬렉션 안경",
            description: "비즈 디테일이 더해진 스테이트먼트 피스와 따뜻한 감각을 담은 2026 부케 컬렉션 안경을 만나보세요."
        },
        "2025-fall-collection": {
            title: "2025 FALL 컬렉션 안경",
            description: "더욱 가볍고 섬세해진 실루엣으로 세련되고 절제된 미학을 표현한 안경 컬렉션입니다."
        },
        "2025-bold-collection": {
            title: "2025 볼드 컬렉션 안경",
            description: "현대적으로 재해석한 방패 구조의 브릿지와 뉴 퓨처리즘을 제안하는 안경 컬렉션입니다."
        },
        "pocket-collection": {
            title: "포켓 컬렉션 안경",
            description: "감각적인 디자인과 컴팩트한 폴딩 구조를 통해 아이웨어의 새로운 비전을 제안합니다."
        },
        "bestsellers": {
            title: "안경 베스트셀러",
            description: "지금 가장 인기가 많은 안경들을 확인해 보세요."
        },
        "blue-light-lenses": {
            title: "블루라이트 안경",
            description: "블루라이트 차단 렌즈를 사용한 기능성과 스타일을 모두 잡은 컬렉션입니다."
        },
        "tinted-lenses": {
            title: "틴트 렌즈 안경",
            description: "다양한 색상의 틴트 렌즈로 감각적인 무드를 연출하는 안경 컬렉션입니다."
        }
    }
};