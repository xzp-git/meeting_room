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
          path: '/user/*',
          component: './404',
        },
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
      hideInMenu: true,
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
    {
      component: './404',
      path: '/*',
    },
  ],
  npmClient: 'pnpm',
});
