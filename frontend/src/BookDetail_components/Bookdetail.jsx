import React, { useState, forwardRef } from 'react';
import '../BookDetail_style/bookdetail.css';
import DatePicker from 'react-datepicker';
import date from 'react-datepicker/dist/react-datepicker.css';
import img from '../etc_assets/bookinformation.png';
import { IoIosArrowBack, IoIosAdd } from 'react-icons/io';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { format, differenceInDays } from 'date-fns';
import { MdDateRange } from "react-icons/md";
import { RiStickyNoteAddLine } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md"; // 삭제 아이콘
import Header_main from '../header_components/Header_main';

const Bookdetail = () => {
    const [rating, setRating] = useState(5);
    const [genre, setGenre] = useState('인문');
    const [readingStatus, setReadingStatus] = useState('완독');
    const [startDate, setStartDate] = useState(new Date('2024-03-02'));
    const [endDate, setEndDate] = useState(null);
    const [quotes, setQuotes] = useState([
        "따뜻한 어머니의 사랑은 마음의 양식이다.",
        "사람은 누군가 자신이 귀하다고 여겨줄 때..."
    ]);
    const [showQuoteForm, setShowQuoteForm] = useState(false);
    const [newQuote, setNewQuote] = useState('');

    // 태그 관련 상태 추가
    const [tags, setTags] = useState(['감성적', '가족이야기']);
    const [showTagForm, setShowTagForm] = useState(false);
    const [newTag, setNewTag] = useState('');

    const renderStars = () => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className="star"
                    onClick={() => setRating(i)}
                >
                    {i <= rating ? <AiFillStar className="filled-star" /> : <AiOutlineStar />}
                </span>
            );
        }
        return stars;
    };

    const handleTodayClick = () => {
        setEndDate(new Date());
    };

    // 인용구 관련 함수
    const toggleQuoteForm = () => {
        setShowQuoteForm(!showQuoteForm);
        if (showQuoteForm) {
            setNewQuote('');
        }
    };

    const handleAddQuote = () => {
        if (newQuote.trim()) {
            setQuotes([...quotes, newQuote]);
            setNewQuote('');
            setShowQuoteForm(false);
        }
    };

    const handleDeleteQuote = (index) => {
        const updated = quotes.filter((_, i) => i !== index);
        setQuotes(updated);
    };

    // 태그 관련 함수
    const toggleTagForm = () => {
        setShowTagForm(!showTagForm);
        if (showTagForm) {
            setNewTag('');
        }
    };

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
            setShowTagForm(false);
        }
    };

    const handleDeleteTag = (index) => {
        const updated = tags.filter((_, i) => i !== index);
        setTags(updated);
    };

    const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
        <button className="custom-date-input" onClick={onClick} ref={ref}>
            <MdDateRange className="calendar-icon" />
            <span>{value}</span>
        </button>
    ));

    return (
        <div>
            <header>
                <Header_main />
            </header>
            <div className="book-detail-container">


                <div className="content">
                    <div className="section-title">
                        <h2>독서 기록</h2>
                        <button className="edit-button">등록</button>
                    </div>

                    {/* 책 정보 */}
                    <div className="book-info">
                        <div className="book-cover">
                            <img src={img} alt="도서 표지" className="cover-image" />
                        </div>

                        <div className="book-details">
                            <div className="book-title-author">
                                <h3>어머님의 말 | 이어령</h3>
                            </div>

                            <div className="book-category">
                                <div className="category-row underline">
                                    <span className="category-label">장르</span>
                                    <span className="category-value">
                                        <select
                                            className="select-input"
                                            value={genre}
                                            onChange={(e) => setGenre(e.target.value)}
                                        >
                                            <option value="소설">소설</option>
                                            <option value="인문">인문</option>
                                            <option value="자기계발">자기계발</option>
                                            <option value="시/에세이">시/에세이</option>
                                            <option value="역사">역사</option>
                                            <option value="과학">과학</option>
                                        </select>
                                    </span>
                                </div>

                                <div className="category-row underline">
                                    <span className="category-label">독서상태</span>
                                    <span className="category-value">
                                        <select
                                            className="select-input"
                                            value={readingStatus}
                                            onChange={(e) => setReadingStatus(e.target.value)}
                                        >
                                            <option value="읽기전">읽기전</option>
                                            <option value="읽는중">읽는중</option>
                                            <option value="완독">독서완료</option>
                                        </select>
                                    </span>
                                </div>

                                <div className="category-row underline">
                                    <span className="category-label">나의 평점</span>
                                    <span className="category-value star-rating">
                                        {renderStars()}
                                    </span>
                                </div>

                                {/* 태그 섹션 - 수정된 부분 */}
                                <div className="category-row tags underline">
                                    <span className="category-label">태그</span>
                                    <div className="tag-container">
                                        {tags.map((tag, index) => (
                                            <div key={index} className="tag-item">
                                                <span className="tag">{tag}</span>
                                                <span
                                                    className="tag-delete"
                                                    onClick={() => handleDeleteTag(index)}
                                                >
                                                    ×
                                                </span>
                                            </div>
                                        ))}
                                        <button className="add-tag" onClick={toggleTagForm}>
                                            <IoIosAdd />
                                        </button>
                                    </div>
                                </div>

                                {/* 태그 입력 폼 */}
                                {showTagForm && (
                                    <div className="tag-form">
                                        <input
                                            type="text"
                                            className="tag-input"
                                            placeholder="새 태그 입력..."
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') handleAddTag();
                                            }}
                                        />
                                        <div className="tag-form-buttons">
                                            <button
                                                className="tag-form-button save"
                                                onClick={handleAddTag}
                                                disabled={!newTag.trim()}
                                            >
                                                추가
                                            </button>
                                            <button
                                                className="tag-form-button cancel"
                                                onClick={toggleTagForm}
                                            >
                                                취소
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="category-row date-inline">
                                    <span className="category-label">독서 기간</span>
                                    <div className="date-display-line">
                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            dateFormat="yyyy-MM-dd"
                                            customInput={<CustomDateInput />}
                                        />
                                        <span className="date-separator">부터</span>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setEndDate(date)}
                                            dateFormat="yyyy-MM-dd"
                                            customInput={<CustomDateInput />}
                                            minDate={startDate}
                                        />
                                        <span className="date-separator">까지</span>
                                        {startDate && endDate && (
                                            <span className="read-summary">
                                                {differenceInDays(endDate, startDate)}일간 독서
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 감명 깊었던 부분 */}
                    <div className="quotes-section">
                        <div className="quotes-header">
                            <h3>감명 깊었던 부분 기억하기</h3>
                        </div>
                        <div className="quotes-content">
                            {quotes.map((quote, index) => (
                                <div key={index} className="quote-bubble">
                                    <span>{quote}</span>
                                    <MdDeleteOutline
                                        className="delete-icon"
                                        onClick={() => handleDeleteQuote(index)}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* 인용구 입력 폼 */}
                        {showQuoteForm && (
                            <div className="quote-form">
                                <textarea
                                    className="quote-input"
                                    placeholder="감명 깊었던 문장을 입력하세요..."
                                    value={newQuote}
                                    onChange={(e) => setNewQuote(e.target.value)}
                                />
                                <div className="quote-form-buttons">
                                    <button
                                        className="quote-form-button save"
                                        onClick={handleAddQuote}
                                        disabled={!newQuote.trim()}
                                    >
                                        저장
                                    </button>
                                    <button
                                        className="quote-form-button cancel"
                                        onClick={toggleQuoteForm}
                                    >
                                        취소
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 추가 버튼 */}
                        <button className="add-quote-button" onClick={toggleQuoteForm}>
                            <span>{showQuoteForm ? '취소' : '추가하기'}</span>
                            <RiStickyNoteAddLine className="add-icon" />
                        </button>
                    </div>

                    {/* 감상평 */}
                    <div className="thoughts-section">
                        <h3>감상평을 남겨보세요!</h3>
                        <textarea
                            className="thoughts-input"
                            placeholder="이 책에 대한 나의 생각을 적어보세요..."
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bookdetail