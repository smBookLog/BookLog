import React, { useEffect, useState } from 'react';
import reading from '../my_style/ReadingStats.css'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const ReadingStats = () => {
  const userId = 'user01'; // 실제 연동되면 교체
  // 읽은분야
  const [genreData, setGenreData] = useState([]); // 장르 리스트
  const [totalGenreCount, setTotalGenreCount] = useState(0);
  // 컬러 배열 (장르 개수에 맞게 추가 가능)
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c'];

  // 월별통계
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const [bookCounts, setBookCounts] = useState(new Array(12).fill(0)); // 월별로 0으로 초기화

  // 읽은분야
  useEffect(() => {
    fetch(`http://localhost:8082/controller/log/stat/genre/${userId}`)
      .then(res => res.json())
      .then(data => {
        setGenreData(data);
        const total = data.reduce((sum, item) => sum + item.genre_count, 0);
        setTotalGenreCount(total);
      })
      .catch(err => console.error('장르 통계 fetch 실패:', err));
  }, []);

  // 월별통계
  useEffect(() => {
    fetch(`http://localhost:8082/controller/log/stat/monthly/${userId}`)
      .then(res => res.json())
      .then(data => {
        const counts = new Array(12).fill(0);
        data.forEach(item => {
          if (item.month && item.monthly_count) {
            const monthNum = parseInt(item.month.split('-')[1], 10); // "2024-04" → 4
            const monthIndex = monthNum - 1; // 0부터 시작
            counts[monthIndex] = item.monthly_count;
          }
        });
        setBookCounts(counts);
      })
      .catch(err => console.error('월별 통계 fetch 실패:', err));
  }, []);

  return (
    <div className="stats-container">

      <div className="stats-card">
        <h3 className="stats-title">읽은 분야</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={genreData}
              dataKey="genre_count"
              nameKey="genre"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {genreData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="stats-card">
        <h3 className="stats-title">월별 통계</h3>
        <div className="bar-chart-container">
          {months.map((month, index) => (
            <div key={month} className="bar-item">
              <div
                className="bar"
                style={{ height: `${bookCounts[index] * 8}px` }}
              ></div>
              <div className="bar-label">{month}</div>
              <div className="bar-value">{bookCounts[index]}권</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReadingStats;