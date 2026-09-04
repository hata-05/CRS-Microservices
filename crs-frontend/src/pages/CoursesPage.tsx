import { useState } from 'react';
import { useCourses } from '../api/useCourses';
import SearchBox from '../components/SearchBox';
import CourseList from '../components/CourseList';
import Pagination from '../components/Pagination';

export default function CoursesPage() {
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page);

    const handleSearch = (newKeyword: string) => {
        setKeyword(newKeyword);
        setPage(0);
    };

    return (
        <div className="animate-fade-in">
            {/* Page Header */}
            <div className="clay-page-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                    <div>
                        <h1 className="clay-page-title">
                            <span className="clay-orb clay-orb-sky" style={{ width: 44, height: 44 }}>
                                📚
                            </span>
                            Danh Sách Môn Học
                        </h1>
                        <p className="clay-page-subtitle">
                            Tra cứu chương trình học phần, số tín chỉ và số lượng chỗ trống được đồng bộ tức thời
                        </p>
                    </div>

                    <SearchBox onSearch={handleSearch} />
                </div>
            </div>

            {/* Course List Card Container */}
            <div style={{ marginTop: 24 }}>
                <CourseList
                    courses={courses}
                    state={state}
                    errorMessage={errorMessage}
                    onRetry={refetch}
                />
            </div>

            {/* Pagination */}
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}
