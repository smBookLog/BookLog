import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import '../BookDetail_style/bookdetail.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import defaultImg from '../etc_assets/bookinformation.png';
import { IoIosAdd } from 'react-icons/io';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { differenceInDays } from 'date-fns';
import { RiStickyNoteAddLine } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import Header_main from '../header_components/Header_main';

const Bookdetail = () => {
    const [rating, setRating] = useState(5);
    const [genre, setGenre] = useState('전체');
    const [readingStatus, setReadingStatus] = useState('FINISHED'); // 오타 수정: FINSI -> FINISHED
    const [startDate, setStartDate] = useState(new Date('2024-03-02'));
    const [endDate, setEndDate] = useState(null);
    const [quotes, setQuotes] = useState([]);
    const [showQuoteForm, setShowQuoteForm] = useState(false);
    const [newQuote, setNewQuote] = useState('');
    const [thoughts, setThoughts] = useState('');
    const [tags, setTags] = useState([]);
    const [showTagForm, setShowTagForm] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [bookIdx, setBookIdx] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const logIdx = params.get('logIdx');

    const [bookTitle, setBookTitle] = useState('');
    const [bookAuthor, setBookAuthor] = useState('');
    const [bookImage, setBookImage] = useState(defaultImg);

    useEffect(() => {
        if (logIdx) {
            // 백엔드 API 경로에 맞게 수정
            fetch(`http://localhost:8082/controller/feed/${logIdx}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error('서버 응답 오류: ' + res.status);
                    }
                    return res.json();
                })
                .then(data => {
                    console.log("서버에서 받은 데이터:", data);
                    if (data && data.length > 0) {
                        const d = data[0];
                        setReadingStatus(d.status || 'FINISHED');
                        setStartDate(d.startDate ? new Date(d.startDate) : new Date());
                        setEndDate(d.endDate ? new Date(d.endDate) : null);
                        setRating(d.rating || 5);
                        setThoughts(d.content || '');
                        setQuotes(d.quotes || []);
                        setTags(d.tags || []);  // 태그 데이터도 설정
                        setBookTitle(d.title || '제목 없음');
                        setBookAuthor(d.author || '저자 미상');
                        setBookImage(d.bookImgUrl || defaultImg);
                        setBookIdx(d.bookIdx);
                        setGenre(d.genre || '인문');
                    }
                })
                .catch(err => {
                    console.error("불러오기 실패:", err);
                    alert("데이터를 불러오는데 실패했습니다.");
                });
        }
    }, [logIdx]);

    useEffect(() => {
        if (!logIdx && location.state) {
            console.log("검색에서 넘어온 데이터:", location.state);
            const { title, author, imageUrl, bookIdx: bookId } = location.state || {};
            
            // location.state가 undefined일 수 있으므로 안전하게 처리
            setBookTitle(title || '제목 없음');
            setBookAuthor(author || '저자 미상');
            setBookImage(imageUrl || defaultImg);
            setBookIdx(bookId);
        }
    }, [logIdx, location.state]);

    // bookIdx가 없는 경우 바로 /Search로 이동
    useEffect(() => {
        if (!logIdx && !bookIdx && location.state === undefined) {
            console.log("책 정보 없음, 검색 페이지로 이동");
            navigate('/Search');
        }
    }, [logIdx, bookIdx, location.state, navigate]);

    const renderStars = () => (
        Array.from({ length: 5 }, (_, i) => (
            <span key={i + 1} className="star" onClick={() => setRating(i + 1)}>
                {i + 1 <= rating ? <AiFillStar className="filled-star" /> : <AiOutlineStar />}
            </span>
        ))
    );

    const toggleQuoteForm = () => {
        setShowQuoteForm(!showQuoteForm);
        if (showQuoteForm) setNewQuote(''); 
    };

    const handleAddQuote = () => {
        if (newQuote.trim()) {
            setQuotes([...quotes, newQuote]);
            setNewQuote('');
            setShowQuoteForm(false);
        }
    };

    const handleDeleteQuote = (index) => {
        setQuotes(quotes.filter((_, i) => i !== index));
    };

    const toggleTagForm = () => {
        setShowTagForm(!showTagForm);
        if (showTagForm) setNewTag('');
    };

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
            setShowTagForm(false);
        }
    };

    const handleDeleteTag = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        // 필수 값 확인
        if (!bookIdx) {
            alert("책 정보가 유효하지 않습니다.");
            return;
        }

        const logData = {
            logIdx: logIdx ? parseInt(logIdx) : undefined,
            userId: "user01",
            bookIdx: parseInt(bookIdx),
            status: readingStatus || "FINISHED",
            startDate: startDate?.toISOString().split("T")[0],
            endDate: endDate?.toISOString().split("T")[0] || null,
            rating,
            content: thoughts,
            tags,
            quotes,
        };

        console.log("전송할 데이터:", logData);

        const url = logIdx
            ? `http://localhost:8082/controller/log/update`
            : `http://localhost:8082/controller/log/add`;
        const method = logIdx ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(logData),
            });

            if (!response.ok) {
                throw new Error('서버 응답 오류: ' + response.status);
            }

            const result = await response.text();
            console.log("서버 응답:", result);
            alert(logIdx ? "수정 완료!" : "등록 완료!");
            // 성공 후 이동 경로 설정 (선택사항)
            // navigate('/MyBooks'); 
        } catch (error) {
            console.error("저장 중 오류:", error);
            alert(logIdx ? "수정 실패!" : "등록 실패!");
        }
    };

    // bookIdx와 logIdx 둘 다 없고 location.state도 없는 경우에만 null 반환
    if (!bookIdx && !logIdx && !location.state) return null;

    return (
        <div>
            <Header_main />
            <div className="book-detail-container">
                <div className="content">
                    <div className="section-title">
                        <h2>독서 기록</h2>
                        <button className="edit-button" onClick={handleSubmit}>
                            {logIdx ? '수정' : '등록'}
                        </button>
                    </div>

                    <div className="book-info">
                        <div className="book-cover">
                            <img src={bookImage} alt="도서 표지" className="cover-image" />
                        </div>
                        <div className="book-details">
                            <h3>{bookTitle || '제목 없음'} | {bookAuthor || '저자 미상'}</h3>

                            <div className="category-row underline">
                                <span className="category-label">장르</span>
                                <select value={genre} onChange={e => setGenre(e.target.value)}>
                                    <option value="소설">소설</option>
                                    <option value="인문">인문</option>
                                    <option value="자기계발">자기계발</option>
                                    <option value="시/에세이">시/에세이</option>
                                    <option value="역사">역사</option>
                                    <option value="과학">과학</option>
                                </select>
                            </div>

                            <div className="category-row underline">
                                <span className="category-label">독서상태</span>
                                <select value={readingStatus} onChange={e => setReadingStatus(e.target.value)}>
                                    <option value="NOT_STARTED">독서예정</option>
                                    <option value="READING">독서중</option>
                                    <option value="FINISHED">독서완료</option>
                                </select>
                            </div>

                            <div className="category-row underline">
                                <span className="category-label">나의 평점</span>
                                <span className="category-value star-rating">
                                    {renderStars()}
                                </span>
                            </div>

                            <div className="category-row underline">
                                <span className="category-label">독서 기간</span>
                                <div className="date-display-line">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText="시작 날짜"
                                        className="date-input"
                                    />
                                    <span>부터</span>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText="종료 날짜"
                                        className="date-input"
                                        minDate={startDate}
                                    />
                                    <span>까지</span>
                                    {startDate && endDate && (
                                        <span className="read-summary">
                                            {differenceInDays(endDate, startDate)}일간 독서
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="category-row tags underline">
                                <span className="category-label">태그</span>
                                <div className="tag-container">
                                    {tags.map((tag, index) => (
                                        <div key={index} className="tag-item">
                                            <span className="tag">{tag}</span>
                                            <span className="tag-delete" onClick={() => handleDeleteTag(index)}>×</span>
                                        </div>
                                    ))}
                                    <button className="add-tag" onClick={toggleTagForm}>
                                        <IoIosAdd />
                                    </button>
                                </div>
                            </div>

                            {showTagForm && (
                                <div className="tag-form">
                                    <input
                                        type="text"
                                        className="tag-input"
                                        placeholder="새 태그 입력..."
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                    />
                                    <button className="add-quote-button" onClick={handleAddTag}>
                                        추가하기 <RiStickyNoteAddLine />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="quotes-section">
                        <h3>감명 깊었던 부분 기억하기</h3>
                        <div className="quotes-content">
                            {quotes.map((quote, index) => (
                                <div key={index} className="quote-bubble">
                                    <span>{quote}</span>
                                    <MdDeleteOutline className="delete-icon" onClick={() => handleDeleteQuote(index)} />
                                </div>
                            ))}
                        </div>

                        {showQuoteForm && (
                            <div className="quote-form">
                                <textarea
                                    className="quote-input"
                                    placeholder="감명 깊었던 문장을 입력하세요..."
                                    value={newQuote}
                                    onChange={(e) => setNewQuote(e.target.value)}
                                />
                                <button className="quote-form-button save" onClick={handleAddQuote}>저장</button>
                                <button className="quote-form-button cancel" onClick={toggleQuoteForm}>취소</button>
                            </div>
                        )}

                        <button className="add-quote-button" onClick={toggleQuoteForm}>
                            <span>{showQuoteForm ? '취소' : '추가하기'}</span>
                            <RiStickyNoteAddLine className="add-icon" />
                        </button>
                    </div>

                    <div className="thoughts-section">
                        <h3>감상평을 남겨보세요!</h3>
                        <textarea
                            className="thoughts-input"
                            placeholder="이 책에 대한 나의 생각을 적어보세요..."
                            value={thoughts}
                            onChange={(e) => setThoughts(e.target.value)}
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bookdetail;