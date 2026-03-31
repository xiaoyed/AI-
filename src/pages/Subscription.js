import React, { useState } from 'react';
import { Layout, Menu, Button, Table, Modal, Form, Select, Checkbox, Input, message, Space } from 'antd';
import { MenuUnfoldOutlined, PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

// 订阅管理页
const Subscription = ({ globalState }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // 订阅列表数据
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      name: '火花点火平台Q2业绩报告订阅',
      scene: globalState.sceneName,
      trigger: '每日固定时间 09:00',
      status: '启用',
      createTime: '2024-06-01'
    }
  ]);

  // 表格列配置
  const columns = [
    { title: '订阅名称', dataIndex: 'name', key: 'name', width: 220 },
    { title: '绑定场景', dataIndex: 'scene', key: 'scene', width: 200 },
    { title: '触发规则', dataIndex: 'trigger', key: 'trigger', width: 200 },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (status) => <span style={{ color: status === '启用' ? '#52c41a' : '#ff4d4f' }}>{status}</span>
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 120 },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" icon={<PlayCircleOutlined />} onClick={() => message.success('已立即执行一次，报告已推送给接收人')}>立即执行</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => {
            setDataSource(prev => prev.filter(item => item.key !== record.key));
            message.success('订阅已删除');
          }}>删除</Button>
        </Space>
      ),
    },
  ];

  // 保存新增订阅
  const handleSaveSubscription = () => {
    form.validateFields().then(values => {
      // 触发规则文本映射
      const triggerText = {
        daily: '每日固定时间 09:00',
        weekly: '每周一 09:00',
        monthly: '每月1日 09:00',
        update: '数据更新时立即触发'
      }[values.trigger];

      // 新增订阅到列表
      setDataSource(prev => [...prev, {
        key: Date.now().toString(),
        name: values.name,
        scene: globalState.sceneName,
        trigger: triggerText,
        status: '启用',
        createTime: new Date().toLocaleDateString()
      }]);
      setModalVisible(false);
      form.resetFields();
      message.success('订阅规则保存成功');
    });
  };

  return (
    <Layout>
      {/* 左侧导航栏 */}
      <Sider width={240} theme="dark">
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
          智能报告系统
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['2']}>
          <Menu.Item key="1" onClick={() => navigate('/scene-edit')}>场景管理</Menu.Item>
          <Menu.Item key="2">订阅管理</Menu.Item>
        </Menu>
      </Sider>

      {/* 右侧主内容区 */}
      <Layout>
        {/* 顶部操作栏 */}
        <Header>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button icon={<LeftOutlined />} onClick={() => navigate('/scene-edit')}>返回场景编辑</Button>
            <span style={{ fontSize: 16, fontWeight: 500 }}>订阅管理</span>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>新增订阅</Button>
        </Header>

        {/* 表格内容区 */}
        <Content className="main-content">
          <div style={{ background: '#fff', borderRadius: 8, padding: 24 }}>
            <Table dataSource={dataSource} columns={columns} bordered />
          </div>
        </Content>
      </Layout>

      {/* 新增订阅弹窗 */}
      <Modal
        title="新增订阅规则"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={handleSaveSubscription}
        okText="保存"
        cancelText="取消"
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            label="订阅名称" 
            name="name" 
            rules={[{ required: true, message: '请输入订阅名称' }]}
            initialValue={`${globalState.sceneName} 定时报告订阅`}
          >
            <Input placeholder="请输入订阅名称" />
          </Form.Item>
          <Form.Item label="触发时机" name="trigger" initialValue="daily">
            <Select>
              <Option value="daily">每日固定时间 09:00</Option>
              <Option value="weekly">每周一 09:00</Option>
              <Option value="monthly">每月1日 09:00</Option>
              <Option value="update">数据更新时立即触发</Option>
            </Select>
          </Form.Item>
          <Form.Item label="接收人" name="receiver">
            <Select mode="multiple" placeholder="请选择接收人">
              <Option value="user1">张三</Option>
              <Option value="user2">李四</Option>
              <Option value="user3">王五</Option>
              <Option value="dept1">华东区域团队</Option>
            </Select>
          </Form.Item>
          <Form.Item label="通知方式" name="notify" initialValue={['wechat', 'email']}>
            <Checkbox.Group>
              <Checkbox value="wechat">企业微信</Checkbox>
              <Checkbox value="email">邮件</Checkbox>
              <Checkbox value="system">系统消息</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item label="报告内容" name="content" initialValue={['global', 'chapter']}>
            <Checkbox.Group>
              <Checkbox value="global">全局观点</Checkbox>
              <Checkbox value="chapter">章节观点</Checkbox>
              <Checkbox value="table">原始数据</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Subscription;