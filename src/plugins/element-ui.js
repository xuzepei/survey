import Vue from 'vue'

// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(ElementUI)

import 'element-ui/lib/theme-chalk/index.css'
import { Dialog, Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItemGroup, MenuItem, Select, Option, Link, Popover, Radio, RadioGroup} from 'element-ui'

//表单相关
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)

Vue.use(Link)
Vue.use(Popover)

Vue.use(Dialog)

Vue.use(Radio)
Vue.use(RadioGroup)

//布局相关
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)







//Vue.use(Message)，Message不需要注册
Vue.prototype.$message = Message;