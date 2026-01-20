import { useState, useRef, useEffect } from "react";
import video1 from "../assets/videos/2026COLLECTION.mp4";
import video2 from "../assets/videos/FALLCOLLECTION.mp4";
import video3 from "../assets/videos/MAIN_PC.avif";
import video4 from "../assets/videos/BOLDCOLLECTION.mp4";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Swiper, SwiperSlide } from 'swiper/react';
import { twMerge } from "tailwind-merge";
import { Pagination, Navigation } from "swiper/modules";

const SLIDES = [
    {
        id: 1,
        src: video1,
        title: "2026 COLLECTION",
        type: "video",
        buyLink: "/category/collections/2026-collection",
        campaignLink: "/stories/2026-collection"
    },
    {
        id: 2,
        src: video2,
        title: "FALL COLLECTION",
        type: "video",
        buyLink: "/category/collections/2025-fall-collection",
        campaignLink: "/stories/2025-fall-collection"
    },
    {
        id: 3,
        src: video3,
        title: "THE ROOM: ESCAPE THE HUNT",
        type: "image",
        buyLink: "/shop/theroom",
        campaignLink: "/stories/theroom"
    },
    {
        id: 4,
        src: video4,
        title: "BOLD COLLECTION",
        type: "video",
        buyLink: "/category/collections/2025-bold-collection",
        campaignLink: "/stories/2025-bold-collection"
    },
];

function Home() {
    const [swiperInstance, setSwiperInstance] = useState<any>(null);
    const progressRef = useRef<HTMLDivElement[]>([]);
    const timerRef = useRef<number | null>(null);

    const updateMediaControl = (swiper: any) => {
        if (!swiper) return;

        // 1. 기존 애니메이션 중지
        if (timerRef.current) cancelAnimationFrame(timerRef.current);

        // 2. 비디오 초기화
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach(v => {
            v.pause();
            v.currentTime = 0;
        });

        // 3. 누적형 페이지네이션 로직: 지나온 바는 채우고, 앞의 바는 비움
        progressRef.current.forEach((bar, index) => {
            if (!bar) return;
            if (index < swiper.realIndex) {
                bar.style.transform = 'scaleX(1)'; // 지나온 슬라이드
            } else if (index > swiper.realIndex) {
                bar.style.transform = 'scaleX(0)'; // 대기 중인 슬라이드
            }
            // 현재 슬라이드(index === swiper.realIndex)는 아래 애니메이션 함수에서 실시간 처리
        });

        const currentData = SLIDES[swiper.realIndex];
        const activeSlideDOM = swiper.slides[swiper.activeIndex];
        const activeBar = progressRef.current[swiper.realIndex];

        if (currentData.type === "video") {
            const video = activeSlideDOM.querySelector('video');
            if (video) {
                video.onended = () => swiper.slideNext();
                const animateVideo = () => {
                    if (!video.paused && !video.ended) {
                        const progress = video.currentTime / video.duration;
                        if (activeBar) activeBar.style.transform = `scaleX(${progress})`;
                        timerRef.current = requestAnimationFrame(animateVideo);
                    }
                };
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        timerRef.current = requestAnimationFrame(animateVideo);
                    }).catch(() => startImageTimer(swiper, activeBar));
                }
            }
        } else {
            startImageTimer(swiper, activeBar);
        }
    };

    const startImageTimer = (swiper: any, activeBar: HTMLDivElement | null) => {
        let start: number | null = null;
        const duration = 8000;
        const animate = (timestamp: number) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            if (activeBar) activeBar.style.transform = `scaleX(${progress})`;
            if (progress < 1) {
                timerRef.current = requestAnimationFrame(animate);
            } else {
                swiper.slideNext();
            }
        };
        timerRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (swiperInstance) updateMediaControl(swiperInstance);
        return () => { if (timerRef.current) cancelAnimationFrame(timerRef.current); };
    }, [swiperInstance]);

    return (
        <section className={twMerge("w-full", "h-[770px] relative overflow-hidden bg-black")}>
            <Swiper
                onSwiper={setSwiperInstance}
                loop={true}
                speed={250}
                autoplay={false}
                navigation={true}
                modules={[Pagination, Navigation]}
                onSlideChangeTransitionEnd={updateMediaControl}
                className={twMerge("w-full h-full relative cursor-e-resize", [
                    "[&_.swiper-button-next]:after:!content-none",
                    "[&_.swiper-button-prev]:after:!content-none",
                    "[&_.swiper-button-next]:!opacity-0",
                    "[&_.swiper-button-prev]:!opacity-0",
                    "[&_.swiper-button-next]:!w-1/4",
                    "[&_.swiper-button-next]:!h-full",
                    "[&_.swiper-button-next]:!right-0",
                    "[&_.swiper-button-next]:!top-0",
                    "[&_.swiper-button-next]:!m-0",
                    "[&_.swiper-button-next]:!cursor-e-resize",
                    "[&_.swiper-button-prev]:!w-1/4",
                    "[&_.swiper-button-prev]:!h-full",
                    "[&_.swiper-button-prev]:!left-0",
                    "[&_.swiper-button-prev]:!top-0",
                    "[&_.swiper-button-prev]:!m-0",
                    "[&_.swiper-button-prev]:!cursor-e-resize",
                ])}
            >
                {SLIDES.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full h-full">
                            {slide.type === "video" ? (
                                <video src={slide.src} muted playsInline className="w-full h-full object-cover" />
                            ) : (
                                <img src={slide.src} className="w-full h-full object-cover" alt={slide.title} />
                            )}

                            {/* 텍스트 및 버튼 컨테이너 */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center top-113 pointer-events-none">
                                <h2 className="text-white text-[24px] font-bold uppercase tracking-[0.1em] mb-6">
                                    {slide.title}
                                </h2>

                                <div className="flex gap-2 z-50 pointer-events-auto">
                                    <a
                                        href={slide.buyLink}
                                        onClick={(e) => e.stopPropagation()}
                                        className="px-[23px] py-2 border border-white text-white text-[11px] font-medium rounded-full hover:bg-white hover:text-black transition-all duration-300 text-center"
                                    >
                                        구매하기
                                    </a>
                                    <a
                                        href={slide.campaignLink}
                                        onClick={(e) => e.stopPropagation()}
                                        className="px-[20px] py-2 border border-white text-white text-[11px] font-medium rounded-full hover:bg-white hover:text-black transition-all duration-300 text-center"
                                    >
                                        캠페인 보기
                                    </a>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* --- 누적형 슬림 페이지네이션 바 --- */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-[7px]">
                    {SLIDES.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => swiperInstance?.slideToLoop(index)}
                            className="w-25 h-6 flex items-center group focus:outline-none cursor-e-resize"
                        >
                            <div className="w-full h-[1px] bg-white/20 relative overflow-hidden pointer-events-none">
                                <div
                                    ref={(el) => (progressRef.current[index] = el!)}
                                    className="absolute top-0 left-0 w-full h-full bg-white origin-left transition-transform duration-100 ease-linear"
                                    style={{transform: 'scaleX(0)'}}
                                />
                            </div>
                        </button>
                    ))}
                </div>
            </Swiper>
        </section>
    );
}

export default Home;