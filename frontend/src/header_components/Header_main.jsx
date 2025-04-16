import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../header_assets/booklog_2.png';
import defaultProfileImg from '../etc_assets/profile.png';
import '../header_style/headermain.css';
import { AiOutlineSearch } from "react-icons/ai";

const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleSearchClick = () => {
        navigate('/search');
    };

    const handleProfileClick = () => {
        navigate('/myprofile');
    };

    return (
        <header className="header" style={{paddingLeft:'0px'}}>
            <div className="header-top" style={{gap:'17px'}}>
                <img className="logo" src={logo} alt="BookLog 로고" />

                {/* PC용 메뉴 */}
                <nav className="nav-menu pc-nav">
                    <Link to="/main">메인</Link>
                    <Link to="/mypage">나의 서재</Link>
                </nav>

                <div className="search-box">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder=" 검색어를 입력하세요"
                            onFocus={handleSearchClick}
                            readOnly
                        />
                        <AiOutlineSearch className="search-icon" />
                    </div>
                </div>

                <div className="user-info" onClick={handleProfileClick} style={{ cursor: "pointer", flexDirection:'column' }}>
                    <img
                        src={user?.profileImg || defaultProfileImg}
                        alt="프로필"
                        className="profile-img"
                        style={{marginRight:'0px'}}
                    />
                    <div>
                        <span className="userid">@{user?.userId}</span>
                    </div>
                </div>
            </div>

            {/* 모바일용 메뉴 */}
            <nav className="nav-menu mobile-nav">
                <Link to="/main">메인</Link>
                <Link to="/mypage">나의 서재</Link>
            </nav>
        </header>
    );
};

export default Header;