import React, { useState, useEffect } from "react";
import axios from "axios";
import editprofile from "../myprofile_style/EditProfile.css";
import image from "../etc_assets/profile.png";
import Header_mypage from "../header_components/Header_mypage";

function EditProfile() {
    const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

    const [user, setUser] = useState({
        userId: storedUser?.userId || "",
        userPw: "",
        confirmPw: "",
        name: storedUser?.name || "",
        email: "",
        bio: storedUser?.bio || "",
        profileImg: storedUser?.profileImg || ""
    });

    const [emailId, setEmailId] = useState("");
    const [emailDomain, setEmailDomain] = useState("naver.com");
    const [storedEmail, setStoredEmail] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newProfileUrl, setNewProfileUrl] = useState(user.profileImg || "");
    const [urlValid, setUrlValid] = useState(true);

    useEffect(() => {
        if (!storedUser) {
            alert("로그인 정보가 없습니다. 로그인 페이지로 이동합니다.");
            window.location.href = "/login";
            return;
        }

        axios.get(`http://localhost:8082/controller/user/${storedUser.userId}`)
            .then(response => {
                const userData = response.data;
                setUser({
                    userId: userData.userId || "",
                    userPw: "",
                    confirmPw: "",
                    name: userData.name || "",
                    bio: userData.bio || "",
                    profileImg: userData.profileImg || ""
                });

                if (userData.email) {
                    setStoredEmail(userData.email);
                    const [id, domain] = userData.email.split("@");
                    setEmailId(id || "");
                    setEmailDomain(domain || "naver.com");
                }

                setIsLoading(false);
            })
            .catch(error => {
                console.error("사용자 정보 로딩 실패:", error);
                setLoadError(error.message || "사용자 정보를 불러오는데 실패했습니다.");
                setIsLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if (!user.userId || user.userId.trim() === "") {
            alert("아이디를 입력해주세요.");
            return;
        }

        if (user.userPw && user.userPw !== user.confirmPw) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        const fullEmail = `${emailId}@${emailDomain}`;
        if (!emailId || emailId.trim() === "") {
            alert("이메일을 입력해주세요.");
            return;
        }

        const updatedUser = {
            newUserId: user.userId,
            userPw: user.userPw,
            name: user.name,
            email: fullEmail,
            bio: user.bio,
            profileImg: user.profileImg
        };

        if (!updatedUser.userPw) {
            delete updatedUser.userPw;
        }

        axios.put(`http://localhost:8082/controller/update/${storedUser.userId}`, updatedUser)
            .then((res) => {
                alert(res.data);
                if (res.data.includes("수정되었습니다")) {
                    const updatedStoredUser = {
                        ...storedUser,
                        userId: updatedUser.newUserId,
                        name: updatedUser.name,
                        bio: updatedUser.bio,
                        profileImg: updatedUser.profileImg,
                        email: fullEmail
                    };
                    localStorage.setItem("user", JSON.stringify(updatedStoredUser));
                    window.history.back();
                }
            })
            .catch((err) => {
                console.error("업데이트 오류:", err);
                alert("수정 실패: " + (err.response?.data || err.message));
            });
    };

    const checkUserId = () => {
        if (user.userId === storedUser?.userId) {
            alert("현재 사용 중인 아이디입니다.");
            return;
        }

        if (!user.userId.trim()) {
            alert("아이디를 입력해주세요.");
            return;
        }

        axios.get("http://localhost:8082/controller/check/id", {
            params: { userId: user.userId }
        })
            .then(res => alert(res.data))
            .catch(err => {
                console.error("아이디 체크 오류:", err);
                alert("아이디 중복 확인 실패: " + (err.response?.data || err.message));
            });
    };

    const checkEmail = () => {
        if (!emailId.trim()) {
            alert("이메일을 입력해주세요.");
            return;
        }

        const fullEmail = `${emailId}@${emailDomain}`;
        if (fullEmail === storedEmail) {
            alert("현재 사용 중인 이메일입니다.");
            return;
        }

        axios.get("http://localhost:8082/controller/check/email", {
            params: { email: fullEmail }
        })
            .then(res => alert(res.data))
            .catch(err => {
                console.error("이메일 체크 오류:", err);
                alert("이메일 중복 확인 실패: " + (err.response?.data || err.message));
            });
    };

    const handleCancel = () => {
        window.history.back();
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    const handleLogin = () => {
        window.location.href = "/login";
    };

    const handleProfileImgClick = () => {
        setNewProfileUrl(user.profileImg);
        setShowModal(true);
    };

    const handleModalConfirm = () => {
        if (urlValid) {
            setUser(prev => ({ ...prev, profileImg: newProfileUrl }));
            setShowModal(false);
        } else {
            alert("유효한 이미지 URL을 입력해주세요.");
        }
    };

    const handleModalCancel = () => {
        setShowModal(false);
    };

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setNewProfileUrl(url);
        validateImageUrl(url);
    };

    const validateImageUrl = (url) => {
        const img = new Image();
        img.onload = () => setUrlValid(true);
        img.onerror = () => setUrlValid(false);
        img.src = url;
    };

    if (isLoading) {
        return <div className="loading-container"><h2>사용자 정보를 불러오는 중입니다...</h2></div>;
    }

    return (
        <div>
            <header className="edit-header">
                <div className="header-container">
                    <Header_mypage />
                    <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
                </div>
            </header>

            {loadError && (
                <div className="warning-banner">
                    <p>서버에서 최신 정보를 불러오지 못했습니다. 일부 정보가 최신 상태가 아닐 수 있습니다.</p>
                </div>
            )}

            <div className="edit-container">
                <div className="profile-section">
                    <img
                        className="profile-img"
                        src={user.profileImg || image}
                        alt="유저 프로필"
                        onClick={handleProfileImgClick}
                        style={{ width: "100px", height: "100px",cursor: "pointer" }}
                        title="클릭하여 이미지 URL 변경"
                    />
                </div>

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>프로필 이미지 URL 변경</h3>
                            <input
                                type="text"
                                value={newProfileUrl}
                                onChange={handleUrlChange}
                                placeholder="이미지 URL을 입력하세요"
                            />
                            <div className="preview-section">
                                {newProfileUrl && (
                                    <img
                                        src={newProfileUrl}
                                        alt="미리보기"
                                        style={{
                                            maxWidth: "100px",
                                            border: urlValid ? "2px solid green" : "2px solid red"
                                        }}
                                    />
                                )}
                                {!urlValid && <p style={{ color: "red" }}>유효하지 않은 이미지 URL입니다.</p>}
                            </div>
                            <div className="modal-buttons">
                                <button onClick={handleModalCancel}>취소</button>
                                <button onClick={handleModalConfirm} disabled={!urlValid}>확인</button>
                            </div>
                        </div>
                    </div>
                )}

                <hr className="divider" />

                <form className="form-section" onSubmit={(e) => e.preventDefault()}>
                    {/* 아이디 */}
                    <div className="form-group">
                        <label>아이디</label>
                        <div className="input-with-button">
                            <input type="text" name="userId" value={user.userId} onChange={handleChange} />
                            <button type="button" onClick={checkUserId}>중복 확인</button>
                        </div>
                    </div>

                    {/* 비밀번호 */}
                    <div className="form-group">
                        <label>비밀번호</label>
                        <input
                            type="password"
                            name="userPw"
                            value={user.userPw}
                            onChange={handleChange}
                            placeholder="변경할 비밀번호를 입력하세요"
                        />
                    </div>
                    
                    {/* 비밀번호 확인 */}
                    <div className="form-group">
                        <label>비밀번호 확인</label>
                        <input
                            type="password"
                            name="confirmPw"
                            value={user.confirmPw}
                            onChange={handleChange}
                            placeholder="비밀번호를 다시 입력하세요"
                        />
                    </div>

                    {/* 이름
                    <div className="form-group">
                        <label>성명</label>
                        <input type="text" name="name" value={user.name} onChange={handleChange} />
                    </div> */}

                    {/* 이메일 */}
                    <div className="form-group email-group">
                        <label>이메일</label>
                        <div className="email-inputs">
                            <input type="text" value={emailId} onChange={(e) => setEmailId(e.target.value)} />
                            <span>@</span>
                            <select value={emailDomain} onChange={(e) => setEmailDomain(e.target.value)}>
                                <option value="naver.com">naver.com</option>
                                <option value="gmail.com">gmail.com</option>
                                <option value="daum.net">daum.net</option>
                                <option value="example.com">example.com</option>
                            </select>
                            <div className="input-with-button">
                            <button type="button" onClick={checkEmail}>중복 확인</button>
                            </div>
                        </div>
                    </div>

                    {/* 소개 */}
                    <div className="form-group">
                        <label>소개</label>
                        <textarea name="bio" value={user.bio} onChange={handleChange} />
                    </div>

                    {/* 버튼 */}
                    <div className="button-group">
                        <button type="button" className="cancel-btn" onClick={handleCancel}>취소</button>
                        <button type="button" className="submit-btn" onClick={handleSubmit}>수정</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;
