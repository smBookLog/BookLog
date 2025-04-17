import React, { useState, useEffect } from 'react';
import '../my_style/UserProfile.css';
import defaultPic from '../etc_assets/profile_1.png';
import { AiOutlineComment, AiOutlineUserAdd, AiFillEdit, AiOutlineCheck } from 'react-icons/ai';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const navigate = useNavigate();
  // URL 파라미터에서 사용자 ID 가져오기 (예: /profile/:userId)
  const { userId: profileUserId } = useParams();
  
  const [user, setUser] = useState({
    userId: '',
    name: '',
    profileImage: null,
    bio: '여기는 북로그 회원의 한줄 소개가 들어가는 공간입니다.',
  });

  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로그인한 현재 사용자 정보 가져오기
    const currentUserData = localStorage.getItem("user");
    let loggedInUserId = null;
    
    if (currentUserData) {
      try {
        const parsedUserData = JSON.parse(currentUserData);
        loggedInUserId = parsedUserData.userId;
        setCurrentUserId(loggedInUserId);
      } catch (error) {
        console.error("사용자 정보 파싱 오류:", error);
      }
    }
    
    // 프로필을 볼 사용자 ID 결정
    // URL 파라미터가 있으면 해당 사용자의 프로필, 없으면 현재 로그인한 사용자의 프로필
    const targetUserId = profileUserId || loggedInUserId;
    
    // 현재 보고 있는 프로필이 로그인한 사용자의 프로필인지 확인
    const isOwnProfile = loggedInUserId === targetUserId;
    setIsOwnProfile(isOwnProfile);
    
    if (targetUserId) {
      // 프로필 사용자 정보 가져오기
      axios.get(`http://localhost:8082/controller/user/${targetUserId}`)
        .then(response => {
          const userData = response.data;
          setUser({
            userId: userData.userId,
            name: userData.name || '',
            profileImage:
              userData.profileImg &&
              userData.profileImg.trim() !== '' &&
              userData.profileImg !== 'null'
                ? userData.profileImg
                : null,
            bio: userData.bio || '여기는 북로그 회원의 한줄 소개가 들어가는 공간입니다.',
          });
          
          // 팔로워/팔로잉 수 가져오기
          axios.get(`http://localhost:8082/controller/followers/${targetUserId}`)
            .then(res => setFollowers(res.data.length))
            .catch(err => console.error("팔로워 불러오기 실패", err));

          axios.get(`http://localhost:8082/controller/following/${targetUserId}`)
            .then(res => setFollowing(res.data.length))
            .catch(err => console.error("팔로잉 불러오기 실패", err));
          
          // 본인 프로필이 아닌 경우에만 팔로우 상태 확인
          if (!isOwnProfile && loggedInUserId) {
            axios.get(`http://localhost:8082/controller/following/${loggedInUserId}`)
              .then(res => {
                const isAlreadyFollowing = res.data.includes(targetUserId);
                setIsFollowing(isAlreadyFollowing);
              })
              .catch(err => console.error("팔로잉 상태 확인 실패", err));
          }
          
          setLoading(false);
        })
        .catch(error => {
          console.error("사용자 정보 로드 실패:", error);
          setLoading(false);
        });
    } else {
      // 사용자 ID가 없는 경우 로그인 페이지로 이동
      navigate('/login');
    }
  }, [profileUserId, navigate]);

  // 팔로우 처리
  const handleFollow = () => {
    if (!currentUserId) {
      alert("로그인이 필요합니다.");
      navigate('/login');
      return;
    }

    const followData = {
      followerId: currentUserId,     // 현재 로그인한 사용자
      followingId: user.userId       // 프로필 페이지의 사용자
    };

    if (isFollowing) {
      // 언팔로우
      axios.delete(`http://localhost:8082/controller/unfollow/${followData.followerId}/${followData.followingId}`)
        .then(res => {
          console.log(res.data);
          setIsFollowing(false);
          setFollowers(prev => prev - 1);
        })
        .catch(err => console.error("언팔로우 실패", err));
    } else {
      // 팔로우
      axios.post("http://localhost:8082/controller/follow", followData)
        .then(res => {
          console.log(res.data);
          setIsFollowing(true);
          setFollowers(prev => prev + 1);
        })
        .catch(err => console.error("팔로우 실패", err));
    }
  };

  const profileImageSrc = user.profileImage || defaultPic;
  
  // 팔로워 또는 팔로잉 목록 페이지로 이동하는 함수
  const handleViewFollowers = () => {
    navigate(`/followers`, { state: { type: 'followers', userId: user.userId, from: `/mypage/${user.userId}` } });
  };
  
  const handleViewFollowing = () => {
    navigate(`/followers`, { state: { type: 'following', userId: user.userId, from: `/mypage/${user.userId}`} });
  };

  if (loading) {
    return <div className="loading">프로필 로딩 중...</div>;
  }

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
            {/* 내 프로필이 아닐 때만 팔로우 버튼 표시 */}
            {!isOwnProfile && currentUserId && (
              <button 
                className={`profile-badge ${isFollowing ? 'following' : 'subscribe'}`}
                onClick={handleFollow}
                title={isFollowing ? "언팔로우" : "팔로우"}
              >
                {isFollowing ? <AiOutlineCheck /> : <AiOutlineUserAdd />}
              </button>
            )}
            {/* 로그인한 경우에만 메시지 버튼 표시 */}
            {currentUserId && (
              <Link to='/MessageList' className="profile-badge follow" title="메시지함">
                <AiOutlineComment />
              </Link>
            )}
          </div>
          <div className="profile-stats">
            <span className="clickable-stat" onClick={handleViewFollowers}>팔로우 {followers}</span> · <span className="clickable-stat" onClick={handleViewFollowing}>팔로잉 {following}</span>
          </div>
          <p className="profile-bio">{user.bio}</p>
        </div>
        <div>
          {/* 본인 프로필일 때만 수정 버튼 표시 */}
          {isOwnProfile && (
            <Link to="/myprofile" className='custom-link' title="프로필 수정">
              <AiFillEdit />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;