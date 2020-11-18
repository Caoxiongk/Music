import Vue from 'vue';
import App from './App.vue';
// @ts-ignore
import router from './router/index.ts';
// @ts-ignore
import store from './store/index.ts';
// @ts-ignore
import Vant from 'vant';
import 'vant/lib/index.css';
import axios from '../src/api/axios.js';
import '../src/font/iconfont.css';
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer);
Vue.prototype.$axios = axios;
Vue.use(Vant);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
