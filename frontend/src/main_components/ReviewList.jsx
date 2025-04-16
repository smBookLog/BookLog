import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../main_style/ReviewList.css';
import ReviewItem from './ReviewItem';
import BookRecommendation from './BookRecommendation';
import UserSector from './UserSelectorBook';

function ReviewList() {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserInfo(storedUser);
    } else {
      setError("로그인 정보를 찾을 수 없습니다.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userInfo) return;
    const userId = userInfo.userId || userInfo.id || '';

    axios.get(`http://localhost:8082/controller/main/${userId}`)
      .then((res) => {
        setFeedItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("피드 데이터 불러오기 실패:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      });
  }, [userInfo]);

  const renderLogSection = (logs) => {
    return (
      <div className="logs-section">
        {/* 1~5 */}
        {logs.slice(0, 5).map((log, idx) => (
          <ReviewItem key={`log-0-${idx}`} review={log} />
        ))}

        {/* 유저 추천 */}
        {logs.length > 5 && <UserSector />}

        {/* 6~10 */}
        {logs.slice(5, 10).map((log, idx) => (
          <ReviewItem key={`log-5-${idx}`} review={log} />
        ))}

        {/* 책 추천 */}
        {logs.length > 10 && (
          <div className="recommendation-section">
            <BookRecommendation recommendation={logs[10]} />
          </div>
        )}

        {/* 11~ */}
        {logs.slice(10).map((log, idx) => (
          <ReviewItem key={`log-10-${idx}`} review={log} />
        ))}
      </div>
    );
  };

  const renderFeedItem = (item, index) => {
    switch (item.type) {
      case 'log':
        return renderLogSection(item.data);
      case 'recommend_user':
        return (
          <div key={`user-${index}`} className="recommendation-section">
            <UserSector users={item.data} />
          </div>
        );
      case 'recommend_text':
        return (
          <div key={`book-${index}`} className="recommendation-section">
            <BookRecommendation recommendation={item.data} />
          </div>
        );
      default:
        return <div key={`unknown-${index}`}>알 수 없는 피드 유형입니다.</div>;
    }
  };

  if (loading) return <div className="loading-container">로딩 중...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="review-list-wrapper">
      <div className="review-list-container">
        <div className="review-items-container">
          {feedItems.length > 0 ? (
            feedItems.map((item, index) => renderFeedItem(item, index))
          ) : (
            <div className="empty-feed">피드 내용이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewList;
