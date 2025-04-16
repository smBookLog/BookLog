import React, { useState } from 'react';
import tabbar from '../my_style/TabBar.css';

const TabBar = ({ onStatusChange }) => {
  const [activeTab, setActiveTab] = useState('독서중');

  const tabs = ['독서중', '독서완료', '독서예정'];

  const statusMap = {
    '독서중': 'READING',
    '독서완료': 'FINISHED',
    '독서예정': 'NOT_STARTED'
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onStatusChange(statusMap[tab]); // 부모에게 상태 전달
  };

  return (
    <div className="tab-container">
      <h2 className="tab-title">독서 목록</h2>
      <div className="tabs-wrapper">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabBar;
