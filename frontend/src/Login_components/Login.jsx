import React, { useState, useEffect } from 'react';
import "../Login_style/Login.css";
import image from "../header_assets/booklog_1.png";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [users, setUsers] = useState([]);
  const [rememberLogin, setRememberLogin] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8082/controller/login')
      .then(res => setUsers(res.data))
      .catch(err => console.error("유저 정보 불러오기 실패", err));
  }, []);

  const handleSignup = () => {
    navigate("/signup");
  };
  
  const login = () => {
    // 입력 검증
    if (!id.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }
    if (!pw.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    axios.post('http://localhost:8082/controller/login', {
      userId: id,
      userPw: pw
    })
      .then(res => {
        const msg = res.data;
        if (msg === "아이디 또는 비밀번호가 올바르지 않습니다.") {
          alert(msg);
        } else {
          alert(msg);
          
          // 로그인 성공 시 사용자 정보 가져오기
          axios.get(`http://localhost:8082/controller/user/${id}`)
            .then(userRes => {
              console.log("사용자 정보 로드 성공:", userRes.data);
              
              // 사용자 정보를 localStorage에 저장
              const userData = userRes.data;
              localStorage.setItem("user", JSON.stringify(userData));
              
              // 로그인 상태 유지 체크했을 경우
              if (rememberLogin) {
                localStorage.setItem("rememberLogin", "true");
              }
              
              navigate('/main');
            })
            .catch(err => {
              console.error("사용자 정보 가져오기 실패", err);
              
              // API 호출은 실패했지만 로그인은 성공했으므로 최소한의 정보로 로컬 스토리지 저장
              const minimalUserData = {
                userId: id,
                name: msg.replace("님 환영합니다!", "").trim() // 환영 메시지에서 이름 추출
              };
              localStorage.setItem("user", JSON.stringify(minimalUserData));
              
              alert("로그인은 성공했으나 일부 사용자 정보를 가져오지 못했습니다.");
              navigate('/main');
            });
        }
      })
      .catch(err => {
        console.error("로그인 오류", err);
        alert("서버 오류가 발생했습니다.");
      });
  };
  
  // 엔터 키로 로그인 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      login();
    }
  };
  
  return (
    <div className="container">
      <div className="login-box">
        <div className="logo-section">
          <img style={{marginTop:'2rem'}} src={image} alt="logo" className="logo" />
        </div>

        <div className="input-section">
          <input
            type="text"
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyPress={handleKeyPress}
            // style={{ width: '372px' }}
          />
          <input
            type="password"
            placeholder="PW"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyPress={handleKeyPress}
            // style={{ width: '372px' }}
          />
        </div>

        <div className="options">
          <div>
            <button onClick={() => navigate("/find-id")} className="link-btn">아이디찾기</button>
            <button onClick={() => navigate("/find-pw")} className="link-btn">비밀번호찾기</button>
          </div>
          <label>
            <input 
              type="checkbox" 
              checked={rememberLogin}
              onChange={(e) => setRememberLogin(e.target.checked)}
            />
            로그인 상태 유지
          </label>
        </div>

        <button className="login-btn" onClick={login}>로그인</button>
        <button onClick={handleSignup} className="signup-btn">회원가입</button>
      </div>
    </div>
  );
};

export default Login;