import React, { useState } from 'react';
import tabbar from '../my_style/TabBar.css';

const TabBar = () => {
    const [activeTab, setActiveTab] = useState('읽은책');
  
    // 실제 선택 가능한 탭들
    const tabs = ['읽은책', '독서중', '독서 예정'];
    
    return (
      <div className="tab-container">
        <div className="tab-title">독서 목록</div>
        <div className="tabs-wrapper">
          {tabs.map(tab => (
            <button 
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    );
  }

export default TabBar