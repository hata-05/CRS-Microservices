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

    // Đồng bộ dữ liệu Form khi chọn sửa môn học khác (không dùng useEffect để tránh lỗi set-state-in-effect)
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
            errors.soTinChi = 'Số tín chỉ phải là số lớn hơn 0';
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
                // Lỗi serverError đã được xử lý qua props serverError từ Component cha
            }
        })();
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <h3>{editingCourse ? 'Sửa môn học' : 'Thêm môn học mới'}</h3>
            <div style={{ marginBottom: 8 }}>
                <label>Tên môn học</label><br />
                <input
                    type="text"
                    value={values.tenMonHoc}
                    onChange={(e) => setValues({ ...values, tenMonHoc: e.target.value })}
                />
                {clientErrors.tenMonHoc && <p style={{ color: '#b91c1c', margin: 0 }}>{clientErrors.tenMonHoc}</p>}
            </div>
            <div style={{ marginBottom: 8 }}>
                <label>Số tín chỉ</label><br />
                <input
                    type="number"
                    value={values.soTinChi}
                    onChange={(e) => setValues({ ...values, soTinChi: e.target.value })}
                />
                {clientErrors.soTinChi && <p style={{ color: '#b91c1c', margin: 0 }}>{clientErrors.soTinChi}</p>}
            </div>
            <div style={{ marginBottom: 8 }}>
                <label>Số chỗ tối đa</label><br />
                <input
                    type="number"
                    value={values.soChoToiDa}
                    onChange={(e) => setValues({ ...values, soChoToiDa: e.target.value })}
                />
                {clientErrors.soChoToiDa && <p style={{ color: '#b91c1c', margin: 0 }}>{clientErrors.soChoToiDa}</p>}
            </div>
            {serverError && <p style={{ color: '#b91c1c' }}>{serverError}</p>}
            <button type="submit" disabled={submitting}>
                {submitting ? 'Đang lưu...' : (editingCourse ? 'Cập nhật' : 'Thêm mới')}
            </button>
            {editingCourse && (
                <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>
                    Hủy
                </button>
            )}
        </form>
    );
}