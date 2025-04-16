import React from 'react';
import '../my_style/BookItem.css';

const BookItem = ({ book }) => {
    const getStatusLabel = (status) => {
      switch (status) {
        case 'READING':
          return '독서중';
        case 'FINISHED':
          return '독서완료';
        case 'NOT_STARTED':
          return '독서예정';
        default:
          return '알 수 없음';
      }
    };
  
    return (
        <div className="book-item">
          <img
            src={book.bookImgUrl || 'https://via.placeholder.com/100x150?text=No+Image'}
            alt={book.title}
            className="book-img"
          />
          <div className="book-info">
            <h4>{book.title}</h4>
            <p className="author">{book.author}</p>
            <p className="rating">{'⭐'.repeat(book.rating || 0)}</p>
            <p className="status">{getStatusLabel(book.status)}</p>
          </div>
        </div>
      );
    };
    
    export default BookItem;