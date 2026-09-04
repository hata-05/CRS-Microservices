import { useState, useEffect } from 'react';

interface SearchBoxProps {
    onSearch: (keyword: string) => void;
    placeholder?: string;
}

export default function SearchBox({ onSearch, placeholder }: SearchBoxProps) {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(inputValue.trim());
        }, 400);
        return () => clearTimeout(timer);
    }, [inputValue, onSearch]);

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: 440 }}>
            <div style={{
                position: 'absolute',
                left: 18,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--clay-primary)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center'
            }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </div>
            <input
                type="text"
                className="clay-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder ?? 'Tìm kiếm theo tên môn học...'}
                style={{
                    paddingLeft: 48,
                    paddingRight: inputValue ? 42 : 20,
                    height: 52
                }}
            />
            {inputValue && (
                <button
                    type="button"
                    onClick={() => setInputValue('')}
                    className="clay-btn clay-btn-secondary"
                    style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        padding: 6,
                        width: 28,
                        height: 28,
                        borderRadius: '50%'
                    }}
                    title="Xóa tìm kiếm"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
