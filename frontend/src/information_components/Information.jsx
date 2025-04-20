import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../header_components/Header";
import Header_search from "../header_components/Header_search";
import "../information_style/information.css";
import bookinformation from "../etc_assets/bookinformation.png";

const Information = () => {
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("독서 목록에 추가");
  const dropdownRef = useRef(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isbn } = useParams();
  const location = useLocation();
  const initialBook = location.state || {};

  const from = location.state?.from;

  // 사용자 정보 가져오기
  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    } else {
      const userId = localStorage.getItem("userId");
      if (userId) {
        setUser({ userId });
      } else {
        navigate('/login', { state: { returnPath: location.pathname } });
      }
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    console.log("initialBook 확인:", initialBook);
  }, [initialBook]);

  const [book, setBook] = useState(() =>
    initialBook.bookIdx
      ? {
        bookIdx: initialBook.bookIdx || null,
        title: initialBook.title || initialBook.bookTitle || "제목 없음",
        author: initialBook.author || initialBook.bookAuthor || "저자 정보 없음",
        bookImg: initialBook.bookImg || initialBook.bookImgUrl || bookinformation,
        genre: initialBook.genre || "장르 정보 없음",
        description: initialBook.description || "책 소개가 없습니다.",
      }
      : undefined
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 서버에서 책 정보 받아왔는지 확인
  useEffect(() => {
    if (!initialBook.bookIdx && isbn) {
      setLoading(true);
      axios.get(`http://localhost:8082/controller/search/book?isbn=${isbn}`)
        .then(res => {
          const data = res.data;
          console.log("서버에서 받아온 책 정보:", data);

          setBook({
            bookIdx: data.bookIdx,
            title: data.book_title || data.title || "제목 없음",
            author: data.book_author || data.author || "저자 정보 없음",
            bookImg: data.bookImg || bookinformation,
            genre: data.genre || "장르 정보 없음",
            description: data.description || "책 소개가 없습니다."
          });
        })
        .catch((error) => {
          console.error("서버에서 책 정보 가져오기 실패", error);
          setBook(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isbn, initialBook.bookIdx]);

  // 이미 독서 기록에 추가되어 있는지 확인
  useEffect(() => {
    if (user?.userId && book?.bookIdx) {
      axios.get(`http://localhost:8082/controller/log/check`, {
        params: { userId: user.userId, bookIdx: book.bookIdx }
      })
        .then(res => {
          if (res.data === true) {
            setAdded(true);
            setSelectedStatus("이미 추가된 책");
          }
        })
        .catch(error => {
          console.error("독서 기록 확인 실패:", error);
        });
    }
  }, [user, book]);

  const getImageUrl = (url) => {
    if (!url || url === "null" || url.includes("no_image")) return bookinformation;
    return url.startsWith("http://") ? url.replace("http://", "https://") : url;
  };

  const toggleDropdown = () => {
    if (!added) {
      setStatusOpen((prev) => !prev);
    }
  };

  const statusMap = {
    "독서 완료": "FINISHED",
    "독서중": "READING",
    "독서 예정": "NOT_STARTED"
  };

  const handleStatusSelect = async (status) => {
    if (loading || !user?.userId) return;

    setLoading(true);
    setSelectedStatus(status);
    setStatusOpen(false);

    if (!book?.bookIdx) {
      alert("책 정보를 아직 불러오는 중입니다.");
      setLoading(false);
      return;
    }

    try {
      // 서버 상태 코드로 변환
      const serverStatus = statusMap[status];

      const payload = {
        userId: user.userId,
        bookIdx: book.bookIdx,
        status: serverStatus,
        startDate: new Date().toISOString().split("T")[0],
        endDate: serverStatus === "FINISHED" ? new Date().toISOString().split("T")[0] : null,
        rating: 0,
        content: "",
        tags: [],
        quotes: [],
      };

      await axios.post(`http://localhost:8082/controller/log/add`, payload);

      alert(`'${book.title}'이(가) ${status} 목록에 추가되었습니다.`);
      setAdded(true);

      // 저장 후 마이페이지로 이동 (독서 상태와 함께)
      navigate("/mypage", { state: { readingStatus: serverStatus } });
    } catch (err) {
      console.error("저장 실패", err);
      if (err.response && err.response.status === 400) {
        alert("이미 독서 기록에 추가된 책입니다.");
        setAdded(true);
      } else {
        alert("독서 기록 저장 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !book) {
    return (
      <div>
        {from === 'search' ? <Header_search /> : <Header />}
        <div className="information-container">
          <div className="loading-indicator">
            <p>책 정보를 불러오는 중입니다...</p>
          </div>
        </div>
      </div>
    );
  }

  if (book === null) {
    return (
      <div>
        {from === 'search' ? <Header_search /> : <Header />}
        <div className="information-container">
          <p>해당 ISBN의 책 정보를 찾을 수 없습니다.</p>
          <button
            className="back-button"
            onClick={() => navigate(-1)}
            style={{
              padding: "8px 16px",
              marginTop: "20px",
              backgroundColor: "#3f51b5",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  if (book === undefined) {
    return (
      <div>
        {from === 'search' ? <Header_search /> : <Header />}
        <div className="information-container">
          <p>책 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {from === 'search' ? <Header_search /> : <Header />}
      <div className="information-container" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <br />
        <br />
        <div className="book-info" style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          height: "500px",
          gap: isMobile ? "2px" : "12px"
        }}>
          <img
            className="book-cover"
            src={getImageUrl(book?.bookImg)}
            onError={(e) => (e.target.src = bookinformation)}
            alt={book?.title || "책 표지"}
            style={{
              width: isMobile ? "250px" : "280px",
              height: isMobile ? "320px" : "400px",
              objectFit: "cover",
              borderRadius: "10px",
              border: "1px solid #ddd",
              margin: "0px 20px 0px 25px",
            }}
          />
          <br />
          <div className="book-meta" style={{
            display: "flex",
            flexDirection: "column",
            alignItems: isMobile ? "center" : "flex-start",
            gap: isMobile ? "5px" : "20px",
            fontSize: isMobile ? "14px" : "16px"
          }}>
            <p>
              <strong>제목: </strong>{book?.title || "제목 정보 없음"}
            </p>
            <p>
              <strong>저자: </strong> {book?.author || "저자 정보 없음"}
            </p>
            <p>
              <strong>장르: </strong> {book.genre || "장르 정보 없음"}
            </p>
            <div className="dropdown-wrapper" ref={dropdownRef}>
              <button
                className="add-button"
                onClick={toggleDropdown}
                disabled={added || loading}
                style={{
                  padding: "10px 20px",
                  backgroundColor: added ? "#ccc" : "#lihtgreen",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: added ? "default" : "pointer",
                  fontWeight: "bold",
                  transition: "background-color 0.3s"
                }}
              >
                {added ? "이미 추가된 책" : loading ? "처리 중..." : selectedStatus}
              </button>
              {statusOpen && !added && (
                <ul className="dropdown-menu" style={{
                  position: "absolute",
                  backgroundColor: "white",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  listStyle: "none",
                  padding: "0",
                  margin: "5px 0 0 0",
                  borderRadius: "4px",
                  width: "100%",
                  zIndex: 10
                }}>
                  {Object.keys(statusMap).map((status) => (
                    <li
                      key={status}
                      onClick={() => handleStatusSelect(status)}
                      style={{
                        padding: "10px 15px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f0f0f0",
                        transition: "background-color 0.3s"
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#7ac64d"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                    >
                      {status}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="book-description" style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
          <h2>책 소개</h2>
          <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{book.description || "책 소개가 없습니다."}</p>
        </div>
      </div>
    </div>
  );
};

export default Information;