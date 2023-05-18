import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue' 
import Login from '../views/LoginView.vue'
import { useStoreAuth } from '@/stores/login'
import Logout from '../views/LogoutView.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta:{requiresAuth:true}
    },
    {
      path: '/monthly',
      name: 'monthlyt',
      component: () => import('../views/MonthlyView.vue'),
      meta:{requiresAuth:true}
    },
    {
      path: '/dayly',
      name: 'dayly',
      component: () => import('../views/DaylyView.vue'),
      meta:{requiresAuth:true}
    },
    {
      path: '/dayly/attendanceRegistration',
      name: 'attendanceRegistration',
      component: () => import('../views/AttendanceRegistrationVeiw.vue'),
      meta:{requiresAuth:true}
    },
    {
      path: '/dayly/attendanceRegistration/attendanceCompleted',
      name: 'attendanceCompleted',
      component: () => import('../views/AttendanceCompletedView.vue'),
      meta:{requiresAuth:true}
    },
    {
      path: '/:pathmatch(.*)*',
      name: 'notFound',
      component: NotFound,
      
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta:{requiresAuth:false}
      // ここはfalse
    },
    {
      path:'/logout',
      name:'logout',
      component:Logout
    }
  ]
})

// 上記をtrueに設定したらログインが完了してないと、('/login')にリダイレクトする作りにしています
router.beforeEach((to,from,next)=>{
  if(to.meta.requiresAuth){
    const isAuthenticated = useStoreAuth()
    if(isAuthenticated.isLoggedIn){
      next()
    }else{
      next('/login')
    }
  }else{
    next()
  }
})


export default router
