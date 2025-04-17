import React, { useState, useEffect } from 'react';
import '../main_style/ReviewItem.css';
import defaultUserImage from '../etc_assets/sum.png';
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
        bookAuthor
    } = review;

    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const navigate = useNavigate();

    // 책 리뷰 이동
    const handleReviewClick = () => {
        navigate(`/feed/${review.logIdx}`, {
            state: {
                bookTitle: bookTitle || title,
                bookAuthor: bookAuthor || author,
                bookImgUrl: bookImgUrl
            }
        });

    };
    // 책 정보 이동
    const handleBookClick = () => {
        navigate(`/information/${isbn}`, {
            state: {
                bookIdx,
                title: bookTitle || title,
                author: bookAuthor || author,
                imageUrl: bookImgUrl,
                genre: review.genre,
                description: review.description
            }
        });


    };
    useEffect(() => {
        // 초기 좋아요 수 로딩
        axios.get(`http://localhost:8082/controller/${review.logIdx}/likes`)
            .then(res => setLikes(res.data))
            .catch(err => console.error(err));
    }, [review.logIdx]);


    const handleLike = async () => {
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
                await axios.delete("http://localhost:8082/controller/dislike", { data: likeData });
                setLikes(prev => prev - 1);
            } else {
                await axios.post("http://localhost:8082/controller/like", likeData);
                setLikes(prev => prev + 1);
            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error("좋아요 처리 중 오류 발생:", error);
        }
    };

    return (
        <div className="review-wrapper">
            {/* 사용자 정보 */}
            <div className="review-header">
                <div className="user-info">
                    <div className="user-avatar" style={{ width: '50px', height: '50px' }}>
                        <img src={profileImgUrl || defaultUserImage} alt={userId} />
                    </div>
                    <div className="username">{userId}</div>
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

            {/* 리뷰 내용 */}
            <div className="review-content" onClick={handleReviewClick} style={{ cursor: "pointer" }}>
                <p>{content} <span className="more-link">더보기</span></p>
            </div>

            {/* 책 정보 카드 */}
            <div
                className="book-info-card"
                onClick={handleBookClick}
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    backgroundColor: '#eeeeee',
                    padding: '16px',
                    borderRadius: '20px',
                    marginTop: '16px',
                    gap: '16px',
                    flexWrap: 'nowrap',
                    cursor: 'pointer'
                }}
            >
                {/* 책 이미지 */}
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

                {/* 책 정보 */}
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
                        {review.description || "책 소개가 없습니다."}
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
                    <button className="comment-button">
                        <LuMessageSquareMore />
                        <span className="comment-count">0</span>
                    </button>
                </div>
                <div className="publish-date">{new Date(createdAt).toLocaleDateString()}</div>
            </div>
        </div>
    );
};

export default ReviewItem;
