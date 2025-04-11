import React, { useState, useEffect } from 'react';
import "../Login_style/Login.css";
import image from "../header_assets/booklog_1.png"
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const Login = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [users, setUsers] = useState([]);

  // useEffect로 유저 데이터 가져오기
  useEffect(() => {
    axios.get('http://localhost:8082/controller/login')
      .then(res => setUsers(res.data))
      .catch(err => console.error("유저 정보 불러오기 실패", err));
  }, []);



  const handleSignup = () => {
    navigate("/signup");
  };

  const login = () => {
    const user = users.find(u => u.id === id && u.password === pw);
    if (user) {
      alert(`${user.name}님 환영합니다!`);
      navigate('/main');
    } else {
      alert('ID 또는 비밀번호가 올바르지 않습니다.');
    }

    return (

      <div className="container">
        <div className="login-box">
          <div className="logo-section">
            <img src={image} alt="logo" className="logo" />
          </div>

          <div className="input-section">
            <input type="text" placeholder="ID" />
            <input type="password" placeholder="PW" />
          </div>

          <div className="options">
            <div>
              <button onClick={() => navigate("/find-id")} className="link-btn">아이디찾기</button>
              <button onClick={() => navigate("/find-pw")} className="link-btn">비밀번호찾기</button>
            </div>
            <label>
              <input type="checkbox" />
              로그인 상태 유지
            </label>
          </div>

          <button className="login-btn" onClick={login}>로그인</button>
          <button onClick={handleSignup} className="signup-btn">회원가입</button>

        </div>

        <div className="input-section">
          <input style={{ width: '372px' }} type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} />
          <input style={{ width: '372px' }} type="password" placeholder="PW" value={pw} onChange={(e) => setPw(e.target.value)} />
        </div>

        <div className="options">
          <div>
            <button onClick={() => navigate("/find-id")} className="link-btn">아이디찾기</button>
            <button onClick={() => navigate("/find-pw")} className="link-btn">비밀번호찾기</button>
          </div>
          <label>
            <input type="checkbox" />
            로그인 상태 유지
          </label>
        </div>

        <button className="login-btn" onClick={login}>로그인</button>
        <button onClick={handleSignup} className="signup-btn">회원가입</button>
      </div>
    );
  }
}

export default Login;