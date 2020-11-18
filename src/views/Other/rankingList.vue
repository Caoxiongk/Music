<template>
<div id="rankinglist">
    <h1>云音乐歌手榜(每天更新)</h1>
    <ul class="rankinglistTitle">
        <li v-for="(item,index) in topList" :key="index" @click="Btn(item)">
            <img :src="item.coverImgUrl">
            <p>
                <span>{{item.name}}</span>
                <span>{{item.description}}</span>
            </p>
        </li>
    </ul>

    <van-popup v-model="show" :style="{ height: 'auto',width:'85%'}" class="popup">
        <p class="popupValue">
            <span>榜单前三</span>
            <van-icon name="fire" />
        </p>
        <ul class="rankinglistValue">
            <li v-for="(item,index) in ContentSong.tracks" :key="index" @click="PlayBtns(item)">
                <div class="vanIcon">
                    <van-icon name="award" color="#FF0033" v-if="index == 0" />
                    <span v-if="index !=0">{{index}}</span>
                </div>
                <p>
                    <span>{{item.first}}</span>
                    <span>---</span>
                    <span>{{item.second}}</span>
                </p>
            </li>
        </ul>
    </van-popup>
</div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'vue-property-decorator';
import Api from '../../api/api.js';
import axios from 'axios';
@Component({})
export default class rankinglist extends Vue {
    topList: Array < any > = [];
    ContentSong: any = {};
    show: boolean = false;
    mounted() {
        this.topListBtn();
    };

    //获取所有的榜单
    topListBtn() {
        (this as any).$axios.post(Api.API.topList).then((res: any) => {
            console.log('111')
            console.log(res.data)
            this.topList = res.data.list
        })
    };

    //获取对应榜单的前三的歌曲
    Btn(item: any) {
        let ContentSong = [];
        this.ContentSong = {};
        console.log('dd')
        console.log(item);
        (this as any).$axios.post(Api.API.toplistDetail).then((res: any) => {
            if (res.data.code == 200) {
                ContentSong = res.data.list.filter((x: any) => {
                    return x.name == item.name
                })
                this.ContentSong = ContentSong[0];
                if (this.ContentSong.tracks != 0) {
                    this.show = true
                } else {
                    this.$notify({
                        type: 'danger',
                        message: '暂无数据'
                    });
                }
            }

        })
    };

    //播放
    PlayBtns(item: any) {
        console.log(item)
    }

}
</script>

<style lang="scss" scoped>
h1 {
    text-align: center;
    font-size: 1.1rem;
    color: #FF9900;
    letter-spacing: 5px;
    padding: 0.5rem 0;
}

.rankinglistTitle {
    list-style: none;
    background: rgba(36, 41, 46, 1);

    li {
        display: flex;
        height: 5rem;
        margin-top: 0.5rem;

        p {
            width: 77%;
            height: 100%;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            padding: 0.5rem 0.3rem;

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
                margin-top: 0.4rem;
            }
        }

        img {
            width: 23%;
            height: 100%;
        }
    }

    li:last-child {
        padding-bottom: 5rem;
    }
}

.popup {
    padding: 0.7rem 0.7rem;

    .popupValue {
        font-size: 1.1rem;
        color: red;
        font-weight: 700;
        display: flex;
        justify-content: center;
        align-items: center;
        letter-spacing: 3px;
    }

    .rankinglistValue {
        list-style: none;

        li {
            display: flex;
            align-items: center;
            margin-top: 0.3rem;
        }

        .vanIcon {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 0.5rem;
            width: 13%;

            .van-icon {
                font-size: 2rem;
            }

            span {
                font-weight: 700;
                font-size: 1.4rem;
                color: #FF9900;
            }
        }

        p {
            width: 87%;

            span {
                font-size: 1rem;
            }

            span:nth-child(2) {
                padding: 0 0.3rem;
            }

            span:nth-child(3) {
                color: #999999;
                font-size: 0.9rem;
            }
        }
    }
}
</style>
