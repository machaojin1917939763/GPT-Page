import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Message,
} from '@arco-design/web-react';
import { IconUser, IconLock, IconEmail } from '@arco-design/web-react/icon';
import { useHistory } from 'react-router-dom';
import styles from './style/index.module.css';

const FormItem = Form.Item;

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function Register() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: RegisterForm) => {
    try {
      setLoading(true);
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        Message.success('注册成功！');
        history.push('/login');
      } else {
        const error = await response.json();
        Message.error(error.message || '注册失败，请重试');
      }
    } catch (error) {
      Message.error('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.title}>
          <Typography.Title heading={3}>注册账号</Typography.Title>
        </div>
        <Form
          form={form}
          layout="vertical"
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <FormItem
            label="用户名"
            field="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<IconUser />}
              placeholder="请输入用户名"
              allowClear
            />
          </FormItem>
          <FormItem
            label="邮箱"
            field="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input prefix={<IconEmail />} placeholder="请输入邮箱" allowClear />
          </FormItem>
          <FormItem
            label="密码"
            field="password"
            rules={[
              { required: true, message: '请输入密码' },
              { minLength: 6, message: '密码长度至少为 6 位' },
            ]}
          >
            <Input.Password
              prefix={<IconLock />}
              placeholder="请输入密码"
              allowClear
            />
          </FormItem>
          <FormItem
            label="确认密码"
            field="confirmPassword"
            rules={[
              { required: true, message: '请确认密码' },
              {
                validator: (value, callback) => {
                  if (value !== form.getFieldValue('password')) {
                    callback('两次输入的密码不一致');
                  }
                  callback();
                },
              },
            ]}
          >
            <Input.Password
              prefix={<IconLock />}
              placeholder="请确认密码"
              allowClear
            />
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" long loading={loading}>
              注册
            </Button>
          </FormItem>
          <div className={styles.actions}>
            <Typography.Text type="secondary">
              已有账号？
              <Button
                type="text"
                className={styles.link}
                onClick={() => history.push('/login')}
              >
                立即登录
              </Button>
            </Typography.Text>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;
