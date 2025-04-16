import React, { useEffect, useState } from 'react';
import reading from '../my_style/ReadingStats.css';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReadingStats = () => {
  // 로그인한 사용자 ID 가져오기
  const [userId, setUserId] = useState('');
  // 읽은분야
  const [genreData, setGenreData] = useState([]); // 장르 리스트
  const [totalGenreCount, setTotalGenreCount] = useState(0);
  // 컬러 배열 (장르 개수에 맞게 추가 가능)
  // 🔹 자동 색상 생성 함수
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 360 / count) % 360;
      colors.push(`hsl(${hue}, 70%, 70%)`);
    }
    return colors;
  };

   // 🔹 커스텀 라벨 ('권' 제거, 선 없음)
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x+2}
        y={y-2}
        fill="white"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
      >
         {`${(percent * 100).toFixed(0)}%`} {/* 퍼센트 표시 */}
      </text>
    );
  };

  // 월별통계
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const [bookCounts, setBookCounts] = useState(new Array(12).fill(0)); // 월별로 0으로 초기화

  // 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setUserId(user.userId);
    } else {
      console.error('로그인 정보를 찾을 수 없습니다.');
      // 로그인 정보가 없을 경우의 처리 (예: 로그인 페이지로 리다이렉트)
      // window.location.href = '/login';
    }
  }, []);

  // 읽은분야 (userId가 설정된 후에만 API 호출)
  useEffect(() => {
    if (!userId) return; // userId가 없으면 API 호출하지 않음
    
    fetch(`http://localhost:8082/controller/log/stat/genre/${userId}`)
      .then(res => res.json())
      .then(data => {
        setGenreData(data);
        const total = data.reduce((sum, item) => sum + item.genre_count, 0);
        setTotalGenreCount(total);
      })
      .catch(err => console.error('장르 통계 fetch 실패:', err));
  }, [userId]); // userId가 변경될 때마다 다시 호출

  // 월별통계 (userId가 설정된 후에만 API 호출)
  useEffect(() => {
    if (!userId) return; // userId가 없으면 API 호출하지 않음
    
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
  }, [userId]); // userId가 변경될 때마다 다시 호출

  // 데이터가 없거나 로딩 중일 때 표시할 내용
  if (!userId) {
    return <div className="stats-container">로그인 정보를 불러오는 중...</div>;
  }

  // 🔹 장르 개수에 따라 동적으로 색상 생성
  const COLORS = generateColors(genreData.length);

  return (
    <div className="stats-container">
      <div className="stats-card">
        <h3 className="stats-title">읽은 분야</h3>
        {genreData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genreData}
                dataKey="genre_count"
                nameKey="genre"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={renderCustomizedLabel} // ✅ 라벨 커스텀
                labelLine={false}            // ✅ 선 제거
              >
                {genreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="no-data">데이터가 없습니다.</div>
        )}
      </div>

      <div className="stats-card">
        <h3 className="stats-title">월별 통계</h3>
        {bookCounts.some(count => count > 0) ? (
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
        ) : (
          <div className="no-data">데이터가 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default ReadingStats;