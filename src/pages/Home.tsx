import {useState, useRef, useEffect} from "react";
import video1 from "../assets/videos/2026COLLECTION.mp4";
import video2 from "../assets/videos/FALLCOLLECTION.mp4";
import video3 from "../assets/videos/MAIN_PC.avif";
import video4 from "../assets/videos/BOLDCOLLECTION.mp4";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import {Swiper, SwiperSlide} from 'swiper/react';
import {twMerge} from "tailwind-merge";
import {Pagination, Navigation} from "swiper/modules";
import {Link, useNavigate } from "react-router-dom";
import LookBookSlider from "./components/LookBookSlider.tsx";
import BestSellerSlider from "./components/BestSellerSlider.tsx";

const SLIDES = [
    {
        id: 1,
        src: video1,
        title: "2026 COLLECTION",
        type: "video",
        buyLink: "/category/collections/c-2026-collection",
        campaignLink: "/stories"
    },
    {
        id: 2,
        src: video2,
        title: "FALL COLLECTION",
        type: "video",
        buyLink: "/category/collections/c-2025-fall-collection",
        campaignLink: "/stories"
    },
    {
        id: 3,
        src: video3,
        title: "THE ROOM: ESCAPE THE HUNT",
        type: "image",
        buyLink: "/stories",
        campaignLink: "/stories"
    },
    {
        id: 4,
        src: video4,
        title: "BOLD COLLECTION",
        type: "video",
        buyLink: "/category/collections/c-2025-bold-collection",
        campaignLink: "/stories"
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
        return () => {
            if (timerRef.current) cancelAnimationFrame(timerRef.current);
        };
    }, [swiperInstance]);

    return (
        <div className={twMerge()}>
            <section className={twMerge("w-full", "h-[770px]", "relative", "overflow-hidden")}>
                <Swiper
                    onSwiper={setSwiperInstance}
                    loop={true}
                    speed={600} // 너무 느리지 않게 살짝 조정 (기존 800 -> 600)
                    autoplay={false}
                    navigation={true}
                    threshold={5} // 반응 시작 지점을 낮춰 더 민감하게 반응하게 함

                    // 1. 땡기는 힘을 약하게 (손가락 움직임에 슬라이드가 더 많이 따라오게)
                    touchRatio={1.2} // 1보다 높이면 적은 힘(움직임)으로도 휙휙 따라옵니다.

                    // 2. 적게 밀어도 다음으로 넘어가게 설정
                    longSwipesRatio={0.2} // 기존 0.5(50%)에서 0.2(20%)로 변경. 조금만 밀어도 착! 넘어갑니다.

                    followFinger={true}
                    shortSwipes={true} // 가벼운 터치에도 반응하도록 다시 활성화

                    resistance={true}
                    resistanceRatio={0.85} // 끝부분 저항을 줄여서 더 부드럽게

                    touchAngle={45}
                    modules={[Pagination, Navigation]}
                    onSlideChangeTransitionEnd={updateMediaControl}

                    // 3. 다른 요소(텍스트, 이미지)가 드래그되어 따라오는 현상 방지
                    className={twMerge(
                        "w-full h-full relative cursor-e-resize active:cursor-grabbing select-none",
                        [
                            "[&_img]:pointer-events-none", // 이미지 드래그 방지 (중요!)
                            "[&_button]:select-none",      // 버튼 텍스트 선택 방지
                            "[&_.swiper-button-next]:after:!content-none",
                            "[&_.swiper-button-prev]:after:!content-none",
                            "[&_.swiper-button-next]:!opacity-0",
                            "[&_.swiper-button-prev]:!opacity-0",
                            // 버튼 영역을 최소화하여 드래그 간섭 차단
                            "[&_.swiper-button-next]:!w-[40px] [&_.swiper-button-prev]:!w-[40px]"
                        ]
                    )}
                >
                    {SLIDES.map((slide) => (
                        <SwiperSlide key={slide.id}>
                            <div className="relative w-full h-full">
                                {slide.type === "video" ? (
                                    <video src={slide.src} muted playsInline className="w-full h-full object-cover"/>
                                ) : (
                                    <img src={slide.src} className="w-full h-full object-cover select-none "
                                         alt={slide.title}/>
                                )}

                                {/* 텍스트 및 버튼 컨테이너 */}
                                <div
                                    className="absolute inset-0 flex flex-col items-center justify-center top-120 pointer-events-none">
                                    <h2 className="text-[24px] md:text-[26px] font-serif lining-nums leading-[1.2] tracking-[-0.02em] text-white mb-6">
                                        {slide.title}
                                    </h2>

                                    <div className="flex gap-2 z-50 pointer-events-auto">
                                        <a
                                            href={slide.buyLink}
                                            onClick={(e) => e.stopPropagation()}
                                            className="px-[23px] select-none  py-2 border border-white text-white text-[11px] font-medium rounded-full   select-nonehover:text-black 0 text-center"
                                        >
                                            구매하기
                                        </a>
                                        <a
                                            href={slide.campaignLink}
                                            onClick={(e) => e.stopPropagation()}
                                            className="px-[20px] py-2 border  select-none border-white text-white text-[11px] font-medium rounded-full  select-nonehover:text-black  text-center"
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
                                <div
                                    className="w-full h-[1px] bg-white/20 relative overflow-hidden pointer-events-none">
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
            {/*신제품 슬라이드*/}
            <div>
                <div className={twMerge("pt-[55px]", "px-[50px]", "w-full")}>
                    <p className={twMerge("text-[#111]", "text-[19px]", "font-[550]")}>새롭게 선보이는 젠틀몬스터 신제품</p>
                    <Link
                        to="/category/sunglasses/view-all"
                        className={twMerge("text-[15px]", "underline", "decoration-1")}
                    >
                        더보기
                    </Link>
                </div>

                {/* 슬라이더 영역: 텍스트 바로 아래 붙도록 설정 */}
                <div >
                    <LookBookSlider />
                </div>
            </div>

            {/*TOP 베스트셀러 슬라이드*/}
            <div>
                <div className={twMerge("pt-[55px]", "px-[50px]", "w-full", "pb-10")}>
                    <p className={twMerge("text-[#111]", "text-[19px]", "font-[550]")}>TOP 10 베스트셀러</p>
                    <Link
                        to="/category/collections/bestseller"
                        className={twMerge("text-[15px]", "underline", "decoration-1")}
                    >
                        더보기
                    </Link>
                </div>
                <div >
                    <BestSellerSlider />
                </div>
            </div>
        </div>
    );
}

export default Home;