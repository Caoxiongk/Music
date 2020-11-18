<template>
<div id="VideoPlayback">
    <header>
        <van-nav-bar left-arrow @click-left="onClickLeft" />
        <div id="headerWatch">
            <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
        </div>
    </header>

    <main>
        <div class="Introduction">
            <h1>{{watchData.name}} ---- {{watchData.artistName}}</h1>
            <div class="giveLike">
                <p>
                    <van-icon name="good-job" />
                    <span> 点赞 ({{DetailInfoList.likedCount}})</span>
                </p>
                <p>
                    <van-icon name="chat" />
                    <span> 评论 ({{DetailInfoList.commentCount}})</span>
                </p>
                <p>
                    <van-icon name="share" />
                    <span> 转发 ({{DetailInfoList.shareCount}})</span>
                </p>
            </div>
        </div>

        <div class="comments">
            <van-sticky>
                <h1>热门评论 ({{commentsArray.length}})</h1>
            </van-sticky>
            <ul>
                <li v-for="(item,index) in commentsArray" :key="index">
                    <img :src="item.user.avatarUrl">
                    <div class="headerComment">
                        <div class="headerCommentOne">
                            <p>{{item.user.nickname}}</p>
                            <p style="display: flex;align-items: center;">
                                <span>{{item.likedCount}}</span>
                                <van-icon name="like-o" />
                            </p>
                        </div>
                        <p style="margin-top:0.3rem;font-size:0.9rem">
                            {{item.content}}
                        </p>
                    </div>
                </li>
            </ul>
        </div>
    </main>
</div>
</template>

<script>
import Api from '../../api/api.js';
export default {
    data() {
        return {
            watchId: this.$route.query.id,
            watchData: {},
            DetailInfoList: {},
            commentsArray: [],
            playerOptions: {
                autoplay: false, //如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [{
                    type: "", //这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
                    src: "" //url地址
                }],
                poster: "", //你的封面地址
                // width: document.documentElement.clientWidth, //播放器宽度
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                    timeDivider: true,
                    durationDisplay: true,
                    remainingTimeDisplay: false,
                    fullscreenToggle: false //全屏按钮
                }
            }
        }
    },

    mounted() {
        this.playBtn();
        this.address();
        this.DetailInfo();
        this.commentsBtn()
    },

    methods: {
        onClickLeft() {
            this.$router.go(-1)
        },

        //获取视频详情
        playBtn() {
            console.log(this.watchId)
            console.log(this.watchList)
            this.$axios.post(Api.API.detailMv + "?mvid=" + this.watchId).then(res => {
                console.log(res.data.data)
                this.watchData = res.data.data;
                this.playerOptions.poster = res.data.data.cover
            })
        },

        //获取播放地址
        address() {
            this.$axios.post(Api.API.mvUrl + "?id=" + this.watchId).then(res => {
                this.playerOptions.sources[0].src = res.data.data.url;
            })
        },

        //获取视频的点赞转发评论数
        DetailInfo() {
            this.$axios.post(Api.API.detailInfo + "?mvid=" + this.watchId).then(res => {
                console.log('123131')
                console.log(res.data)
                this.DetailInfoList = res.data;
            })
        },

        //获取视频全部评论数
        commentsBtn() {
            this.$axios.post(Api.API.commentMV + "?id=" + this.watchId).then(res => {
                console.log('aaaaaaaaa')
                this.commentsArray = res.data.hotComments;
            })
        }
    }
}
</script>

<style lang="scss" scoped>
header {

    .van-nav-bar {
        position: absolute;
        background: transparent;
        z-index: 333;
    }

    #headerWatch {
        position: relative;
        top: 0;
        width: 100%;
    }
}

.Introduction {
    box-sizing: border-box;
    padding: 0.5rem;

    h1 {
        font-size: 1rem;
        font-weight: 600;
    }

    .giveLike {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 0.5rem;

        p {
            display: flex;
            align-items: center;

            .van-icon {
                font-size: 1.2rem;
                color: #999;
                margin-right: 0.1rem;
            }
        }
    }
}

.comments {
    box-sizing: border-box;
    padding: 0 0.5rem;
    margin-top: 0.5rem;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;

    h1 {
        font-size: 1rem;
        font-weight: 600;
        text-align: center;
    }

    ul {
        list-style: none;

        img {
            width: 10%;
            height: 10%;
            border-radius: 50%;
        }

        li {
            display: flex;
            margin-top: 0.8rem;
        }

        .headerComment {
            width: 90%;
            box-sizing: border-box;
            padding: 0 0.5rem;

            .headerCommentOne {
                display: flex;
                justify-content: space-between;

                .van-icon {
                    font-size: 1rem;
                    margin-left: 0.1rem;
                }

                p:first-child {
                    color: #3182bd;
                    font-size: 0.9rem;
                }

                p:nth-child(2) {
                    font-size: 0.9rem;
                }
            }
        }
    }
}
</style><style lang="scss">
#VideoPlayback {
    background: white;

    .van-icon-arrow-left {
        color: white;
        font-size: 1.3rem;
    }
}
</style>
