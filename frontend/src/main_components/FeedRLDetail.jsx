import React from 'react'
import booking from '../main_style/FeedRLDetail.css'
import userAvatar from '../etc_assets/profile_1.png'
import commentAvatar from '../etc_assets/profile_1.png'
import bookCover from '../etc_assets/profile_1.png'
import { HiArrowNarrowUp } from "react-icons/hi";
import Header from '../header_components/Header'

const FeedRLDetail = () => {
    return (
        <div className="booklog-container">
            <header className="booklog-header">
                <Header />
            </header>

            <div className="post-container">
                <div className="post-header">
                    <div className="user-info">
                        <img src={userAvatar} alt="User Avatar" className="user-avatar" />
                        <span className="username">wtqrkrhttvek</span>
                    </div>
                    <div className="rating">
                        <span className="rating-number">4</span>
                        <div className="stars">
                            <span className="star filled">★</span>
                            <span className="star filled">★</span>
                            <span className="star filled">★</span>
                            <span className="star filled">★</span>
                            <span className="star empty">★</span>
                        </div>
                    </div>
                </div>

                <div className="post-content">
                    <div className="impression-section">
                        <h3 className="section-title" style={{fontSize:"15px"}}>💬 인상 깊은 문장</h3>
                        <p className="quote">"죽음은 어둠이 아니라 또 하나의 빛이다."</p>
                        <p className="quote">"지식은 늙지만 지혜는 늙지 않는다."</p>
                    </div>

                    <div className="review-section">
                        <h4 className="section-title">
                            <span className="highlight-icon">✏️ 독서 감상 </span>
                        </h4>
                        <p className="review-text">
                            이 책은 단순히 한 지식인의 말년을 기록한 책이 아니라,  ‘어떻게 살 것인가'에 대한 깊은 성찰을 담고 있다. 나는 특히 이어령 선생님의 태도에 깊은 감명을 받았다. 그는 생의 마지막 순간까지 '생각하는 인간'으로 살았고, 자신의 말로 세상을 밝히려 했다.
                        </p>
                        <p className="review-text">
                            읽으면서 나는 여러 번 멈춰 서서 생각하게 됐다. 삶의 끝이 언제일지 모르는 우리에게 가장 필요한 건, 지식을 넘어선 지혜이며, 그 지혜는 '들음'과 '침묵' 속에서 피어난다는 걸 배웠다.
                        </p>
                        <p className="review-text">
                            또한 이어령 선생님은 평생을 언어와 글, 지식으로 살아온 사람이었지만, 결국 침묵과 신앙, 기도 속에서 평화를 얻었다. 말의 무게를 아는 사람이기에 마지막까지 그 말에 책임을 지고자 했던 점이 뭉클했다.
                        </p>
                    </div>

                    <div className="book-info">
                        <img src={bookCover} alt="Book Cover" className="book-cover" />
                        <div className="book-details">
                            <h4 className="book-title" style={{fontSize:"15px"}}>책 이름</h4>
                            <p className="book-author">저자 | 2025.03.17</p>
                            <p className="book-description">책 소개</p>
                        </div>
                    </div>

                    <div className="post-footer">
                        <div className="likes-comments">
                            <button className="like-button">
                                <i className="like-icon"></i>
                                <span>3</span>
                            </button>
                            <button className="comment-button">
                                <i className="comment-icon"></i>
                                <span>1</span>
                            </button>
                        </div>
                        <div className="post-date">2025.03.17</div>
                    </div>
                </div>
            </div>

            <div className="comments-section">
                <h3 className="comments-title">댓글</h3>

                <div className="comment">
                    <div className="comment-header">
                        <div className="commenter-info">
                            <img src={commentAvatar} alt="Commenter Avatar" className="commenter-avatar" />
                            <span className="commenter-name">김나은</span>
                        </div>
                        <div className="comment-date">2025.03.20</div>
                    </div>
                    <p className="comment-text">
                        누군가에게 위로가 되는 말, 삶을 돌아보게 만드는 말, 혹은 침묵 속에서 전해지는 평안. 이어령 선생님의 말은 철학적이면서도 인간적이었고, 그래서 더 따뜻하게 다가왔던 것 같습니다.
                    </p>
                    <div className="comment-footer">
                        <button className="comment-like-button">
                            <i className="like-icon"></i>
                            <span>1</span>
                        </button>
                        <button className="comment-reply-button">
                            <i className="reply-icon"></i>
                            <span>0</span>
                        </button>
                    </div>
                </div>

                <div className="comment-input-container">
                    <img src={userAvatar} alt="User Avatar" className="comment-input-avatar" />
                    <input type="text" className="comment-input" placeholder="댓글을 입력하세요." />
                    <button className="comment-submit-button">
                        <HiArrowNarrowUp size={20} />
                    </button>

                </div>
            </div>
        </div>
    );
}


export default FeedRLDetail