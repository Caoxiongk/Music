<template>
<div id="DetailsSinger">

    <header id="header">
        <van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft" />
        <div class="HeaderSinger">
            <img :src="list.img">
            <p>
                <span>{{list.name}}</span>
                <span @click="describeBtn">简介</span>
            </p>
        </div>

    </header>

    <main id="main">
        <van-sticky>
            <van-tabs v-model="active" title-active-color="#FF9900" title-inactive-color="#FFFFFF" @click="FocusBtn()">
                <van-tab v-for="(item,index) in tabList" :key="index" :title="item"></van-tab>
            </van-tabs>
        </van-sticky>
        <ul class="Song" v-if="active !=2">
            <li v-for="(item,index) in activeList" :key="index" :class="{active:ActiveIndex == index}" @click="singleSongBtn(item,index)">
                <p> <span>{{item.name}}</span>
                </p>
                <van-icon name="music-o" />
            </li>
            <li>
                <van-loading size="24px" v-if="LoadingStart == true">加载中...</van-loading>
            </li>
        </ul>
        <ul class="videoMv" v-else>
            <li v-for="(item,index) in MvList" :key="index" @click="WatcnBtn(item)">
                <div>
                    <van-icon name="play-circle-o" size="70" />
                </div>
                <img :src="item.img1v1Url">
                <p>{{item.name}}</p>
            </li>
        </ul>
    </main>

    <footer class="footer">
        <Play />
    </footer>
</div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'vue-property-decorator';
import Api from '../../api/api.js';
import Play from '../../components/Play.vue';
@Component({
    components: {
        Play
    }
})
export default class DetailsSinger extends Vue {
    list: any = JSON.parse((this as any).$route.query.list);
    active: number = 0;
    tabList: Array < any >= ['全部', '热门', 'MV', '专辑'];
    total: number = 0;
    limit: number = 30;
    startId: number = 0;
    activeList: Array < any >= [];
    ActiveIndex: number = 0;
    LoadingStart: boolean = false;
    MvList: Array < any > = [];
    mounted() {
        console.log(this.list)
        this.FocusBtn();
        window.onscroll = () => {
            this.Scope()
        }
    };

    //返回
    onClickLeft() {
        this.$router.push({
            path: '/Other/Singer'
        })
    };

    //描述
    describeBtn() {
        (this as any).$axios.post(Api.API.artistDesc, null, {
            params: {
                id: this.list.id
            }
        }).then((res: any) => {
            console.log(res.data)
            this.$dialog.alert({
                message: res.data.briefDesc,
            });
        })
    };

    //全部
    FocusBtn() {
        let url = '';
        console.log(this.active)
        this.ActiveIndex = 0;
        if (this.active == 0) {
            url = Api.API.artistSongs + "?id=" + this.list.id + "&&limit=" + this.limit;
            this.limit = 30
        } else if (this.active == 1) {
            this.limit = 50;
            url = Api.API.artistTop + "?id=" + this.list.id;
        } else if (this.active == 3) {
            this.album()
        } else {
            this.MvBtn()
        }

        if (this.active == 0 || this.active == 1) {
            (this as any).$axios.post(url).then((res: any) => {
                console.log(res.data)
                if (res.data.code == 200) {
                    this.total = res.data.total;
                    this.activeList = res.data.songs
                } else {
                    this.activeList = [];
                }
            })
        }

    };

    //专辑
    album() {
        this.activeList = [];
        (this as any).$axios.post(Api.API.artistAlbum + "?id=" + this.list.id + "&&cookie=" + localStorage.getItem('usernameCookie')).then((res: any) => {
            console.log(res.data)
            if (res.data.code == 200) {
                this.activeList = res.data.hotAlbums
            } else {
                this.activeList = [];
            }
        })
    };

    //MV
    MvBtn() {
        this.MvList = [];
        console.log('12312313');
        (this as any).$axios.post(Api.API.artistMv + "?id=" + this.list.id).then((res: any) => {
            console.log(res.data)
            if (res.data.code == 200) {
                this.MvList = res.data.mvs
            }
        })
    };

