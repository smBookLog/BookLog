import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../main_style/UserSelector.css';
import { RiAccountCircleFill } from "react-icons/ri";

function UserSelectorBook() {
  const [recommendedUsers, setRecommendedUsers] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const userId = userInfo?.userId;
  
    if (!userId) return;
  
    axios.get(`http://localhost:8082/controller/main/${userId}`)
      .then(res => {
        const feedData = res.data;
        const userSection = feedData.find(item => item.type === "recommend_user");
  
        if (userSection && Array.isArray(userSection.data)) {
          setRecommendedUsers(userSection.data);
        }
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


