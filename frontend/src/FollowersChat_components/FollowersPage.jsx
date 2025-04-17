import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../FollowersChat_style/FollowersPage.css';
import { useNavigate } from 'react-router-dom';

const FollowersPage = () => {
  const [userId, setUserId] = useState('');
  const [activeTab, setActiveTab] = useState('followers');
  const [followers, setFollowers] = useState([]); // 나를 팔로우하는 사람들
  const [following, setFollowing] = useState([]); // 내가 팔로우하는 사람들
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setUserId(user.userId);
    } else {
      console.error('로그인 정보를 찾을 수 없습니다.');
    }
  }, []);

  // 팔로워/팔로잉 데이터 가져오기
  const fetchFollowData = () => {
    if (!userId) return;

    setIsLoading(true);

    // 내가 팔로우하는 사람들 (following)
    axios.get(`http://localhost:8082/controller/following/${userId}`)
      .then(res => {
        setFollowing(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('팔로잉 목록 로딩 실패', err);
        setIsLoading(false);
      });

    // 나를 팔로우하는 사람들 (followers)
    axios.get(`http://localhost:8082/controller/followers/${userId}`)
      .then(res => {
        setFollowers(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('팔로워 목록 로딩 실패', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchFollowData();
  }, [userId]);

  const handleFollow = (target) => {
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    axios.post(`http://localhost:8082/controller/follow`, {
      followerId: userId,
      followingId: target
    })
      .then(res => {
        console.log('팔로우 응답:', res.data);
        if (res.data.includes('완료')) {
          alert(`${target}님을 팔로우했습니다.`);
          fetchFollowData();
        } else {
          alert('팔로우에 실패했습니다: ' + res.data);
        }
      })
      .catch(err => {
        console.error('팔로우 실패', err);
        alert('팔로우에 실패했습니다. 다시 시도해주세요.');
      });
  };

  const handleUnfollow = (target) => {
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    axios.delete(`http://localhost:8082/controller/unfollow/${userId}/${target}`)
      .then(res => {
        console.log('언팔로우 응답:', res.data);
        if (res.data.includes('완료')) {
          alert(`${target}님을 언팔로우했습니다.`);
          fetchFollowData();
        } else {
          alert('언팔로우에 실패했습니다: ' + res.data);
        }
      })
      .catch(err => {
        console.error('언팔로우 실패', err);
        alert('언팔로우에 실패했습니다. 다시 시도해주세요.');
      });
  };

  const userList = activeTab === 'followers' ? followers : following;

  if (!userId) {
    return <div className="followers-container">로그인 정보를 불러오는 중...</div>;
  }

  if (isLoading) {
    return <div className="followers-container">데이터를 불러오는 중...</div>;
  }

  return (
    <div className="followers-container">
      <header>
      <div className="header-top" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px' }}>
        <button className="back-button" onClick={() => navigate(-1)}>←</button>
        <div className="user">@{userId}</div>
        </div>
        <div className="tabs">
          <div
            className={activeTab === 'followers' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('followers')}
          > 
            팔로워 {followers.length}
          </div>
          <div
            className={activeTab === 'following' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('following')}
          >
            팔로잉 {following.length}
          </div>
        </div>
      </header>

      <ul className="user-list" style={{ flexDirection: 'column', display: 'flex', flexWrap: 'nowrap' }}>
        {userList.length === 0 ? (
          <li className="no-data">
            {activeTab === 'followers' ? '팔로워가 없습니다.' : '팔로잉하는 사용자가 없습니다.'}
          </li>
        ) : (
          userList.map((name, idx) => (
            <li key={idx} className="user-item" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
              <div className="avatar" />
              <span className="username">{name}</span>
              {activeTab === 'followers' ? (
                following.includes(name) ? (
                  <button
                    style={{ backgroundColor: 'gray'}}
                    className="unfollow-btn"
                    onClick={() => handleUnfollow(name)}
                  >
                    언팔로우
                  </button>
                ) : (
                  <button
                    className="follow-btn"
                    onClick={() => handleFollow(name)}
                  >
                    팔로우
                  </button>
                )
              ) : (
                <div className="btn-group">
                  {/* <button className="dm-btn">메시지</button> */}
                  <button
                    style={{ backgroundColor: 'gray' }}
                    className="unfollow-btn"
                    onClick={() => handleUnfollow(name)}
                  >
                    언팔로우
                  </button>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default FollowersPage;
