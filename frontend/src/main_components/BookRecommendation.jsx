import React from 'react'
import '../main_style/Recommendation.css';
import img from '../etc_assets/bookinformation.png'

const recommendedBooks = [
    {
      id: 1,
      title: '이어령의 말',
      author: '이어령',
      date: '2025.03.17',
      coverImg: img, // 실제 경로로 교체
      userName: '박수아',
      userAvatar: img, // 실제 경로로 교체
      comment: '이거 진짜 개 재밌음\n박신부님 폼 미쳤음',
    },
    {
      id: 1,
      title: '이어령의 말',
      author: '이어령',
      date: '2025.03.17',
      coverImg: img, // 실제 경로로 교체
      userName: '박수아',
      userAvatar: img, // 실제 경로로 교체
      comment: '이거 진짜 개 재밌음\n박신부님 폼 미쳤음',
    },
    {
      id: 1,
      title: '이어령의 말',
      author: '이어령',
      date: '2025.03.17',
      coverImg: img, // 실제 경로로 교체
      userName: '박수아',
      userAvatar: img, // 실제 경로로 교체
      comment: '이거 진짜 개 재밌음\n박신부님 폼 미쳤음',
    },
    {
      id: 1,
      title: '이어령의 말',
      author: '이어령',
      date: '2025.03.17',
      coverImg: img, // 실제 경로로 교체
      userName: '박수아',
      userAvatar: img, // 실제 경로로 교체
      comment: '이거 진짜 개 재밌음\n박신부님 폼 미쳤음',
    }
    
  ];

const BookRecommendation = () => {
  return (
    <div className="book-recommendation">
      <h2 className="section-title">‘이어령의 말’ 같은 책을 원한다면? 📚</h2>
      <div className="book-list">
        {recommendedBooks.map(book => (
          <div key={book.id} className="recommended-book">
            <img src={book.coverImg} alt={book.title} className="book-cover" />
            <div className="book-info">
              <div className="book-title">{book.title}</div>
              <div className="book-meta">{book.author} | {book.date}</div>
              <div className="book-comment">{book.comment}</div>
              <div className="user-section">
                <img src={book.userAvatar} alt={book.userName} className="user-avatar" />
                <span className="user-name">{book.userName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookRecommendation