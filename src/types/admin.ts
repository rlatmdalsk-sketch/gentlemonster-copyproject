export interface UserData {
    id: number;
    email: string;
    name: string; // nickname 대신 JSON에 있는 name 사용
    phone: string;
    birthdate: string;
    gender: "MALE" | "FEMALE";
    role: "USER" | "ADMIN";
    createdAt: string;
    updatedAt: string;
    // _count 등 추가 데이터는 백엔드에서 주지 않으면 선택사항(?)으로 처리
    _count?: {
        videos: number;
        comments: number;
    };
}

// API 응답 구조를 위한 인터페이스 추가
export interface PaginatedUserResponse {
    data: UserData[];
    pagination: {
        totalUsers: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}