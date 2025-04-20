import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../BookDetail_style/bookdetail.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import defaultImg from '../etc_assets/bookinformation.png';

import { IoIosAdd } from 'react-icons/io';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { RiStickyNoteAddLine } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";

import { differenceInDays } from 'date-fns';

import Header_main from '../header_components/Header_main';

const Bookdetail = () => {
    const [rating, setRating] = useState(5);
    const [genre, setGenre] = useState('전체');
    const [readingStatus, setReadingStatus] = useState('FINISHED');
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
    const [userId, setUserId] = useState('');

    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const logIdx = params.get('logIdx');

    const [bookTitle, setBookTitle] = useState('');
    const [bookAuthor, setBookAuthor] = useState('');
    const [bookImage, setBookImage] = useState(defaultImg);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        try {
            const user = JSON.parse(userStr);
            if (!user.userId) {
                throw new Error('사용자 ID 정보가 없습니다.');
            }
            setUserId(user.userId);
        } catch (error) {
            console.error('사용자 정보 파싱 오류:', error);
            alert('사용자 정보를 가져오는데 문제가 발생했습니다. 다시 로그인해주세요.');
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (userId && logIdx) {
            fetch(`http://localhost:8082/controller/feed/${logIdx}`)
                .then(res => {
                    if (!res.ok) throw new Error('서버 응답 오류: ' + res.status);
                    return res.json();
                })
                .then(data => {
                    if (data && data.length > 0) {
                        const d = data[0];

                        // ✅ 추가: 응답 확인용 로그
                        console.log('서버로부터 받아온 태그:', d.tags);

                        if (d.userId && d.userId !== userId) {
                            alert("접근 권한이 없는 독서 기록입니다.");
                            navigate('/');
                            return;
                        }

                        setReadingStatus(d.status || 'FINISHED');
                        setStartDate(d.startDate ? new Date(d.startDate) : new Date());
                        setEndDate(d.endDate ? new Date(d.endDate) : null);
                        setRating(d.rating || 5);
                        setThoughts(d.content || '');
                        setQuotes(d.quotes || []);

                        // ✅ 여기 수정: fallback 처리
                        setTags(Array.isArray(d.tags) ? d.tags : []);

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
    }, [logIdx, userId, navigate]);


    useEffect(() => {
        if (!logIdx && location.state) {
            const {
                title,
                author,
                imageUrl,
                bookIdx: bookId,
                tags: stateTags // ✅ tags도 같이 받는다
            } = location.state || {};

            setBookTitle(title || '제목 없음');
            setBookAuthor(author || '저자 미상');
            setBookImage(imageUrl || defaultImg);
            setBookIdx(bookId);

            // ✅ 여기 추가: location.state로 전달된 tags도 반영
            if (Array.isArray(stateTags)) {
                setTags(stateTags);
            }
        }
    }, [logIdx, location.state]);


    useEffect(() => {
        if (!logIdx && !bookIdx && location.state === undefined) {
            navigate('/Search');
        }
    }, [logIdx, bookIdx, location.state, navigate]);

    const renderStars = () => (
        Array.from({ length: 5 }, (_, i) => (
            <span key={i + 1} className="star-d" onClick={() => setRating(i + 1)}>
                {i + 1 <= rating ? <AiFillStar className="filled-star-d" /> : <AiOutlineStar />}
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
        if (!userId) {
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }

        if (!bookIdx) {
            alert("책 정보가 유효하지 않습니다.");
            return;
        }

        const logData = {
            logIdx: logIdx ? parseInt(logIdx) : undefined,
            userId: userId,
            bookIdx: parseInt(bookIdx),
            status: readingStatus || "FINISHED",
            startDate: startDate?.toISOString().split("T")[0],
            endDate: endDate?.toISOString().split("T")[0] || null,
            rating,
            content: thoughts,
            tags,
            quotes,
        };

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

            alert(logIdx ? "수정 완료!" : "등록 완료!");
            navigate('/booklist');
        } catch (error) {
            console.error("저장 중 오류:", error);
            alert(logIdx ? "수정 실패!" : "등록 실패!");
            navigate('/booklist');
        }
    };

    const handleDelete = async () => {
        if (!userId) {
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }

        if (!logIdx) {
            alert("아직 저장되지 않은 독서 기록은 삭제할 수 없습니다.");
            return;
        }

        if (!window.confirm("정말로 이 독서 기록을 삭제하시겠습니까?")) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8082/controller/log/delete/${logIdx}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error('서버 응답 오류: ' + response.status);
            }

            alert("삭제 완료!");
            navigate('/booklist');
        } catch (error) {
            console.error("삭제 중 오류:", error);
            alert("삭제 실패!");
        }
    };
    const getTagColorClass = (index) => {
        const tagColorCount = 6; // 클래스는 color-0 ~ color-5로 구성
        return `color-${index % tagColorCount}`;
    };
    if (!userId) return null;
    if (!bookIdx && !logIdx && !location.state) return null;

    return (
        <div>
            <Header_main />
            <div className="book-detail-container-d">
                <div className="content-d">
                    <div className="section-title-d">
                        <h2>독서 기록</h2>
                        <div className="button-group-d">
                            <button className="edit-button-d" onClick={handleSubmit}>
                                {logIdx ? '저장' : '등록'}
                            </button>
                            {logIdx && (
                                <button className="delete-button-d" onClick={handleDelete}>
                                    삭제
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="book-info-section-d">
                        <div className="book-info-d">
                            <div className="detail-book-cover-d">
                                <img src={bookImage} alt="도서 표지" className="detail-cover-image-d" />
                            </div>
                            <div className="detail-book-info-d" id='a'>
                                <div className="book-header-d">
                                    <h3>{bookTitle || '제목 없음'} </h3>
                                    <h4>| {bookAuthor || '저자 미상'}</h4>
                                    <div className="category-row-d underline-d">
                                        <span className="category-label-d">장르</span>
                                        <span>{genre}</span>
                                    </div>
                                </div>

                                <div className="reading-details-d">
                                    <div className="category-row-d underline-d">
                                        <span className="category-label-d">독서상태</span>
                                        <select value={readingStatus} onChange={e => setReadingStatus(e.target.value)}>
                                            <option value="NOT_STARTED">독서예정</option>
                                            <option value="READING">독서중</option>
                                            <option value="FINISHED">독서완료</option>
                                        </select>
                                    </div>

                                    <div className="category-row-d underline-d">
                                        <span className="category-label-d">나의 평점</span>
                                        <span className="category-value-d star-rating-d">
                                            {renderStars()}
                                        </span>
                                    </div>

                                    <div className="category-row-d underline-d">
                                        <span className="category-label-d">독서기간</span>
                                        <div className="date-display-line-d">
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(date) => setStartDate(date)}
                                                dateFormat="yyyy-MM-dd"
                                                placeholderText="시작 날짜"
                                                className="date-input-d"
                                            />
                                            <span>부터</span>
                                            <DatePicker
                                                selected={endDate}
                                                onChange={(date) => setEndDate(date)}
                                                dateFormat="yyyy-MM-dd"
                                                placeholderText="종료 날짜"
                                                className="date-input-d"
                                                minDate={startDate}
                                            />
                                            <span>까지</span>
                                            {startDate && endDate && (
                                                <span className="read-summary-d">
                                                    {differenceInDays(endDate, startDate)}일간 독서
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="category-row-d tags-d underline-d">
                                        <span className="category-label-d">태그</span>
                                        <div className="tag-container-d">
                                            {tags.map((tag, index) => (
                                                <div key={index} className="tag-item-d">
                                                    <span className={`tag-d ${getTagColorClass(index)}`}>{tag}</span>
                                                    <span className="tag-delete-d" onClick={() => handleDeleteTag(index)}>×</span>
                                                </div>
                                            ))}
                                            <button className="add-tag-d" onClick={toggleTagForm}>
                                                <IoIosAdd />
                                            </button>
                                        </div>
                                    </div>

                                    {showTagForm && (
                                        <div className="tag-form-d">
                                            <input
                                                type="text"
                                                className="tag-input-d"
                                                placeholder="새 태그 입력..."
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                            />
                                            <button className="add-quote-button-d" onClick={handleAddTag}>
                                                추가하기 <RiStickyNoteAddLine />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="quotes-section-d">
                        <h3>감명 깊었던 부분 기억하기</h3>
                        <div className="quotes-content-d">
                            {quotes.map((quote, index) => (
                                <div key={index} className="quote-bubble-d">
                                    <span>{quote}</span>
                                    <MdDeleteOutline className="delete-icon-d" onClick={() => handleDeleteQuote(index)} />
                                </div>
                            ))}
                        </div>

                        {showQuoteForm && (
                            <div className="quote-form-d">
                                <textarea
                                    className="quote-input-d"
                                    placeholder="감명 깊었던 문장을 입력하세요..."
                                    value={newQuote}
                                    onChange={(e) => setNewQuote(e.target.value)}
                                />
                                <div className="quote-form-buttons-d">
                                    <button className="quote-form-button-d save-d" onClick={handleAddQuote}>저장</button>
                                    <button className="quote-form-button-d cancel-d" onClick={toggleQuoteForm}>취소</button>
                                </div>
                            </div>
                        )}

                        <button className="add-quote-button-d" onClick={toggleQuoteForm}>
                            <span>{showQuoteForm ? '취소' : '추가하기'}</span>
                            <RiStickyNoteAddLine className="add-icon-d" />
                        </button>
                    </div>

                    <div className="thoughts-section-d">
                        <h3>감상평을 남겨보세요!</h3>
                        <textarea
                            className="thoughts-input-d"
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