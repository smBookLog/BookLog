import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookItem from './BookItem';
import '../my_style/BookList.css';
import { LuBookPlus } from "react-icons/lu";
import TabBar from './TabBar';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import '../BookDetail_style/bookdetail.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookList = () => {
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('READING');
  const [books, setBooks] = useState([]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('전체');
  const [genres, setGenres] = useState(['전체']);
  const navigate = useNavigate();

  // 로그인 정보 확인
  useEffect(() => {
    const userStr = localStorage.getItem('user');

    if (!userStr) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (!user.userId) {
        throw new Error('사용자 ID 정보가 없습니다.');
      }
      setUserId(user.userId);
      console.log("로그인 사용자 ID:", user.userId);
    } catch (error) {
      console.error('사용자 정보 파싱 오류:', error);
      alert('사용자 정보를 가져오는데 문제가 발생했습니다. 다시 로그인해주세요.');
      navigate('/login');
    }
  }, [navigate]);

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setIsSelectOpen(false);
  };

  // userId가 설정된 후에만 데이터 로드
  useEffect(() => {
    if (!userId) return;

    console.log("API 호출 중:", userId, status);

    axios.get(`http://localhost:8082/controller/${userId}/${status}`)
      .then(response => {
        console.log("API 응답:", response.data);
        const fetchedBooks = response.data;
        setBooks(fetchedBooks);

        // 장르 목록 동적으로 추출 (중복 제거, 빈 값 제거)
        const uniqueGenres = Array.from(
          new Set(
            fetchedBooks
              .map(book => book.genre)
              .filter(genre => genre && genre.trim() !== '')
          )
        );
        setGenres(['전체', ...uniqueGenres]);
      })
      .catch(error => {
        console.error('API 호출 에러:', error);
      });
  }, [userId, status]);

  // 선택된 장르에 따라 책 필터링
  const filteredBooks = selectedGenre === '전체'
    ? books
    : books.filter(book => book.genre === selectedGenre);

  // userId가 없으면 렌더링하지 않음
  if (!userId) return null;

  // 바깥쪽 페이지 전체 배경 연회색
  const pageStyle = {
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    padding: '40px 0',
  };

  // 가운데 콘텐츠 흰색 박스
  const wrapperStyle = {
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
  };

  const bookListStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '25px',
    overflowX: 'hidden',
    width: '100%',
  };

  // 상단 필터 스타일
  const topFilterStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 0',
    borderBottom: '1px solid #eaeaea',
    marginBottom: '20px',
  };

  return (
    <div style={pageStyle}>
      <div style={wrapperStyle}>
        <TabBar onStatusChange={setStatus} />
        
        {/* 상단에 장르 필터와 추가 버튼 배치 */}
        <div style={topFilterStyle}>
          <div className="genre-select-group">
            <span className="genre-label">장르</span>
            <div className="genre-select-container">
              <div
                className="genre-select-button"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
              >
                {selectedGenre} ▼
              </div>
              {isSelectOpen && (
                <div className="genre-dropdown">
                  {genres.map((genre) => (
                    <div
                      key={genre}
                      className={`genre-option ${selectedGenre === genre ? 'selected' : ''}`}
                      onClick={() => handleGenreSelect(genre)}
                    >
                      {genre}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <a href="/search" className="add-button">추가<LuBookPlus /></a>
        </div>

        <div className="book-info-container-new"> {/* 메인 css */}
          <div style={bookListStyle}>
            {filteredBooks.length === 0 ? (
              <p>도서가 없습니다.</p>
            ) : (
              filteredBooks.map(book => (
                <div key={book.logIdx} className="book-item-with-actions">
                  <Link to={`/bookdetail?logIdx=${book.logIdx}`}>
                    <BookItem book={book} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookList;