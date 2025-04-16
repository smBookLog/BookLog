import React, { useState, useEffect } from 'react';
import { RiArrowLeftSLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import '../header_style/search.css';
import bookinformation from "../etc_assets/bookinformation.png";
import axios from 'axios';

const Search = () => {
    const [tab, setTab] = useState('전체');
    const [searchQuery, setSearchQuery] = useState('');
    const tabs = ['전체', '계정', '책'];

    const [accountResults, setAccountResults] = useState([]);
    const [bookResults, setBookResults] = useState([]);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            // 전체 유저/책 불러오기
            axios.get(`http://localhost:8082/controller/search/all/users`)
                .then(res => {
                    console.log("전체 유저:", res.data);
                    setAccountResults(res.data || []);
                })
                .catch(() => setAccountResults([]));

            axios.get(`http://localhost:8082/controller/search/all/books`)
                .then(res => {
                    console.log("전체 책:", res.data);
                    setBookResults(res.data || []);
                })
                .catch(() => setBookResults([]));
        } else {
            // 유저 검색
            axios.get(`http://localhost:8082/controller/search/user?userId=${searchQuery}`)
                .then(res => {
                    let data = res.data;
                    if (typeof data === 'string') {
                        try {
                            data = JSON.parse(data);
                        } catch {
                            setAccountResults([]);
                            return;
                        }
                    }
                    if (data && data.userId) {
                        setAccountResults([data]);
                    } else {
                        setAccountResults([]);
                    }
                })
                .catch(() => setAccountResults([]));

            // 책 검색
            if (/^\d{13}$/.test(searchQuery)) {
                axios.get(`http://localhost:8082/controller/search/book?isbn=${searchQuery}`)
                    .then(res => {
                        let data = res.data;
                        if (typeof data === 'string') {
                            try {
                                data = JSON.parse(data);
                            } catch {
                                setBookResults([]);
                                return;
                            }
                        }
                        if (data && data.isbn) {
                            setBookResults([data]);
                        } else {
                            setBookResults([]);
                        }
                    })
                    .catch(() => setBookResults([]));
            } else {
                axios.get(`http://localhost:8082/controller/search/book/title?title=${searchQuery}`)
                    .then(res => {
                        let data = res.data;
                        if (typeof data === 'string') {
                            try {
                                data = JSON.parse(data);
                            } catch {
                                setBookResults([]);
                                return;
                            }
                        }
                        if (Array.isArray(data)) {
                            setBookResults(data);
                        } else {
                            setBookResults([]);
                        }
                    })
                    .catch(() => setBookResults([]));
            }
        }
    }, [searchQuery]);

    const renderAccounts = () =>
        accountResults.map((acc, idx) => (
            <div key={idx} className="account-item">
                <div className="account-image default-avatar" />
                <span>{acc.nickname || acc.userId}</span>
            </div>
        ));

    const renderBooks = () =>
        bookResults.map((book, idx) => (
            <div key={idx} className="book-item">
                <img
                    src={book.bookImg && book.bookImg !== "null" ? book.bookImg : bookinformation}
                    alt={book.title}
                    className="book-image"
                />
                <div className="book-title">{book.title}</div>
                <div className="book-author">{book.author}</div>
            </div>
        ));

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
