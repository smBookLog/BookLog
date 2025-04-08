import React, { useState } from 'react';
import axios from 'axios';

function App() {
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
      <p onClick={(e) => { setCk(e.target.innerText) }}>이걸 클릭</p>
      <h1>{ck}</h1>
    </div>
  );
}

export default App;
