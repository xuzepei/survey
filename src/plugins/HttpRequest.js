import Vue from 'vue'
import axios from 'axios';
// import { userShared } from './User.js';

//配置axios
// axios.defaults.baseURL = "https://www.wanandroid.com/user/"
// Vue.prototype.$http = axios;

// 创建 axios 实例
const instance = axios.create({
  //baseURL: 'https://dl.freqtek.com:18791/dsd', // 设置默认的 baseURL
  timeout: 20000, // 请求超时时间20s
});

export default instance;

//将axios挂载到Vue原型上，这样所有组件都可以通过this.$http访问
Vue.prototype.$http = instance;


// class HttpRequest {
//   constructor(baseURL = '/') {
//     this.http = axios.create({
//       baseURL,
//       timeout: 20000, // 请求超时时间20s
//       headers: {
//         'Content-Type': 'application/json',
//         "Accept": "*/*",
//         "Authorization": userShared.authorization(),
//       }
//     });
//   }

//   async get(url, onSuccess, onError) {
//     try {
//       const response = await this.http.post('/token', data);

//       if (response.status === 200 && response.headers['content-type']?.includes('application/json')) {
//         if (response.data.success && response.data.data) {
//           onSuccess?.(response.data.data.content);
//         } else {
//           onError?.(response.data.errorMessage || '登录失败');
//         }
//       } else {
//         onError?.('请求失败：非200响应');
//       }
//     } catch (err) {
//       console.error(err);
//       onError?.('网络请求错误');
//     }
//   }

//   // 你可以添加更多 API 方法
// }
