import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../FollowersChat_style/Message.css';
import { useNavigate } from 'react-router-dom';

const Message = () => {
  const [activeTab, setActiveTab] = useState('followers');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const userId = 'user03'; // 로그인 유저 ID라고 가정
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8082/controller/following/${userId}`)
      .then(res => setFollowers(res.data))
      .catch(err => console.error('팔로워 불러오기 실패', err));

    axios.get(`http://localhost:8082/controller/followers/${userId}`)
      .then(res => setFollowing(res.data))
      .catch(err => console.error('팔로잉 불러오기 실패', err));
  }, [userId]);

  const handleMessageClick = (receiverName) => {
    const content = prompt(`${receiverName}님에게 보낼 메시지를 입력하세요:`);
    if (!content) return;

    axios.post('http://localhost:8082/controller/message/send', {
      senderId: userId,
      receiverId: receiverName,
      content: content
    })
      .then(() => {
        alert('메시지 전송 완료!');
        navigate(`/message/conversation/${userId}/${receiverName}`);
      })
      .catch(err => {
        console.error('메시지 전송 실패:', err);
        alert('메시지 전송 실패');
      });
  };

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
        {userList.map((name, idx) => (
          <div key={idx} className="user-card">
            <div className="user-info">
              <div className="avatar" />
              <span>{name}</span>
            </div>
            <button className="message-btn" onClick={() => handleMessageClick(name)}>Message</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Message;
