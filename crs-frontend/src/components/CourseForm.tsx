import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Course, CourseFormValues } from '../types/course';
import { emptyCourseForm } from '../types/course';

interface CourseFormProps {
    editingCourse: Course | null;
    onSubmit: (values: CourseFormValues) => Promise<void>;
    onCancel: () => void;
    submitting: boolean;
    serverError: string | null;
}

export default function CourseForm({
    editingCourse,
    onSubmit,
    onCancel,
    submitting,
    serverError,
}: CourseFormProps) {
    const [values, setValues] = useState<CourseFormValues>(emptyCourseForm);
    const [clientErrors, setClientErrors] = useState<Partial<CourseFormValues>>({});
    const [prevEditingCourse, setPrevEditingCourse] = useState<Course | null>(null);

    if (editingCourse !== prevEditingCourse) {
        setPrevEditingCourse(editingCourse);
        setValues(
            editingCourse
                ? {
                    tenMonHoc: editingCourse.tenMonHoc,
                    soTinChi: String(editingCourse.soTinChi),
                    soChoToiDa: String(editingCourse.soChoToiDa),
                }
                : emptyCourseForm
        );
        setClientErrors({});
    }

    const validate = (): boolean => {
        const errors: Partial<CourseFormValues> = {};
        if (!values.tenMonHoc.trim()) {
            errors.tenMonHoc = 'Tên môn học không được để trống';
        }
        const soTinChi = Number(values.soTinChi);
        if (!values.soTinChi || isNaN(soTinChi) || soTinChi <= 0) {
            errors.soTinChi = 'Số tín chỉ phải là số nguyên dương lớn hơn 0';
        }
        const soChoToiDa = Number(values.soChoToiDa);
        if (!values.soChoToiDa || isNaN(soChoToiDa) || soChoToiDa <= 0) {
            errors.soChoToiDa = 'Số chỗ tối đa phải là số lớn hơn 0';
        }
        setClientErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        void (async () => {
            try {
                await onSubmit(values);
            } catch {
                // Handled via props
            }
        })();
    };

    return (
        <div className="clay-card animate-fade-in" style={{ marginBottom: 28 }}>
            <div className="clay-card-header">
                <div className="clay-card-title-group">
                    <div className={`clay-orb ${editingCourse ? 'clay-orb-pink' : 'clay-orb-violet'}`}>
                        {editingCourse ? (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        ) : (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        )}
                    </div>
                    <div>
                        <h2 className="clay-card-title">
                            {editingCourse ? `Chỉnh sửa môn học: ${editingCourse.tenMonHoc}` : 'Thêm môn học mới'}
                        </h2>
                        <p className="clay-card-subtitle">
                            {editingCourse ? 'Cập nhật số tín chỉ hoặc chỉ tiêu số lượng sinh viên' : 'Nhập thông tin môn học để đưa vào danh sách đăng ký học phần'}
                        </p>
                    </div>
                </div>

                {editingCourse && (
                    <span className="clay-badge clay-badge-warning">
                        Đang ở chế độ chỉnh sửa
                    </span>
                )}
            </div>

            {serverError && (
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
                    {serverError}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
                    <div className="clay-form-group">
                        <label className="clay-label">
                            Tên môn học <span style={{ color: 'var(--clay-rose)' }}>*</span>
                        </label>
                        <input
                            type="text"
                            className="clay-input"
                            placeholder="Ví dụ: Phát triển phần mềm hướng dịch vụ"
                            value={values.tenMonHoc}
                            onChange={(e) => setValues({ ...values, tenMonHoc: e.target.value })}
                        />
                        {clientErrors.tenMonHoc && (
                            <p style={{ color: 'var(--clay-rose)', fontSize: '0.82rem', fontWeight: 700, marginTop: 4 }}>
                                {clientErrors.tenMonHoc}
                            </p>
                        )}
                    </div>

                    <div className="clay-form-group">
                        <label className="clay-label">
                            Số tín chỉ <span style={{ color: 'var(--clay-rose)' }}>*</span>
                        </label>
                        <input
                            type="number"
                            className="clay-input"
                            placeholder="Ví dụ: 3"
                            min="1"
                            value={values.soTinChi}
                            onChange={(e) => setValues({ ...values, soTinChi: e.target.value })}
                        />
                        {clientErrors.soTinChi && (
                            <p style={{ color: 'var(--clay-rose)', fontSize: '0.82rem', fontWeight: 700, marginTop: 4 }}>
                                {clientErrors.soTinChi}
                            </p>
                        )}
                    </div>

                    <div className="clay-form-group">
                        <label className="clay-label">
                            Số chỗ tối đa <span style={{ color: 'var(--clay-rose)' }}>*</span>
                        </label>
                        <input
                            type="number"
                            className="clay-input"
                            placeholder="Ví dụ: 50"
                            min="1"
                            value={values.soChoToiDa}
                            onChange={(e) => setValues({ ...values, soChoToiDa: e.target.value })}
                        />
                        {clientErrors.soChoToiDa && (
                            <p style={{ color: 'var(--clay-rose)', fontSize: '0.82rem', fontWeight: 700, marginTop: 4 }}>
                                {clientErrors.soChoToiDa}
                            </p>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                    {editingCourse && (
                        <button type="button" onClick={onCancel} className="clay-btn clay-btn-secondary">
                            Hủy bỏ
                        </button>
                    )}
                    <button type="submit" disabled={submitting} className="clay-btn clay-btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>
                            {submitting ? 'Đang lưu...' : (editingCourse ? 'Lưu thay đổi' : 'Tạo môn học mới')}
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
}
