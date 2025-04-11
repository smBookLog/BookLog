import React, { useState } from 'react'
import section from '../my_style/BookSection.css'
import { useNavigate } from 'react-router-dom';
import bookImg from '../etc_assets/bookinformation.png';

const BookSection = () => {
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [readingStatus, setReadingStatus] = useState('독서중'); // 예: '독서중'을 기본값으로
    // 도서 데이터
    const books = Array.from({ length: 7 }, (_, i) => ({
        id: i + 1,
        image: bookImg , // public 폴더 또는 경로에 맞춰 수정
        title: '작품명',
        author: '저자',
        rating: '★★★★☆'
    }));

    // 클릭한 버튼의 상태를 업데이트하는 함수
    const handleStatusChange = (status) => {
        setReadingStatus(status);
    };
    const navigate = useNavigate();

    const booklist = () => {
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
                    <div className="book-info">
                      <img src={book.image} alt={book.title} className="book-cover-img" />
                      <p className="book-title">{book.title}</p>
                      <p className="book-author">{book.author}</p>
                    </div>
                  </div>
                ))}
            </div>
        </div>
    );

}

export default BookSection