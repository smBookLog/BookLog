import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookItem from './BookItem';
import '../my_style/BookList.css';
import { LuBookPlus } from "react-icons/lu";
import TabBar from './TabBar';
import { Link } from 'react-router-dom';

const BookList = () => {
  const userId = 'user01';
  const [status, setStatus] = useState('READING');
  const [books, setBooks] = useState([]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('전체');

  const genres = ['전체', '소설', '시/에세이', '경제/경영', '자기계발', '역사', '과학', '예술', '기타'];

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setIsSelectOpen(false);
  };

  useEffect(() => {
    axios.get(`http://localhost:8082/controller/${userId}/${status}`)
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.error('API 호출 에러:', error);
      });
  }, [userId, status]);

  const handleDelete = (logIdx) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      axios.delete(`http://localhost:8082/controller/log/delete/${logIdx}`)
        .then(() => {
          setBooks(prev => prev.filter(book => book.logIdx !== logIdx));
        })
        .catch(error => {
          console.error('삭제 실패:', error);
        });
    }
  };

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

  return (
    <div style={pageStyle}>
      <div style={wrapperStyle}>
        <TabBar onStatusChange={setStatus} />
        <div className="book-list-header">
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

          <a href="/bookdetail" className="add-button">추가<LuBookPlus /></a>
        </div>

        <div style={bookListStyle}>
          {books.length === 0 ? (
            <p>도서가 없습니다.</p>
          ) : (
            books.map(book => (
              <div key={book.logIdx} className="book-item-with-actions">
                <Link to={`/bookdetail?logIdx=${book.logIdx}`}>
                  <BookItem book={book} />
                </Link>
                <button className="delete-button" onClick={() => handleDelete(book.logIdx)}>
                  삭제
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookList;
