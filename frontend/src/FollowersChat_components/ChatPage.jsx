import React, { useState } from 'react';
import chatPage from '../FollowersChat_style/ChatPage.css';

const initialMessages = [
    {
      id: 1,
      sender: '상대방',
      time: '4월 8일, 1:05 pm',
      text: '안녕하세요 독서 모임 관심 있어서 연락드려요',
    },
    {
      id: 2,
      sender: '나',
      time: '4월 8일, 2:32 pm',
      text: '안녕하세요! 반갑습니다 :)',
    },
    {
      id: 3,
      sender: '나',
      time: '4월 8일, 2:32 pm',
      text: '언제 가능하신가요?',
    },
    {
      id: 4,
      sender: '상대방',
      time: '4월 8일, 4:03 pm',
      text: '전 주말에 괜찮아요!',
    },
  ];
  

const ChatPage = () => {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
  
    const handleSend = () => {
      if (input.trim() === '') return;
      const newMsg = {
        id: messages.length + 1,
        sender: '나',
        time: '지금',
        text: input,
      };
      setMessages([...messages, newMsg]);
      setInput('');
    };
  
    return (
      <div className="chat-container">
        <div className="chat-header">
          <span className="back-button">←</span>
          <span className="username">책먹는하마123</span>
        </div>
        <div className="chat-body">
          {messages.map((msg, idx) => (
            <div key={idx}>
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
          <button onClick={handleSend}>🟢</button>
        </div>
      </div>
    );
  }
  
export default ChatPage