import React, { useState, useEffect } from 'react';
import '../main_style/ReviewItem.css';
import defaultUserImage from '../etc_assets/profile_1.png';
import defaultBookCover from '../etc_assets/bookinformation.png';
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { LuMessageSquareMore } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReviewItem = ({ review }) => {
    const {
        userId,
        profileImgUrl,
        rating,
        content,
        title,
        bookImgUrl,
        author,
        createdAt,
        isbn,
        bookIdx,
        bookTitle,
        bookAuthor,
        genre,
        description
    } = review;

    const [tags, setTags] = useState([]);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const navigate = useNavigate();

    // 태그 색상 클래스 계산 함수
    const getTagColorClass = (index) => {
        const tagColorCount = 6;
        return `color-${index % tagColorCount}`;
    };

    // 책 리뷰 상세로 이동
    const handleReviewClick = () => {
        navigate(`/feed/${review.logIdx}`, {
            state: {
                bookTitle: bookTitle || title,
                bookAuthor: bookAuthor || author,
                bookImgUrl: bookImgUrl,
                bookGenre: genre || "장르 정보 없음"
            }
        });
    };

    // 책 정보 페이지로 이동
    const handleBookClick = (e) => {
        e.stopPropagation(); // 이벤트 버블링 방지
        navigate(`/information/${isbn}`, {
            state: {
                bookIdx,
                title: bookTitle || title,
                author: bookAuthor || author,
                bookImg: bookImgUrl,
                genre: genre,
                description: description
            }
        });
    };

    // 유저 프로필 페이지로 이동 - 새로 추가된 함수
    const handleUserClick = (e) => {
        e.stopPropagation(); // 이벤트 버블링 방지
        navigate(`/user/${userId}`);
    };

    useEffect(() => {
        // 초기 좋아요 수 로딩
        axios.get(`http://localhost:8082/controller/${review.logIdx}/likes`)
            .then(res => setLikes(res.data))
            .catch(err => console.error(err));

        // 댓글 수 로딩 - 피드 데이터에서 댓글 정보 가져오기
        axios.get(`http://localhost:8082/controller/feed/${review.logIdx}`)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    const logData = res.data[0];
                    // 댓글 배열이 있으면 그 길이를 사용, 없으면 0으로 설정
                    setCommentCount(Array.isArray(logData.comments) ? logData.comments.length : 0);
                }
            })
            .catch(err => console.error("댓글 수 로딩 중 오류:", err));

        // 좋아요 상태 확인
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            axios.get(`http://localhost:8082/controller/isLiked?logIdx=${review.logIdx}&userId=${user.userId}`)
                .then(res => setIsLiked(res.data === true))
                .catch(err => console.error("좋아요 상태 확인 실패", err));
        }
    }, [review.logIdx]);

    const handleLike = async (e) => {
        e.stopPropagation(); // Prevent event bubbling
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("로그인 후 이용해주세요");
            return;
        }

        const likeData = {
            logIdx: review.logIdx,
            userId: user.userId
        };

        try {
            if (isLiked) {
                await axios.request({
                    method: 'DELETE',
                    url: 'http://localhost:8082/controller/dislike',
                    data: likeData,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                setLikes(prev => prev - 1);
            } else {
                await axios.post("http://localhost:8082/controller/like", likeData);
                setLikes(prev => prev + 1);
            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error("좋아요 처리 중 오류 발생:", error);
            console.log("에러 상세:", error.response ? error.response.data : "응답 데이터 없음");
        }
    };


    // 태그 불러오기
    useEffect(() => {
        axios.get(`http://localhost:8082/controller/feed/${review.logIdx}`)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setTags(res.data[0].tags || []);
                }
            })
            .catch(err => console.error("태그 불러오기 실패", err));
    }, [review.logIdx]);

    return (
        <div className="review-wrapper">
            {/* 사용자 정보 - 클릭 이벤트 추가 */}
            <div className="review-header">
                <div className="user-info" onClick={handleUserClick} style={{ cursor: 'pointer' }}>
                    <div className="user-avatar" style={{ width: '50px', height: '50px' }}>
                        <img src={profileImgUrl || defaultUserImage} alt={userId} />
                    </div>
                    <div className="username" style={{ marginLeft: '0px' }}>{userId}</div>
                </div>

                <div className="rating-display">
                    <div className="rating-number">{rating}</div>
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={star <= rating ? "star filled" : "star empty"}>
                                {star <= rating ? "★" : "☆"}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* 리뷰 본문 */}
            <div className="review-content" onClick={handleReviewClick} style={{ cursor: "pointer" }}>
                <p>{content}</p>
            </div>

            {/* 책 정보 카드 */}
            <div
                className="book-info-card"
                onClick={handleBookClick}
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    backgroundColor: '#f5f5f5',
                    padding: '16px',
                    borderRadius: '20px',
                    marginTop: '16px',
                    gap: '16px',
                    flexWrap: 'nowrap',
                    cursor: 'pointer'
                }}
            >
                <div>
                    <img
                        src={bookImgUrl || defaultBookCover}
                        alt={title}
                        style={{
                            width: '90px',
                            height: 'auto',
                            objectFit: 'cover',
                            flexShrink: 0
                        }}
                    />
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        flex: 1
                    }}
                >
                    <div style={{ fontWeight: 'bold', fontSize: '1.05rem', marginBottom: '4px' }}>
                        {title}
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#555' }}>
                        {author}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#999', marginTop: '8px' }}>
                        {description && description.length > 100
                            ? `${description.substring(0, 100)}...`
                            : description || "책 소개가 없습니다."}
                    </div>
                </div>
            </div>

            {/* 좋아요, 댓글, 날짜 */}
            <div className="review-footer">
                <div className="interactions">
                    <button className="like-button" onClick={handleLike}>
                        {isLiked ? <span className="like-filled"><FaHeart /></span> : <FiHeart />}
                        <span className="like-count">{likes}</span>
                    </button>
                    <button className="comment-button" onClick={handleReviewClick}>
                        <LuMessageSquareMore />
                        <span className="comment-count">{commentCount}</span>
                    </button>
                </div>
                <div className="publish-date">{new Date(createdAt).toLocaleDateString()}</div>
            </div>
        </div>

    );
};

export default ReviewItem;