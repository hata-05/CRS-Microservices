import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login as loginApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import type { ApiErrorResponse } from '../types/apiError';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const res = await loginApi({ username: username.trim(), password });
            login(res.data);
            navigate('/courses');
        } catch (err) {
            if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: 380, margin: '60px auto' }}>
            <div className="clay-card">
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: '#0f172a' }}>
                    Đăng nhập hệ thống CRS
                </h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                    Hệ thống đăng ký học phần tín chỉ
                </p>

                {error && (
                    <div style={{
                        background: '#fee2e2',
                        border: '1px solid #fecaca',
                        color: '#b91c1c',
                        padding: '8px 12px',
                        borderRadius: 6,
                        marginBottom: 16,
                        fontSize: 13
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="clay-form-group">
                        <label className="clay-label">Tên đăng nhập</label>
                        <input
                            type="text"
                            className="clay-input"
                            placeholder="admin hoặc student1"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="clay-form-group" style={{ marginBottom: 20 }}>
                        <label className="clay-label">Mật khẩu</label>
                        <input
                            type="password"
                            className="clay-input"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="clay-btn clay-btn-primary"
                        disabled={submitting}
                        style={{ width: '100%', padding: '10px' }}
                    >
                        {submitting ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>

                <div style={{ marginTop: 16, fontSize: 12, color: '#64748b', textAlign: 'center' }}>
                    Tài khoản mẫu: <strong>admin</strong> / <strong>admin123</strong> (hoặc <strong>student1</strong>)
                </div>
            </div>
        </div>
    );
}
