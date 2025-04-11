import React from 'react';
import '../my_style/BookItem.css';

const BookItem = ({book}) => {
    return (
        <div className="book-item">
            <div className="book-cover">
                <div className="book-cover-placeholder"></div>
            </div>
            <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
            </div>
        </div>
    );
}

export default BookItem