import Vue from 'vue'

// 定义全局方法

// //判断是否为开发环境
// Vue.prototype.$isDev = function () {
//     return process.env.NODE_ENV === 'development';
// };


// //判断是否能点击，防抖
// var gDebounceTimeout = null;
// Vue.prototype.$isClickable = function () {
//     if (gDebounceTimeout) {
//         return false;
//     }

//     // 设置 3 秒防抖时间
//     gDebounceTimeout = setTimeout(() => {
//         gDebounceTimeout = null;  // 清除定时器
//     }, 3000);

//     return true;
// };

const Tool = {
/**
 * 忽略大小写获取对象属性值
 * @param {Object} obj - 要查询的对象
 * @param {string} key - 要获取的属性名（大小写不敏感）
 * @returns {any} 属性值，如果没找到返回 undefined
 */
  getValueIgnoreCase(obj, key) {
    if (!obj || typeof obj !== 'object') return undefined;
    const lowerKey = key.toLowerCase();
    for (const k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        if (k.toLowerCase() === lowerKey) return obj[k];
        if (typeof obj[k] === 'object') {
          const val = Tool.getValueIgnoreCase(obj[k], key);
          if (val !== undefined) return val;
        }
      }
    }
    return undefined;
  },

  // 判断是否为开发环境
  isDev() {
    return process.env.NODE_ENV === 'development';
  },

  // 防抖点击判断
  _debounceTimeout: null,
  isClickable() {
    if (Tool._debounceTimeout) return false;

    // 设置 3 秒防抖时间
    Tool._debounceTimeout = setTimeout(() => {
      Tool._debounceTimeout = null;
    }, 3000);
    return true;
  },
};

// 挂载到 Vue 原型
Vue.prototype.$tool = Tool;

// 整体导出
export default Tool;