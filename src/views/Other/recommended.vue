<template>
<div id="recommended">
    <header>
        <van-swipe :autoplay="3000">
            <van-swipe-item v-for="(image, index) in bannerList" :key="index" id="swipe" style="height: 200px;">
                <img :src="image.imageUrl" />
            </van-swipe-item>
        </van-swipe>

        <ul id="headerTable">
            <li v-for="(item,index) in headerList" :key="index" @click="$router.push({path:item.to})">
                <van-icon :name="item.icon" />
                <p>{{item.name}}</p>
            </li>
        </ul>
    </header>

    <main id="main">
        <h1>热门歌单推荐</h1>
        <ul>
            <li v-for="(item,index) in HotPopularList" :key="index">
                <img :src="item.coverImgUrl">
                <p>
                    <span v-text="item.name"></span>
                    <span v-text="item.description"></span>
                </p>
            </li>
            <li v-if="start == true" class="vanLoading">
                <van-loading size="24px">加载中...</van-loading>
            </li>
        </ul>
    </main>

</div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'vue-property-decorator';
import topImg from '../../assets/default.png';
import Api from '../../api/api.js';
import {
    Lazyload
} from 'vant';

Vue.use(Lazyload);
@Component({
    components: {},
})
export default class top extends Vue {
    //banner列表
    bannerList: Array < any > = [];
    //头部导航列表
    headerList: Array < any > = [
                {
            name: '每日推荐',
            icon: 'diamond-o',
            to:'/RecommendedDaily'
        },
        {
            name: '分类',
            icon: 'orders-o',
             to:''
        },
        {
            name: '视频',
            icon: 'filter-o',
             to:''
        },
        {
            name: '云村',
            icon: 'flower-o',
             to:''
        },
          {
            name: '每日推荐',
            icon: 'diamond-o',
             to:''
        },
          {
            name: '每日推荐',
            icon: 'diamond-o',
             to:''
        },
          {
            name: '每日推荐',
            icon: 'diamond-o',
             to:''
        },
        {
            name: '电台',
            icon: 'desktop-o',
             to:''
        },
    ];
    //热门歌单列表
    HotPopularList: Array < any > = [];
    HotPopularLists: Array < any > = [];
    //页数
    pageSize: number = 1;
    //控制底部加载中的状态
    start: boolean = false;
    mounted() {
        this.banner();
        this.HotPopular();
        window.onscroll = () => {
            this.scorTop()
        }
    };

    //获取banner列表
    banner(): void {
        (this as any).$axios.post(Api.API.banner).then((res: any) => {
            this.bannerList = res.data.banners;
        })
    };

    //获取热门歌单
    HotPopular() {
        this.HotPopularLists = [];
        (this as any).$axios.post(Api.API.Popularsonglist).then((res: any) => {
            if (res.data.code == 200) {
                this.HotPopularLists = res.data.playlists;
                this.HotPopularList = this.HotPopularLists.slice(0, this.pageSize * 10)
                console.log(this.HotPopularList)
            }
        })
    };

    //滑到底部
    scorTop() {
        //变量scrollTop是滚动条滚动时，距离顶部的距离
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        //变量windowHeight是可视区的高度
        let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        //变量scrollHeight是滚动条的总高度
        let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        //滚动条到底部的条件
        if (scrollTop + windowHeight == scrollHeight) {
            if (this.HotPopularLists.length != this.HotPopularList.length) {
                this.start = true;
                setTimeout(() => {
                    this.start = false;
                    this.pageSize++;
                    this.HotPopularList = this.HotPopularLists.slice(0, this.pageSize * 10);
                }, 1000)
            }
        }
    };

}
</script>

<style lang="scss" scoped>
#swipe {
    img {
        width: 100%;
        height: 100%;
    }
}

#headerTable {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;

    li {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 25%;
        box-sizing: border-box;
        margin-top: 1rem;

        i {
            color: white;
            background: red;
            border-radius: 50%;
            width: 2.5rem;
            height: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
        }

        p {
            color: white;
            font-size: 0.9rem;
            margin-top: 0.3rem;
        }
    }
}

#main {
    h1 {
        text-align: center;
        font-size: 1.1rem;
        color: #FF9900;
        letter-spacing: 5px;
        padding: 0.5rem 0;
    }

    ul {
        width: 100%;
        list-style: none;

        .vanLoading {
            display: flex;
            justify-content: center;
        }

        li {
            width: 100%;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding: 0.5rem 0.5rem;

            img {
                width: 23%;
                height: 4.5rem;
                border-radius: 7px;
            }

            p {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: 77%;
                height: 4.5rem;
                box-sizing: border-box;
                padding: 0.2rem 0.5rem;

                span:first-child {
                    color: white;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                }

                span:nth-child(2) {
                    color: #CCCCCC;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    font-size: 0.8rem;
                }
            }
        }
    }
}
</style>
