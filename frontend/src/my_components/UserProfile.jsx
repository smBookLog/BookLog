import React from 'react'
import info from '../my_style/UserProfile.css'
import pic from '../etc_assets/profile.png'
import { AiOutlineComment } from 'react-icons/ai'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { AiFillEdit } from "react-icons/ai";
import { Link } from 'react-router-dom';

const UserProfile = () => {


  return (
    <div className="profile-card">
      <div className="profile-content">
        <div className="profile-image-container">
          <img
            src={pic}
            className="profile-image"
          />
        </div>
        <div className="profile-info">
          <div className="profile-header">
            <h2 className="profile-name">책읽는하마123</h2>
            {/* 팔로우/팔로잉 */}
            <Link to='/followers' className="profile-badge subscribe"><AiOutlineUserAdd /></Link>
            {/* DM */}
            <Link to='/chatpage' className="profile-badge follow"><AiOutlineComment /></Link>
          </div>
          <div className="profile-stats">팔로우 50 · 팔로잉 50</div>
          <p className="profile-bio">여기는 북로그 회원의 한줄 소개가 들어가는 공간입니다.</p>
          {/* <div className="profile-tags">
            <button className="profile-tag reader">로맨스</button>
            <button className="profile-tag reviewer">호러/스릴러</button>
            <button className="profile-tag leader">무협지</button>
          </div> */}
        </div>
        <div>
          <Link to="/myprofile" className='custom-link'>
            <AiFillEdit />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default UserProfile