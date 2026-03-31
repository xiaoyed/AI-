import React, { useState } from 'react';
import { Layout, Button, Tabs, Card, Input, message, Spin } from 'antd';
import { SaveOutlined, ReloadOutlined, CopyOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { TextArea } = Input;
const { TabPane } = Tabs;

// 智能观点预览页
const ViewPreview = ({ globalState, setGlobalState }) => {
  const [loading, setLoading] = useState(false);
  const [views, setViews] = useState(globalState.views);
  const navigate = useNavigate();

  // 重新生成观点（模拟AI生成）
  const handleRegenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setViews(prev => ({
        ...prev,
        global: '【AI重新生成】全局观点：Q2整体销售额同比增长15%，达成率112%，超预期完成季度目标。核心增长动力来自华东区域的市场拓展和新品类的销量突破，需重点关注产品A的销量下滑问题。',
        chapters: prev.chapters.map(ch => ({
          ...ch,
          content: `【AI重新生成】${ch.content}`
        }))
      }));
      setLoading(false);
      message.success('观点重新生成成功');
    }, 1500);
  };

  // 保存编辑后的观点
  const handleSaveViews = () => {
    setGlobalState(prev => ({ ...prev, views }));
    message.success('观点保存成功');
  };

  // 复制全部观点
  const handleCopyAll = () => {
    const allContent = `全局观点：\n${views.global}\n\n${views.chapters.map(ch => `${ch.name}：\n${ch.content}`).join('\n\n')}`;
    navigator.clipboard.writeText(allContent).then(() => {
      message.success('全部观点已复制到剪贴板');
    });
  };

  return (
    <Layout>
      {/* 顶部操作栏 */}
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button icon={<LeftOutlined />} onClick={() => navigate('/scene-edit')}>返回场景编辑</Button>
          <span style={{ fontSize: 16, fontWeight: 500 }}>智能观点预览</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button icon={<ReloadOutlined />} onClick={handleRegenerate} loading={loading}>重新生成</Button>
          <Button icon={<SaveOutlined />} type="primary" onClick={handleSaveViews}>保存观点</Button>
          <Button icon={<CopyOutlined />} onClick={handleCopyAll}>复制全部观点</Button>
          <Button type="primary" onClick={() => navigate('/report-edit')}>下一步：编辑报告</Button>
        </div>
      </Header>

      {/* 主内容区 */}
      <Content className="main-content">
        <div className="double-column">
          {/* 左侧源数据区 */}
          <div className="left-panel">
            <h3>观点生成源数据</h3>
            <Card title="数据表格/图表列表" size="small" style={{ marginBottom: 16 }}>
              <p>✅ 华东区域销售数据</p>
              <p>✅ 产品销量趋势图</p>
              <p>✅ 竞品分析数据</p>
              <p>✅ 季度目标达成表</p>
            </Card>
            <Card title="生成日志" size="small">
              <p>最近生成时间：{new Date().toLocaleString()}</p>
              <p>生成耗时：1.2s</p>
              <p style={{ color: '#52c41a' }}>状态：全部观点生成成功</p>
            </Card>
          </div>

          {/* 右侧观点预览区 */}
          <div className="right-panel">
            <Spin spinning={loading} tip="AI正在生成观点，请稍候...">
              <Tabs defaultActiveKey="1">
                {/* 全局观点Tab */}
                <TabPane tab="全局观点" key="1">
                  <h4>全局观点（展示位置：场景描述下方）</h4>
                  <TextArea
                    value={views.global}
                    onChange={(e) => setViews(prev => ({ ...prev, global: e.target.value }))}
                    rows={8}
                    placeholder="全局观点内容"
                    style={{ fontSize: 14, lineHeight: 1.6 }}
                  />
                </TabPane>
                {/* 章节观点Tab */}
                <TabPane tab="章节观点" key="2">
                  {views.chapters.map(ch => (
                    <div key={ch.id} style={{ marginBottom: 24 }}>
                      <h4>{ch.name}</h4>
                      <TextArea
                        value={ch.content}
                        onChange={(e) => setViews(prev => ({
                          ...prev,
                          chapters: prev.chapters.map(c => c.id === ch.id ? { ...c, content: e.target.value } : c)
                        }))}
                        rows={6}
                        placeholder="章节观点内容"
                        style={{ fontSize: 14, lineHeight: 1.6 }}
                      />
                    </div>
                  ))}
                </TabPane>
              </Tabs>
            </Spin>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ViewPreview;