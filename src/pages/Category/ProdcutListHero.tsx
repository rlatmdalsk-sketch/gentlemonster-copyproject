interface ProductListHeroProps {
    currentCategory: {
        title: string;
        description: string;
        image?: string; // image가 있으면 Collection 타입으로 판단
    };
}

const ProductListHero = ({ currentCategory }: ProductListHeroProps) => {
    const isCollection = "image" in currentCategory;

    if (isCollection) {
        return (
            <section className="relative w-full h-screen">
                <img
                    src={currentCategory.image}
                    className="w-full h-full object-cover"
                    alt="hero"
                />
                <div className="absolute inset-0 bg-black/10 flex flex-col justify-end pb-20 px-10">
                    <h2 className="text-white text-[24px] font-bold uppercase">
                        {currentCategory.title}
                    </h2>
                    <p className="text-white text-[12px] opacity-90 w-[400px]">
                        {currentCategory.description}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="pt-24 pb-12 text-center">
            <h2 className="text-[18px] font-bold uppercase tracking-widest">
                {currentCategory.title}
            </h2>
            <p className="text-[11px] text-gray-500 mt-4">
                {currentCategory.description}
            </p>
        </section>
    );
};

export default ProductListHero;