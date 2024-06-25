import { request } from '@umijs/max';

export interface HttpBaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface UserInfo {
  id: number;

  username: string;

  nickName: string;

  email: string;

  avatar: string;

  phone: string;

  isFrozen: boolean;

  isAdmin: boolean;

  createTime: Date;

  roles: string[];

  permissions: string[];
}

export interface LoginUserVo {
  userInfo: UserInfo;

  accessToken: string;

  refreshToken: string;
}

export const login = async (
  data: { username: string; password: string },
  options?: { [key: string]: any },
) => {
  return request<HttpBaseResponse<LoginUserVo>>('/api/v1/user/login', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

export const getCaptcha = async (
  data: { email: string },
  options?: { [key: string]: any },
) => {
  return request<HttpBaseResponse<LoginUserVo>>('/api/v1/user/captcha', {
    method: 'get',
    params: data,
    ...(options || {}),
  });
};

export interface RegisterReq {
  username: string;

  nickName: string;

  password: string;

  email: string;

  captcha: string;
}

export const register = async (
  data: RegisterReq,
  options?: { [key: string]: any },
) => {
  return request<HttpBaseResponse>('/api/v1/user/register', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

export const updatePassword = async (
  data: Omit<RegisterReq, 'nickName' | 'username'>,
  options?: { [key: string]: any },
) => {
  return request<HttpBaseResponse>('/api/v1/user/update/password', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

export const getUpdateCaptcha = async (options?: { [key: string]: any }) => {
  return request<HttpBaseResponse<LoginUserVo>>('/api/v1/user/update/captcha', {
    method: 'GET',
    ...(options || {}),
  });
};

export async function refreshToken() {
  const res = await request('/api/v1/user/refresh', {
    params: {
      refreshToken: localStorage.getItem('refresh_token'),
    },
  });
  localStorage.setItem('access_token', res.data.accessToken || '');
  localStorage.setItem('refresh_token', res.data.refreshToken || '');
  return res;
}

export const getUserInfo = async (options?: { [key: string]: any }) => {
  return request<HttpBaseResponse<UserInfo>>('/api/v1/user/info', {
    method: 'GET',
    ...(options || {}),
  });
};
export const updateUserInfo = async (
  data: { avatar?: string; nickName?: string },
  options?: { [key: string]: any },
) => {
  return request<HttpBaseResponse>('/api/v1/user/update/userinfo', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

export const queryUserList = async (
  data: { username?: string; nickName?: string; email?: string },
  options?: { [key: string]: any },
) => {
  return request<HttpBaseResponse<{ users: UserInfo[]; total: number }>>(
    '/api/v1/user/list',
    {
      method: 'GET',
      params: data,
      ...(options || {}),
    },
  );
};

export const freezeUser = async (
  data: { id: string; freeze: number },
  options?: { [key: string]: any },
) => {
  return request<HttpBaseResponse>('/api/v1/user/freeze', {
    method: 'GET',
    params: data,
    ...(options || {}),
  });
};
