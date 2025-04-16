import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../main_style/UserSelector.css';
import { RiAccountCircleFill } from "react-icons/ri";

function UserSelectorBook() {
  const [recommendedUsers, setRecommendedUsers] = useState([]);

  useEffect(() => {
    // const userId = localStorage.getItem("userId"); // 또는 "user01" 사용 시 "user01"로 변경
    const userId = localStorage.getItem("user");

    if (!userId) return;

    axios.get(`http://localhost:8082/controller/genre-mixed/${userId}`)
      .then(res => {
        setRecommendedUsers(res.data);
      })
      .catch(err => {
        console.error("추천 유저 불러오기 실패:", err);
      });
  }, []);

  return (
    <div className="user-recommendation-container">
      <h3 className="recommendation-title">회원님과 취향이 비슷한 유저들💕</h3>
      <div className="user-list">
        {recommendedUsers.map((user, index) => (
          <div key={index} className="recommended-user">
            <div className="avatar-container">
              {user.profileImg ? (
                <img
                  src={user.profileImg}
                  alt={user.userId}
                  className="user-avatar"
                />
              ) : (
                <div className="default-avatar">
                  <span className="avatar-icon"><RiAccountCircleFill /></span>
                </div>
              )}
            </div>
            <div className="user-name">{user.userId}</div>
            <button className="follow-btn">팔로우</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserSelectorBook;


