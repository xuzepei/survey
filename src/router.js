import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/LoginPage.vue'
import Home from '@/components/Home.vue'
import MyHelloWorld from '@/components/MyHelloWorld.vue'
import Survey from '@/pages/SurveyPage.vue'
import Lottery from '@/pages/LotteryPage.vue'
import ClientList from '@/pages/ClientListPage.vue'
import HelloWorld from '@/components/HelloWorld.vue'
import Dashboard from '@/components/Dashboard.vue'
import Cases from '@/components/Cases.vue'
import Keys from '@/plugins/keys.js';
import { loginToolShared } from './plugins/LoginTool'
import { userShared } from './plugins/User'

Vue.use(Router)

const router = new Router({
    mode: 'hash', // Use 'history' mode to avoid hash in URLs
    routes: [
        {
            path: '/clients', name: 'ClientList', component: ClientList, meta: {
                requireAuth: true //need to login
            }, children: [], //redirect: '/dashboard'
        },
        { path: '/login', name: 'Login', component: Login },
        { path: '/lottery', name: 'Lottery', component: Lottery },
        { path: '/', name: 'Survey', component: Survey},
    ]
})

//路由守卫
router.beforeEach(async (to, from, next) => {

    console.log("Check if it is logged in...")

    let isLoggedIn = false
    const is_login = window.sessionStorage.getItem(Keys.is_login)
    if (!is_login) {
        isLoggedIn = false
    } else {
        isLoggedIn = true
    }

    console.log("isLoggedIn: " + isLoggedIn)

    // 只拦 lottery 页面
    if (to.path === '/lottery') {
        const surveySubmitted = localStorage.getItem('survey_submitted')
        if (!surveySubmitted) {
            // ❌ 未提交 Survey，不允许访问
            return next('/')
        }
    } 

    //要求登录的
    if (to.matched.some(record => record.meta.requireAuth)) {
        if (!isLoggedIn) {
            //未登录，则需要跳转到登录页
            if (to.path !== '/login') {
                console.log("router: " + "未登录，则需要跳转到登录页")
                return next('/login')
            } else {
                console.log("router: " + "已经在登录页，直接放行")
                return next() // 已经在登录页，直接放行
            }
        } else {
            // 如果是登录成功刚跳转来的
            // if (from.path === '/login') {
            //     console.log("router: " + "如果是登录成功刚跳转来的")
            //     return next()
            // }
            //return next()
        }
    }

    return next()
})


export default router