import React, { useState } from 'react'
import booklogsignup from "../Login_style/Signup.css";
import img from '../header_assets/booklog_2.png';
import axios from 'axios';


const Signup = () => {

  const [form, setForm] = useState({
    userId: '',
    name: '',
    userPw: '',
    confirmPw: '',
    nickname: '',
    email: '',
  });

  const [emailDomain, setEmailDomain] = useState("naver.com");
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const fullEmail = `${form.email}@${emailDomain}`;
    const newForm = { ...form, email: fullEmail };

    try {
      const response = await axios.post('http://localhost:8082/register', form);
      alert(response.data); // ex) "회원가입이 완료되었습니다."
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입 실패!');
    }
  };

  const checkUserId = async () => {
    const res = await axios.get(`http://localhost:8082/controller/check/id?userId=${form.userId}`);
    alert(res.data); // "사용 가능한 아이디입니다." 또는 "이미 사용 중인 아이디입니다."
  };

  const checkUseremail = async () => {
    const res = await axios.get(`http://localhost:8082/controller/check/email?email=${form.email}`);
    alert(res.data); // "사용 가능한 이메일입니다." 또는 "이미 사용 중인 이메일입니다."
  };

  return (
    <div className="signup-container">
      <div className="resetpw-box">
        <img src={img} alt="logo" className="logo"></img>
        <br />
        <form>
          {/* 아이디 */}
          <div className="form-group">
            <label>아이디</label>
            <div className="input-with-button">
              <input type="text" name="userId" value={form.userId} 
              onChange={handleChange} placeholder="6~16자/영문소문자, 숫자 사용가능" />
              <button type="button" onClick={checkUserId}>중복확인</button>
            </div>
          </div>

          {/* 성명 */}
          <div className="form-group">
            <label>성명</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="성명" />
          </div>

          {/* 비밀번호 */}
          <div className="form-group">
            <label>비밀번호</label>
            <input type="password" name="userPw" value={form.userPw} onChange={handleChange} placeholder="8~15자 영문, 숫자, 특수문자 모두 포함 가능" />
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-group">
            <label>비밀번호 확인</label>
            <input type="password" name="confirmPw" value={form.confirmPw} onChange={handleChange} placeholder="비밀번호를 다시 입력해주세요" />
          </div>

          {/* 닉네임
          <div className="form-group">
            <label>닉네임</label>
            <div className="input-with-button">
              <input type="text" placeholder="사용할 닉네임 입력해주세요" />
              <button type="button">중복확인</button>
            </div>
          </div> */}

          {/* 이메일 */}
          <div className="form-group email-group">
            <label>이메일</label>
            <div className="email-inputs">
              <input type="text" name="email" value={form.email} onChange={handleChange} placeholder="이메일" />
              <span>@</span>
              <select onChange={(e) => setEmailDomain(e.target.value)}>
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="daum.net">daum.net</option>
              </select>
              <div className="input-with-button">
                <button type="button" onClick={checkUseremail}>중복확인</button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <button
              type="button" className="verify-btn" onClick={handleRegister}>회원가입</button>
          </div>
        </form>
      </div>
    </div>
  );
}



export default Signup