import React from 'react';
import logo from '../assets_header/booklog_2.png';
import profileImg from '../assets_header/profile.png';
import '../style_header/headermain.css';
import { useNavigate, Link } from 'react-router-dom';
import { AiOutlineSearch } from "react-icons/ai";

const Header = () => {
    const navigate = useNavigate();

    const handleSearchClick = () => {
        navigate('/search');
    };

    return (
        <header className="header">
            <div className="header-top">
                <img className="logo" src={logo} alt="BookLog 로고" />

                {/* PC에서는 이 nav 위치가 옮겨짐 */}
                <nav className="nav-menu pc-nav">
                    <Link to="/headermain">메인</Link>
                    <Link to="#">나의 서재</Link>
                </nav>

                <div className="search-box">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="검색어를 입력하세요"
                            onFocus={handleSearchClick}
                            readOnly
                        />
                        <AiOutlineSearch className="search-icon" />
                    </div>
                </div>

                <div className="user-info">
                    <img src={profileImg} alt="프로필" />
                    <span>내정보</span>
                </div>
            </div>

            {/* 모바일에서만 보이는 메뉴 */}
            <nav className="nav-menu mobile-nav">
                <Link to="/headermain">메인</Link>
                <Link to="#">나의 서재</Link>
            </nav>
        </header>
    );
};

export default Header;
