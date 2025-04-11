import React from 'react'
import "../Login_style/Login.css";
import image from "../header_assets/booklog_1.png"
import { useNavigate } from "react-router-dom";


const Login = () => {
    const navigate = useNavigate();
    const handleSignup = () => {
      navigate("/signup");
    };
    const login = () => {
      navigate('/main')
    }
    return (
      
      <div className="container">
        <div className="login-box">
          <div className="logo-section">
            <img src={image} style={{width:'200px', height:'200px'}} className="logo" />
          </div>
  
          <div className="input-section">
            <input style={{width:'372px'}} type="text" placeholder="ID" />
            <input style={{width:'372px'}} type="password" placeholder="PW" />
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
      </div>
  
      
    );
  }
  

export default Login