import React from 'react';
import '../main_style/BookRecommendation.css';

function BookRecommendation({ recommendation }) {
  if (!recommendation) {
    return (
      <div className="book-recommendation empty-recommendation">
        <h3>책 추천</h3>
        <p className="empty-message">추천 내용이 없습니다.</p>
      </div>
    );
  }

  // 추천 텍스트를 문단으로 나누기
  const paragraphs = recommendation.split(/\n\s*\n/);

  return (
    <div className="book-recommendation">
      <div className="recommendation-header">
        <h3>AI 맞춤 책 추천 💕</h3>
        <span className="ai-badge">Gemini</span>
      </div>
      <div className="recommendation-content">
        {paragraphs.map((paragraph, index) => (
          <p key={`para-${index}`}>{paragraph}</p>
        ))}
      </div>
      <div className="recommendation-footer">
        <button className="more-books-btn">다른 책 추천받기</button>
      </div>
    </div>
  );
}

export default BookRecommendation;