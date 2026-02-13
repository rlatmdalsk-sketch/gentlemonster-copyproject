import { create } from 'zustand';

interface NotificationState {
    isOpen: boolean;
    message: string;
    item: any;
    timer: any;
    show: (message: string, item?: any) => void;
    hide: () => void;
}

const useNotificationStore = create<NotificationState>((set, get) => ({
    isOpen: false,
    message: '',
    item: null,
    timer: null, // 초기값 null

    show: (message, item) => {
        const currentTimer = get().timer;
        if (currentTimer) clearTimeout(currentTimer);

        set({
            isOpen: true,
            message,
            item,
        });

        const newTimer = setTimeout(() => {
            set({ isOpen: false });
        }, 3000);

        set({ timer: newTimer });
    },

    hide: () => {
        const currentTimer = get().timer;
        if (currentTimer) clearTimeout(currentTimer);
        set({ isOpen: false });
    },
}));

export default useNotificationStore;