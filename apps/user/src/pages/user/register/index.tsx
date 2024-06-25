import { getCaptcha, register } from '@/services';
import { MailTwoTone } from '@ant-design/icons';
import {
  ProForm,
  ProFormCaptcha,
  ProFormText,
} from '@ant-design/pro-components';
import { useNavigate, useRequest } from '@umijs/max';
import { message } from 'antd';
import { FC } from 'react';
import Wrapper from '../components/wrapper';

const getCaptchaRequest = async (email: string) => {
  const res = await getCaptcha({ email });
  if (res.code === 1) {
    message.success('验证码发送成功');
  }
};

const registerRequest = async (userInfo: any) => {
  const res = await register(userInfo);
  if (res.code === 1) {
    message.success('注册成功');
  }
};

const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const { run: runGetCaptcha } = useRequest(getCaptchaRequest, {
    manual: true,
  });
  const { run: runRegister } = useRequest(registerRequest, {
    manual: true,
    onSuccess() {
      navigate('/user/login');
    },
  });
  return (
    <ProForm<{
      name: string;
      company?: string;
      useMode?: string;
    }>
      style={{
        marginTop: 50,
      }}
      submitter={{
        // 配置按钮的属性
        resetButtonProps: {
          style: {
            // 隐藏重置按钮
            display: 'none',
          },
        },
        submitButtonProps: {
          style: {
            marginLeft: 'auto',
          },
        },
      }}
      labelCol={{ span: 4, offset: 2 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      onFinish={runRegister}
    >
      <ProFormText
        width="md"
        name="username"
        label="用户名"
        tooltip="最长为 24 位"
        placeholder="请输入用户名"
        rules={[
          {
            required: true,
            message: '请输入用户名',
          },
        ]}
      />
      <ProFormText
        width="md"
        name="nickName"
        label="昵称"
        placeholder="请输入昵称"
        rules={[
          {
            required: true,
            message: '请输入用户名',
          },
        ]}
      />
      <ProFormText.Password
        width="md"
        name="password"
        label="密码"
        placeholder="请输入密码"
        rules={[
          {
            required: true,
            message: '请输入用户名',
          },
        ]}
      />
      <ProFormText.Password
        width="md"
        name="confirmPassword"
        required
        label="确认密码"
        placeholder="请输入确认密码"
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value) {
                return Promise.reject(new Error('请输入确认密码'));
              }
              if (getFieldValue('password') !== value) {
                return Promise.reject('两次密码输入不一致');
              }
              return Promise.resolve();
            },
          }),
        ]}
      />
      <ProFormText
        width="md"
        name="email"
        label="邮箱"
        placeholder="请输入邮箱"
        rules={[
          {
            required: true,
            message: '请输入邮箱',
          },
        ]}
      />
      <ProFormCaptcha
        label="验证码"
        fieldProps={{
          prefix: <MailTwoTone />,
        }}
        captchaProps={{}}
        countDown={60}
        // 手机号的 name，onGetCaptcha 会注入这个值
        phoneName="email"
        name="captcha"
        rules={[
          {
            required: true,
            message: '请输入验证码',
          },
        ]}
        placeholder="请输入验证码"
        // 如果需要失败可以 throw 一个错误出来，onGetCaptcha 会自动停止
        // throw new Error("获取验证码错误")
        onGetCaptcha={runGetCaptcha}
      />
    </ProForm>
  );
};

export default () => (
  <Wrapper title="用户注册">
    <RegisterPage />
  </Wrapper>
);
