import { useState, useEffect, useCallback } from 'react';
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
            let message = 'Không thể tải danh sách đăng ký.';
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
                    let message = 'Không thể tải danh sách đăng ký.';
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

        if (!window.confirm(`Hủy đăng ký môn "${courseName}"?`)) return;

        setCancellingId(row.id);
        try {
            await cancelRegistration(row.id);
            showToast(`Đã hủy đăng ký môn "${courseName}" thành công`, 'success');
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
        <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
            <h1>Danh sách học phần đã đăng ký</h1>

            {loading && <p>Đang tải danh sách...</p>}

            {loadError && (
                <div style={{ color: '#b91c1c', marginBottom: 16 }}>
                    <p>{loadError}</p>
                    <button type="button" onClick={handleRetry}>
                        Thử lại
                    </button>
                </div>
            )}

            {!loading && !loadError && registrations.length === 0 && (
                <p>Bạn chưa đăng ký môn học nào.</p>
            )}

            {!loading && !loadError && registrations.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
                    <thead>
                    <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                        <th style={{ padding: 8 }}>Tên môn học</th>
                        <th style={{ padding: 8 }}>Số tín chỉ</th>
                        <th style={{ padding: 8 }}>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {registrations.map((row) => {
                        const rowData = row as unknown as Record<string, string | number>;
                        const name = String(rowData.courseName ?? rowData.tenMonHoc ?? 'N/A');
                        const credits = String(rowData.credits ?? rowData.soTinChi ?? '0');

                        return (
                            <tr key={row.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: 8 }}>{name}</td>
                                <td style={{ padding: 8 }}>{credits}</td>
                                <td style={{ padding: 8 }}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            void handleCancel(row);
                                        }}
                                        disabled={cancellingId === row.id}
                                        style={{
                                            backgroundColor: '#dc2626',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '6px 12px',
                                            borderRadius: 4,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {cancellingId === row.id ? 'Đang hủy...' : 'Hủy đăng ký'}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
        </div>
    );
}