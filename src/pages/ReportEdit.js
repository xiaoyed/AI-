import React, { useState } from 'react';
import { Layout, Button, Card, Form, Radio, Checkbox, Select, message, Spin } from 'antd';
import { SaveOutlined, EyeOutlined, ExportOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Option } = Select;

// 报告编辑与导出页
const ReportEdit = ({ globalState }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // 模拟导出报告
  const handleExport = () => {
    form.validateFields().then(values => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        message.success('报告导出成功！已自动下载到本地');
      }, 1500);
    });
  };

  return (
    <Layout>
      {/* 顶部操作栏 */}
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button icon={<LeftOutlined />} onClick={() => navigate('/view-preview')}>返回观点预览</Button>
          <span style={{ fontSize: 16, fontWeight: 500 }}>报告编辑与导出</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button icon={<SaveOutlined />}>保存报告</Button>
          <Button icon={<EyeOutlined />}>预览PDF</Button>
          <Button type="primary" icon={<ExportOutlined />} onClick={handleExport} loading={loading}>开始导出</Button>
        </div>
      </Header>

      {/* 主内容区 */}
      <Content className="main-content">
        <div className="double-column">
          {/* 左侧大纲导航 */}
          <div className="left-panel">
            <Card title="报告大纲导航" size="small" style={{ marginBottom: 16 }}>
              <p>📄 封面</p>
              <p>📑 目录</p>
              <p style={{ fontWeight: 500, color: '#165DFF' }}>📊 全局观点</p>
              <p>  • 智能观点1</p>
              <p>  • 智能观点2</p>
              <p>📈 数据附录</p>
              <p>📃 封底</p>
            </Card>
            <Card title="订阅快捷设置" size="small">
              <p>导出完成后，可设置定时订阅，自动生成报告并推送给相关人员</p>
              <Button type="link" onClick={() => navigate('/subscription')} style={{ padding: 0 }}>去设置订阅规则</Button>
            </Card>
          </div>

          {/* 右侧编辑+配置区 */}
          <div className="right-panel">
            {/* 报告编辑画布 */}
            <Card title="报告编辑画布区（所见即所得）" size="small" style={{ marginBottom: 24 }}>
              <div style={{ textAlign: 'center', marginBottom: 30 }}>
                <h2>{globalState.sceneName} 智能分析报告</h2>
                <p style={{ color: '#86909c' }}>生成时间：{new Date().toLocaleString()}</p>
              </div>
              
              <div style={{ marginBottom: 24 }}>
                <h3>一、全局数据洞察</h3>
                <p style={{ fontSize: 14, lineHeight: 1.8 }}>{globalState.views.global}</p>
              </div>

              <div>
                <h3>二、细分维度分析</h3>
                {globalState.views.chapters.map(ch => (
                  <div key={ch.id} style={{ marginBottom: 16 }}>
                    <h4>2.{ch.id} {ch.name}</h4>
                    <p style={{ fontSize: 14, lineHeight: 1.8 }}>{ch.content}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* 导出配置 */}
            <Card title="导出配置" size="small">
              <Form form={form} layout="vertical">
                <Form.Item label="导出格式" name="format" initialValue="pdf">
                  <Radio.Group>
                    <Radio value="pdf">PDF</Radio>
                    <Radio value="word">Word</Radio>
                    <Radio value="excel">Excel</Radio>
                    <Radio value="ppt">PPT</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="导出内容" name="content" initialValue={['cover', 'global', 'chapter']}>
                  <Checkbox.Group>
                    <Checkbox value="cover">封面&目录</Checkbox>
                    <Checkbox value="global">全局观点</Checkbox>
                    <Checkbox value="chapter">章节观点</Checkbox>
                    <Checkbox value="table">原始数据表格</Checkbox>
                    <Checkbox value="chart">可视化图表</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
                <Form.Item label="页面大小" name="pageSize" initialValue="a4">
                  <Select>
                    <Option value="a4">A4</Option>
                    <Option value="a3">A3</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="页码设置" name="pageNumber" initialValue="bottom">
                  <Select>
                    <Option value="bottom">页面底部居中</Option>
                    <Option value="top">页面顶部居右</Option>
                    <Option value="none">不显示页码</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ReportEdit;