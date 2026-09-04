import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { getApiKeys, createApiKey, revokeApiKey } from '../api/apiKeyApi';
import type { ApiKey } from '../types/apiKey';
import type { ApiErrorResponse } from '../types/apiError';

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [ownerName, setOwnerName] = useState('');
    const [scopes, setScopes] = useState('courses:read');
    const [validDays, setValidDays] = useState('30');
    const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const loadKeys = useCallback(() => {
        setLoading(true);
        getApiKeys()
            .then((res) => {
                setKeys(res.data);
                setError(null);
            })
            .catch(() => setError('Không thể tải danh sách API Key.'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadKeys();
    }, [loadKeys]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setNewKeyValue(null);
        setCopied(false);
        setSubmitting(true);
        try {
            const res = await createApiKey({
                ownerName: ownerName.trim(),
                scopes: scopes.trim(),
                validDays: validDays ? Number(validDays) : undefined,
            });
            setNewKeyValue(res.data.keyValue);
            setOwnerName('');
            loadKeys();
        } catch (err) {
            if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Cấp API Key không thành công, vui lòng thử lại.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleRevoke = async (key: ApiKey) => {
        if (!window.confirm(`Xác nhận thu hồi API Key của đối tác "${key.ownerName}"? Thao tác này sẽ vô hiệu hóa quyền gọi API của đối tác.`)) return;
        try {
            await revokeApiKey(key.id);
            loadKeys();
        } catch {
            alert('Thu hồi API Key không thành công.');
        }
    };

    const handleCopy = () => {
        if (!newKeyValue) return;
        navigator.clipboard.writeText(newKeyValue).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    return (
        <div className="animate-fade-in">
            {/* Page Header */}
            <div className="clay-page-header">
                <h1 className="clay-page-title">
                    <span className="clay-orb clay-orb-violet" style={{ width: 44, height: 44 }}>
                        🔑
                    </span>
                    Quản Lý API Key Đối Tác
                </h1>
                <p className="clay-page-subtitle">
                    Cấp phát, phân quyền theo phạm vi (scope) và thu hồi mã khóa tích hợp dành cho hệ thống bên ngoài
                </p>
            </div>

            {/* Form cấp Key mới */}
            <div className="clay-card" style={{ marginBottom: 28 }}>
                <div className="clay-card-header">
                    <div className="clay-card-title-group">
                        <div className="clay-orb clay-orb-emerald">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                <circle cx="7.5" cy="15.5" r="4.5"></circle>
                                <path d="m21 2-9.6 9.6"></path>
                                <path d="m15.5 7.5 3 3"></path>
                            </svg>
                        </div>
                        <div>
                            <h2 className="clay-card-title">Cấp API Key mới</h2>
                            <p className="clay-card-subtitle">
                                Thiết lập quyền truy cập cho đối tác theo từng phạm vi API được chỉ định
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div style={{
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        color: '#991B1B',
                        padding: '12px 18px',
                        borderRadius: 16,
                        marginBottom: 20,
                        fontSize: '0.9rem',
                        fontWeight: 600
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleCreate}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
                        <div className="clay-form-group">
                            <label className="clay-label">
                                Tên đối tác <span style={{ color: 'var(--clay-rose)' }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="clay-input"
                                placeholder="Ví dụ: Công ty ABC Edu"
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="clay-form-group">
                            <label className="clay-label">
                                Phạm vi quyền (Scopes) <span style={{ color: 'var(--clay-rose)' }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="clay-input"
                                placeholder="courses:read"
                                value={scopes}
                                onChange={(e) => setScopes(e.target.value)}
                                required
                            />
                        </div>

                        <div className="clay-form-group">
                            <label className="clay-label">
                                Hiệu lực (số ngày, để trống = vĩnh viễn)
                            </label>
                            <input
                                type="number"
                                className="clay-input"
                                placeholder="30"
                                min="1"
                                value={validDays}
                                onChange={(e) => setValidDays(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                        <button type="submit" disabled={submitting} className="clay-btn clay-btn-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="7.5" cy="15.5" r="4.5"></circle>
                                <path d="m21 2-9.6 9.6"></path>
                            </svg>
                            <span>{submitting ? 'Đang cấp...' : 'Cấp API Key ngay'}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Hộp thông báo Key vừa tạo (chỉ hiển thị 1 lần duy nhất) */}
            {newKeyValue && (
                <div className="clay-card animate-fade-in" style={{
                    background: '#FFFBEB',
                    border: '1.5px solid #FDE68A',
                    marginBottom: 28,
                    padding: '24px 28px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#92400E', fontWeight: 800, fontSize: '0.95rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                            Key vừa tạo (chỉ hiển thị 1 lần duy nhất, hãy sao chép và lưu trữ an toàn ngay):
                        </div>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="clay-btn clay-btn-sm"
                            style={{
                                background: copied ? 'var(--clay-emerald)' : 'var(--clay-amber)',
                                color: '#FFFFFF',
                                fontWeight: 800
                            }}
                        >
                            {copied ? '✓ Đã sao chép' : 'Sao chép Key'}
                        </button>
                    </div>
                    <pre style={{
                        background: '#1E1B24',
                        color: '#38BDF8',
                        padding: '16px 20px',
                        borderRadius: 'var(--radius-input)',
                        fontSize: '0.95rem',
                        fontFamily: 'var(--font-mono)',
                        overflowX: 'auto',
                        userSelect: 'all',
                        boxShadow: 'inset 6px 6px 14px rgba(0,0,0,0.35)'
                    }}>
                        {newKeyValue}
                    </pre>
                </div>
            )}

            {/* Danh sách API Key */}
            <div className="clay-card-header" style={{ marginTop: 24, marginBottom: 16 }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--clay-foreground)' }}>
                    Danh sách API Key trong hệ thống
                </h2>
            </div>

            {loading ? (
                <div className="clay-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <p style={{ color: 'var(--clay-muted)', fontWeight: 700 }}>Đang tải danh sách API Key...</p>
                </div>
            ) : keys.length === 0 ? (
                <div className="clay-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
                    <div className="clay-orb clay-orb-sky" style={{ width: 56, height: 56, margin: '0 auto 16px', fontSize: '1.5rem' }}>
                        🔑
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--clay-foreground)' }}>
                        Chưa có API Key nào được cấp
                    </h3>
                    <p style={{ color: 'var(--clay-muted)', fontSize: '0.9rem', marginTop: 4 }}>
                        Sử dụng form phía trên để cấp mã khóa đầu tiên cho đối tác
                    </p>
                </div>
            ) : (
                <div className="clay-table-container">
                    <table className="clay-table">
                        <thead>
                            <tr>
                                <th>Đối tác</th>
                                <th>Scopes</th>
                                <th style={{ textAlign: 'center', width: 140 }}>Trạng thái</th>
                                <th>Hạn sử dụng</th>
                                <th style={{ textAlign: 'right', width: 140 }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {keys.map((k) => (
                                <tr key={k.id}>
                                    <td style={{ fontWeight: 800, color: 'var(--clay-foreground)' }}>
                                        {k.ownerName}
                                    </td>
                                    <td>
                                        <span className="clay-badge clay-badge-info" style={{ fontFamily: 'var(--font-mono)' }}>
                                            {k.scopes}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className={`clay-badge ${k.status === 'ACTIVE' ? 'clay-badge-success' : 'clay-badge-danger'}`}>
                                            {k.status === 'ACTIVE' ? '● ACTIVE' : '● REVOKED'}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--clay-muted)' }}>
                                        {k.expiresAt ? new Date(k.expiresAt).toLocaleDateString('vi-VN') : 'Vĩnh viễn'}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        {k.status === 'ACTIVE' ? (
                                            <button
                                                type="button"
                                                onClick={() => handleRevoke(k)}
                                                className="clay-btn clay-btn-danger clay-btn-sm"
                                            >
                                                Thu hồi
                                            </button>
                                        ) : (
                                            <span style={{ color: 'var(--clay-subtle)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                                                Đã thu hồi
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
