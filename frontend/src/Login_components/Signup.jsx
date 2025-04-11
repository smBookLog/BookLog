import React from 'react'
import booklogsignup from "../Login_style/Signup.css";
import img from '../header_assets/booklog_2.png';


const Signup = () => {
  return (
    <div className="signup-container">
      <div>
        <img src={img} alt="logo" className="logo"></img>
        <br />
        <form>
          {/* 아이디 */}
          <div className="form-group">
            <label>아이디</label>
            <div className="input-with-button">
              <input type="text" placeholder="6~15자 영문+숫자, 숫자 시작 불가" />
              <button type="button">중복확인</button>
            </div>
          </div>

          {/* 성명 */}
          <div className="form-group">
            <label>성명</label>
            <input  type="text" placeholder="성명" />
          </div>

          {/* 비밀번호 */}
          <div className="form-group">
            <label>비밀번호</label>
            <input  type="password" placeholder="8~15자 영문, 숫자, 특수문자 모두 포함 가능" />
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-group">
            <label>비밀번호 확인</label>
            <input  type="password" placeholder="비밀번호를 다시 입력해주세요" />
          </div>
          
          {/* 닉네임 */}
          <div className="form-group">
            <label>닉네임</label>
            <div className="input-with-button">
              <input type="text" placeholder="사용할 닉네임 입력해주세요" />
              <button type="button">중복확인</button>
            </div>
          </div>

          {/* 이메일 */}
          <div className="form-group email-group">
            <label>이메일</label>
            <div className="email-inputs">
              <input type="text" placeholder="이메일" />
              <span>@</span>
              <select>
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="daum.net">daum.net</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <button style={{ width: '450px', marginLeft: '0px' }}
              className="verify-btn">회원가입</button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default Signup