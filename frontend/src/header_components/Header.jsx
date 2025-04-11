import React from 'react';
import loge from '../header_assets/booklog_2.png';
import { RiArrowLeftSLine } from "react-icons/ri";
import '../header_style/headermain.css';
import { useNavigate, Link } from 'react-router-dom';

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
        width: '100%',
        backgroundColor: 'white'
    }

    return (
        <header style={headerStyle_1}>
            <div style={headerStyle}>
                <Link to="/" className='custom-link'>
                    <RiArrowLeftSLine size={35} /> 
                </Link>
                <div style={headerStyle_loge}>
                    <Link to="/headermain">
                        <img src={loge} style={{width: '150px', height: 'auto'}}/>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;
