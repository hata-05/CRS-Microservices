import type { Course } from '../types/course';
import type { LoadState } from '../api/useCourses';

interface CourseListProps {
    courses: Course[];
    state: LoadState;
    errorMessage: string;
    onRetry: () => void;
    onEdit?: (course: Course) => void;
    onDelete?: (course: Course) => void;
    onRegister?: (course: Course) => void;
    registeringId?: number | null;
}

export default function CourseList({
    courses,
    state,
    errorMessage,
    onRetry,
    onEdit,
    onDelete,
    onRegister,
    registeringId,
}: CourseListProps) {
    if (state === 'loading') {
        return <p style={{ padding: '16px 0', color: '#64748b' }}>Đang tải danh sách môn học...</p>;
    }

    if (state === 'error') {
        return (
            <div style={{ color: '#b91c1c', padding: '12px 0' }}>
                <p style={{ marginBottom: 8 }}>{errorMessage}</p>
                <button type="button" onClick={onRetry} className="clay-btn clay-btn-secondary clay-btn-sm">
                    Thử lại
                </button>
            </div>
        );
    }

    if (state === 'empty' || courses.length === 0) {
        return <p style={{ padding: '16px 0', color: '#64748b' }}>Không tìm thấy môn học nào phù hợp.</p>;
    }

    const showActions = !!onEdit || !!onDelete || !!onRegister;

    return (
        <div className="clay-table-container">
            <table className="clay-table">
                <thead>
                    <tr>
                        <th>Tên môn học</th>
                        <th style={{ textAlign: 'center', width: 110 }}>Số tín chỉ</th>
                        <th style={{ textAlign: 'center', width: 160 }}>Số chỗ</th>
                        {showActions && <th style={{ textAlign: 'right', width: 160 }}>Thao tác</th>}
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => {
                        const isFull = course.soChoConLai === 0;

                        return (
                            <tr key={course.id}>
                                <td>
                                    <span style={{ fontWeight: 600, color: '#0f172a' }}>
                                        {course.tenMonHoc}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {course.soTinChi}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <span className={`clay-badge ${isFull ? 'clay-badge-danger' : 'clay-badge-success'}`}>
                                        {isFull ? 'Hết chỗ' : `${course.soChoConLai} / ${course.soChoToiDa}`}
                                    </span>
                                </td>
                                {showActions && (
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                                            {onEdit && (
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(course)}
                                                    className="clay-btn clay-btn-secondary clay-btn-sm"
                                                >
                                                    Sửa
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(course)}
                                                    className="clay-btn clay-btn-danger clay-btn-sm"
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                            {onRegister && (
                                                <button
                                                    type="button"
                                                    onClick={() => onRegister(course)}
                                                    disabled={isFull || registeringId === course.id}
                                                    className="clay-btn clay-btn-primary clay-btn-sm"
                                                    style={{
                                                        opacity: isFull ? 0.6 : 1,
                                                        cursor: isFull ? 'not-allowed' : 'pointer'
                                                    }}
                                                >
                                                    {registeringId === course.id ? 'Đang xử lý...' : isFull ? 'Hết chỗ' : 'Đăng ký'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
