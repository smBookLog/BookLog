import React, { useEffect, useState } from 'react'
import section from '../my_style/BookSection.css'
import { useNavigate } from 'react-router-dom';

const BookSection = () => {
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [readingStatus, setReadingStatus] = useState('독서중'); // 예: '독서중'을 기본값으로
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();
    const userId = 'user01'; // 로그인 연동된 경우 여기에 로그인된 userId 사용

    const statusMap = {
        '독서중': 'READING',
        '독서완료': 'FINISHED',
        '독서예정': 'NOT_STARTED'
    };


    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch(`http://localhost:8082/controller/${userId}/${statusMap[readingStatus]}`);
                const data = await response.json();
                setBooks(data); // 받아온 데이터로 상태 업데이트
            } catch (error) {
                console.error('책 불러오기 실패:', error);
            }
        };

        fetchBooks();
    }, [readingStatus, selectedCategory]);

    // 클릭한 버튼의 상태를 업데이트하는 함수
    const handleStatusChange = (status) => {
        setReadingStatus(status);
    };

    const booklist = () => {
        navigate('/booklist');
      };

    return (
        <div className="book-section">
            <div className="book-header">
                <h3 className="section-title">
                    독서 목록
                    <span className="filter-container">
                        <div className="reading-status-buttons">
                            {['독서중', '독서완료', '독서예정'].map((status) => (
                                <button
                                    key={status}
                                    className={`view-button ${readingStatus === status ? 'active' : ''}`}
                                    onClick={() => handleStatusChange(status)}
                                >
                                    {status}
                                </button>
                            ))}
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
                            <option>프로그래밍</option>
                        </select>
                    </span>
                </h4>
            </div>

            <div className="book-grid">
                {books
                    .filter(book => selectedCategory === '전체' || book.genre === selectedCategory)
                    .map((book) => (
                        <div key={book.logIdx} className="book-item">
                            <div className="book-cover">
                                <img src={book.bookImgUrl} alt={book.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                            </div>
                            <div className="book-info">
                                <h4 className="book-title">{book.title}</h4>
                                <p className="book-rating">★ {book.rating}</p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );

}

export default BookSection;