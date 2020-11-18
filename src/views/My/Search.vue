<template>
<div id="Search">
    <header id="header">
        <van-search v-model="searchVlue" :placeholder="HotSearchValie" background="#24292e" @input="inputSearch()" />
        <span style="text-align: center;padding:0.5rem 0;width: 100%;display: inline-block;color:#999999" v-if="searchVlue.length == 0">热搜列表</span>
        <ul class="HotClass" v-if="searchVlue.length == 0">
            <li v-for="(item,index) in tableList" :key="index" @click="HotBtn(item)">
                <span class="iconfont icon-yinyue"></span>
                <span>{{item.first}}</span>
            </li>
        </ul>

        <ul class="HotClass" v-if="searchVlue.length">
            <li v-for="(item,index) in tableList" :key="index" @click="playBtn(item,index)">
                <span class="iconfont icon-yinyue"></span>
                <span>{{item.name}}</span>
            </li>
        </ul>
    </header>
</div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'vue-property-decorator';
import Api from '../../api/api.js';
@Component({})
export default class Search extends Vue {
    searchVlue: string = '';
    startId: number = 0;
    HotSearchValie: string = '';
    tableList: Array < any > = [];

    mounted() {
        this.SearchDefault();
        this.SearchHot()
    };

    //获取热搜关键字
    SearchDefault() {
        (this as any).$axios.post(Api.API.searchDefault).then((res: any) => {
            this.HotSearchValie = res.data.data.showKeyword
        })
    };

    //热搜列表
    SearchHot() {
        this.tableList = [];
        (this as any).$axios.post(Api.API.searchHot).then((res: any) => {
            if (res.data.code == 200) {
                this.tableList = res.data.result.hots;
                console.log(this.tableList)
            } else {
                this.tableList = []
            }
        })
    };

    //输入框值改变
    inputSearch() {
        this.tableList = [];
        if (this.searchVlue.length == 0) {
            this.SearchHot()
        } else {
            (this as any).$axios.post(Api.API.SearchCloudsearch + "?keywords=" + this.searchVlue).then((res: any) => {
                console.log(res.data.result.songs)
                this.tableList = res.data.result.songs
            })
        }
    };

    //热搜列表点击进行搜
    HotBtn(item: any) {
        this.searchVlue = item.first;
        this.inputSearch()
    };

    //判断歌曲是否有用
    playBtn(item: any, index: any) {
        (this as any).$axios.post(Api.API.CheckMusic + "?id=" + item.id).then((res: any) => {
            console.log('12123')
            console.log(res.data)
            if (res.data.success == true) {
                this.$store.state.songId = item.id;
            } else {
                this.$toast.fail(res.data.message);
            }
        })
    };

}
</script>

<style lang="scss" scoped>
#Search {
    .HotClass {
        list-style: none;
        padding: 10px 12px;

        li {
            color: #999999;
            padding: 0.5rem 0.5rem;

            span:first-child {
                margin-right: 1rem;
            }
        }
    }
}
</style><style lang="scss">
#Search {
    .van-search__content {
        background: rgba(72, 72, 85, .6) !important;
    }

    .van-field__control {
        color: white;
    }
}
</style>
