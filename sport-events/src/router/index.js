import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Manage from '../views/Manage.vue'
import Joined from '../views/Joined'
import Create from '../views/Create.vue'
import Create_Account from '../views/Create_Account.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/Login.vue')
  },
  {
    path: '/manage',
    name: 'Manage',
    component: Manage
  },
  {
    path: '/joined',
    name: 'Joined',
    component: Joined
  }, 
  {
    path: '/create', 
    name: 'Create', 
    component: Create
  }, 
  {
    path: '/create-account',
    name: 'Create_Account',
    component: Create_Account
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
