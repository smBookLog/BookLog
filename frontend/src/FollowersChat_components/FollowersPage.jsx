import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../FollowersChat_style/FollowersPage.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import defaultPic from '../etc_assets/profile_1.png'; // 기본 프로필 이미지 경로를 확인하세요

const FollowersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const backLink = location.state?.from || '/';  // fallback으로 홈 지정
  const safeBackLink = (backLink && backLink !== '/login') ? backLink : '/mypage/' + userId;
  
  // 로케이션에서 프로필 사용자 ID 받기 (없으면 현재 로그인한 사용자)
  const profileUserId = location.state?.userId;
  const [currentUserId, setCurrentUserId] = useState('');
  const [activeTab, setActiveTab] = useState(location.state?.type || 'followers');
  const [followers, setFollowers] = useState([]); // 팔로워 목록
  const [following, setFollowing] = useState([]); // 팔로잉 목록
  const [users, setUsers] = useState([]); // 사용자 상세 정보
  const [followStatus, setFollowStatus] = useState({}); // 팔로우 상태
  const [isLoading, setIsLoading] = useState(true);

  // 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setCurrentUserId(user.userId);
    } else {
      console.error('로그인 정보를 찾을 수 없습니다.');
    }
  }, []);

  // 프로필 사용자 ID 설정
  const [userId, setUserId] = useState('');
  useEffect(() => {
    if (profileUserId) {
      setUserId(profileUserId);
    } else if (currentUserId) {
      setUserId(currentUserId);
    }
  }, [profileUserId, currentUserId]);

  // 팔로워/팔로잉 데이터 가져오기
  useEffect(() => {
    if (!userId || !currentUserId) return;

    setIsLoading(true);

    // 활성 탭에 따라 데이터 가져오기
    const endpoint = activeTab === 'followers' 
      ? `http://localhost:8082/controller/followers/${userId}`
      : `http://localhost:8082/controller/following/${userId}`;
    
    // 1. 먼저 현재 사용자의 팔로잉 목록 가져오기
    axios.get(`http://localhost:8082/controller/following/${currentUserId}`)
      .then(followingResponse => {
        const followingList = followingResponse.data || [];
        
        // 2. 그 다음 팔로워/팔로잉 목록 가져오기
        return axios.get(endpoint)
          .then(response => {
            const userIds = response.data;
            
            if (activeTab === 'followers') {
              setFollowers(userIds);
            } else {
              setFollowing(userIds);
            }
            
            // 사용자 목록이 비어있으면 처리 종료
            if (userIds.length === 0) {
              setUsers([]);
              setIsLoading(false);
              return;
            }
            
            // 3. 사용자 상세 정보 가져오기
            const userDetailsPromises = userIds.map(userId => 
              axios.get(`http://localhost:8082/controller/user/${userId}`)
                .then(res => res.data)
                .catch(err => {
                  console.error(`사용자 ${userId} 정보 불러오기 실패:`, err);
                  return { userId }; // 최소한 userId만 포함
                })
            );
            
            return Promise.all(userDetailsPromises)
              .then(usersData => {
                // 4. 팔로우 상태 설정
                const status = {};
                usersData.forEach(user => {
                  status[user.userId] = followingList.includes(user.userId);
                });
                
                setUsers(usersData);
                setFollowStatus(status);
                setIsLoading(false);
              });
          });
      })
      .catch(err => {
        console.error(`${activeTab} 목록 로딩 실패`, err);
        setIsLoading(false);
      });
  }, [userId, activeTab, currentUserId]);

  const handleFollow = (targetUserId) => {
    if (!currentUserId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
  
    // 원래대로 POST 메서드 사용 (서버 요구사항에 맞게)
    axios.post(`http://localhost:8082/controller/follow`, {
      followerId: currentUserId,
      followingId: targetUserId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log('팔로우 응답:', res.data);
        // 상태 업데이트
        setFollowStatus(prev => ({
          ...prev,
          [targetUserId]: true
        }));
        // 현재 탭에 따라 데이터 갱신
        if (activeTab === 'following' && userId === currentUserId) {
          setFollowing(prev => [...prev, targetUserId]);
        }
      })
      .catch(err => {
        console.error('팔로우 실패', err.response?.data || err.message || err);
        alert('팔로우에 실패했습니다. 다시 시도해주세요.');
      });
  };

  const handleUnfollow = (targetUserId) => {
    if (!currentUserId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    axios.delete(`http://localhost:8082/controller/unfollow/${currentUserId}/${targetUserId}`)
      .then(res => {
        console.log('언팔로우 응답:', res.data);
        // 상태 업데이트
        setFollowStatus(prev => ({
          ...prev,
          [targetUserId]: false
        }));
        // 현재 탭에 따라 데이터 갱신
        if (activeTab === 'following' && userId === currentUserId) {
          setFollowing(prev => prev.filter(id => id !== targetUserId));
          // 사용자 목록에서도 제거 (following 탭에서만)
          if (activeTab === 'following') {
            setUsers(prev => prev.filter(user => user.userId !== targetUserId));
          }
        }
      })
      .catch(err => {
        console.error('언팔로우 실패', err);
        alert('언팔로우에 실패했습니다. 다시 시도해주세요.');
      });
  };

  // 탭 전환 처리
  const handleTabChange = (type) => {
    setActiveTab(type);
    navigate('/followers', { 
      state: { 
        type, 
        userId 
      } 
    }, { replace: true });
  };

  // 사용자 프로필로 이동
  const handleViewProfile = (targetUserId) => {
    navigate(`/mypage/${targetUserId}`);
  };

  if (!userId) {
    return <div className="followers-container">사용자 정보를 불러오는 중...</div>;
  }

  if (isLoading) {
    return <div className="followers-container">데이터를 불러오는 중...</div>;
  }

  return (
    <div className="followers-container">
      <header>
        <div className="header-top" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px' }}>
          <Link to={safeBackLink} className="back-button">←</Link>
          <div className="user">@{userId}</div>
        </div>
        <div className="tabs">
          <div
            className={activeTab === 'followers' ? 'tab active' : 'tab'}
            onClick={() => handleTabChange('followers')}
          > 
            팔로워 {followers.length}
          </div>
          <div
            className={activeTab === 'following' ? 'tab active' : 'tab'}
            onClick={() => handleTabChange('following')}
          >
            팔로잉 {following.length}
          </div>
        </div>
      </header>

      <ul className="user-list" style={{ flexDirection: 'column', display: 'flex', flexWrap: 'nowrap' }}>
        {users.length === 0 ? (
          <li className="no-data">
            {activeTab === 'followers' ? '팔로워가 없습니다.' : '팔로잉하는 사용자가 없습니다.'}
          </li>
        ) : (
          users.map((user, idx) => (
            <li key={idx} className="user-item" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
              <div className="user-info" onClick={() => handleViewProfile(user.userId)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <div className="avatar">
                  <img 
                    src={user.profileImg || defaultPic} 
                    alt={`${user.name || user.userId}의 프로필`}
                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                  />
                </div>
                <div className="user-details">
                  <div className="username">{user.name || user.userId}</div>
                  <div className="user-id">@{user.userId}</div>
                  {user.bio && <div className="user-bio">{user.bio}</div>}
                </div>
              </div>
              
              {currentUserId && currentUserId !== user.userId && (
                followStatus[user.userId] ? (
                  <button
                    style={{ backgroundColor: 'gray' }}
                    className="unfollow-btn"
                    onClick={() => handleUnfollow(user.userId)}
                  >
                    언팔로우
                  </button>
                ) : (
                  <button
                    className="follow-btn"
                    onClick={() => handleFollow(user.userId)}
                  >
                    팔로우
                  </button>
                )
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default FollowersPage;