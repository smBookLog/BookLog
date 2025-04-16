import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../main_style/ReviewList.css';
import Reviewltem from './Reviewltem';
import BookRecommendation from './BookRecommendation';
import UserSector from './UserSelectorBook';

function ReviewList() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8082/controller/user01/FINISHED')
      .then((res) => {
        setReviews(res.data);
      })
      .catch((err) => {
        console.error("리뷰 데이터 불러오기 실패:", err);
      });
  }, []);

  return (
    <div className="review-list-wrapper">
      <div className="review-list-container">
        <div className="review-items-container">
          {reviews.length > 0 ? (
            <>
              {/* 리뷰 1~5 */}
              {reviews.slice(0, 5).map((review) => (
                <Reviewltem
                  key={review.logIdx}
                  username={review.userId}
                  rating={review.rating}
                  content={review.content}
                  bookTitle={review.title}
                  author={review.author}
                  publishDate={review.endDate || review.startDate}
                  initialLikes={review.likeCount || 0}
                  commentCount={(review.comments && review.comments.length) || 0}
                />
              ))}

              {/* <UserSector /> 출력 */}
              {reviews.length > 5 && <UserSector />}

              {/* 리뷰 6~10 */}
              {reviews.slice(5, 10).map((review) => (
                <Reviewltem
                  key={review.logIdx}
                  username={review.userId}
                  rating={review.rating}
                  content={review.content}
                  bookTitle={review.title}
                  author={review.author}
                  publishDate={review.endDate || review.startDate}
                  initialLikes={review.likeCount || 0}
                  commentCount={(review.comments && review.comments.length) || 0}
                />
              ))}

              {/* <BookRecommendation /> 출력 */}
              {reviews.length > 10 && (
                <div className="recommendation-section">
                  <BookRecommendation />
                </div>
              )}

              {/* 리뷰 11번 이후 나머지 */}
              {reviews.slice(10).map((review) => (
                <Reviewltem
                  key={review.logIdx}
                  username={review.userId}
                  rating={review.rating}
                  content={review.content}
                  bookTitle={review.title}
                  author={review.author}
                  publishDate={review.endDate || review.startDate}
                  initialLikes={review.likeCount || 0}
                  commentCount={(review.comments && review.comments.length) || 0}
                />
              ))}
            </>
          ) : (
            <div>기록이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewList;
