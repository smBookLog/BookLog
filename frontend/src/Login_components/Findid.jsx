import React from "react";
import booklogfindId from "../Login_style/Findid.css";
import img from '../header_assets/booklog_2.png';

const Findid = () => {
    return (
        <div className="findid-container">
          <div className="findid-box">
            <img src={img} alt="logo" className="logo"></img>
            <br/>
    
            <form>
              {/* 성명 */}
              <div className="form-group">
                <label>성명</label>
                <input  type="text" placeholder="성명" />
              </div>
              <br/>
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
                <div style={{ marginTop: '0px'}}>
                  {/* 버튼 */}
                  <button type="button" className="verify-btn">메일 인증 받기</button>
                  <button 
                    type="button" className="verify-btn">아이디 찾기</button>
              </div>
          </div>
    
        </form>
          </div >
        </div >
      );
    }
    

export default Findid