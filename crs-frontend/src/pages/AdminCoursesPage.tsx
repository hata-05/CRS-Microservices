import { useState } from 'react';
import axios from 'axios';
import { useCourses } from '../api/useCourses';
import { createCourse, updateCourse, deleteCourse } from '../api/courseApi';
import SearchBox from '../components/SearchBox';
import CourseList from '../components/CourseList';
import Pagination from '../components/Pagination';
import CourseForm from '../components/CourseForm';
import type { Course, CourseFormValues } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';

export default function AdminCoursesPage() {
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page);

    const handleSearch = (newKeyword: string) => {
        setKeyword(newKeyword);
        setPage(0);
    };

    const extractErrorMessage = (err: unknown): string => {
        if (axios.isAxiosError<ApiErrorResponse>(err)) {
            const data = err.response?.data;
            if (data?.message) return data.message;
            if (data) {
                const firstFieldError = Object.values(data).find((v) => typeof v === 'string');
                if (firstFieldError) return firstFieldError;
            }
        }
        return 'Đã xảy ra lỗi khi thực hiện thao tác, vui lòng thử lại.';
    };

    const handleFormSubmit = async (values: CourseFormValues) => {
        setSubmitting(true);
        setFormError(null);
        try {
            if (editingCourse) {
                await updateCourse(editingCourse.id, values);
            } else {
                await createCourse(values);
            }
            setEditingCourse(null);
            refetch();
        } catch (err) {
            setFormError(extractErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (course: Course) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa môn học "${course.tenMonHoc}"? Thao tác này không thể hoàn tác.`)) {
            return;
        }
        try {
            await deleteCourse(course.id);
            refetch();
        } catch (err) {
            alert(extractErrorMessage(err));
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Page Header */}
            <div className="clay-page-header">
                <h1 className="clay-page-title">
                    <span className="clay-orb clay-orb-pink" style={{ width: 44, height: 44 }}>
                        🛠️
                    </span>
                    Quản Trị Môn Học (Admin)
                </h1>
                <p className="clay-page-subtitle">
                    Thêm mới học phần, điều chỉnh số tín chỉ và chỉ tiêu số lượng sinh viên trong chương trình đào tạo
                </p>
            </div>

            {/* Form Thêm/Sửa môn học */}
            <CourseForm
                editingCourse={editingCourse}
                onSubmit={handleFormSubmit}
                onCancel={() => setEditingCourse(null)}
                submitting={submitting}
                serverError={formError}
            />

            {/* Tìm kiếm & Danh sách */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--clay-foreground)' }}>
                    Danh sách các học phần hiện có
                </h2>
                <SearchBox onSearch={handleSearch} />
            </div>

            <CourseList
                courses={courses}
                state={state}
                errorMessage={errorMessage}
                onRetry={refetch}
                onEdit={setEditingCourse}
                onDelete={handleDelete}
            />

            {/* Pagination */}
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}
