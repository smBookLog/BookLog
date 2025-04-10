import React from "react";
import Header from "./components_header/Header";
import "./Information.css";
import bookinformation from "./assets_header/bookinformation.png"

const Information = () => {
  return (
    <div className="information-container">
      <Header />
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
          나를 향해 쓴 문이 인상된 움직이기를
          차가운 언어, 생각의 틀을 비추는 문동물, 그리고 역력한 시간이 모인 결정체
          이야기의 말들
        </p>
        <p>
          한 사람의 끝에는 그 사람의 말이 남게 된다. 이이령의 문 속에 고이 담긴 책 한 권이 우리를 찾아왔다.
          2022년 봄 끝을 마치지 못한 채 살다 멈춘 44세 순수문학 작가인 그녀 이이령은 삶을 쓰는 일의 진실과 함께 문을 열었다.
          중반부를 넘기며 독자들은 그녀라는 사람에게 가까워지고 마치 그녀 자신으로 글을 통과할 수 있게 된다.
          그것이 곧 ‘감응’이며, 타인의 기억을 마주하며 겪는 접촉이다.
          이것이 바로 책 제목을 내세운 의미이자 그녀가 진심으로 이야기했던, 말의 끝이라는 이야기로 귀결된다.
          이제 더 이상 말할 수 없는 작가의 목소리를 깊이 읽어야 한다.
          그녀 자신을 말할 기회가 주어지지 못했다.
          이야기는 삶의 언어로, 그녀는 독립된 문단을 독자에게 이어준다.
          이야기의 말들이 독자들에게 살아 있는 언어로 각인되는 이 시간을, 저문에서 작가의 삶을 어떻게 살아야겠는지를 향한 여정을 떠내는 시간이자.
        </p>
      </div>
    </div>
  );
};

export default Information;
