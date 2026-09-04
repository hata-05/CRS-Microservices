import { useState } from 'react';
import axios from 'axios';
import { useCourses } from '../api/useCourses';
import { registerCourse } from '../api/registrationApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import SearchBox from '../components/SearchBox';
import CourseList from '../components/CourseList';
import Pagination from '../components/Pagination';
import Toast from '../components/Toast';
import type { Course } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';

export default function RegisterCoursePage() {
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [registeringId, setRegisteringId] = useState<number | null>(null);

    const { user } = useAuth();
    const { toast, showToast, clearToast } = useToast();
    const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page);

    const handleSearch = (newKeyword: string) => {
        setKeyword(newKeyword);
        setPage(0);
    };

    const handleRegister = (course: Course) => {
        if (!user) {
            showToast('Vui lòng đăng nhập vào tài khoản để đăng ký học phần!', 'error');
            return;
        }

        setRegisteringId(course.id);
        void (async () => {
            try {
                await registerCourse({ studentId: user.id, courseId: course.id });
                showToast(`Đăng ký thành công môn học "${course.tenMonHoc}"!`, 'success');
                refetch();
            } catch (err) {
                let message = 'Đăng ký không thành công, vui lòng thử lại.';
                if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
                    message = err.response.data.message;
                }
                showToast(message, 'error');
            } finally {
                setRegisteringId(null);
            }
        })();
    };

    return (
        <div className="animate-fade-in">
            {/* Page Header */}
            <div className="clay-page-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                    <div>
                        <h1 className="clay-page-title">
                            <span className="clay-orb clay-orb-emerald" style={{ width: 44, height: 44 }}>
                                ✍️
                            </span>
                            Đăng Ký Học Phần
                        </h1>
                        <p className="clay-page-subtitle">
                            Lựa chọn các môn học trong kỳ đào tạo và ghi danh giữ chỗ tức thời theo số lượng còn lại
                        </p>
                    </div>

                    <SearchBox onSearch={handleSearch} />
                </div>
            </div>

            {/* Course List with Register Action */}
            <div style={{ marginTop: 24 }}>
                <CourseList
                    courses={courses}
                    state={state}
                    errorMessage={errorMessage}
                    onRetry={refetch}
                    onRegister={handleRegister}
                    registeringId={registeringId}
                />
            </div>

            {state === 'success' && totalPages > 1 && (
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
        </div>
    );
}
