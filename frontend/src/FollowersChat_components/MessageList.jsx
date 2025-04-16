import React, { useEffect, useState } from 'react';
import '../FollowersChat_style/MessageList.css';
import { FiEdit2 } from 'react-icons/fi';
import { IoIosArrowBack } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';

const MessageList = () => {
  const [groupedMessages, setGroupedMessages] = useState([]);
  const userId = 'user01'; // 로그인 사용자 ID
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8082/controller/message/all/${userId}`)
      .then(response => response.json())
      .then(data => {
        const grouped = {};

        data.forEach(msg => {
          const otherUser = msg.senderId === userId ? msg.receiverId : msg.senderId;
          if (!grouped[otherUser]) {
            grouped[otherUser] = [];
          }
          grouped[otherUser].push(msg);
        });

        const latestMessages = Object.entries(grouped).map(([user, msgs]) => {
          const sorted = msgs.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
          return {
            userId: user,
            latestMessage: sorted[0]
          };
        });

        latestMessages.sort((a, b) => new Date(b.latestMessage.sentAt) - new Date(a.latestMessage.sentAt));
        setGroupedMessages(latestMessages);
      })
      .catch(error => console.error('메시지 로딩 실패:', error));
  }, []);

  // ✅ 대화 상대 클릭 시 ChatPage로 이동
  const handleClick = (otherUserId) => {
    navigate(`/chat/${otherUserId}`);
  };

  return (
    <div className="message-container">
      <div className="message-header">
      <Link to='/mypage'>
          <IoIosArrowBack size={24} style={{ cursor: 'pointer' }} />
        </Link>
        <span>메시지</span>
        <Link to='/Message'>
          <FiEdit2 style={{ cursor: 'pointer' }} />
        </Link>
      </div>

      <div className="message-list">
        {groupedMessages.map((item, index) => (
          <div
            className="message-item"
            key={index}
            onClick={() => handleClick(item.userId)}
            style={{ cursor: 'pointer' }}
          >
            <div className="profile-img" />
            <div className="message-info">
              <div className="message-top">
                <span className="name">{item.userId}</span>
                <span className="time">{item.latestMessage.sentAt}</span>
              </div>
              <div className="preview">{item.latestMessage.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;
