import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../header_assets/booklog_2.png';
import profileImg from '../etc_assets/profile.png';
import '../header_style/headermain.css';
import { AiOutlineSearch } from "react-icons/ai";

const Header = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');

    useEffect(() => {
        const storedId = localStorage.getItem("userId");
        if (storedId) {
            axios.get(`http://localhost:8082/controller/user/${storedId}`)
                .then((res) => {
                    setName(res.data.name);  // UserDTO에 name이 있는 경우
                })
                .catch((err) => {
                    console.error("이름 불러오기 실패", err);
                });
        }
    }, []);

    const handleSearchClick = () => {
        navigate('/search');
    };

    return (
        <header className="header">
            <div className="header-top">
                <img className="logo" src={logo} alt="BookLog 로고"/>

                <nav className="nav-menu pc-nav">
                    <Link to="/main">메인</Link>
                    <Link to="/mypage">나의 서재</Link>
                </nav>

                <div className="search-box">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="검색어를 입력하세요 "
                            onFocus={handleSearchClick}
                            readOnly
                            style={{ padding: '10px 5px 10px 0.05px' }}
                        />
                        <AiOutlineSearch className="search-icon" />
                    </div>
                </div>

                <div className="user-info">
                    <Link to="/myprofile" className='custom-link'>
                        <img src={profileImg} alt="프로필" />
                        <br />
                        <span>{name || "내정보"} 님</span>
                    </Link>
                </div>
            </div>

            <nav className="nav-menu mobile-nav">
                <div>
                    <Link to="/main">메인</Link>
                </div>
                <div>
                    <Link to="/mypage">나의 서재</Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
