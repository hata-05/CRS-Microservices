interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    const isSuccess = type === 'success';

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                padding: '12px 20px',
                borderRadius: 6,
                backgroundColor: isSuccess ? '#16a34a' : '#dc2626',
                color: '#ffffff',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                zIndex: 9999,
                fontSize: 13,
                fontWeight: 500
            }}
        >
            <span>{message}</span>
            <button
                type="button"
                onClick={onClose}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: 15,
                    lineHeight: 1
                }}
            >
                ✕
            </button>
        </div>
    );
}