    //播放MV
    WatcnBtn(item: any) {
        this.$router.push({
            path: '/VideoPlayback',
            query: {
                id: item.id
            }
        })
    };

    //判断滚动条是否到达底部
    Scope() {
        //变量scrollTop是滚动条滚动时，距离顶部的距离
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        //变量windowHeight是可视区的高度
        var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        //变量scrollHeight是滚动条的总高度
        var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        //滚动条到底部的条件
        if (scrollTop + windowHeight >= scrollHeight && this.active == 0) {
            //写后台加载数据的函数
            console.log("距顶部" + scrollTop + "可视区高度" + windowHeight + "滚动条总高度" + scrollHeight);
            this.LoadingStart = true;
            setTimeout(() => {
                if (this.limit <= this.total) {
                    this.limit = this.limit + 10;
                    this.FocusBtn()
                } else {
                    this.$dialog.alert({
                        message: '没有更多了',
                        theme: 'round-button',
                    });
                }
            }, 1000)
        }
    };

    //歌曲播放
    singleSongBtn(item: any, index: any) {
        console.log('123')
        this.ActiveIndex = index;
        //查看歌曲是否能播放
        (this as any).$axios.post(Api.API.CheckMusic + "?id=" + item.id).then((res: any) => {
            console.log('12123')
            console.log(res.data)
            if (res.data.success == true) {
                console.log(item)
                this.$store.state.songId = item.id;
            } else {
                this.$toast.fail(res.data.message);
            }
        })
    }

}
</script>

<style lang="scss" scoped>
.active {
    color: #FF9900 !important;
}

#DetailsSinger {
    background: #24292e;
    min-height: 100vh;

    #header {
        background: #24292e;

        .van-nav-bar {
            background: #24292e;
        }

        .HeaderSinger {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        img {
            width: 7rem;
            height: 7rem;
            border-radius: 50%;
            animation: run 15s linear 0s infinite;
        }

        @-webkit-keyframes run {
            from {
                -webkit-transform: rotate(0deg);
            }

            to {
                -webkit-transform: rotate(360deg);
            }
        }

        p {
            color: white;
            font-size: 0.95rem;
            margin-top: 1.5rem;
            display: flex;
            margin-bottom: 1rem;

            span {
                padding: 0 0.5rem;
            }
        }
    }

    #main {

        .Song {
            list-style: none;
            box-sizing: border-box;
            padding: 0.5rem 1rem;

            li {
                color: #999999;
                padding: 0.7rem 0.3rem;
                border-bottom: 1px solid #999999;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .van-icon {
                    font-size: 1.1rem;
                }

                span {
                    margin-right: 0.5rem;
                }
            }

            li:last-child {
                border: none;
                margin-bottom: 0.5rem;
            }

            .van-loading {
                width: 100%;
                display: flex;
                justify-content: center;
            }
        }

        .videoMv {
            box-sizing: border-box;
            padding: 0rem 0.5rem;
            background: #24292e;

            li {
                width: 100%;
                margin-top: 1rem;
                position: relative;

                div {
                    width: 100%;
                    height: 11rem;
                    background: rgba(10, 10, 10, .4);
                    position: absolute;
                    z-index: 111;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .van-icon {
                        color: white;
                    }
                }

                img {
                    width: 100%;
                    height: 11rem;

                }

                p {
                    color: white;
                    padding: 0.2rem 0.3rem;
                }
            }
        }
    }
}

.footer {
    position: fixed;
    width: 100%;
    z-index: 333;
    background: red;
    bottom: 0;
}
</style><style lang="scss">
#DetailsSinger {

    .van-icon-arrow-left,
    .van-nav-bar__text,
    .van-nav-bar__title {
        color: white;
    }

    .van-hairline--bottom::after {
        border-bottom-width: 0px !important;
    }

    .van-tabs__nav {
        background: transparent;
    }

    .van-tabs__line {
        background: #FF9900;
    }

    .van-sticky {
        background: #24292e;
        z-index: 333;
    }

}
</style>
