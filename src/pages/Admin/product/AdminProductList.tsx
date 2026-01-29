import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { MdAdd, MdEdit, MdDelete, MdSearch, MdChevronLeft, MdChevronRight, MdRefresh } from "react-icons/md";
import { fetchProducts } from "../../../api/product.api";
import { deleteProduct } from "../../../api/admin.product.api";
import type { Product } from "../../../types/product";

const AdminProductList = () => {
    const navigate = useNavigate();

    // Data States
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    // Filter States (검색 기능은 추후 백엔드 API 지원 시 연동)
    const [searchQuery, setSearchQuery] = useState("");

    // 데이터 로딩
    const loadProducts = async (page: number) => {
        try {
            setLoading(true);
            // 공용 API 사용
            const response = await fetchProducts({
                page,
                limit,
                sort: "latest", // 최신순 정렬 기본
            });

            setProducts(response.data);
            setTotalPages(response.pagination.totalPages);
            setTotalProducts(response.pagination.total);
        } catch (error) {
            console.error("상품 목록 로딩 실패", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts(currentPage);
    }, [currentPage]);

    // 가격 포맷팅 (KRW)
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(price);
    };

    // 상품 삭제
    const handleDelete = async (id: number) => {
        if (window.confirm("정말 이 상품을 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.")) {
            try {
                await deleteProduct(id); // 관리자 API 사용
                alert("상품이 삭제되었습니다.");
                loadProducts(currentPage); // 목록 새로고침
            } catch (error: any) {
                alert(error.response?.data?.message || "상품 삭제에 실패했습니다.");
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* --- Header --- */}
            <div className="flex justify-between items-end pb-4 border-b border-black/10">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-[0.15em] text-[#111]">
                        상품 목록
                    </h1>
                    <p className="text-xs text-gray-500 mt-2 tracking-wider uppercase">
                        전체 상품 조회 및 관리 ({totalProducts} items)
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* 검색 바 */}
                    <div className="flex items-center gap-2 border-b border-gray-300 pb-1 px-2 w-48">
                        <MdSearch className="text-gray-400 text-lg" />
                        <input
                            type="text"
                            placeholder="상품명 검색"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-xs w-full placeholder:text-[10px]"
                        />
                    </div>

                    {/* 새로고침 버튼 */}
                    <button
                        onClick={() => loadProducts(currentPage)}
                        className="p-2 text-gray-400 hover:text-black transition-colors"
                        title="새로고침"
                    >
                        <MdRefresh className="text-xl" />
                    </button>

                    {/* 상품 등록 버튼 */}
                    <button
                        onClick={() => navigate("/admin/product/create")}
                        className="flex items-center gap-2 bg-[#111] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-black/80 transition-colors"
                    >
                        <MdAdd className="text-sm" />
                        <span>상품 등록</span>
                    </button>
                </div>
            </div>

            {/* --- Table Area --- */}
            <div className="bg-white shadow-sm border border-gray-100 min-h-[500px]">
                {loading ? (
                    <div className="p-20 text-center text-xs text-gray-400 tracking-widest">
                        데이터를 불러오는 중입니다...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-24">이미지</th>
                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">상품 정보</th>
                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">카테고리</th>
                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">가격</th>
                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">등록일</th>
                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">관리</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-xs text-gray-400">
                                        등록된 상품이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors group"
                                    >
                                        {/* 이미지 */}
                                        <td className="p-4">
                                            <div className="w-16 h-16 bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-100">
                                                {product.images && product.images.length > 0 ? (
                                                    <img
                                                        src={product.images[0].url}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-[9px] text-gray-400">NO IMG</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* 상품 정보 */}
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1 max-w-[200px]">
                                                <span className="text-sm font-bold text-[#111] truncate">{product.name}</span>
                                                <span className="text-[10px] text-gray-400 uppercase tracking-wider truncate">
                                                        {product.summary}
                                                    </span>
                                                <span className="text-[9px] text-gray-400 mt-1">
                                                        {product.collection} / {product.Shape}
                                                    </span>
                                            </div>
                                        </td>

                                        {/* 카테고리 */}
                                        <td className="p-4 text-xs text-gray-600 font-medium">
                                            {product.category?.name || <span className="text-gray-300">-</span>}
                                            <div className="text-[9px] text-gray-400 mt-1 font-mono">
                                                /{product.category?.path}
                                            </div>
                                        </td>

                                        {/* 가격 */}
                                        <td className="p-4 text-xs text-[#111] font-mono tracking-wide font-bold">
                                            {formatPrice(product.price)}
                                        </td>

                                        {/* 등록일 */}
                                        <td className="p-4 text-[10px] text-gray-400 font-mono">
                                            {new Date(product.createdAt).toLocaleDateString()}
                                        </td>

                                        {/* 관리 버튼 */}
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => navigate(`/admin/product/edit/${product.id}`)}
                                                    className="p-2 hover:bg-black hover:text-white rounded-full transition-colors text-gray-400"
                                                    title="수정"
                                                >
                                                    <MdEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 hover:bg-red-500 hover:text-white rounded-full transition-colors text-gray-400"
                                                    title="삭제"
                                                >
                                                    <MdDelete />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* --- Pagination --- */}
            <div className="flex justify-end gap-2 pt-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-black hover:text-black disabled:opacity-30 disabled:hover:border-gray-200 transition-colors"
                >
                    <MdChevronLeft />
                </button>
                <div className="flex items-center gap-2 px-4 text-xs font-medium tracking-widest text-gray-500">
                    <span className="text-black">{currentPage}</span> / {totalPages}
                </div>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-black hover:text-black disabled:opacity-30 disabled:hover:border-gray-200 transition-colors"
                >
                    <MdChevronRight />
                </button>
            </div>
        </div>
    );
};

export default AdminProductList;