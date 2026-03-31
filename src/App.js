import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import SceneEdit from './pages/SceneEdit';
import ViewPreview from './pages/ViewPreview';
import ReportEdit from './pages/ReportEdit';
import Subscription from './pages/Subscription';
import './App.css';

function App() {
  // 全局状态管理，贯穿全流程
  const [globalState, setGlobalState] = useState({
    sceneName: '火花点火平台Q2业绩分析',
    smartReportEnabled: false,
    rules: {},
    views: {
      global: '全局观点：Q2整体销售额同比增长15%，主要得益于华东区域市场拓展，核心产品销量同比提升22%，整体达成率112%。',
      chapters: [
        { id: 1, name: '智能观点1', content: '章节观点：华东区域贡献了40%的整体销售额，环比增长20%，其中上海、江苏两个城市的贡献占比超60%，是核心增长区域。' },
        { id: 2, name: '智能观点2', content: '章节观点：核心产品A的销量同比下降5%，主要受竞品低价策略影响，需重点关注华南区域的市场份额变化，及时调整销售策略。' }
      ]
    }
  });

  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <div className="app-container">
          <Routes>
            {/* 首页默认跳转到场景编辑页 */}
            <Route path="/" element={<Navigate to="/scene-edit" replace />} />
            {/* 场景编辑页（流程入口） */}
            <Route 
              path="/scene-edit" 
              element={<SceneEdit globalState={globalState} setGlobalState={setGlobalState} />} 
            />
            {/* 观点预览页 */}
            <Route 
              path="/view-preview" 
              element={<ViewPreview globalState={globalState} setGlobalState={setGlobalState} />} 
            />
            {/* 报告编辑导出页 */}
            <Route 
              path="/report-edit" 
              element={<ReportEdit globalState={globalState} setGlobalState={setGlobalState} />} 
            />
            {/* 订阅管理页 */}
            <Route 
              path="/subscription" 
              element={<Subscription globalState={globalState} setGlobalState={setGlobalState} />} 
            />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;