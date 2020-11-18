import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home/home.vue';
import recommended from '../views/Other/recommended.vue';
import Singer from '../views/Other/singer.vue';
import Login from '../views/My/Login.vue';
import Search from '../views/My/Search.vue';
import DetailsSinger from '../views/Other/DetailsSinger.vue';
import test from '../views/Other/test.vue';
import VideoPlayback from '../views/Other/VideoPlayback.vue';
import rankingList from '../views/Other/rankingList.vue';
import RecommendedDaily from '../views/Other/RecommendedDaily.vue';
Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    redirect:'/Other/recommended'
  },
  {
   path:'/Home',
   name:'Home',
   component: Home,
  },
  {
    path:'/test',
    name:'test',
    component: test,
   },
  {
    path:'/Login',
    name:'Login',
    component: Login,
   },
   {
    path:'/DetailsSinger',
    name:'DetailsSinger',
    component: DetailsSinger,
   },
   {
    path:'/VideoPlayback',
    name:'VideoPlayback',
    component: VideoPlayback,
   },
   {
    path:'/RecommendedDaily',
    name:'RecommendedDaily',
    component: RecommendedDaily,
   },
  {
    path:'/Other',
    component: Home,
    children:[
      {
        path:'recommended',
        name:'recommended',
        component:recommended
      },
      {
        path:'rankingList',
        name:'rankingList',
        component:rankingList
      },
      {
        path:'Search',
        name:'Search',
        component:Search
      },
      {
        path:'Singer',
        name:'Singer',
        component:Singer
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
