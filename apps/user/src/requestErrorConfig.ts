﻿import {
  request,
  type AxiosRequestConfig,
  type RequestOptions,
} from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';
import { refreshToken } from './services';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0, // 静默
  WARN_MESSAGE = 1, // 需要提示
  ERROR_MESSAGE = 2, // 需要错误
  NOTIFICATION = 3, // 需要通知
  REDIRECT = 9, // 需要重定向
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
interface PendingTask {
  config: AxiosRequestConfig;
  resolve: (value: any) => void;
}
let refreshing = false;
const queue: PendingTask[] = [];
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType } =
        res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: async (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围

        const { config } = error.response;

        if (refreshing && !config.url.includes('/user/refresh')) {
          return new Promise((resolve) => {
            queue.push({
              config,
              resolve,
            });
          });
        }
        if (
          error.response.status === 401 &&
          !config.url.includes('/user/refresh')
        ) {
          refreshing = true;

          const res = await refreshToken();
          refreshing = false;
          if (res.code === 1) {
            queue.forEach(({ config, resolve }) => {
              resolve(request(config.url!, config));
            });
            return request(config.url!, config);
          } else {
            message.error(res.message);
            setTimeout(() => {
              window.location.href = '/login';
            }, 1000);
          }
        } else {
          message.error(
            `${error.response?.data?.message ?? error.response?.statusText}`,
          );
          refreshing = false;
        }
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      const { headers } = config;
      const token = localStorage.getItem('access_token');
      if (token && headers) {
        headers.Authorization = `Bearer ${token}`;
      } else if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      console.log(response, 'responseInterceptors');
      // 拦截响应数据，进行个性化处理
      // const { data } = response as unknown as ResponseStructure;
      // if (data?.success === false) {
      //   message.error('请求失败！');
      // }
      return response;
    },
  ],
};
