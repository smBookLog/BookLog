import React, { useState } from 'react';
import '../main_style/Reviewltem.css';
import defaultUserImage from '../etc_assets/sum.png';
import defaultBookCover from '../etc_assets/bookinformation.png';
import { GoPlus } from "react-icons/go";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa"; // Import filled heart
import { LuMessageSquareMore } from "react-icons/lu";
import { Link } from 'react-router-dom';

const Reviewltem = ({
    username,
    userImage = defaultUserImage,
    rating,
    content,
    bookTitle = "책 이름",
    bookCoverImage = defaultBookCover,
    author = "저자",
    publishDate,
    commentCount = 0,
    initialLikes = 0
}) => {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = () => {
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
        setIsLiked(!isLiked);
    };

    const handleReviewClick = () => {
        console.log('Review clicked:', bookTitle);
    };

    const formattedDate = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
        } catch {
            return dateString;
        }
    };

    return (
        <div className="review-wrapper" onClick={handleReviewClick}>
            <div className="review-item-container">
                {/* 상단 헤더: 사용자 정보 및 별점 */}
                <div className="review-header-new">
                    <div className="header-left">
                        <div className="user-avatar-new">
                            <img src={userImage} alt={username} />
                        </div>
                        <div className="username-new">{username}</div>
                    </div>
                    <div className="rating-new">
                        <div className="rating-number">{rating}</div>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={star <= rating ? "star filled" : "star"}>★</span>
                        ))}
                    </div>
                </div>

                {/* 리뷰 본문 */}
                <div className="review-content-new">
                    <p>{content}</p>
                    <Link to='/FeedRLDetail'>
                        <button className="more-button-new">...더보기</button>
                    </Link>
                </div>

                {/* 책 정보 */}
                <Link to='/information' className='custom-link'>
                    <div className="book-info-container-new">
                        <div className="book-cover-new">
                            <img src={bookCoverImage} alt={bookTitle} />
                        </div>
                        <div className="book-details-new">
                            <div className="book-title-new">{bookTitle}</div>
                            <div className="book-author-new">{author} | {formattedDate(publishDate)}</div>
                            <div className="book-description-new">책 소개</div>
                        </div>
                    </div>
                </Link>

                {/* 좋아요 및 댓글 */}
                <div className="review-footer-new">
                    <div className="actions-new">
                        <button
                            className={`like-button-new ${isLiked ? 'liked' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLike();
                            }}
                        >
                            {isLiked ? (
                                <span className="liked-emoji"><FaHeart /></span>
                            ) : (
                                <span><FiHeart /></span>
                            )}
                            <span className="like-count">{likes}</span>
                        </button>

                        <a
                            href={`/review/${encodeURIComponent(bookTitle)}/comments`}
                            className="comment-button-new"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="comment-icon"><LuMessageSquareMore /></span>
                            <span className="comment-count-new">{commentCount}</span>
                        </a>
                    </div>
                    <div className="review-date-new">{formattedDate(publishDate)}</div>
                </div>
            </div>
        </div>
    );
};

export default Reviewltem