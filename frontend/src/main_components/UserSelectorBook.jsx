import React from 'react';
import '../main_style/UserSelector.css';

const recommendedUsers = [
    {
      id: 1,
      username: '책읽는워니123',
      profileImage: null,
      isFollowing: true
    },
    {
      id: 2,
      username: '김나은',
      profileImage: null,
      isFollowing: false
    },
    {
      id: 3,
      username: 'asdf',
      profileImage: null,
      isFollowing: false
    },
    {
      id: 4,
      username: '박수안',
      profileImage: null,
      isFollowing: false
    },
    {
      id: 5,
      username: '책읽는워니123',
      profileImage: null,
      isFollowing: true
    },
    {
      id: 6,
      username: '김나은',
      profileImage: null,
      isFollowing: false
    },
    {
      id: 7,
      username: 'asdf',
      profileImage: null,
      isFollowing: false
    },
    {
      id: 8,
      username: '박수안',
      profileImage: null,
      isFollowing: false
    }
  ];
  
  function UserSelectorBook() {
    return (
      <div className="user-recommendation-container">
        <h3 className="recommendation-title">박수아님과 취향이 비슷한 유저들💕</h3>
        <div className="user-list">
          {recommendedUsers.map(user => (
            <div key={user.id} className="recommended-user">
              <div className="avatar-container">
                {user.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user.username} 
                    className="user-avatar" 
                  />
                ) : (
                  <div className="default-avatar">
                    <span className="avatar-icon">👤</span>
                  </div>
                )}
              </div>
              <div className="user-name">{user.username}</div>
              <button className="follow-btn">팔로우</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

export default UserSelectorBook