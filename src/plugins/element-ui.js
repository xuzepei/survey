import Vue from 'vue'

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import enLocale from 'element-ui/lib/locale/lang/en'

//指定语言
Vue.use(ElementUI, { locale: enLocale })

import { Message} from 'element-ui'
//Vue.use(Message)，Message不需要注册
Vue.prototype.$message = Message;