<template>
<div id="Play">

    <aplayer autoplay @ended="ended()" :music="{
        title:musicList.title ,
        author:musicList.author,
        url: musicList.url,
        pic: musicList.pic,
        }">
    </aplayer>
    <van-icon name="bars" @click="listBtns()" />
    <van-popup v-model="listStart" position="bottom" :style="{ height: '60%' }" id="Popup">
        <p>
            <span>顺序播放({{ArrayList.length}})首</span>
        </p>
        <ul>
            <li v-for="(item,index) in ArrayList" :key="index" :class="{active:currentIndex == index}" @click="historyBtn(item,index)">
                <span>{{item.song.name}}</span>
                <span>--</span>
                <span>{{item.song.ar[0].name}}</span>
            </li>
        </ul>
    </van-popup>
</div>
</template>

<script>
import Aplayer from 'vue-aplayer'
import Api from '../api/api.js';
import axios from 'axios';
export default {
    components: {
        Aplayer
    },
    data() {
        return {
            listStart: false,
            ArrayList: [],
            currentIndex: 0,
            songList: {},
            musicList: {
                title: 'Preparation',
                author: 'Hans Zimmer/Richard Harvey',
                url: 'http://devtest.qiniudn.com/Preparation.mp3',
                pic: 'http://devtest.qiniudn.com/Preparation.jpg',
            }
        }
    },

    mounted() {
        if (this.$store.state.songId) {
            this.detail()
        }
    },

    methods: {
        //获取播放记录
        listBtns() {
            this.currentIndex++
            if (localStorage.getItem('userId')) {
                this.listStart = true;
                this.$axios.post(Api.API.userRecord + '?uid=' + localStorage.getItem('userId')).then(res => {
                    console.log('这是播放记录')
                    console.log(res.data.allData)
                    this.ArrayList = res.data.allData
                })
            } else {

            }
        },

        // //获取详情和歌曲地址
        detail() {
            let Api1 = this.$axios.post(Api.API.songdetail + "?ids=" + this.$store.state.songId);
            let Api2 = this.$axios.post(Api.API.songUrl + "?id=" + this.$store.state.songId);
            axios.all([Api1, Api2]).then(axios.spread((allTask, allCity) => {
                this.musicList = {
                    title: allTask.data.songs[0].al.name,
                    author: allTask.data.songs[0].ar[0].name,
                    url: allCity.data.data.url,
                    pic: allTask.data.songs[0].al.picUrl,
                }
            }))
        },

        //选中变红
        historyBtn(item, index) {
            this.currentIndex = index;
            console.log(item)
            this.$store.state.songId = item.song.id;
        }

    },

    // watch: {
    //     'songList': {
    //         handler(newVal, oldVal) {
    //             // this.detail()
    //             console.log('执行了')
    //         },
    //         deep: true,
    //         // immediate: true,
    //     }
    // }
    watch: {
        '$store.state.songId': {
            handler(newval, oldval) {
                console.log('执行了ddd')
                this.detail()
            },
            deep: true
        }
    }
}
</script>

<style lang="scss" scoped>
.van-icon {
    position: absolute;
    right: 0;
    z-index: 3333;
    color: white;
    top: 0;
    font-size: 1.7rem;
    margin: 0.5rem;
    background: tr;
}

.active {
    background: #eaeaea;
}

#Popup {
    padding: 0rem 0.5rem;
    box-sizing: border-box;

    p {
        font-size: 1.1rem;
        font-weight: 700;
        border-bottom: 0.1rem solid #e6e6e6;
        padding: 1rem 0;
    }

    ul {
        list-style: none;
        margin-bottom: 5rem;

        li {
            padding: 0.6rem 0.5rem;
            border-bottom: 0.1rem solid #e6e6e6;
        }

        span:first-child {
            font-size: 1rem;
        }

        span:nth-child(2) {
            padding: 0 0.5rem;
        }

        span:nth-child(3) {
            font-size: 0.9rem;
            color: #999999
        }

    }
}
</style><style>
.aplayer {
    margin: 0px !important;
    background-color: rgba(72, 72, 85, 1) !important;
    position: relative;
    z-index: 3333;
}

.aplayer-title,
.aplayer-author,
.aplayer-ptime,
.aplayer-dtime {
    color: white !important;
}

.aplayer-controller .aplayer-time .aplayer-icon {
    display: none !important;
}

.aplayer-music {
    width: 88%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>
