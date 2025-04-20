import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../header_components/Header';
import defaultUserImage from '../etc_assets/profile_1.png';
import defaultBookCover from '../etc_assets/bookinformation.png';
import { HiArrowNarrowUp } from "react-icons/hi";
import '../main_style/FeedRLDetail.css';
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { LuMessageSquareMore } from "react-icons/lu";
import { useLocation } from 'react-router-dom';

const FeedRLDetail = () => {
  const { logIdx } = useParams();
  const [log, setLog] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [userId, setUserId] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [bookInfo, setBookInfo] = useState(null);
  const [isProcessingLike, setIsProcessingLike] = useState(false); // 좋아요 처리 중인지 상태 추가
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  // 로그 및 사용자 정보 로드
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setUserId(user.userId);

    loadFeedData();
  }, [logIdx]);

  // 피드 데이터 로드 함수
  const loadFeedData = () => {
    axios.get(`http://localhost:8082/controller/feed/${logIdx}`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          const logData = res.data[0];
          setLog(logData);
          setLikes(logData.likeCount || 0);

          if (logData.isbn) {
            axios.get(`http://localhost:8082/controller/search/book?isbn=${logData.isbn}`)
              .then(res => setBookInfo(res.data));
          }

          // 사용자가 로그인한 경우에만 좋아요 상태 확인
          const user = JSON.parse(localStorage.getItem("user"));
          if (user) {
            checkUserLiked(logData.logIdx, user.userId);
          }
        }
      })
      .catch(err => console.error("상세 리뷰 불러오기 실패", err));
  };

  // 사용자 좋아요 상태 확인
  const checkUserLiked = (logId, userId) => {
    // 직접 hasLiked 체크 API 호출 (isLiked API가 없을 경우 대체)
    axios.get(`http://localhost:8082/controller/hasLiked?logIdx=${logId}&userId=${userId}`)
      .then(res => {
        // 응답이 0이면 좋아요 안함, 1 이상이면 좋아요 함
        const hasLiked = res.data > 0;
        console.log("좋아요 상태 확인 결과:", hasLiked);
        setIsLiked(hasLiked);
      })
      .catch(err => {
        console.error("좋아요 상태 확인 실패, 대체 방법 시도:", err);

        // 대체 방법: 좋아요 수 API를 통해 좋아요 상태 확인
        axios.get(`http://localhost:8082/controller/${logId}/likes`)
          .then(res => {
            setLikes(res.data);
            console.log("좋아요 수:", res.data);
          });
      });
  };

  // 좋아요 처리 함수
  const handleLike = async () => {
    // 이미 처리 중이면 중복 클릭 방지
    if (isProcessingLike) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("로그인 후 이용해주세요");
      return;
    }

    setIsProcessingLike(true); // 처리 시작

    const likeData = {
      logIdx: parseInt(logIdx),
      userId: user.userId
    };

    try {
      console.log("좋아요 요청 데이터:", likeData);

      if (isLiked) {
        // 좋아요 취소
        console.log("좋아요 취소 요청 시작");
        await axios.delete("http://localhost:8082/controller/dislike", {
          data: likeData,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log("좋아요 취소 성공");
        setIsLiked(false);
        setLikes(prev => Math.max(0, prev - 1));
      } else {
        // 좋아요 추가
        console.log("좋아요 추가 요청 시작");
        await axios.post("http://localhost:8082/controller/like", likeData);
        console.log("좋아요 추가 성공");
        setIsLiked(true);
        setLikes(prev => prev + 1);
      }

      // 좋아요 수 갱신
      refreshLikeCount();

    } catch (error) {
      console.error("좋아요 처리 중 오류 발생:", error);
      if (error.response) {
        console.log("서버 응답:", error.response.data);
        console.log("상태 코드:", error.response.status);
      }

      // 에러 발생 시 전체 데이터 다시 로드
      loadFeedData();
    } finally {
      // 처리 완료
      setIsProcessingLike(false);
    }
  };

  // 좋아요 수 새로고침
  const refreshLikeCount = () => {
    axios.get(`http://localhost:8082/controller/${logIdx}/likes`)
      .then(res => {
        console.log("새로운 좋아요 수:", res.data);
        setLikes(res.data);
      })
      .catch(err => console.error("좋아요 수 조회 실패", err));
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;

    axios.post(`http://localhost:8082/controller/comment`, {
      logIdx: log.logIdx,
      userId: userId,
      content: commentText
    }).then(() => {
      setCommentText('');
      return axios.get(`http://localhost:8082/controller/feed/${logIdx}`);
    }).then(res => {
      if (res.data && res.data.length > 0) {
        setLog(res.data[0]);
      }
    }).catch(err => console.error("댓글 저장 실패", err));
  };

  const handleDeleteComment = (commentIdx) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      axios.delete(`http://localhost:8082/controller/comment/delete/${commentIdx}`)
        .then(() => {
          return axios.get(`http://localhost:8082/controller/feed/${logIdx}`);
        })
        .then(res => {
          if (res.data?.length > 0) setLog(res.data[0]);
        })
        .catch(err => console.error("댓글 삭제 실패", err));
    }
  };

  if (!log) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div className="booklog-container">
      <header className="booklog-header">
        <Header />
      </header>

      <div className="post-container">
        <div className="post-header">
          <div className="user-info">
            <img src={log.profileImgUrl || defaultUserImage} alt="User Avatar" className="user-avatar" />
            <span className="username">{log.userId}</span>
          </div>
          <div className="rating">
            <span className="rating-number">{log.rating}</span>
            <div className="stars">
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className={i <= log.rating ? "star filled" : "star empty"}>★</span>
              ))}
            </div>
          </div>
        </div>

        <div className="post-content">
          <div className="impression-section">
            <h3 className="section-title">💬 인상 깊은 문장</h3>
            {Array.isArray(log.quotes) && log.quotes.map((q, i) => (
              <p className="quote" key={i}>
                "{q}"
              </p>
            ))}
          </div>

          <div className="review-section">
            <h4 className="section-title">✏️ 독서 감상</h4>
            <p className="review-text">{log.content}</p>
          </div>

          <div
            className="book-info-card"
            onClick={() => navigate(`/information/${log.isbn}`, {
              state: {
                from: 'feed',
                bookIdx: log.bookIdx,
                title: log.title,
                author: log.author,
                bookImg: log.bookImgUrl,
                genre: log.genre,
                description: log.description
              }
            })}

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
            <div>
              <img
                src={log.bookImgUrl || defaultBookCover}
                alt="Book Cover"
                style={{
                  width: '90px',
                  height: 'auto',
                  objectFit: 'cover',
                  borderRadius: '8px',
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
                제목: {bookInfo?.title || bookInfo?.book_title || state?.bookTitle || log.bookTitle || "제목 정보 없음"}
              </div>
              <div style={{ fontSize: '0.95rem', color: '#555' }}>
                저자: {bookInfo?.author || bookInfo?.book_author || state?.bookAuthor || log.bookAuthor || "저자 정보 없음"}</div>

              <div style={{ fontSize: '0.9rem', color: '#999', marginTop: '8px' }}>
                {bookInfo?.description || log.description || "책 소개가 없습니다."}
              </div>
            </div>
          </div>

          <div className="review-footer">
            <div className="interactions">
              <button
                className="like-button"
                onClick={handleLike}
                disabled={isProcessingLike}
              >
                {isLiked ? <span className="like-filled"><FaHeart /></span> : <FiHeart />}
                <span className="like-count">{likes}</span>
              </button>
              <button className="comment-button" disabled>
                <LuMessageSquareMore />
                <span className="comment-count">{Array.isArray(log.comments) ? log.comments.length : 0}</span>
              </button>
            </div>
            <div className="publish-date">{new Date(log.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <div className="comments-section">
        <h3 className="comments-title">댓글</h3>
        {Array.isArray(log.comments) && log.comments.map((comment, i) => (
          <div className="comment" key={i}>
            <div className="comment-header">
              <div className="commenter-info">
                <img
                  src={comment.profileImgUrl || defaultUserImage}
                  alt="Commenter Avatar"
                  className="commenter-avatar"
                />
                <span className="commenter-name">{comment.userId}</span>
              </div>
              <div className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</div>
            </div>

            <p className="comment-text">{comment.content}</p>

            <div className="comment-footer">
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <button className="like-button" disabled>
                  <FiHeart /><span style={{ marginLeft: '5px' }}>0</span>
                </button>
                <button className="comment-button" disabled>
                  <LuMessageSquareMore /> <span style={{ marginLeft: '5px' }}>0</span>
                </button>
              </div>
              {comment.userId === userId && (
                <div className="comment-actions" style={{ marginLeft: '5px' }}>
                  <button onClick={() => handleDeleteComment(comment.commentIdx)}>삭제</button>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="comment-input-container">
          <img src={userId.profileImgUrl || defaultUserImage} alt="User Avatar" className="comment-input-avatar" />
          <input
            type="text"
            className="comment-input"
            placeholder="댓글을 입력하세요."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button className="comment-submit-button" onClick={handleCommentSubmit}>
            <HiArrowNarrowUp size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedRLDetail;