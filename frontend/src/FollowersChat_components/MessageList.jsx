import React, { useEffect, useState } from 'react';
import '../FollowersChat_style/MessageList.css';
import { FiEdit2 } from 'react-icons/fi';
import { IoIosArrowBack } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import profileImg from '../etc_assets/profile.png';

const MessageList = () => {
  const [groupedMessages, setGroupedMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [usersData, setUsersData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserInfo(storedUser);
    } else {
      setError("로그인 정보를 찾을 수 없습니다.");
    }
  }, []);

  useEffect(() => {
    if (!userInfo) return;

    const userId = userInfo.userId || userInfo.id || '';
    if (!userId) {
      setError("사용자 ID를 찾을 수 없습니다.");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`http://localhost:8082/controller/message/all/${userId}`)
      .then(res => res.ok ? res.json() : Promise.reject("메시지를 불러오는데 실패했습니다."))
      .then(data => {
        const grouped = {};
        const otherUserIds = new Set();

        data.forEach(msg => {
          const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
          otherUserIds.add(otherId);
          grouped[otherId] = [...(grouped[otherId] || []), msg];
        });

        const latestMessages = Object.entries(grouped).map(([otherId, msgs]) => {
          const sorted = msgs.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
          return {
            userId: otherId,
            latestMessage: sorted[0],
            unreadCount: msgs.filter(msg => msg.senderId !== userId && !msg.isRead).length
          };
        }).sort((a, b) => new Date(b.latestMessage.sentAt) - new Date(a.latestMessage.sentAt));

        setGroupedMessages(latestMessages);
        fetchUsersInfo([...otherUserIds]);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("메시지를 불러오는데 실패했습니다.");
        setLoading(false);
      });
  }, [userInfo]);

  const fetchUsersInfo = async (userIds) => {
    const temp = {};
    for (const id of userIds) {
      try {
        const res = await fetch(`http://localhost:8082/controller/user/${id}`);
        if (res.ok) {
          const data = await res.json();
          temp[id] = {
            userId: id,
            nickname: data.nickname || data.userName || id,
            profileImage: data.profileImg || null
          };
        } else {
          temp[id] = { userId: id, nickname: id, profileImage: null };
        }
      } catch {
        temp[id] = { userId: id, nickname: id, profileImage: null };
      }
    }
    setUsersData(temp);
  };

  const handleClick = (otherUserId) => {
    navigate(`/chat/${otherUserId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
  
    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();
  
    if (isToday) {
      return date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } else {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    }
  };

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="message-container">
      <div className="message-header">
        <Link to='/mypage'><IoIosArrowBack size={24} /></Link>
        <span>메시지</span>
        <Link to='/Message'><FiEdit2 /></Link>
      </div>

      {loading ? (
        <div className="loading">메시지를 불러오는 중...</div>
      ) : (
        <div className="message-list">
          {groupedMessages.length > 0 ? (
            groupedMessages.map((item, index) => {
              const userData = usersData[item.userId] || { nickname: item.userId, userId: item.userId };
              return (
                <div className="message-item" key={index} onClick={() => handleClick(item.userId)}>
                  <div className="profile-img">
                    {userData.profileImage ? (
                      <img
                        src={
                          userData.profileImage.startsWith('http')
                            ? userData.profileImage
                            : `http://localhost:8082/${userData.profileImage}`
                        }
                        alt="프로필"
                        onError={(e) => {e.target.onerror = null; e.target.src = profileImg; }}
                      />
                    ) : (
                      <div className="default-profile">
                        {userData.nickname?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="message-info">
                    <div className="message-top">
                      <span className="name">{userData.nickname}</span>
                      <span className="time">{formatDate(item.latestMessage.sentAt)}</span>
                    </div>
                    <div className="message-bottom">
                      <div className="preview">{item.latestMessage.content}</div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-message">메시지가 없습니다.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageList;
