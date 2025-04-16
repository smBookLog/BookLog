import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdOutlineSend } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../FollowersChat_style/ChatPage.css';

const ChatPage = () => {
  const { receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [senderId, setSenderId] = useState('');
  const [receiverProfileImg, setReceiverProfileImg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (!user.userId) {
        throw new Error('사용자 ID 정보가 없습니다.');
      }
      setSenderId(user.userId);
    } catch (error) {
      console.error('사용자 정보 파싱 오류:', error);
      alert('사용자 정보를 가져오는데 문제가 발생했습니다. 다시 로그인해주세요.');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!senderId) return;
      try {
        const [inboxRes, sentRes] = await Promise.all([
          axios.get(`http://localhost:8082/controller/message/inbox/${senderId}`),
          axios.get(`http://localhost:8082/controller/message/sent/${senderId}`)
        ]);

        const formatDate = (dateStr) => {
          if (!dateStr) return '시간 없음';
          const parsed = new Date(dateStr.replace(' ', 'T'));
          return parsed.toLocaleString('ko-KR', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        };

        const inboxMsgs = inboxRes.data
          .filter(msg => msg.senderId === receiverId)
          .map((msg, idx) => ({
            id: `inbox-${idx}`,
            sender: '상대방',
            rawTime: new Date(msg.sentAt.replace(' ', 'T')),
            time: formatDate(msg.sentAt),
            text: msg.content
          }));

        const sentMsgs = sentRes.data
          .filter(msg => msg.receiverId === receiverId)
          .map((msg, idx) => ({
            id: `sent-${idx}`,
            sender: '나',
            rawTime: new Date(msg.sentAt.replace(' ', 'T')),
            time: formatDate(msg.sentAt),
            text: msg.content
          }));

        const allMsgs = [...inboxMsgs, ...sentMsgs].sort((a, b) => a.rawTime - b.rawTime);
        setMessages(allMsgs);
      } catch (err) {
        console.error("메시지 불러오기 실패", err);
      }
    };

    fetchMessages();
  }, [receiverId, senderId]);

  useEffect(() => {
    const fetchReceiverInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:8082/controller/user/${receiverId}`);
        if (res.data && res.data.profileImg) {
          setReceiverProfileImg(res.data.profileImg);
        } else {
          setReceiverProfileImg('/default-profile.png');
        }
      } catch (err) {
        console.error('상대방 정보 조회 실패:', err);
        setReceiverProfileImg('/default-profile.png');
      }
    };

    if (receiverId) {
      fetchReceiverInfo();
    }
  }, [receiverId]);

  const handleSend = async () => {
    if (input.trim() === '' || !senderId) return;

    try {
      await axios.post('http://localhost:8082/controller/message/send', {
        senderId,
        receiverId,
        content: input
      });

      const now = new Date();
      const newMsg = {
        id: `local-${Date.now()}`,
        sender: '나',
        rawTime: now,
        time: now.toLocaleString('ko-KR', {
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        text: input
      };

      setMessages((prev) => [...prev, newMsg]);
      setInput('');
    } catch (err) {
      console.error("메시지 전송 실패", err);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <Link to="/MessageList">
          <span className="back-button"><IoArrowBack /></span>
        </Link>
        <div className="chat-profile-info">
          <img
            className="chat-profile-image"
            src={receiverProfileImg}
            alt="profile"
          />
          <span className="username">{receiverId}</span>
        </div>
      </div>
      <div className="chat-body">
        {messages.map((msg, idx) => (
          <div className="chat-message-wrapper" key={msg.id}>
            {(idx === 0 || messages[idx - 1].time !== msg.time) && (
              <div className="chat-time">{msg.time}</div>
            )}
            <div className={`chat-bubble ${msg.sender === '나' ? 'mine' : 'theirs'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}><MdOutlineSend /></button>
      </div>
    </div>
  );
};

export default ChatPage;
