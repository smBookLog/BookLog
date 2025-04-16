import React, { useState, useEffect } from 'react';
import '../my_style/UserProfile.css';
import defaultPic from '../etc_assets/profile.png';
import { AiOutlineComment, AiOutlineUserAdd, AiFillEdit } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState({
    userId: '',
    name: '',
    profileImage: null,
    bio: '여기는 북로그 회원의 한줄 소개가 들어가는 공간입니다.',
  });

  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        console.log("localStorage에서 불러온 유저 데이터:", parsedUserData);

        const userId = parsedUserData.userId;

        setUser({
          userId,
          name: parsedUserData.name || '',
          profileImage:
            parsedUserData.profileImg &&
            parsedUserData.profileImg.trim() !== '' &&
            parsedUserData.profileImg !== 'null'
              ? parsedUserData.profileImg
              : null,
          bio: parsedUserData.bio || '여기는 북로그 회원의 한줄 소개가 들어가는 공간입니다.',
        });

        //  실시간 팔로우/팔로잉 수 가져오기
        axios.get(`http://localhost:8082/controller/followers/${userId}`)
          .then(res => setFollowers(res.data.length))
          .catch(err => console.error("팔로워 불러오기 실패", err));

        axios.get(`http://localhost:8082/controller/following/${userId}`)
          .then(res => setFollowing(res.data.length))
          .catch(err => console.error("팔로잉 불러오기 실패", err));
      } catch (error) {
        console.error("사용자 정보 파싱 오류:", error);
      }
    }
  }, []);

  const profileImageSrc = user.profileImage || defaultPic;

  return (
    <div className="profile-card">
      <div className="profile-content">
        <div className="profile-image-container">
          <img
            src={profileImageSrc}
            alt="프로필 이미지"
            className="profile-image"
          />
        </div>
        <div className="profile-info">
          <div className="profile-header">
            <h2 className="profile-name">{user.userId}</h2>
            <Link to='/followers' className="profile-badge subscribe" title="팔로워 목록">
              <AiOutlineUserAdd />
            </Link>
            <Link to='/MessageList' className="profile-badge follow" title="메시지함">
              <AiOutlineComment />
            </Link>
          </div>
          <div className="profile-stats">
            팔로우 {followers} · 팔로잉 {following}
          </div>
          <p className="profile-bio">{user.bio}</p>
        </div>
        <div>
          <Link to="/myprofile" className='custom-link' title="프로필 수정">
            <AiFillEdit />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
