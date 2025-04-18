import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../main_style/UserSelector.css';
import { RiAccountCircleFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

function UserSelectorBook() {
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [followStatus, setFollowStatus] = useState({});
  const [currentUserId, setCurrentUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 현재 로그인한 사용자 정보 가져오기
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const userId = userInfo?.userId;

    if (!userId) return;

    setCurrentUserId(userId);

    // 추천 유저 목록 가져오기
    axios.get(`http://localhost:8082/controller/main/${userId}`)
      .then(res => {
        const feedData = res.data;
        const userSection = feedData.find(item => item.type === "recommend_user");

        if (userSection && Array.isArray(userSection.data)) {
          setRecommendedUsers(userSection.data);

          // 현재 사용자의 팔로잉 목록 가져오기
          return axios.get(`http://localhost:8082/controller/following/${userId}`);
        }
      })
      .then(followingRes => {
        if (followingRes && followingRes.data) {
          const followingList = followingRes.data;

          // 팔로우 상태 설정
          const status = {};
          recommendedUsers.forEach(user => {
            status[user.userId] = followingList.includes(user.userId);
          });

          setFollowStatus(status);
        }
      })
      .catch(err => {
        console.error("데이터 불러오기 실패:", err);
      });
  }, []);

  // 팔로우 처리 함수
  const handleFollow = (targetUserId) => {
    if (!currentUserId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    axios.post(`http://localhost:8082/controller/follow`, {
      followerId: currentUserId,
      followingId: targetUserId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log('팔로우 성공:', res.data);
        // 상태 업데이트
        setFollowStatus(prev => ({
          ...prev,
          [targetUserId]: true
        }));
      })
      .catch(err => {
        console.error('팔로우 실패', err.response?.data || err.message || err);
        alert('팔로우에 실패했습니다. 다시 시도해주세요.');
      });
  };

  // 언팔로우 처리 함수
  const handleUnfollow = (targetUserId) => {
    if (!currentUserId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    axios.delete(`http://localhost:8082/controller/unfollow/${currentUserId}/${targetUserId}`)
      .then(res => {
        console.log('언팔로우 성공:', res.data);
        // 상태 업데이트
        setFollowStatus(prev => ({
          ...prev,
          [targetUserId]: false
        }));
      })
      .catch(err => {
        console.error('언팔로우 실패', err);
        alert('언팔로우에 실패했습니다. 다시 시도해주세요.');
      });
  };

  // 프로필 페이지로 이동 처리
  const handleProfileClick = (userId) => {
    navigate(`/mypage/${userId}`);
  };

  // 아바타 컨테이너 스타일
  const avatarContainerStyle = {
    position: 'relative',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    marginBottom: '10px',
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  };

  // 사용자 아바타 이미지 스타일
  const userAvatarStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '120%', // 더 크게 표시하여 컨테이너를 채움
    height: '120%',
    objectFit: 'cover',
    borderRadius: '50%'
  };

  // 기본 아바타 스타일
  const defaultAvatarStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(235, 235, 235)',
    borderRadius: '50%'
  };

  // 아이콘 스타일
  const avatarIconStyle = {
    fontSize: '40px',
    color: 'lightgray'
  };

  return (
    <div className="user-recommendation-container">
      <h3 className="recommendation-title">회원님과 취향이 비슷한 유저들💕</h3>
      <div className="user-list-horizontal">
        {recommendedUsers.map((user, index) => (
          <div key={index} className="recommended-user">
            <div
              style={avatarContainerStyle}
              onClick={() => handleProfileClick(user.userId)}
            >
              {user.profileImg ? (
                <img
                  src={user.profileImg}
                  alt={user.userId}
                  style={userAvatarStyle}
                />
              ) : (
                <div style={defaultAvatarStyle}>
                  <span style={avatarIconStyle}><RiAccountCircleFill /></span>
                </div>
              )}
            </div>
            <div
              className="user-name"
              onClick={() => handleProfileClick(user.userId)}
              style={{ cursor: 'pointer' }}
            >
              {user.userId}
            </div>
            {followStatus[user.userId] ? (
              <button
                className="follow-btn unfollow"
                style={{ backgroundColor: 'gray', width: '70px', borderRadius: '4px', padding: '5px 10px', color: 'white', border: 'none', fontSize: '12px', cursor: 'pointer' }}
                onClick={() => handleUnfollow(user.userId)}
              >
                언팔로우
              </button>
            ) : (
              <button
                className="follow-btn"
                style={{ backgroundColor: '#3897f0', width: '70px', borderRadius: '4px', padding: '5px 10px', color: 'white', border: 'none', fontSize: '12px', cursor: 'pointer' }}
                onClick={() => handleFollow(user.userId)}
              >
                팔로우
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserSelectorBook;