interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    return (
        <div
            style={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                padding: '12px 24px',
                borderRadius: 4,
                backgroundColor: type === 'success' ? '#16a34a' : '#dc2626',
                color: '#fff',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                zIndex: 1000,
            }}
        >
            <span>{message}</span>
            <button
                onClick={onClose}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                }}
            >
                ✕
            </button>
        </div>
    );
}