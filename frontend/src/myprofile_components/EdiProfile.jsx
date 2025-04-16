import React, { useState } from "react";
import axios from "axios";
import editprofile from "../myprofile_style/EditProfile.css";
import image from "../etc_assets/profile.png"
import Header_mypage from "../header_components/Header_mypage";
import { useParams } from 'react-router-dom';

function EditProfile() {
    const [name, setUserId] = useState("");
    const [email, setEmail] = useState("EchoRider");
    const [emailDomain, setEmailDomain] = useState("naver.com");

    const { userId } = useParams();

    const handleLogout = () => {
        localStorage.removeItem("userId"); // 예: 로그인 정보 제거
        window.location.href = "/login";   // 로그인 페이지로 이동
    };
    

    const handleCheckUserId = () => {
        alert("사용 가능한 아이디입니다."); // 실제 서버 검증 연결 가능
    };

    const handleCheckEmail = () => {
        alert("사용 가능한 이메일입니다."); // 실제 서버 검증 연결 가능
    };

    return (
        <div>
            {/* 상단 헤더 */}
            <header className="edit-header">
                <div className="header-container">
                    <Header_mypage />
                    <button className="logout-btn" onClick={handleLogout}>로그아웃</button>

                </div>
            </header>


            <div className="edit-container">

                {/* 프로필 이미지 */}
                <div className="profile-section">
                    <img
                        className="profile-img"
                        src={image}
                        alt="유저 프로필"
                    />
                </div>

                <hr className="divider" />

                {/* 입력 폼 */}
                {/* 성명 */}
                <form className="form-section">
                    <div className="form-group">
                        <label>아이디</label>
                        <div className="inline-field">
                            <input type="text" value={userId} placeholder="아이디" />
                            <button type="button" className="input-with-button"
                                onClick={handleCheckUserId}>중복 확인</button>
                        </div>
                    </div>

                    {/* 비밀번호 */}
                    <div className="form-group">
                        <label>비밀번호</label>
                        <input type="password" placeholder="8~16자리, 숫자, 특수문자 모두 포함 가능" />
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="form-group">
                        <label>비밀번호 확인</label>
                        <input type="password" placeholder="8~16자리, 숫자, 특수문자 모두 포함 가능" />
                    </div>

                    {/* 닉네임
                    <div className="form-group">
                        <label>닉네임</label>
                        <div className="inline-field">
                            <input
                                style={{ width: '600px' }}
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                            <button type="button" className="check-btn1">
                                중복 확인
                            </button>
                        </div>
                    </div> */}

                    {/* 이메일 */}
                    <div className="form-group">
                        <label>이메일</label>
                        <div className="inline-field">
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" />
                            <span>@</span>
                            <select value={emailDomain}
                                onChange={(e) => setEmailDomain(e.target.value)}>
                                <option value="naver.com">naver.com</option>
                                <option value="gmail.com">gmail.com</option>
                                <option value="daum.net">daum.net</option>
                            </select>
                            <button type="button" className="input-with-button"
                                onClick={handleCheckEmail}>중복 확인</button>
                        </div>
                    </div>

                    {/* 관심분야
                    <div className="form-group">
                        <label>관심 분야(최대 5개)</label>
                        <div className="tag-box">
                            <span className="tag red">로맨스</span>
                            <span className="tag purple">인문사회</span>
                            <span className="tag yellow">자기계발</span>
                            <button className="add-tag">＋</button>
                        </div>
                    </div> */}

                    {/* 소개글 */}
                    <div className="form-group">
                        <label>소개</label>
                        <textarea placeholder="수정할 소개글을 입력해주세요." />
                    </div>

                    {/* 버튼 */}
                    <div className="button-group">
                        <button className="cancel-btn">취소</button>
                        <button className="submit-btn">수정</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;
