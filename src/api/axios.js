import Vue from "vue"; //vue3.0  vue已经全局化
// 在官方的axios的基础上封装一个添加拦截器的axios
import axios from 'axios';
// 引入路由
import router from '../router/index.ts';

import API from '../api/api'
//引入element
import { Notify } from 'vant';

function Refreshtoken() {
    const url = API.Api.Refreshtoken+'?refreshToken='+sessionStorage.getItem('refreshToken');
    axios.get(url).then(res=>{
        if(res.data.code=='1'){
            sessionStorage.setItem('token', res.data.data.accessToken);
            sessionStorage.setItem('refreshToken', res.data.refreshToken);
        }else{
            Message.error('访问资源未授权，请登陆后重试！');
            router.push({name:'Login'}).catch(()=>{});
        }
    }).catch(err=>{
        console.log(err);
    })
    console.log(url);

}
const service = axios.create({
    baseURL:'http://81.68.238.59:3000',
    timeout: 30000
})

//跳转判断 路由拦截
// router.beforeEach((to,from,next)=>{
//     //如果用户访问的登录页，直接放行
//     // if(to.path === '/Login') return next()
//     // //从sessionStorage中获取到保存的token的值
//     // const token = sessionStorage.getItem('token')
//     // //没有token，强制跳转到登录页
//     // if(!token) return next('/Login')
//     // next()
//   })
  
// 全局添加拦截器的作用是可以在每个API前面加上headers的token验证
//请求前
service.interceptors.request.use(config => {
    // 判断token是否存在和是否需要token验证的路由
    // if (config.url.includes('/api/')) {
    //     if(sessionStorage.getItem("username")){
    //         config.headers.common["Authorization"] = sessionStorage.getItem("username");
    //     }
    // }else if(config.url.includes(window.apiObj.connector2)){
    //     if(sessionStorage.getItem('Token') && sessionStorage.getItem("username")){
    //         config.headers.common["Authorization"] = sessionStorage.getItem("username");
    //         config.headers.common["Verification"] = JSON.parse(sessionStorage.getItem('Token'));
    //     }
    // }
    let token = sessionStorage.getItem('token')
    if(token){
        config.headers.common["Authorization"] = 'Bearer ' + token;
    }
    return config;
});
// 处理退出响应的拦截器 err可以捕获状态，来进行响应的处理
//数据请求成功后
service.interceptors.response.use(response =>{
     if(response.status === 200){
         const res = response.data;
     }
    return response;
}, err => {
    if (!err.response) {
        Notify({ type: 'danger', message: '服务器出现问题，请稍后重试!' });
        console.log('触发')
        // 跳转到登录界面
        // router.push({name:'Login'}).catch(()=>{});
        sessionStorage.clear();
        return
    };
    // 获取状态码
    const status = err.response.status;
    switch (status) { // 其他情况补充处理
        case 500:
        case 400:
            Notify({ type: 'danger', message: '服务器出现问题，请稍后重试!' });
            break
        case 401:
            Notify({ type: 'danger', message: '服务器出现问题，请稍后重试!' });
            //  router.push({name: 'Login'}).catch(()=>{});
            //  sessionStorage.clear();
            // Refreshtoken();
            break
        case 403:
            Notify({ type: 'danger', message: '服务器出现问题，请稍后重试!' });
            break
        case 404:
            Notify({ type: 'danger', message: '服务器出现问题，请稍后重试!' });
            break
    }
    return Promise.reject(err)
})

export default service
