import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getMyRegistrations, cancelRegistration } from '../api/registrationApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import type { Registration } from '../types/registration';
import type { ApiErrorResponse } from '../types/apiError';

export default function MyRegistrationsPage() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<number | null>(null);

    const { user } = useAuth();
    const { toast, showToast, clearToast } = useToast();

    const loadData = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const res = await getMyRegistrations();
            const data = 'data' in res ? (res.data as Registration[]) : (res as Registration[]);
            setRegistrations(data);
            setLoadError(null);
        } catch (err) {
            let message = 'Không thể tải danh sách môn học đã đăng ký.';
            if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
                message = err.response.data.message;
            }
            setLoadError(message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        let active = true;

        Promise.resolve().then(async () => {
            if (!user) {
                if (active) setLoading(false);
                return;
            }
            try {
                const res = await getMyRegistrations();
                const data = 'data' in res ? (res.data as Registration[]) : (res as Registration[]);
                if (active) {
                    setRegistrations(data);
                    setLoadError(null);
                }
            } catch (err) {
                if (active) {
                    let message = 'Không thể tải danh sách môn học đã đăng ký.';
                    if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
                        message = err.response.data.message;
                    }
                    setLoadError(message);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }).catch(() => {});

        return () => {
            active = false;
        };
    }, [user]);

    const handleCancel = async (row: Registration) => {
        const courseName =
            (row as unknown as Record<string, string>).courseName ??
            (row as unknown as Record<string, string>).tenMonHoc ??
            'học phần này';

        if (!window.confirm(`Bạn có chắc chắn muốn hủy đăng ký môn học "${courseName}"? Chỗ trống sẽ được trả lại cho sinh viên khác.`)) return;

        setCancellingId(row.id);
        try {
            await cancelRegistration(row.id);
            showToast(`Đã hủy đăng ký môn học "${courseName}" thành công!`, 'success');
            await loadData();
        } catch (err) {
            let message = 'Hủy đăng ký thất bại, vui lòng thử lại.';
            if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
                message = err.response.data.message;
            }
            showToast(message, 'error');
        } finally {
            setCancellingId(null);
        }
    };

    const handleRetry = () => {
        setLoading(true);
        void loadData();
    };

    return (
        <div className="animate-fade-in">
            {/* Page Header */}
            <div className="clay-page-header">
                <h1 className="clay-page-title">
                    <span className="clay-orb clay-orb-emerald" style={{ width: 44, height: 44 }}>
                        🎓
                    </span>
                    Môn Học Đã Đăng Ký
                </h1>
                <p className="clay-page-subtitle">
                    Theo dõi danh sách các học phần bạn đã ghi danh thành công và quản lý kế hoạch học tập của bạn
                </p>
            </div>

            {loading && (
                <div className="clay-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
                    <div className="clay-orb clay-orb-violet" style={{ width: 52, height: 52, margin: '0 auto 16px', animation: 'clay-breathe 2s infinite' }}>
                        ⏳
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--clay-foreground)' }}>
                        Đang tải danh sách đăng ký...
                    </h3>
                </div>
            )}

            {loadError && (
                <div className="clay-card" style={{ textAlign: 'center', padding: '40px 24px', background: '#FEF2F2', border: '1.5px solid #FECACA' }}>
                    <p style={{ color: '#991B1B', fontWeight: 700, marginBottom: 16 }}>{loadError}</p>
                    <button type="button" onClick={handleRetry} className="clay-btn clay-btn-primary">
                        Thử lại kết nối
                    </button>
                </div>
            )}

            {!loading && !loadError && registrations.length === 0 && (
                <div className="clay-card" style={{ textAlign: 'center', padding: '56px 24px' }}>
                    <div className="clay-orb clay-orb-sky" style={{ width: 64, height: 64, margin: '0 auto 18px', fontSize: '1.8rem' }}>
                        📝
                    </div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--clay-foreground)', marginBottom: 8 }}>
                        Bạn chưa đăng ký môn học nào trong kỳ này
                    </h2>
                    <p style={{ color: 'var(--clay-muted)', fontSize: '0.95rem', marginBottom: 24 }}>
                        Hãy vào trang Đăng ký học phần để chọn các môn học phù hợp với thời khóa biểu của bạn
                    </p>
                    <Link to="/register-course" className="clay-btn clay-btn-primary clay-btn-lg">
                        <span>Đến trang Đăng ký học phần</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                    </Link>
                </div>
            )}

            {!loading && !loadError && registrations.length > 0 && (
                <div className="clay-table-container">
                    <table className="clay-table">
                        <thead>
                            <tr>
                                <th>Tên môn học</th>
                                <th style={{ textAlign: 'center', width: 140 }}>Số tín chỉ</th>
                                <th style={{ textAlign: 'center', width: 160 }}>Trạng thái</th>
                                <th style={{ textAlign: 'right', width: 160 }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map((row) => {
                                const rowData = row as unknown as Record<string, string | number>;
                                const name = String(rowData.courseName ?? rowData.tenMonHoc ?? 'Học phần đã đăng ký');
                                const credits = String(rowData.credits ?? rowData.soTinChi ?? '3');

                                return (
                                    <tr key={row.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                                <div className="clay-orb clay-orb-emerald" style={{ width: 42, height: 42 }}>
                                                    ✓
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--clay-foreground)' }}>
                                                        {name}
                                                    </div>
                                                    <div style={{ fontSize: '0.82rem', color: 'var(--clay-subtle)', marginTop: 2 }}>
                                                        Mã đăng ký: REG-{row.id.toString().padStart(4, '0')}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className="clay-badge clay-badge-info" style={{ fontWeight: 800 }}>
                                                {credits} Tín chỉ
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className="clay-badge clay-badge-success">
                                                ● Đã ghi danh
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    void handleCancel(row);
                                                }}
                                                disabled={cancellingId === row.id}
                                                className="clay-btn clay-btn-danger clay-btn-sm"
                                            >
                                                {cancellingId === row.id ? (
                                                    'Đang hủy...'
                                                ) : (
                                                    <>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                                        </svg>
                                                        <span>Hủy môn</span>
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
        </div>
    );
}
