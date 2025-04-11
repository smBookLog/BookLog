import React, { useState } from 'react';
import { RiArrowLeftSLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import '../header_style/search.css';
import bookinformation from "../etc_assets/bookinformation.png"

const Search = () => {
    const [tab, setTab] = useState('전체');
    const [searchQuery, setSearchQuery] = useState('');
    const tabs = ['전체', '계정', '책'];

    const allAccounts = [
        { id: 1, name: '이어령', image: null },
        { id: 2, name: '이어령123', image: null },
        { id: 3, name: '이어령이', image: null },
    ];

    const allBooks = [
        {
            id: 1,
            title: '이어령의 말',
            author: '이어령',
            image: bookinformation
        },
    ];

    // 검색어로 필터링
    const filteredAccounts = allAccounts.filter(acc =>
        acc.name.includes(searchQuery)
    );

    const filteredBooks = allBooks.filter(book =>
        book.title.includes(searchQuery) || book.author.includes(searchQuery)
    );

    const renderAccounts = () =>
        filteredAccounts.map((acc) => (
            <div key={acc.id} className="account-item">
                {acc.image ? (
                    <img src={acc.image} alt={acc.name} className="account-image" />
                ) : (
                    <div className="account-image default-avatar" />
                )}
                <span>{acc.name}</span>
            </div>
        ));

    const renderBooks = () =>
        filteredBooks.map((book) => (
            <div key={book.id} className="book-item">
                <img src={book.image} alt={book.title} className="book-image" />
                <div className="book-title">{book.title}</div>
                <div className="book-author">{book.author}</div>
            </div>
        ));

    const noResult = filteredAccounts.length === 0 && filteredBooks.length === 0;

    const renderContent = () => {
        if (noResult) {
            return (
                <div className="no-result">
                    ‘{searchQuery}’에 대한 검색 기록이 없습니다.
                </div>
            );
        }

        switch (tab) {
            case '전체':
                return (
                    <>
                        {filteredAccounts.length > 0 && (
                            <>
                                <h2 className="section-title">계정</h2>
                                {renderAccounts()}
                            </>
                        )}
                        {filteredBooks.length > 0 && (
                            <>
                                <h2 className="section-title">책</h2>
                                {renderBooks()}
                            </>
                        )}
                    </>
                );
            case '계정':
                return filteredAccounts.length ? renderAccounts() : (
                    <div className="no-result">‘{searchQuery}’에 대한 검색 기록이 없습니다.</div>
                );
            case '책':
                return filteredBooks.length ? renderBooks() : (
                    <div className="no-result">‘{searchQuery}’에 대한 검색 기록이 없습니다.</div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="search-container">
            <header className="search-top">
                <Link to="/" >
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
