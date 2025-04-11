import React from 'react';
import '../main_style/ReviewList.css';
import img from '../etc_assets/sum.png';
import Reviewltem from './Reviewltem';
import BookRecommendation from './BookRecommendation';
import UserSector from './UserSelectorBook';

const reviews = [
    {
      id: 1,
      username: 'sftu7',
      rating: 4,
      content: '이 책은 당신과 작사이자의 관계를 다루며 책이라는데, 마음에 잘 깊이 파고들며 인간 심리를 탐구한다고 하는 책입니다 단락이거든요 근데 정말 공감되고 감성이 잘 드러나는 부분들이 많아...',
      bookTitle: '책 이름',
      date: '2023.03.17',
      bookAuthor: '저자',
      likes: 3,
      comments: 2
    },
    {
      id: 2,
      username: 'wlqrkhrtlvek',
      rating: 4,
      content: '이 책은 당신과 작사이자의 관계를 다루며 책이라는데, 마음에 잘 깊이 파고들며 인간 심리를 탐구한다고 하는 책입니다 단락이거든요 근데 정말 공감되고 감성이 잘 드러나는 부분들이 많아...',
      bookTitle: '책 이름',
      date: '2023.03.17',
      bookAuthor: '저자',
      likes: 3,
      comments: 2
    },
    {
      id: 3,
      username: '박먹는여우',
      rating: 4,
      content: '이 책은 당신과 작사이자의 관계를 다루며 책이라는데, 마음에 잘 깊이 파고들며 인간 심리를 탐구한다고 하는 책입니다 단락이거든요 근데 정말 공감되고 감성이 잘 드러나는 부분들이 많아...',
      bookTitle: '책 이름',
      date: '2023.03.17',
      bookAuthor: '저자',
      likes: 3,
      comments: 2
    }
  ];

  
  function ReviewList() {
    return (
      <div className="review-list-wrapper">
        <div className="review-list-container">
          <div className="review-items-container">
            {reviews.map((review) => (
              <Reviewltem
                key={review.id}
                username={review.username}
                rating={review.rating}
                content={review.content}
                bookTitle={review.bookTitle}
                author={review.bookAuthor}
                publishDate={review.date}
                initialLikes={review.likes}
                commentCount={review.comments}
              />
            ))}
            
            <div className="recommendation-section">
              <BookRecommendation />
            </div>
            
            <UserSector />
          </div>
        </div>
      </div>
    );
  }

export default ReviewList