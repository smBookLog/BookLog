import React, { useEffect, useState } from 'react'
import section from '../my_style/BookSection.css'
import { useNavigate } from 'react-router-dom';


const BookSection = () => {
    const [userId, setUserId] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [readingStatus, setReadingStatus] = useState('독서중');
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState(['전체']);
    const navigate = useNavigate();


    const statusMap = {
        '독서중': 'READING',
        '독서완료': 'FINISHED',
        '독서예정': 'NOT_STARTED'
    };

    // 사용자 정보 가져오기
    useEffect(() => {
        const userInfo = localStorage.getItem('user');
        if (userInfo) {
            const user = JSON.parse(userInfo);
            setUserId(user.userId);
        } else {
            console.error('로그인 정보를 찾을 수 없습니다.');
            // 로그인 정보가 없을 경우 처리 (예: 로그인 페이지로 리다이렉트)
            // navigate('/login');
        }
    }, []);

    // 책 데이터 가져오기
    useEffect(() => {
        if (!userId) return; // userId가 없으면 API 호출하지 않음

        const fetchBooks = async () => {
            try {
                const response = await fetch(`http://localhost:8082/controller/${userId}/${statusMap[readingStatus]}`);
                const data = await response.json();
                setBooks(data);

                // 사용자가 가진 장르 추출 (중복 제거)
                const userGenres = ['전체', ...new Set(data.map(book => book.genre).filter(Boolean))];
                setGenres(userGenres);

                // 만약 현재 선택된 장르가 사용자 장르에 없으면 '전체'로 리셋
                if (!userGenres.includes(selectedCategory)) {
                    setSelectedCategory('전체');
                }
            } catch (error) {
                console.error('책 불러오기 실패:', error);
            }
        };

        fetchBooks();
    }, [userId, readingStatus]);

    // 클릭한 버튼의 상태를 업데이트하는 함수
    const handleStatusChange = (status) => {
        setReadingStatus(status);
    };

    const booklist = () => {
        navigate('/booklist');
    };

    // 로그인 정보가 없거나 로딩 중일 때 표시할 내용
    if (!userId) {
        return <div className="book-section">로그인 정보를 불러오는 중...</div>;
    }

    return (
        <div className="book-section">
            <div className="book-header">
                <h3 className="section-title" style={{ alignItems: 'center', fontSize: '18px', color: 'black' }}>
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
            </div>

            <div className="book-info-container-new">  {/* 메인에서 컨테이너 가져옴(메인 css) 시작 */}
                <div className="genre-filter-container">
                    <h4 className="genre-title">
                        장르
                        <span className="category-filter-container">
                            <select
                                className="category-select"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {genres.map((genre) => (
                                    <option key={genre} value={genre}>
                                        {genre}
                                    </option>
                                ))}
                            </select>
                        </span>
                        <button onClick={booklist} className="view-all-button" style={{ alignItems: 'end', backgroundColor: '#f5f5f5' }}>
                    전체 보기
                        </button>

                    </h4>
                    <div className="book-grid"> {/* 시작 */}
                        {books.length > 0 ? (
                            books
                                .filter(book => selectedCategory === '전체' || book.genre === selectedCategory)
                                .map((book) => (
                                    <div key={book.logIdx} className="book-item">
                                        <div className="book-cover" style={{ borderRadius: '0px', margin: '0px', maxHeight: '170px', maxWidth:'130px',objectFit: 'cover', backgroundColor: 'transparent' }}>
                                            <img
                                                src={book.bookImgUrl}
                                                alt={book.title}
                                                style={{ height: '160px', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div className="book-info" style={{ marginLeft: '0px', marginBottom: '0px', backgroundColor: '#f5f5f5' }}>
                                            <h4 className="book-title" style={{ marginTop: '10px', alignItems:'center' }}>{book.title}</h4>
                                            <p className="book-author" style={{ marginLeft: '0px',  marginTop: '-10px' }}>{book.author}</p>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="no-books-message">
                                {readingStatus}인 책이 없습니다.
                            </div>
                        )}
                    </div> {/* 끝 */}
                </div>

            </div>
        </div>
    );
}

export default BookSection;