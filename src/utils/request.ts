import axios from 'axios';
import {ElMessage, ElMessageBox} from 'element-plus';
import {Session} from './storage';
import router from "../router";

// 配置新建一个 axios 实例
const service = axios.create({
    baseURL: import.meta.env.VITE_API_URL as any,
    timeout: 0,
    headers: {'Content-Type': 'application/json'},
});

// 添加请求拦截器
service.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么 token
        if (Session.get('token')) {
            (<any>config.headers).common['Authorization'] = `Bearer ${Session.get('token')}`;
        }
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
service.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        return response
    },
    (error) => {
        if (error.response.status === 403 && error.response.data.code !== 2) {
            ElMessage({
                type: "error",
                message: "接口无访问权限"
            })
        }
        return Promise.reject(error);
    }
);

// 导出 axios 实例
export default service;
