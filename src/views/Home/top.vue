<template>
<div id="top">
    <header id="header">
        <van-row>
            <van-col span="4"></van-col>
            <van-col span="16">
                <img :src="topImg">
                <span>Water Music</span>
            </van-col>
            <van-col span="4" @click="LoginShow =true">
                <van-icon name="manager-o" color="#FF9900" size="1.5rem" />
            </van-col>
        </van-row>
    </header>
    <ul>
        <li v-for="(item,index) in topList" :key="index" @click="topBtn(item,index)">
            <span v-text="item.name" :class="{active:currentIndex == index}"></span>
        </li>
    </ul>

    <van-popup v-model="LoginShow" position="right" :style="{ height: '100%',width:'80%',backgroundColor:'#f2f2f2' }">
        <Login></Login>
    </van-popup>
</div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'vue-property-decorator';
import topImg from '../../assets/default.png';
import Api from '../../api/api.js';
import Login from '../../components/login.vue';
@Component({
    components: {
        Login
    }
})
export default class top extends Vue {
    //选中的下表
    currentIndex: number = 0;
    //头部图片
    topImg: any = topImg;
    //弹窗列表
    LoginShow: boolean = false;
    //头部列表
    topList: Array < any > = [{
            id: 1,
            name: '推荐',
            to: '/Other/recommended'
        },
        {
            id: 2,
            name: '歌手',
            to: '/Other/Singer'
        },
        {
            id: 3,
            name: '榜单',
            to: '/Other/rankingList'
        },
        {
            id: 4,
            name: '搜索',
            to: '/Other/Search'
        },
    ];

    mounted() {
        if (sessionStorage.getItem('currentIndex')) {
            this.currentIndex = Number(sessionStorage.getItem('currentIndex'))
        }
        if (sessionStorage.getItem('path')) {
            (this as any).$router.push({
                path: sessionStorage.getItem('path')
            })
        }
    };
    //选中变红
    topBtn(item: any, index: any): void {
        this.currentIndex = index;
        sessionStorage.setItem('currentIndex', String(this.currentIndex))
        sessionStorage.setItem('path', item.to)
        this.$router.push({
            path: item.to
        })
    };

}
</script>

<style lang="scss" scoped>
#top {
    background-color: #24292e;

    .active {
        border-bottom: 2px solid #FF9900;
    }

    .van-row {

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .van-col {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 3rem;

        img {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            margin-right: 0.5rem;
        }

        span {
            font-size: 1.1rem;
            color: #FF9900;
        }
    }

    ul {
        display: flex;
        justify-content: space-between;
        color: #CCCCCC;
        list-style: none;
        box-sizing: border-box;
    }

    li {
        width: 25%;
        text-align: center;
        padding: 0.3rem 0;

        span {
            display: inline-block;
            height: 100%;
            box-sizing: border-box;
            padding: 0.5rem 0;
        }
    }
}
</style>
