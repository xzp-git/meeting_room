import { getUpdateCaptcha, updateUserInfo } from '@/services';
import { MailTwoTone } from '@ant-design/icons';
import {
  ProForm,
  ProFormCaptcha,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import { Avatar, Form, message } from 'antd';
import React from 'react';
import useStyles from './index.style';

const getAvatarURL = () => {
  const url =
    'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
  return url;
};

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }: { avatar?: string }) => {
  const { styles } = useStyles();

  return (
    <>
      <div className={styles.avatar_title}>头像</div>
      <Avatar className={styles.avatar} src={avatar} alt="avatar" />
    </>
  );
};

const getCaptchaRequest = async () => {
  const res = await getUpdateCaptcha();
  if (res.code === 1) {
    message.success('验证码发送成功');
  }
};

const BaseView: React.FC = () => {
  const { styles } = useStyles();
  const [form] = Form.useForm();
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser, loading } = initialState || {};
  const { run: runGetCaptcha } = useRequest(getCaptchaRequest, {
    manual: true,
  });
  const { run: runUpdateUserInfo } = useRequest(
    async (val) => {
      const res = await updateUserInfo(val);
      if (res.code === 1) {
        message.success('更新基本信息成功');
        setInitialState((s) => ({
          ...s,
          currentUser: { ...s?.currentUser, ...val },
        }));
      }
    },
    {
      manual: true,
    },
  );

  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <ProForm
            form={form}
            layout="vertical"
            onFinish={runUpdateUserInfo}
            submitter={{
              searchConfig: {
                submitText: '更新基本信息',
              },
              render: (_, dom) => dom[1],
            }}
            initialValues={{
              ...(currentUser || {}),
            }}
            hideRequiredMark
          >
            <ProFormText
              name="avatar"
              label="昵称"
              placeholder="请输入昵称"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
              hidden
            />
            <AvatarView
              avatar={
                currentUser?.avatar
                  ? `http://localhost:3001/${currentUser?.avatar}`
                  : getAvatarURL()
              }
            />
            <ProFormUploadButton
              colProps={{ span: 12 }}
              title="更改头像"
              label=""
              max={2}
              fieldProps={{
                name: 'file',
                accept: 'image/*',
                showUploadList: false,
                onChange(info) {
                  const { status } = info.file;
                  if (status === 'done') {
                    console.log(info.file, 'info.file');
                    form.setFieldValue('avatar', info.file.response.data);
                    setInitialState((s: any) => ({
                      ...s,
                      currentUser: {
                        ...s?.currentUser,
                        avatar: info.file.response.data,
                      },
                    }));
                    message.success(`${info.file.name}文件上传成功`);
                  } else if (status === 'error') {
                    message.error(`${info.file.name}文件上传失败`);
                  }
                },
              }}
              action="http://localhost:3001/api/v1/user/upload"
            />
            <ProFormText
              name="nickName"
              label="昵称"
              placeholder="请输入昵称"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
              colProps={{ span: 12 }}
            />

            <ProFormText
              name="email"
              label="邮箱"
              rules={[
                {
                  required: true,
                },
              ]}
              disabled
            />
            <ProFormCaptcha
              label="验证码"
              fieldProps={{
                prefix: <MailTwoTone />,
              }}
              captchaProps={{}}
              countDown={60}
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
        </>
      )}
    </div>
  );
};
export default BaseView;
