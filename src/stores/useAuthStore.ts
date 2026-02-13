import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/user.ts";

interface AuthState {
    isLoggedIn: boolean;
    token: string | null;
    user: User | null;
    login: (user: User, token: string) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            token: null,
            user: null,
            // 매개변수 순서를 (user, token)으로 변경
            login: (user, token) => set({ isLoggedIn: true, user, token }),
            logout: () => {
                // 로그아웃 시 로컬 스토리지를 명확히 비우거나 상태를 초기화
                set({ isLoggedIn: false, token: null, user: null });
            },
        }),
        {
            name: "auth-storage",
            // (선택 사항) 세션 스토리지로 바꾸고 싶다면 아래 주석 해제
            // storage: createJSONStorage(() => sessionStorage),
        },
    ),
);

export default useAuthStore;