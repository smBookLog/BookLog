import React, { useState, useEffect } from "react";
import axios from "axios";
import editprofile from "../myprofile_style/EditProfile.css";
import image from "../etc_assets/profile.png";
import Header from "../header_components/Header";

function EditProfile() {
    // 디버깅 로그 추가
    console.log("로컬 스토리지 내용:", localStorage.getItem("user"));
    
    const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    
    console.log("파싱된 사용자 정보:", storedUser);

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

    useEffect(() => {
        // 사용자 정보가 없을 경우 로그인 페이지로 리디렉션
        if (!storedUser) {
            console.error("저장된 사용자 정보가 없습니다.");
            alert("로그인 정보가 없습니다. 로그인 페이지로 이동합니다.");
            window.location.href = "/login";
            return;
        }
        
        console.log("API 호출 시작, 사용자 ID:", storedUser.userId);
        
        // 서버에서 사용자 정보 불러오기 - controller 경로 추가
        axios.get(`http://localhost:8082/controller/user/${storedUser.userId}`)
          .then(response => {
            console.log("서버 응답:", response.data);
            
            if (!response.data) {
                throw new Error("서버에서 사용자 정보를 찾을 수 없습니다.");
            }
            
            const userData = response.data;
            setUser({
              userId: userData.userId || "",
              userPw: "",                    // 보안상 비밀번호는 빈 값으로
              confirmPw: "",
              name: userData.name || "",
              bio: userData.bio || "",
              profileImg: userData.profileImg || ""
            });
            
            // 이메일 분리 및 저장
            if (userData.email) {
              setStoredEmail(userData.email); // 기존 이메일 저장
              const [id, domain] = userData.email.split('@');
              setEmailId(id || "");
              setEmailDomain(domain || "naver.com");
            }
            
            setIsLoading(false);
          })
          .catch(error => {
            console.error("사용자 정보 로딩 실패:", error);
            console.error("에러 상세:", error.response || error.message);
            setLoadError(error.message || "사용자 정보를 불러오는데 실패했습니다.");
            setIsLoading(false);
            
            // 에러 발생 시에도 로컬 스토리지 데이터라도 사용
            if (storedUser) {
                if (storedUser.email) {
                    const [id, domain] = storedUser.email.split('@');
                    setEmailId(id || "");
                    setEmailDomain(domain || "naver.com");
                    setStoredEmail(storedUser.email);
                }
            }
          });
      }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        // 기본 유효성 검사
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
      
        // 비밀번호가 입력되지 않았다면 서버에 전송하지 않음
        if (!updatedUser.userPw) {
          delete updatedUser.userPw;
        }
        
        console.log("업데이트 요청 데이터:", updatedUser);
      
        // controller 경로 추가
        axios.put(`http://localhost:8082/controller/update/${storedUser.userId}`, updatedUser)
          .then((res) => {
            console.log("업데이트 응답:", res.data);
            alert(res.data);
            // 성공 시 로컬스토리지 사용자 정보 업데이트
            if(res.data.includes("수정되었습니다")) {
              const updatedStoredUser = {
                ...storedUser,
                userId: updatedUser.newUserId,
                name: updatedUser.name,
                bio: updatedUser.bio,
                profileImg: updatedUser.profileImg,
                email: fullEmail
              };
              localStorage.setItem("user", JSON.stringify(updatedStoredUser));
              console.log("로컬 스토리지 업데이트 완료:", updatedStoredUser);
              
              // 성공 후 페이지 이동 (선택사항)
              window.history.back();
            }
          })
          .catch((err) => {
            console.error("업데이트 오류:", err);
            console.error("응답 상세:", err.response?.data);
            alert("수정 실패: " + (err.response?.data || err.message));
          });
      };

    const checkUserId = () => {
        // 기존 아이디와 같은 경우 체크하지 않음
        if (user.userId === storedUser?.userId) {
            alert("현재 사용 중인 아이디입니다.");
            return;
        }

        if (!user.userId.trim()) {
            alert("아이디를 입력해주세요.");
            return;
        }

        // controller 경로 추가
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
        // 이메일 형식 검사
        if (!emailId.trim()) {
            alert("이메일을 입력해주세요.");
            return;
        }

        const fullEmail = `${emailId}@${emailDomain}`;
        
        // 기존 이메일과 같은 경우 체크하지 않음
        if (fullEmail === storedEmail) {
            alert("현재 사용 중인 이메일입니다.");
            return;
        }
        
        // controller 경로 추가
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
        // 이전 페이지로 이동
        window.history.back();
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/login"; // 로그인 페이지로 리디렉션
    };

    const handleLogin = () => {
        window.location.href = "/login"; // 로그인 페이지로 리디렉션
    };

    // 로딩 중이거나 오류가 있을 때 표시할 내용
    if (isLoading) {
        return (
            <div className="loading-container">
                <h2>사용자 정보를 불러오는 중입니다...</h2>
            </div>
        );
    }

    if (loadError && !storedUser) {
        return (
            <div className="error-container">
                <h2>오류가 발생했습니다</h2>
                <p>{loadError}</p>
                <button onClick={handleLogin}>로그인 페이지로 이동</button>
            </div>
        );
    }

    return (
        <div>
            <header className="edit-header">
                <div className="header-container">
                    <Header />
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
                    <img className="profile-img" src={user.profileImg || image} alt="유저 프로필" />
                </div>

                <hr className="divider" />

                <form className="form-section" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label>아이디</label>
                        <div className="inline-field">
                            <input
                                type="text"
                                name="userId"
                                value={user.userId}
                                onChange={handleChange}
                            />
                            <button type="button" onClick={checkUserId}>중복 확인</button>
                        </div>
                    </div>

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

                    <div className="form-group">
                        <label>성명</label>
                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>이메일</label>
                        <div className="inline-field">
                            <input
                                type="text"
                                value={emailId}
                                onChange={(e) => setEmailId(e.target.value)}
                            />
                            <span>@</span>
                            <select
                                value={emailDomain}
                                onChange={(e) => setEmailDomain(e.target.value)}
                            >
                                <option value="naver.com">naver.com</option>
                                <option value="gmail.com">gmail.com</option>
                                <option value="daum.net">daum.net</option>
                                <option value="example.com">example.com</option>
                            </select>
                            <button type="button" onClick={checkEmail}>중복 확인</button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>소개</label>
                        <textarea
                            name="bio"
                            value={user.bio}
                            onChange={handleChange}
                        />
                    </div>

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