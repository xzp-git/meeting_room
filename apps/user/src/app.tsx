import logo from '@/assets/logo.svg';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { RequestConfig, history } from '@umijs/max';
import {
  AvatarDropdown,
  AvatarName,
} from './components/RightContent/AvatarDropdown';
import { errorConfig } from './requestErrorConfig';
import { UserInfo, getUserInfo } from './services';

const loginPath = '/user/login';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  currentUser?: UserInfo;
  loading?: boolean;
  fetchUserInfo?: () => Promise<UserInfo | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const res = await getUserInfo({
        skipErrorHandler: true,
      });
      return res.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (![loginPath, '/user/register'].includes(location.pathname)) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
    };
  }
  return {
    fetchUserInfo,
  };
}

export const layout: RunTimeLayoutConfig = (state) => {
  const { initialState } = state;
  console.log(initialState, 'initialState');

  const { currentUser } = initialState as any;
  return {
    logo: logo,
    avatarProps: {
      src: currentUser.avatar
        ? `http://localhost:3001/${currentUser.avatar}`
        : 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown menu>{avatarChildren}</AvatarDropdown>;
      },
    },
    menu: {
      locale: false,
    },
    layout: 'mix',
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  baseURL: 'http://localhost:3001/',
  timeout: 3000,
  ...errorConfig,
};
