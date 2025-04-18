import React from 'react'
import booklogresetpw from "../Login_style/Resetpw.css";
import img from '../header_assets/booklog_2.png';
const Resetpw = () => {
  return (
    <div className="resetpw-container">
      <div className="resetpw-box">
        <img src={img} alt="logo" className="logo"></img>
        <br />

        <form>
          {/* 새 비밀번호 */}
          <div className="form-group">
            <label>비밀번호</label>
            <input
              
              type="password"
              placeholder="8~16자 이내, 영문, 숫자, 특수문자 모두 혼용 가능"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-group">
            <label>비밀번호 확인</label>
            <input  type="password" placeholder="비밀번호를 다시 입력해주세요" />
          </div>

          {/* 설정 버튼 */}
          <button  type="submit" className="verify-btn">
            새 비밀번호 설정
          </button>
        </form>
      </div>
    </div>
  );
}


export default Resetpw