import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../FollowersChat_style/FollowersPage.css';

const FollowersPage = () => {
<<<<<<< HEAD
=======
  const userId = 'user01';
>>>>>>> b13bb68dc7023a87330b2aed7286e9b3e145b9a5
  // const dummyData = {
  //   followers: ['이어정123', 'ASDF', '젤봐', '전이갈래', 'MeToo!', 'chlehdgh', '냉국수', '김수인'],
  //   following: ['UserA', 'UserB', 'UserC'],
  // };

  const userId = 'user01';
  const [activeTab, setActiveTab] = useState('followers');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    // 나를 팔로우하는 사람 (followers)
    axios.get(`http://localhost:8082/controller/followers/${userId}`)
      .then(res => setFollowers(res.data))
      .catch(err => {
        console.error('팔로워 로딩 실패', err);

      });
  
    // 내가 팔로우하는 사람 (following)
    axios.get(`http://localhost:8082/controller/following/${userId}`)
      .then(res => setFollowing(res.data))
      .catch(err => {
        console.error('팔로잉 로딩 실패', err);

      });
  }, [userId]);
  


  const handleFollow = (target) => {
    axios.post(`http://localhost:8082/controller/follow`, {
      followerId: userId,
      followingId: target
    }).then(() => {
      alert(`${target}님을 팔로우했습니다.`);
      setFollowing(prev => [...prev, target]);
    }).catch(err => {
      console.error('팔로우 실패', err);
    });
  };

  const handleUnfollow = (target) => {
    axios.delete(`http://localhost:8082/controller/unfollow/${userId}/${target}`)
      .then(() => {
        alert(`${target}님을 언팔로우했습니다.`);
        setFollowing(prev => prev.filter(name => name !== target));
      })
      .catch(err => {
        console.error('언팔로우 실패', err);
      });
  };

  const userList = activeTab === 'followers' ? followers : following;

  return (
    <div className="followers-container">
      <header>
        <h1>@{userId}</h1>
        <div className="tabs">
          <div
            className={activeTab === 'followers' ? 'tab1 active' : 'tab1'}
            onClick={() => setActiveTab('followers')}
          >
            팔로워 {followers.length}
          </div>
          <div
            className={activeTab === 'following' ? 'tab1 active' : 'tab1'}
            onClick={() => setActiveTab('following')}
          >
            팔로잉 {following.length}
          </div>
        </div>
      </header>

      <ul className="user-list">
        {userList.length === 0 ? (
          <li className="no-data">표시할 사용자가 없습니다.</li>
        ) : (
          userList.map((name, idx) => (
            <li key={idx} className="user-item">
              <div className="avatar" />
              <span className="username">{name}</span>
              {activeTab === 'followers' ? (
                following.includes(name) ? (
                  <button className="unfollow-btn1" onClick={() => handleUnfollow(name)}>
                    언팔로우
                  </button>
                ) : (
                  <button className="follow-btn" onClick={() => handleFollow(name)}>
                    팔로우
                  </button>
                )
              ) : (
                <div className="btn-group">
                  <button  className="dm-btn">메시지</button>
                  <button className="unfollow-btn1" onClick={() => handleUnfollow(name)}>
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