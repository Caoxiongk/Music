<template>
<div id="logins">
    <header id="header">
        <p>个人中心</p>
        <img :src="MyLogin.headerImg" @click="headerLoginBtn">
        <span class="login">
            <span>{{MyLogin.name}}</span>
            <span class="iconfont icon-vips" :style="{color:MyLogin.vipType == 0 ? 'white' : 'yellow'}"></span>
        </span>
    </header>

    <main>
        <div id="tableHeader">
            <ul>
                <li>
                    <span>{{MyLogin.dynamic}}</span>
                    <span>当前等级</span>
                </li>
                <li>
                    <span>{{MyLogin.focus}}</span>
                    <span>登录天数</span>
                </li>
                <li>
                    <span>{{MyLogin.fans}}</span>
                    <span>听歌次数</span>
                </li>
                <li>
                    <span>{{MyLogin.video}}</span>
                    <span>距离升级</span>
                </li>
            </ul>
        </div>

        <div class="loginList">
            <ul>
                <li v-for="(item,index) in LoginList" :key="index">
                    <p>
                        <span :class="item.icon"></span>
                        <span>{{item.name}}</span>
                    </p>
                    <van-icon name="arrow" />
                </li>
            </ul>
        </div>

        <div id="vanButton">
            <van-button color="linear-gradient(to right, #ff6034, #ee0a24)" @click="exitBtn()">
                {{cookie?'退出登录':' 嗨!小伙你还没登录呢'}}
            </van-button>
        </div>

        <div id="CloudVillage" v-if="hotwallList">
            <div class="CloudVillage">
                <p>云村热评</p>
                <ul>
                    <li v-for="(item,index) in hotwallList" :key="index">
                        <img :src="item.simpleUserInfo.avatar">
                        <p>
                            <span>{{item.simpleUserInfo.nickname}}</span>
                            <span>{{item.content}}</span>
                        </p>
                    </li>
                    <li></li>
                </ul>
            </div>

        </div>
    </main>

</div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'vue-property-decorator';
import headerImg from '../assets/default.png';
import Api from '../api/api.js';
import axios from 'axios';
@Component({})
export default class Login extends Vue {
    cookie: any = localStorage.getItem('usernameCookie');
    userId: any = localStorage.getItem('userId');
    MyLogin = {
        headerImg: headerImg,
        name: '未登录',
        dynamic: 0,
        focus: 0,
        fans: 0,
        video: 0,
        vipType: 0,
    };
    LoginList: Array < any > = [{
            name: '我的音乐',
            to: '',
            icon: 'iconfont icon-yinyue'
        },
        {
            name: '我的消息',
            to: '',
            icon: 'iconfont icon-xiaoxi'
        },
        {
            name: '我喜欢的音乐',
            to: '',
            icon: 'iconfont icon-xihuan1'
        },
        {
            name: '我的云盘',
            to: '',
            icon: 'iconfont icon-B'
        },
        {
            name: '最近播放',
            to: '',
            icon: 'iconfont icon-zuijinyuedu'
        },
        {
            name: '已购买',
            to: '',
            icon: 'iconfont icon-yigoumai'
        }
    ];
    //云村热评
    hotwallList: Array < any > = [];

    mounted() {
        this.hotwallBtn();
        if (this.cookie) {
            this.AccessInformation()
        }
    };

    //获取云村热评
    hotwallBtn() {
        this.hotwallList = [];
        (this as any).$axios.post(Api.API.hotwall).then((res: any) => {
            console.log(res.data)
            if (res.data.code == 200) {
                this.hotwallList = res.data.data
            }
        })
    };
    //跳转
    headerLoginBtn() {
        if (!this.cookie) {
            this.$router.push({
                path: '/Login'
            })
        }
    };
    //退出登录
    exitBtn() {
        if (this.cookie) {
            localStorage.clear();
            this.MyLogin = {
                headerImg: headerImg,
                name: '未登录',
                dynamic: 0,
                focus: 0,
                fans: 0,
                video: 0
            };
            this.cookie = '';
        } else {
            this.$router.push({
                path: '/Login'
            })
        }
    };
    //获取用户等级信息
    AccessInformation() {
        let ApiOne = (this as any).$axios.post(Api.API.userlevel + "?cookie=" + this.cookie);
        let ApiTwo = (this as any).$axios.post(Api.API.userDetail + "?uid=" + this.userId);
        axios.all([ApiOne, ApiTwo]).then(axios.spread((userResp: any, reposResp: any) => {
            this.MyLogin = {
                headerImg: reposResp.data.profile.avatarUrl,
                name: reposResp.data.profile.nickname,
                dynamic: userResp.data.data.level,
                focus: userResp.data.data.nowLoginCount,
                fans: userResp.data.data.nowPlayCount,
                video: userResp.data.data.nextLoginCount,
                vipType: reposResp.data.profile.vipType
            }
        }))
    }
}
</script>

<style lang="scss" scoped>
#header {
    background: url('../assets/bgc.jpg') no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
        text-align: center;
        padding: 0.8rem 0;
        color: white;
    }

    img {
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        margin-bottom: 0.5rem;
    }

    .login {
        padding-bottom: 0.5rem;

        span {
            font-size: 0.9rem;
            color: white;
            padding: 0 0.1rem;
        }
    }
}

#tableHeader {
    ul {
        list-style: none;
        display: flex;
    }

    li {
        width: 25%;
        background: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 4rem;

        span:first-child {
            margin-bottom: 0.2rem;
            color: #666666;
            font-weight: 600;
            font-size: 1.1rem;
        }

        span:nth-child(2) {
            color: #747474;
            font-size: 0.9rem;
        }
    }
}

.loginList {
    margin-top: 0.5rem;

    ul {
        list-style: none;

        li {
            display: flex;
            justify-content: space-between;
            background: white;
            align-items: center;
            padding: 0.6rem 0.7rem;
            border-bottom: 1px solid #eaeaea;

            p {

                .iconfont {
                    font-size: 20px;
                    color: #999999;
                    margin-right: 0.9rem;
                }

                span {
                    font-size: 0.95rem;
                }
            }

            .van-icon {
                font-size: 20px;
                color: #999999;
            }
        }
    }
}

#vanButton {
    margin-top: 0.5rem;

    .van-button {
        width: 100%;
    }

}

#CloudVillage {
    margin-top: 0.5rem;
    padding: 0 0.5rem;

    .CloudVillage {
        border-radius: 7px;
        overflow: hidden;
        background: white;

        ul {
            list-style: none;

            li {
                width: 100%;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                padding: 0.5rem 0.5rem;

                img {
                    width: 23%;
                    height: 3rem;
                    border-radius: 7px;
                }

                p {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    width: 77%;
                    height: 3rem;
                    box-sizing: border-box;
                    padding: 0.2rem 0.5rem;

                    span {
                        color: #34495e;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                        font-size: 0.9rem;
                    }

                }
            }
        }
    }

    .CloudVillage>p {
        background: url('../assets/hot.jpg') no-repeat;
        background-size: cover;
        width: 100%;
        color: #666666;
        text-align: center;
        padding: 0.5rem 0;
        font-weight: 500;
        letter-spacing: 2px
    }
}
</style>
