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
            showToast('Vui lòng đăng nhập để đăng ký học phần!', 'error');
            return;
        }

        setRegisteringId(course.id);
        void (async () => {
            try {
                await registerCourse({ studentId: user.id, courseId: course.id });
                showToast(`Đăng ký thành công môn "${course.tenMonHoc}"`, 'success');
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
        <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
            <h1>Đăng ký học phần</h1>

            <SearchBox onSearch={handleSearch} />

            <div style={{ marginTop: 16 }}>
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