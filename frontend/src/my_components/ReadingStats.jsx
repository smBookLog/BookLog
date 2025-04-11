import React from 'react'
import reading from '../my_style/ReadingStats.css'


const ReadingStats = () => {
    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const bookCounts = [7, 11, 9, 12, 8, 15];
    
    return (
      <div className="stats-container">
        <div className="stats-card">
          <h3 className="stats-title">읽은 분야</h3>
          <div className="pie-chart-container">
            <div className="pie-chart">
              <div className="pie-segment novel"></div>
              <div className="pie-segment self-help"></div>
              <div className="pie-segment humanities"></div>
            </div>
            <div className="pie-legend">
              <div className="legend-item">
                <div className="legend-color novel"></div>
                <span className="legend-text">소설/스릴러</span>
              </div>
              <div className="legend-item">
                <div className="legend-color self-help"></div>
                <span className="legend-text">자기계발</span>
              </div>
              <div className="legend-item">
                <div className="legend-color humanities"></div>
                <span className="legend-text">인문</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="stats-card">
          <h3 className="stats-title">월별 통계</h3>
          <div className="bar-chart-container">
            {months.slice(0, 12).map((month, index) => (
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

export default ReadingStats