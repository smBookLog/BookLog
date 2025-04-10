import React from 'react';
// import { ArrowLeft } from 'lucide-react';
import loge from '../assets_header/booklog_2.png';
import { RiArrowLeftSLine } from "react-icons/ri";
// import '../style_header/headermain.css'; // 스타일 파일 추가
import { Link } from 'react-router-dom';

const Header = () => {
    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '20px',
        justifyContent: 'space-between'
    };

    const headerStyle_loge = {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center'
    };

    const headerStyle_1 = {
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }

    return (
        <header style={headerStyle_1}>
            <div style={headerStyle}>
                <Link to="/headermain">
                    <RiArrowLeftSLine size={35} /> 
                </Link>
                <div style={headerStyle_loge}>
                    <Link to="/headermain">
                        <img src={loge} />
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;
