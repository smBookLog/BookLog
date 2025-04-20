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
      <h4>{book.title}</h4>
      <h4 className="author" style={{ textAlign: "center" }}>{book.author}</h4>
    </div>
  );
};

export default BookItem;