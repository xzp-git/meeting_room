import logoUrl from '@/assets/logo.svg';
import { login } from '@/services';
import { LockOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormText,
} from '@ant-design/pro-components';
import { Link, useModel, useRequest } from '@umijs/max';
import { Tabs, message, theme } from 'antd';
import { createStyles } from 'antd-style';
import { useState } from 'react';

const useStyles = createStyles(({ css }) => {
  return {
    loginFooter: css`
      margin-block-end: 24px;
      display: flex;
      justify-content: space-between;
    `,
  };
});

type LoginType = 'phone' | 'account';

const Page = () => {
  const { setInitialState } = useModel('@@initialState');
  const [loginType, setLoginType] = useState<LoginType>('account');
  const { token } = theme.useToken();
  const { styles } = useStyles();
  const { run: runLogin } = useRequest(
    async (val: any) => {
      const res = await login(val);
      const { data, code } = res;
      if (code === 1) {
        message.success('登录成功');
        localStorage.setItem('access_token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);
        setInitialState((s) => ({ ...s, currentUser: data.userInfo }));
        localStorage.setItem('user_info', JSON.stringify(data.userInfo));
        const urlParams = new URL(window.location.href).searchParams;
        window.location.href = urlParams.get('redirect') || '/';
      }
    },
    {
      manual: true,
    },
  );
  return (
    <div style={{ height: '100vh' }}>
      <LoginFormPage
        logo={logoUrl}
        onFinish={runLogin}
        backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
        title="灵境畅议"
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
        subTitle="优秀的会议管家"
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
          items={[
            {
              key: 'account',
              label: '账号密码登录',
            },
            {
              key: 'phone',
              label: '邮箱验证码登录',
            },
          ]}
        />
        {loginType === 'account' && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: (
                  <UserOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              placeholder={'用户名: admin or user'}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              placeholder={'密码: 666666'}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
          </>
        )}
        {loginType === 'phone' && (
          <>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: (
                  <MobileOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              name="mobile"
              placeholder={'手机号'}
              rules={[
                {
                  required: true,
                  message: '请输入手机号！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '手机号格式错误！',
                },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              captchaProps={{
                size: 'large',
              }}
              placeholder={'请输入验证码'}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${'获取验证码'}`;
                }
                return '获取验证码';
              }}
              name="captcha"
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ]}
              onGetCaptcha={async () => {
                message.success('获取验证码成功！验证码为：1234');
              }}
            />
          </>
        )}
        <div className={styles.loginFooter}>
          <Link to="/user/register">创建账号</Link>
          <Link to="/user/update-password">忘记密码</Link>
        </div>
      </LoginFormPage>
    </div>
  );
};

export default () => {
  return (
    <ProConfigProvider dark>
      <Page />
    </ProConfigProvider>
  );
};
