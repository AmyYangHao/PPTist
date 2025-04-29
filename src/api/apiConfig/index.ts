import Tools from "@likg/tools";
import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosResult } from "axios";
import { ElMessage } from "element-plus";

/********************
 ** 创建axios实例
 ********************/
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  timeout: 5 * 60 * 1000,
  withCredentials: false,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});

/********************
 ** 请求拦截器
 ********************/
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    // -- GET请求拼接随机值
    if (/GET/i.test(config.method || "")) {
      const t = Math.random().toString(36).slice(2, 9);
      config.params = { ...config.params, t };
    }

    // -- 拼接token
    const token = localStorage.getItem("AUTHORIZATION_TOKEN");

    // -- 配置请求头
    config.headers = {
      Authorization: token ? `Bearer ${token}` : "",
      ...config.headers,
    };
    // -- 返回配置
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/********************
 ** 响应拦截器
 ********************/
axiosInstance.interceptors.response.use(
  async (response: AxiosResponse) => {
    ElMessage.closeAll();
    // -- 处理流数据
    if (response.request.responseType === "blob") {
      return { code: 200, data: response.data, msg: "success" };
    }
    // -- 判断code，统一处理异常
    const { code, msg } = response.data as unknown as AxiosResult;
    if (code === 200) {
      // 1. 成功
      return response.data;
    } else if (code === 402) {
      // 2. Token 过期
      // history.replace('/login');
      return Promise.reject();
    } else {
      const errMsg = msg ? (typeof msg === "string" ? msg : msg.detail) : "服务器异常";
      ElMessage(errMsg);
      return Promise.reject(errMsg);
    }
  },
  (error: AxiosError) => {
    console.log("[request error] > ", error);

    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "请求错误(400)";
          break;
        case 401:
          error.message = "未授权，请重新登录(401)";
          break;
        case 403:
          error.message = "拒绝访问(403)";
          break;
        case 404:
          error.message = "请求出错(404)";
          break;
        case 405:
          error.message = "请求方法不支持(405)";
          break;
        case 408:
          error.message = "请求超时(408)";
          break;
        case 500:
          error.message = "服务器异常(500)";
          break;
        case 501:
          error.message = "服务未实现(501)";
          break;
        case 502:
          error.message = "网络错误(502)";
          break;
        case 503:
          error.message = "网络超时(504)(503)";
          break;
        case 504:
          error.message = "网络超时(504)";
          break;
        case 505:
          error.message = "HTTP版本不受支持(505)";
          break;
        default:
          error.message = `连接出错(${error.response.status})!`;
      }
    } else {
      error.message = "服务链接失败";
    }
    ElMessage(error.message);
    return Promise.reject(error);
  }
);

const request = <R = any>(options: AxiosRequestConfig): Promise<AxiosResult<R>> => {
  return axiosInstance(options);
};

export default request;
