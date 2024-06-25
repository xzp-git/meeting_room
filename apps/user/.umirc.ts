import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  title: '灵境畅议',
  layout: {
    title: '灵境畅议',
  },
  favicons: ['/logo.svg'],
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          path: '/user/login',
          name: 'login',
          component: './user/login',
        },
        {
          path: '/user/register',
          name: 'register',
          component: './user/register',
        },
        {
          path: '/user/update-password',
          name: 'update-password',
          component: './user/update-password',
        },
        // {
        //   path: '/user/*',
        //   component: './404',
        // },
      ],
    },
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: '会议室预定',
      path: '/meeting-room-reserve',
      component: './meeting-room-reserve',
    },
    {
      name: '会议室管理',
      path: '/meeting-room-management',
      component: './meeting-room-management',
    },
    {
      name: '用户管理',
      path: '/user-management',
      component: './user-management',
    },
    {
      name: '个人设置',
      path: '/settings',
      component: './settings',
    },
    {
      component: './404',
      path: '/*',
    },
  ],
  npmClient: 'pnpm',
});
