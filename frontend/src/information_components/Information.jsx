import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../header_components/Header";
import "../information_style/information.css";
import bookinformation from "../etc_assets/bookinformation.png";
import { useNavigate } from "react-router-dom";

const Information = () => {
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const location = useLocation();
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("독서추가하기");
  const dropdownRef = useRef(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (location.state) {
      const { bookIdx, title, author, imageUrl } = location.state;
      setBook({ bookIdx, title, author, genre: null, bookImg: imageUrl, description: null });
    }
  }, [location.state]);

  useEffect(() => {
    axios.get(`http://localhost:8082/controller/search/book?isbn=${isbn}`)
      .then(res => {
        let data = res.data;
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch {
            setBook(null);
            return;
          }
        }
        setBook(prev => ({
          ...prev,
          ...data,
          bookIdx: data?.bookIdx || prev?.bookIdx
        }));
      })
      .catch(() => setBook(null));
  }, [isbn]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getImageUrl = (url) => {
    if (!url || url === "null" || url.includes("no_image")) return bookinformation;
    return url.startsWith("http://") ? url.replace("http://", "https://") : url;
  };

  const toggleDropdown = () => {
    setStatusOpen((prev) => !prev);
  };

  const reverseStatusMap = {
    READING: '독서중',
    FINISHED: '독서완료',
    NOT_STARTED: '독서예정'
  };

  const handleStatusSelect = async (status) => {
    setSelectedStatus(reverseStatusMap[status]);
    setStatusOpen(false);

    if (!book?.bookIdx) {
      alert("책 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    console.log("독서 기록 추가 요청:", {
      userId,
      bookIdx: book.bookIdx,
      status
    });

    try {
      const res = await axios.get(`http://localhost:8082/controller/log/check`, {
        params: { userId, bookIdx: book.bookIdx }
      });

      if (res.data === true) {
        alert("이미 독서 기록에 추가된 책입니다.");
        return;
      }

      const payload = {
        userId,
        bookIdx: book.bookIdx,
        status,
        startDate: new Date().toISOString().split('T')[0],
        endDate: null,
        rating: null,
        content: null,
        tags: [],
        quotes: []
      };

      console.log("POST 요청 전송 데이터:", payload);

      const postResult = await axios.post(`http://localhost:8082/controller/log/add`, payload);

      console.log("저장 성공 응답:", postResult.data);

      alert("독서 기록이 저장되었습니다.");
      setAdded(true);
      navigate('/mypage', { state: { readingStatus: status } });

    } catch (err) {
      console.error("저장 실패", err);
      alert("독서 기록 저장 중 오류가 발생했습니다.");
    }
  };

  if (!book) {
    return (
      <div>
        <Header />
        <div className="information-container">
          <p>책 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="information-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <br /><br />
        <div className="book-info" style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', height: '500px', gap: isMobile ? '5px' : '12px' }}>
          <img
            className="book-cover"
            src={getImageUrl(book.bookImg)}
            style={{ width: isMobile ? '250px' : '280px', height: isMobile ? '320px' : '400px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #ddd', margin: '0px 20px 0px 25px' }}
            alt={book.title}
          />
          <br />
          <div className="book-meta" style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start', gap: '1px', fontSize: isMobile ? '14px' : '16px' }}>
            <p><strong>제목: </strong> {book.title}</p>
            <p><strong>저자: </strong> {book.author}</p>
            <p><strong>장르: </strong> {book.genre || "정보 없음"}</p>
            <br />
            <div className="dropdown-wrapper" ref={dropdownRef}>
              <button className="add-button" onClick={toggleDropdown} disabled={added}>
                {added ? '추가 완료' : selectedStatus}
              </button>
              {statusOpen && !added && (
                <ul className="dropdown-menu">
                  <li onClick={() => handleStatusSelect("READING")}>독서 중</li>
                  <li onClick={() => handleStatusSelect("FINISHED")}>독서 완료</li>
                  <li onClick={() => handleStatusSelect("NOT_STARTED")}>독서 예정</li>
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="book-description">
          <h2>책 소개</h2>
          <p style={{ whiteSpace: 'pre-line' }}>{book.description || "책 소개가 없습니다."}</p>
        </div>
      </div>
    </div>
  );
};

export default Information;