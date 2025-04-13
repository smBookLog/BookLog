import React from 'react'
import { useNavigate } from 'react-router-dom';
import booklogfindpw from "../Login_style/Findpw.css";
import img from '../header_assets/booklog_2.png';

const Findpw = () => {
  const navigate = useNavigate();

  const handleFindPassword = () => {
    // 비밀번호 찾기 로직 처리 후 이동
    navigate('/reset-password');
  };

  return (
    <div className="findpw-container">
      <div className="findpw-box">
        <img src={img} style={{ width: '400px', height: '120px', display: 'flex', justifyContent: 'center' }}></img>
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
            <input style={{ width: '395px' }} type="text" placeholder="성명" />
          </div>

          {/* 이메일 */}
          <div className="form-group">
            <label>이메일</label>
            <div className="email-row">
              <input type="text" placeholder="이메일" />
              <span>@</span>
              <select>
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="daum.net">daum.net</option>
              </select>
            </div>
          </div>

          {/* 버튼 */}
          <button style={{ width: '420px', marginLeft: '0px' }}
            type="submit" className="verify-btn" onClick={handleFindPassword} >비밀번호 찾기</button>
        </form>
      </div>
    </div>
  );
}


export default Findpw;