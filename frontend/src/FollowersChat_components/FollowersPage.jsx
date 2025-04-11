import React, { useState } from 'react';
import '../FollowersChat_style/FollowersPage.css';

const FollowersPage = () => {
  const dummyData = {
    followers: [
      '이어정123', 'ASDF', '젤봐', '전이갈래', 'MeToo!', 'chlehdgh', '냉국수', '김수인',
    ],
    following: ['UserA', 'UserB', 'UserC'],
  };

  const [activeTab, setActiveTab] = useState('followers');

  return (
    <div className="followers-container">
      <header>
        <h1>@jnvifrieir</h1>
        <div className="tabs">
          <div
            className={activeTab === 'followers' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('followers')}
          >
            팔로워 {dummyData.followers.length}
          </div>
          <div
            className={activeTab === 'following' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('following')}
          >
            팔로잉 {dummyData.following.length}
          </div>
        </div>
      </header>

      <ul className="user-list">
        {dummyData[activeTab].map((name, idx) => (
          <li key={idx} className="user-item">
            <div className="avatar" />
            <span className="username">{name}</span>
            {activeTab === 'followers' ? (
              <button className="follow-btn">팔로우</button>
            ) : (
              <div className="btn-group">
                <button className="dm-btn">메시지</button>
                <button className="unfollow-btn">언팔로우</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


export default FollowersPage