import { useNavigate, useSearchParams } from "react-router";

function OrderFailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const code = searchParams.get("code");
    const message = searchParams.get("message");

    return (
        <div className="max-w-xl mx-auto px-4 py-40 text-center">
            <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                    <span className="text-4xl font-bold">!</span>
                </div>
            </div>

            <h1 className="text-3xl font-bold mb-4">주문에 실패했습니다.</h1>
            <p className="text-gray-600 mb-8">
                결제 진행 중 오류가 발생했거나 취소되었습니다.
                <br />
                다시 시도해주세요.
            </p>

            <div className="bg-red-50 p-5 rounded-lg text-left mb-10 border border-red-100">
                <p className="text-red-700 text-sm font-medium">오류 내용</p>
                <p className="text-gray-800 mt-1">
                    {message || "알 수 없는 오류가 발생했습니다."}
                    {code && <span className="text-gray-500 text-xs ml-2">({code})</span>}
                </p>
            </div>

            <div className="flex gap-4 justify-center">
                <button  onClick={() => navigate("/shoppingbag")}>
                    장바구니로 가기
                </button>
                <button
                    onClick={() => navigate("/order")} // 다시 주문 페이지로
                >
                    다시 주문하기
                </button>
            </div>
        </div>
    );
}

export default OrderFailPage;
