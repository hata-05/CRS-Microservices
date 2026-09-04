import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="clay-navbar-wrapper">
            <nav className="clay-navbar">
                <Link to="/courses" className="clay-brand">
                    <span>CRS Portal</span>
                </Link>

                <div className="clay-nav-links">
                    <Link
                        to="/courses"
                        className={`clay-nav-link ${isActive('/courses') ? 'active' : ''}`}
                    >
                        Danh sách môn học
                    </Link>

                    {isAuthenticated && user?.role === 'ADMIN' && (
                        <>
                            <Link
                                to="/admin/courses"
                                className={`clay-nav-link ${isActive('/admin/courses') ? 'active' : ''}`}
                            >
                                Quản trị môn học
                            </Link>
                            <Link
                                to="/admin/api-keys"
                                className={`clay-nav-link ${isActive('/admin/api-keys') ? 'active' : ''}`}
                            >
                                Quản lý API Key
                            </Link>
                        </>
                    )}

                    {isAuthenticated && user?.role === 'STUDENT' && (
                        <>
                            <Link
                                to="/register-course"
                                className={`clay-nav-link ${isActive('/register-course') ? 'active' : ''}`}
                            >
                                Đăng ký học phần
                            </Link>
                            <Link
                                to="/my-registrations"
                                className={`clay-nav-link ${isActive('/my-registrations') ? 'active' : ''}`}
                            >
                                Môn đã đăng ký
                            </Link>
                        </>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {isAuthenticated && user ? (
                        <>
                            <span style={{ fontSize: 13, color: '#334155' }}>
                                Xin chào, <strong>{user.username}</strong> ({user.role})
                            </span>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="clay-btn clay-btn-secondary clay-btn-sm"
                            >
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="clay-btn clay-btn-primary clay-btn-sm">
                            Đăng nhập
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}
