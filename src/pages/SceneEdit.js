import React, { useState } from 'react';
import { Layout, Menu, Button, Switch, Drawer, Form, Checkbox, Radio, Input, Select, message } from 'antd';
import { MenuUnfoldOutlined, SaveOutlined, EyeOutlined, ExportOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

// 场景编辑页（流程入口）
const SceneEdit = ({ globalState, setGlobalState }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // 智能报告开关切换
  const handleSwitchChange = (checked) => {
    setGlobalState(prev => ({ ...prev, smartReportEnabled: checked }));
    if (checked) {
      setDrawerVisible(true);
      message.success('已开启智能报告功能，请配置规则');
    }
  };

  // 保存规则配置
  const handleSaveRules = () => {
    form.validateFields().then(values => {
      setGlobalState(prev => ({ ...prev, rules: values }));
      setDrawerVisible(false);
      message.success('规则配置已保存');
    });
  };

  // 保存场景，走流程分支
  const handleSaveScene = () => {
    message.success('场景保存成功');
    // 开启了智能报告，跳转到观点预览页；没开启则停留在当前页
    if (globalState.smartReportEnabled) {
      navigate('/view-preview');
    }
  };

  return (
    <Layout>
      {/* 左侧导航栏 */}
      <Sider width={240} theme="dark">
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
          智能报告系统
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<SettingOutlined />}>场景管理</Menu.Item>
          <Menu.Item key="2" onClick={() => navigate('/subscription')}>订阅管理</Menu.Item>
        </Menu>
      </Sider>

      {/* 右侧主内容区 */}
      <Layout>
        {/* 顶部操作栏 */}
        <Header>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <MenuUnfoldOutlined style={{ fontSize: 20 }} />
            <span style={{ fontSize: 16, fontWeight: 500 }}>场景编辑：{globalState.sceneName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>智能报告开关</span>
              <Switch checked={globalState.smartReportEnabled} onChange={handleSwitchChange} />
            </div>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveScene}>保存场景</Button>
            <Button icon={<EyeOutlined />} onClick={() => navigate('/view-preview')} disabled={!globalState.smartReportEnabled}>预览观点</Button>
            <Button icon={<ExportOutlined />} onClick={() => navigate('/report-edit')}>导出报告</Button>
          </div>
        </Header>

        {/* 画布内容区 */}
        <Content className="main-content">
          <div style={{ background: '#fff', borderRadius: 8, padding: 24, minHeight: 400 }}>
            <h3>数据图表画布区</h3>
            <p style={{ color: '#86909c' }}>（此处展示业务数据表格/可视化图表，支持拖拽布局）</p>
            <div style={{ marginTop: 20, border: '1px dashed #e8e8e8', padding: 40, textAlign: 'center', borderRadius: 8 }}>
              <p>示例数据：火花点火平台Q2销售数据表格</p>
              <p>示例图表：各区域销量趋势图、产品品类占比饼图</p>
            </div>
            {/* 未开启开关的提示 */}
            {!globalState.smartReportEnabled && (
              <div style={{ marginTop: 40, textAlign: 'center', color: '#86909c' }}>
                <p>开启智能报告开关，可自动生成数据洞察观点与分析报告</p>
              </div>
            )}
          </div>
        </Content>
      </Layout>

      {/* 规则配置抽屉 */}
      <Drawer
        title="智能报告规则配置"
        width={480}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        extra={[
          <Button key="reset">重置</Button>,
          <Button key="save" type="primary" onClick={handleSaveRules}>保存配置</Button>
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="智能观点区域选择" name="viewArea" initialValue={['global', 'chapter']}>
            <Checkbox.Group>
              <Checkbox value="global">全局观点</Checkbox>
              <Checkbox value="chapter">章节观点</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item label="图表匹配规则" name="matchRule" initialValue="default">
            <Radio.Group>
              <Radio value="default">默认图表匹配逻辑</Radio>
              <Radio value="custom">自定义图表匹配逻辑（支持1-3条规则）</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="筛选器 - 实体选择" name="entity">
            <Select mode="multiple" placeholder="请选择数据实体">
              <Option value="sales">销售额</Option>
              <Option value="order">订单量</Option>
              <Option value="product">产品销量</Option>
              <Option value="region">区域数据</Option>
            </Select>
          </Form.Item>

          <Form.Item label="开关精细化控制" name="subSwitches" initialValue={['singleChart']}>
            <Checkbox.Group>
              <Checkbox value="singleChart">启用单图表独立观点开关</Checkbox>
              <Checkbox value="subscription">启用订阅报告参数自定义</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item label="订阅报告可选参数" name="reportParams">
            <Checkbox.Group>
              <Checkbox value="globalView">包含全局观点</Checkbox>
              <Checkbox value="chapterView">包含章节观点</Checkbox>
              <Checkbox value="table">包含原始数据表格</Checkbox>
              <Checkbox value="chart">包含趋势图表</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item label="历史报告设置" name="history">
            <Radio.Group initialValue="3month">
              <Radio value="3month">保留3个月历史报告</Radio>
              <Radio value="6month">保留6个月历史报告</Radio>
              <Radio value="never">不保留历史报告</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Drawer>
    </Layout>
  );
};

export default SceneEdit;