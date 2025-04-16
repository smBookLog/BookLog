import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdOutlineSend } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { Link, useParams } from 'react-router-dom';
import '../FollowersChat_style/ChatPage.css';

const ChatPage = () => {
  const { receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const senderId = 'user01';

  useEffect(() => {
    const fetchMessages = async () => {
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
  }, [receiverId]);

  const handleSend = async () => {
    if (input.trim() === '') return;

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
            src="/static/media/profile.6083c57c60f3e626368f.png"
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
