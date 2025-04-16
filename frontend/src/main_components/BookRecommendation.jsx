import React, { useEffect, useState } from 'react';
import axios from 'axios';

import '../main_style/Recommendation.css';
import img from '../etc_assets/bookinformation.png';

const BookRecommendation = () => {
  const [books, setBooks] = useState([]);
  const [expandedIndexes, setExpandedIndexes] = useState([]); // 더보기 상태 저장

  useEffect(() => {
    const userId = "user01";

    axios.post(`http://localhost:8082/controller/recommend/${userId}`)
      .then(res => {
        const text = res.data;

        const lines = text.split("\n")
          .map(line => line.trim())
          .filter(line =>
            line !== "" &&
            line.includes("책 제목:") &&
            line.includes("작가:") &&
            line.includes("ISBN:") &&
            line.includes("책 소개글:")
          );

        const books = lines.map(line => {
          const title = line.match(/책 제목:\s*(.*?),\s*작가:/)?.[1]?.trim() || "";
          const author = line.match(/작가:\s*(.*?),\s*ISBN:/)?.[1]?.trim() || "";
          const isbn = line.match(/ISBN:\s*(.*?),\s*책 소개글:/)?.[1]?.trim() || "";
          const descriptionMatch = line.match(/책 소개글:\s*(.*)/);
          const description = descriptionMatch && descriptionMatch[1] ? descriptionMatch[1].trim() : "";

          return { title, author, isbn, description };
        });

        setBooks(books);
      })
      .catch(err => console.error("추천 도서 불러오기 실패", err));
  }, []);

  // 더보기 토글 함수
  const toggleExpand = (index) => {
    setExpandedIndexes(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="book-recommendation">
      <h2 className="section-title">비슷한 책을 원한다면? 📚</h2>
      <div className="book-list">
        {books.length === 0 ? (
          <p>추천할 도서가 없습니다.</p>
        ) : (
          books.map((book, index) => {
            const cleanDescription = book.description.replace(/\s+/g, " ").trim();
            const isExpanded = expandedIndexes.includes(index);
            const isLong = cleanDescription.length > 100;

            const visibleText = isExpanded || !isLong
              ? book.description
              : cleanDescription.slice(0, 100) + "...";

            return (
              <div key={book.isbn || index} className="recommended-book">
                <img src={img} alt="책 이미지" className="book-cover1" />
                <div className="book-info">
                  <div className="book-title">{book.title}</div>
                  <div className="book-meta">{book.author} / ISBN: {book.isbn}</div>
                  <div className="book-desc" style={{fontSize:'12px'}}>
                    {/* 왼쪽 정렬 */}
                    {visibleText}
                    {isLong && (
                      <span
                        className="more-toggle"
                        onClick={() => toggleExpand(index)}
                      >
                        {isExpanded ? " 접기 ▲" : " 더보기 ▼"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BookRecommendation;
