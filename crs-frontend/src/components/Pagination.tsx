interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i);

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
            <button
                type="button"
                className="clay-btn clay-btn-secondary clay-btn-sm"
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
                style={{ opacity: currentPage === 0 ? 0.45 : 1, cursor: currentPage === 0 ? 'not-allowed' : 'pointer' }}
            >
                ← Trang trước
            </button>
            {pages.map((p) => {
                const isActive = p === currentPage;
                return (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onPageChange(p)}
                        className={`clay-btn clay-btn-sm ${isActive ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
                        style={{
                            minWidth: 40,
                            height: 38,
                            padding: '6px 12px',
                            fontWeight: isActive ? 900 : 700
                        }}
                    >
                        {p + 1}
                    </button>
                );
            })}
            <button
                type="button"
                className="clay-btn clay-btn-secondary clay-btn-sm"
                disabled={currentPage >= totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
                style={{ opacity: currentPage >= totalPages - 1 ? 0.45 : 1, cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer' }}
            >
                Trang sau →
            </button>
        </div>
    );
}
