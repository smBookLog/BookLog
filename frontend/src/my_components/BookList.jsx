import React, { useState} from 'react';
import BookItem from './BookItem';
import booklist from '../my_style/BookList.css'
import { LuBookPlus } from "react-icons/lu";

const BookList = ({books}) => {
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState('전체');
    
    const genres = ['전체', '소설', '시/에세이', '경제/경영', '자기계발', '역사', '과학', '예술', '기타'];
    
    const handleGenreSelect = (genre) => {
      setSelectedGenre(genre);
      setIsSelectOpen(false);
    };
  
    return (
      <div className="book-list-content-wrapper">
        <div className="book-list-header">
          {/* 장르 + 선택 드롭다운 묶음 */}
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
  
          {/* 추가하기 버튼 */}
          <a href="#" className="add-button">추가<LuBookPlus /></a>
        </div>
  
        {/* 도서 목록 출력 */}
        <div className="book-list">
          {books.map(book => (
            <BookItem key={book.id} book={book} />
          ))}
        </div>
      </div>
    );
  }

export default BookList