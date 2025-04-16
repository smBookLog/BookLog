import React, { useState } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Header_main from './header_components/Header_main'; // 로고 - 메인 - 나의 서재 - 검색 - 내정보
import Header from './header_components/Header'; // 헤더 < - 로고

import Search from './header_components/Search'; // 검색창

import Information from './information_components/Information'; // 책 정보
import EditProfile from './myprofile_components/EdiProfile'; // 회원정보수정
import UserProfile from './my_components/UserProfile'; // 마이페이지
import ReadingStats from './my_components/ReadingStats';
import BookSection from './my_components/BookSection';
import FeedRLDetail from './main_components/FeedRLDetail'; // 필드 독서 기록 디테일
import Login from './Login_components/Login'; // 로그인
import FindId from './Login_components/Findid'; // 아이디 찾기
import FindPw from './Login_components/Findpw'; // 비밀번호 찾기
import Resetpw from './Login_components/Resetpw'; // 새비밀번호 설정
import Signup from './Login_components/Signup'; // 회원가입
import FollowersPage from './FollowersChat_components/FollowersPage'; // 팔로우/팔로잉
import ChatPage from './FollowersChat_components/ChatPage'; // 채팅
import Bookdetail from './BookDetail_components/Bookdetail'; // 독서 기록
import TabBar from './my_components/TabBar'; // 독서 목록
import BookList from './my_components/BookList';
import ReviewList from './main_components/ReviewList';


function App() {
  // 샘플 도서 데이터
  const books = [
    { id: 1, title: '제목', author: '저자' },
    { id: 2, title: '제목', author: '저자' },
    { id: 3, title: '제목', author: '저자' },
    { id: 4, title: '제목', author: '저자' },
    { id: 5, title: '제목', author: '저자' }
  ];
  const [ck, setCk] = useState('');

  // Spring 서버에 GET 요청
  axios.get(
    'http://localhost:8082/controller/api/hello',
    // get방식으로 데이터를 보낼때는 params 라는 키값으로 묶어서 보낼것
    // params를 보내면 이 주소로 보내짐 
    // ㄴ>'http://localhost:8082/controller/login?id=id&pw=pw'
    {
      params: {
        ck: ck
      }
    }
  )
    .then((res) => {
      console.log(res)
      setCk(res.data)
    })

  return (
    <div>
      {/* <p onClick={(e) => { setCk(e.target.innerText) }}>이걸 클릭</p> */}
      {/* <h1>{ck}</h1> */}
      <br />
      <Routes>
        {/* 헤더 */}
        <Route path='/Header_main' element={<Header_main></Header_main>}></Route>
        <Route path='/headermain' element={<Header_main></Header_main>}></Route>
        {/* 검색창 */}
        <Route path='/search' element={<Search></Search>}></Route>

        {/* 로그인 */}
        <Route path='/' element={<Login />}></Route>
        {/* 아이디 찾기 */}
        <Route path='/find-id' element={<FindId />}></Route>
        {/* 비밀번호 찾기 */}
        <Route path='/find-pw' element={<FindPw />}></Route>
        <Route path='/reset-password' element={<Resetpw />}></Route>
        <Route path='/signup' element={<Signup />}></Route>

        {/* 메인 */}
        <Route path='/main' element={
          <div className="app">
            <Header_main />
            <main className="main-content">
              <ReviewList />
            </main>
          </div>
        }></Route>

        {/* 필드리딩디테일 */}

        <Route path='/FeedRLDetail' element={
          <div className="app-container">
            <FeedRLDetail />
          </div>
        } />

        {/* 책 정보 */}
        <Route path='/information' element={<Information></Information>}></Route>
        {/* 독서 목록 */}
        <Route
          path='/booklist'
          element={
            <div className="app">
              <Header />
              <main className="main-content">
                <TabBar />
                <BookList books={books} />
              </main>
            </div>
          }
        />
        {/* 독서 기록 */}
        <Route path="/bookdetail" element={
          <div className="App">
            <Bookdetail />
          </div>
        } />

        {/* 마이페이지 */}
        <Route path='/mypage' element={
          <div className="app-container">
            <Header_main />
            <main className="main-content">
              <UserProfile />
              <ReadingStats />
              <BookSection />
            </main>
          </div>
        } />
        {/* 팔로우/팔로잉 */}
        <Route path='/followers' element={<FollowersPage />}></Route>
        {/* DM/채팅 */}
        <Route path='/chatpage' element={<ChatPage />}></Route>
        {/* 회원정보 수정 */}
        <Route path='/myprofile' element={<EditProfile></EditProfile>}></Route>

      </Routes>
    </div >
  );
}

export default App;
