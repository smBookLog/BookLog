import React from "react";
import Header from "../header_components/Header";
import "../information_style/information.css";
import bookinformation from "../etc_assets/bookinformation.png"

const Information = () => {
  return (
    <div><Header />
    <div className="information-container">
      <br/><br/>
      <div className="book-info">
        <img
          className="book-cover"
          src={bookinformation}
          style={{width: '150px', height: '200px'}}
        />
        <div className="book-meta">
          <p><strong>제목</strong> 이어령의 말</p>
          <p><strong>저자</strong> 이어령</p>
          <p><strong>장르</strong> 인문</p>
          <button className="add-button">책 추가하기</button>
        </div>
      </div>
      <br/>
      <div className="book-description">
        <h2>책 소개</h2>
        <p>
        나를 향해 쓴 글이 당신을 움직이기를 차가운 언어, 생각의 틈을 비집는 문장들, 그리고 억겁의 시간이 모인 결정체 이야기의 말들
        </p>
        <p>
        한 사람의 글에는 그 사람의 생이 담겨 있다. 이어령의 온 생이 고이 담긴 책 한 권이 우리를 찾아왔다. 2022년 2월 눈감을 때까지 평생 쉼 없이 읽고 쓰며 수많은 저작을 남긴 이어령은 생전 글 쓰는 일이 자신을 향해 있다고 말했다. 하지만 나를 향해 쓴 글이 다른 사람에게 가닿아 그에게 느껴지고 그를 움직일 수 있게 한다면 그것이 곧 ‘감동’이며, 더없이 기쁜 일일 것이라 덧붙였다. 이것이 지면과 화면을 빌려 세상에 나온 글이 지닌 선순환적 역할이며, 먼저 돌아간 이가 지금을 살아가는 이들에게 남길 수 있는 가장 값진 유산일 것이다. 이제 그의 지성을 빌려 쓸 기회가 우리에게 주어졌다. 이어령을 아끼는 자는 물론 이어령을 몰랐던 독자까지 이어령의 말을 듣고, 그의 생각을 느끼며 안갯속 같은 이 세상을, 자신에게 주어진 삶을 어떻게 살아갈 것인지 탐구하는 여정을 떠나볼 시간이다.
        </p>
      </div>
    </div></div>
  );
};

export default Information;
