import { useState, useCallback } from 'react';
export function useToast() {
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Hàm hiển thị Toast
    const showToast = useCallback((message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    }, []);

    // Hàm ẩn/xóa Toast
    const clearToast = useCallback(() => {
        setToast(null);
    }, []);

    return { toast, showToast, clearToast };
}
