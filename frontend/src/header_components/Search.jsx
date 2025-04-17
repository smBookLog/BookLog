import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { RiArrowLeftSLine } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import '../header_style/search.css';
import bookinformation from "../etc_assets/bookinformation.png";
import defaultUserImage from "../etc_assets/sum.png";
import axios from 'axios';

const Search = () => {
    const [tab, setTab] = useState('전체');
    const [searchQuery, setSearchQuery] = useState('');
    const tabs = ['전체', '계정', '책'];

    const [accountResults, setAccountResults] = useState([]);
    const [bookResults, setBookResults] = useState([]);
    const [imgErrors, setImgErrors] = useState([]);

    const navigate = useNavigate();

    // 이미지 URL 보정
    const getValidImageUrl = (url) => {
        if (!url || url === "null" || url === "" || url.includes("no_image")) {
            return bookinformation;
        }
        return url.startsWith("http://") ? url.replace("http://", "https://") : url;
    };

    const handleImgError = (index) => {
        const updatedErrors = [...imgErrors];
        updatedErrors[index] = true;
        setImgErrors(updatedErrors);
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`http://localhost:8082/controller/search/user/keyword?keyword=${searchQuery}`);
            let data = res.data;
            if (typeof data === 'string') data = JSON.parse(data);
            setAccountResults(Array.isArray(data) ? data : []);
        } catch {
            setAccountResults([]);
        }
    };

    const fetchBooksByIsbn = async () => {
        try {
            const res = await axios.get(`http://localhost:8082/controller/search/book?isbn=${searchQuery}`);
            let data = res.data;
            if (typeof data === 'string') data = JSON.parse(data);
            const valid = data && data.isbn ? [data] : [];
            setBookResults(valid);
            setImgErrors(Array(valid.length).fill(false));
        } catch {
            setBookResults([]);
            setImgErrors([]);
        }
    };

    const fetchBooksByKeyword = async () => {
        try {
            const res = await axios.get(`http://localhost:8082/controller/search/book/keyword?keyword=${searchQuery}`);
            let data = res.data;
            if (typeof data === 'string') data = JSON.parse(data);
            const valid = Array.isArray(data) ? data : [];
            setBookResults(valid);
            setImgErrors(Array(valid.length).fill(false));
        } catch {
            setBookResults([]);
            setImgErrors([]);
        }
    };

    const fetchDefaultResults = () => {
        axios.get(`http://localhost:8082/controller/search/all/users`)
            .then(res => setAccountResults((res.data || []).slice(0, 5)))
            .catch(() => setAccountResults([]));

        axios.get(`http://localhost:8082/controller/search/all/books`)
            .then(res => {
                const books = (res.data || []).slice(0, 5);
                setBookResults(books);
                setImgErrors(Array(books.length).fill(false));
            })
            .catch(() => {
                setBookResults([]);
                setImgErrors([]);
            });
    };

    useEffect(() => {
        const delaySearch = debounce(() => {
            if (searchQuery.trim() === "") {
                fetchDefaultResults();
            } else {
                fetchUsers();
                /^\d{13}$/.test(searchQuery) ? fetchBooksByIsbn() : fetchBooksByKeyword();
            }
        }, 300);

        delaySearch();
        return () => delaySearch.cancel();
    }, [searchQuery]);

    const handleAccountClick = (userId) => {
        navigate(`/user/${userId}`);
    };

    const renderAccounts = () =>
        accountResults.map((acc, idx) => (
            <div
                key={idx}
                className="account-item"
                onClick={() => handleAccountClick(acc.userId)}
                style={{ cursor: 'pointer' }}
            >
                <img
                    src={acc.profileImg || defaultUserImage}
                    alt="유저 프로필"
                    className="account-image"
                />
                <span>{acc.nickname || acc.name || acc.userId || "이름 없음"}</span>
            </div>
        ));

    const renderBooks = () =>
        bookResults.map((book, idx) => {
            const imageUrl = getValidImageUrl(book.bookImg);
            const isDefault = imgErrors[idx] || !book.bookImg || imageUrl === bookinformation;

            const handleClick = () => {
                navigate(`/information/${book.isbn}`, {
                    state: {
                        bookIdx: book.bookIdx,
                        title: book.title,
                        author: book.author,
                        imageUrl: book.bookImg
                    }
                });
            };

            return (
                <div
                    key={idx}
                    className="book-item"
                    onClick={handleClick}
                    style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        flexDirection: 'row',
                        marginBottom: "16px"
                    }}
                >
                    <div
                        className="book-cover"
                        style={{
                            width: "80px",
                            height: "110px",
                            marginRight: "12px",
                            flexShrink: 0
                        }}
                    >
                        {isDefault ? (
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "#ccc",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "12px",
                                    color: "#555"
                                }}
                            >
                                기본 이미지
                            </div>
                        ) : (
                            <img
                                src={imageUrl}
                                alt={book.title}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
                                }}
                                onError={() => handleImgError(idx)}
                            />
                        )}
                    </div>
                    <div className="book-text" style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                        <div className="book-title" style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "4px" }}>
                            {book.title}
                        </div>
                        <div className="book-author" style={{ fontSize: "14px", color: "#666" }}>
                            {book.author}
                        </div>
                    </div>
                </div>
            );
        });

    const renderContent = () => {
        const hasAccounts = accountResults.length > 0;
        const hasBooks = bookResults.length > 0;
        const showNoResult = searchQuery.trim() !== "";

        if (tab === '전체') {
            return (
                <>
                    <h2 className="section-title">계정</h2>
                    {hasAccounts ? renderAccounts() : <div className="no-result">계정이 없습니다.</div>}
                    <h2 className="section-title">책</h2>
                    {hasBooks ? renderBooks() : <div className="no-result">책이 없습니다.</div>}
                    {showNoResult && !hasAccounts && !hasBooks && (
                        <div className="no-result">‘{searchQuery}’에 대한 검색 결과가 없습니다.</div>
                    )}
                </>
            );
        }

        if (tab === '계정') {
            return hasAccounts ? (
                <>
                    <h2 className="section-title">계정</h2>
                    {renderAccounts()}
                </>
            ) : (
                showNoResult && <div className="no-result">‘{searchQuery}’에 대한 계정 검색 결과가 없습니다.</div>
            );
        }

        if (tab === '책') {
            return hasBooks ? (
                <>
                    <h2 className="section-title">책</h2>
                    {renderBooks()}
                </>
            ) : (
                showNoResult && <div className="no-result">‘{searchQuery}’에 대한 책 검색 결과가 없습니다.</div>
            );
        }

        return null;
    };

    return (
        <div className="search-container">
            <header className="search-top">
                <Link to="/main">
                    <RiArrowLeftSLine size={35} />
                </Link>
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            </header>

            <div className="tab-menu">
                {tabs.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`tab-button ${tab === t ? 'active' : ''}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {renderContent()}
        </div>
    );
};

export default Search;
