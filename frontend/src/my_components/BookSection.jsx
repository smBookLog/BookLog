import React, { useState } from 'react'
import section from '../my_style/BookSection.css'
import { useNavigate } from 'react-router-dom';

const BookSection = () => {
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [readingStatus, setReadingStatus] = useState('독서중'); // 예: '독서중'을 기본값으로
    // 도서 데이터
    const books = Array.from({ length: 7 }, (_, i) => ({
        id: i + 1,
        title: '작품명',
        rating: '★★★★☆'
    }));

    // 클릭한 버튼의 상태를 업데이트하는 함수
    const handleStatusChange = (status) => {
        setReadingStatus(status);
    };
    const navigate = useNavigate();

    const booklist = () =>{
        navigate('/booklist');
    }

    return (
        <div className="book-section">
            <div className="book-header">
                <h3 className="section-title">
                    독서 목록
                    <span className="filter-container">
                        <div className="reading-status-buttons">
                            <button
                                className={`view-button ${readingStatus === '독서중' ? 'active' : ''}`}
                                onClick={() => handleStatusChange('독서중')}
                            >
                                독서중
                            </button>
                            <button
                                className={`view-button ${readingStatus === '독서완료' ? 'active' : ''}`}
                                onClick={() => handleStatusChange('독서완료')}
                            >
                                독서완료
                            </button>
                            <button
                                className={`view-button ${readingStatus === '독서예정' ? 'active' : ''}`}
                                onClick={() => handleStatusChange('독서예정')}
                            >
                                독서예정
                            </button>
                        </div>
                    </span>
                </h3>
                <button onClick={booklist} className="view-all-button">
                    전체 보기
                </button>
            </div>

            <div className="genre-filter-container">
                <h4 className="genre-title">
                    장르
                    <span className="category-filter-container">
                        <select
                            className="category-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option>전체</option>
                            <option>소설/스릴러</option>
                            <option>자기계발</option>
                            <option>인문</option>
                        </select>
                    </span>
                </h4>
            </div>

            <div className="book-grid">
                {books.map((book) => (
                    <div key={book.id} className="book-item">
                        <div className="book-cover">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                            </svg>
                        </div>
                        <div className="book-info">
                            <h4 className="book-title">{book.title}</h4>
                            <p className="book-rating">{book.rating}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

}

export default BookSection