import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../FollowersChat_style/Message.css';
import { useNavigate, Link } from 'react-router-dom';
import profileImg from '../etc_assets/profile_1.png';

const Message = () => {
  const [activeTab, setActiveTab] = useState('followers');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setCurrentUser(parsedUser);
    } else {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (currentUser && currentUser.userId) {
      const fetchUserInfoList = async (userIds) => {
        const promises = userIds.map(id =>
          axios.get(`http://localhost:8082/controller/user/${id}`)
            .then(res => ({
              userId: id,
              nickname: res.data.nickname || id,
              profileImg: res.data.profileImg || null
            }))
            .catch(() => ({
              userId: id,
              nickname: id,
              profileImg: null
            }))
        );
        return Promise.all(promises);
      };

      axios.get(`http://localhost:8082/controller/following/${currentUser.userId}`)
        .then(res => fetchUserInfoList(res.data).then(setFollowers))
        .catch(err => console.error('팔로워 불러오기 실패', err));

      axios.get(`http://localhost:8082/controller/followers/${currentUser.userId}`)
        .then(res => fetchUserInfoList(res.data).then(setFollowing))
        .catch(err => console.error('팔로잉 불러오기 실패', err));
    }
  }, [currentUser]);

  const userList = activeTab === 'followers' ? followers : following;

  return (
    <div className="new-message-container">
      <div className="top-bar">
        <button className="back-button" onClick={() => navigate(-1)}>←</button>
        <h2>새 메시지</h2>
      </div>

      <div className="tabs">
        <div
          className={`tab ${activeTab === 'followers' ? 'active' : ''}`}
          onClick={() => setActiveTab('followers')}
        >
          Followers <span className="count">{followers.length}</span>
        </div>
        <div
          className={`tab ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          Following <span className="count">{following.length}</span>
        </div>
      </div>

      <div className="user-list">
        {userList.length > 0 ? (
          userList.map((user, idx) => (
            <div key={idx} className="user-card">
              <div className="user-info">
                <div className="avatar">
                  {user.profileImg ? (
                    <img
                      src={
                        user.profileImg.startsWith('http')
                          ? user.profileImg
                          : `http://localhost:8082/${user.profileImg}`
                      }
                      alt="프로필"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = profileImg;
                      }}
                    />
                  ) : (
                    <img src={profileImg} alt="기본 프로필" />
                  )}
                </div>
                <span style={{ fontSize: '20px', marginLeft: '10px' }}>{user.nickname}</span>
              </div>
              <Link to={`/chat/${user.userId}`} className="message-btn">
                Message
              </Link>
            </div>
          ))
        ) : (
          <div className="empty-message">
            {activeTab === 'followers' ? '팔로워' : '팔로잉'} 목록이 비어있습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
