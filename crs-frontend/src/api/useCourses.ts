import { useState, useEffect, useCallback } from 'react';
import { getCourses } from './courseApi';
import type { Course } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';
import axios from 'axios';

export type LoadState = 'loading' | 'success' | 'empty' | 'error';

export function useCourses(keyword: string, page: number, size = 10) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [state, setState] = useState<LoadState>('loading');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const fetchCourses = useCallback(async () => {
        setState('loading');
        try {
            const res = await getCourses(keyword, page, size);
            const data = res.data;
            setCourses(data.content || []);
            setTotalPages(data.totalPages || 0);
            setState(!data.content || data.content.length === 0 ? 'empty' : 'success');
        } catch (err) {
            let message = 'Đã xảy ra lỗi không xác định, vui lòng thử lại.';
            if (axios.isAxiosError<ApiErrorResponse>(err)) {
                if (err.response?.data?.message) {
                    message = err.response.data.message;
                } else if (!err.response) {
                    message = 'Không kết nối được tới hệ thống. Vui lòng thử lại sau.';
                }
            }
            setErrorMessage(message);
            setState('error');
        }
    }, [keyword, page, size]);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                const res = await getCourses(keyword, page, size);
                if (!isMounted) return;

                const data = res.data;
                setCourses(data.content || []);
                setTotalPages(data.totalPages || 0);
                setState(!data.content || data.content.length === 0 ? 'empty' : 'success');
            } catch (err) {
                if (!isMounted) return;

                let message = 'Đã xảy ra lỗi không xác định, vui lòng thử lại.';
                if (axios.isAxiosError<ApiErrorResponse>(err)) {
                    if (err.response?.data?.message) {
                        message = err.response.data.message;
                    } else if (!err.response) {
                        message = 'Không kết nối được tới hệ thống. Vui lòng thử lại sau.';
                    }
                }
                setErrorMessage(message);
                setState('error');
            }
        };

        void loadData();

        return () => {
            isMounted = false;
        };
    }, [keyword, page, size]);

    return { courses, totalPages, state, errorMessage, refetch: fetchCourses };
}