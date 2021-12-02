import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/user/Users.vue'
import Rights from './components/power/Rights.vue'
import Roles from './components/power/Roles.vue'



Vue.config.productionTip = false
Vue.use(Router)

 const router = new Router({
   routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', 
       component: Home, 
       redirect: '/welcome',
      children:
      [
      {path: '/welcome',component:Welcome},
      {path:'/users',component:Users},
      {path:'/rights',component:Rights},
      {path:'/Roles',component:Roles}

    ] 
    }
  ]
})
//挂载路由导航守卫
router.beforeEach((to,from,next) =>{
  //to将要访问的路径
  //from 代表哪个路径跳转过来
  //next 是一个函数，表述放行
  //next() 放行 next('/login')
  if(to.path === '/login')return next()
  //获取token
  const tokenstr = window.sessionStorage.getItem('token')
  if(!tokenstr) return next('/login')
  next()
})
export default router