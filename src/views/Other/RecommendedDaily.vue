<template>
  <div id="RecommendedDaily">
    <van-sticky>
      <header
        id="header"
        :style="{
          background: `url(${topImg}) no-repeat`,
          'background-size': 'cover'
        }"
      >
        <van-nav-bar title="" left-arrow @click-left="onClickLeft" />
        <h1>每日推荐</h1>
        <div class="playAll">
          <van-icon name="play-circle-o" size="19" />
          <p>播放全部</p>
        </div>
      </header>
    </van-sticky>

    <main id="main">
      <ul class="SongList">
        <li v-for="(item, index) in musicList" :key="index">
          <div class="left" @click="MusicBtn(item)">
            <img :src="item.al.picUrl" />
            <div>
              <p>
                <span>{{ item.name }}</span>
                <span>{{ item.alia[0] }}</span>
              </p>
              <p>
                <span>{{ item.ar[0].name }}</span>
                <span>-</span>
                <span>{{ item.al.name }}</span>
              </p>
            </div>
          </div>
          <div class="right">
            <van-icon
              name="eye-o"
              size="21"
              color="#999aaa"
              @click="details(item)"
            />
            <van-icon
              name="ellipsis"
              size="21"
              color="#999aaa"
              @click="PopupBtn(item)"
            />
          </div>
        </li>
      </ul>
    </main>
    <footer id="footer"><Play /></footer>
    <van-popup
      v-model="show"
      position="bottom"
      :style="{ height: '50%' }"
      id="wrap"
    >
      <h1 class="popupTitle">热门评论</h1>
      <ul class="Comments" style="overflow-y: auto;">
        <li v-for="(item, index) in CommentMusicList" :key="index">
          <img :src="item.user.avatarUrl" />
          <p>
            <span>{{ item.user.nickname }}</span>
            <span>{{ item.content }}</span>
          </p>
        </li>
      </ul>
    </van-popup>

    <van-popup
      v-model="simiSongShow"
      position="bottom"
      :style="{ height: '60%' }"
    >
       <h1 class="popupTitle">相似歌曲</h1>
       <ul class="simiSong">
          <li v-for="(item,index) in simiSongList" :key="index">
             <img :src="item.album.picUrl">
             <p>
               <span>{{item.name}}</span>
               <span>--</span>
               <span>{{item.artists[0].name}}</span>
             </p>
          </li>
       </ul>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import topImg from "../../assets/recommended.jpg";
import Api from "../../api/api.js";
import Play from "../../components/Play.vue";
@Component({
  components: {
    Play
  }
})
export default class RecommendedDaily extends Vue {
  topImg: any = topImg;
  musicList: any = {};
  show: boolean = false;
  CommentMusicList: Array<any> = [];
  CommentMusicIndex: number = 1;
  CommentMusicBefore: number = 0;
  CommentMusicId: any = "";
  simiSongShow: boolean = false;
  simiSongList:any = [];
  mounted() {
    // this.$nextTick(()=>{
    // // document.getElementById("wrap").addEventListener('scroll',this.scope);
    //    console.log(document.getElementById("wrap"))
    // });
    if (localStorage.getItem("usernameCookie")) {
      this.SongList();
    } else {
      this.routeBtn();
    }
  }

  //返回
  onClickLeft() {
    this.$router.go(-1);
  }

  //获取列表数据
  SongList() {
    (this as any).$axios
      .post(
        Api.API.recommendSongs +
          "?cookie=" +
          localStorage.getItem("usernameCookie")
      )
      .then((res: any) => {
        if (res.data.code == 200) {
          this.musicList = res.data.data.dailySongs;
        } else {
          this.musicList = {};
        }
      });
  }

  //跳转
  routeBtn() {
    this.$dialog
      .alert({
        message: "您还未登录，请先登录",
        theme: "round-button"
      })
      .then(() => {
        localStorage.setItem(
          "currentRoute",
          this.$router.currentRoute.fullPath
        );
        this.$router.push({
          path: "/Login"
        });
      });
  }

  //弹出
  async PopupBtn(item: any) {
    this.show = true;
    this.CommentMusicList = [];
    this.CommentMusicId = item.id;
    this.commentMusicBtn();
  }

  commentMusicBtn() {
    (this as any).$axios
      .post(
        Api.API.commentMusic +
          "?id=" +
          this.CommentMusicId +
          "&&limit=" +
          this.CommentMusicIndex * 20
      )
      .then((res: any) => {
        this.CommentMusicList = res.data.comments;
        if (res.data.total > 5000) {
          this.CommentMusicBefore = Math.ceil(5000 / 20);
        } else {
          this.CommentMusicBefore = Math.ceil(res.data.total / 20);
        }
      });
    5;
    setTimeout(() => {
      document.getElementById("wrap").addEventListener("scroll", this.scope);
    }, 100);
  }

  //滚轮滚动
  scope() {
    console.log("as");
    let scrollTop = document.querySelector("#wrap").scrollTop;
    let clientHeight = document.querySelector("#wrap").clientHeight;
    let scrollHeight = document.querySelector("#wrap").scrollHeight;
    // console.log(scrollTop)
    // console.log(clientHeight)
    // console.log(scrollHeight)
    if (scrollTop + clientHeight >= scrollHeight) {
      console.log(this.CommentMusicBefore);
      this.CommentMusicIndex++;
      console.log(this.CommentMusicIndex);
      if (this.CommentMusicIndex <= this.CommentMusicBefore) {
        console.log("111");
        this.commentMusicBtn();
      }
    }
  }

  //播放音乐 -- 判断音乐是否有用
  MusicBtn(item: any) {
    (this as any).$axios
      .post(Api.API.CheckMusic + "?id=" + item.id)
      .then((res: any) => {
        console.log("12123");
        console.log(res.data);
        if (res.data.success == true) {
          this.$store.state.songId = item.id;
        } else {
          this.$toast.fail(res.data.message);
        }
      });
  }

  //相似歌曲
  details(item: any) {
    this.simiSongShow = true;
    this.simiSongList = [];
    (this as any).$axios.post(Api.API.simiSong + "?id=" + item.id).then((res:any)=>{
      if(res.data.code == 200){
          this.simiSongList = res.data.songs
      }else{
         this.simiSongList = [];
      }
    })
  }
}
</script>

<style lang="scss" scoped>
#RecommendedDaily {
  #header {
    width: 100%;
    height: 13rem;
    background-size: cover;
    position: relative;
    display: flex;
    align-items: center;
    .van-nav-bar {
      position: absolute;
      top: 0;
      background: transparent;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
      padding: 0 0.5rem;
    }
    .playAll {
      background: white;
      display: flex;
      align-items: center;
      padding: 0.5rem;
      position: absolute;
      bottom: 0;
      width: 100%;
      border-top-right-radius: 20px;
      border-top-left-radius: 20px;
      box-sizing: border-box;
      p {
        padding: 0 0.5rem;
      }
    }
  }

  #main {
    .SongList {
      list-style: none;
      li {
        display: flex;
        padding: 0.3rem 0.5rem;
        .left {
          width: 85%;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          div {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            padding: 0.1rem 0.5rem;
            box-sizing: border-box;
            width: 85%;
          }
          img {
            width: 15%;
            height: 2.5rem;
            border-radius: 4px;
          }
          p {
            overflow: hidden; //内容溢出处理
            white-space: nowrap; //文字超出时不换行
            text-overflow: ellipsis; //文字溢出处理
          }
          p:first-child {
            font-size: 0.9rem;
            span:nth-child(2) {
              color: #999aaa;
              margin-left: 0.5rem;
            }
          }
          p:nth-child(2) {
            font-size: 0.6rem;
            color: #999aaa;
            span:nth-child(2) {
              padding: 0 0.3rem;
            }
          }
        }
        .right {
          width: 15%;
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
      }
    }
  }
.simiSong{
  list-style: none;
  margin-top: 2.5rem;
  li{
    display: flex;
    align-items: center;
    padding: 0.5rem;
    p{
      box-sizing: border-box;
      padding-left: 0.5rem;
      span:nth-child(2),span:nth-child(3){
        color: #999aaa;
        font-size: 0.9rem;
      }
      span:nth-child(2){
        padding: 0 0.3rem;
      }
    }
    img{
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
    }
  }
}
  #footer {
    position: fixed;
    width: 100%;
    bottom: 0;
  }

  .van-popup {
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
  }

  .popupTitle {
    text-align: center;
    font-size: 1.1rem;
    font-weight: 600;
    padding: 0.5rem 0;
    position: fixed;
    width: 100%;
    background: white;
  }

  .Comments {
    list-style: none;
    margin-top: 2.5rem;
    li {
      display: flex;
      box-sizing: border-box;
      padding: 0.3rem;
    }
    img {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
    }
    p {
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
      padding-left: 0.5rem;
      span {
        font-size: 0.9rem;
      }
      span:first-child {
        color: #808080;
      }
    }
  }
}
</style>

<style lang="scss">
#RecommendedDaily {
  .van-nav-bar__left {
    padding: 0 8px;
  }
  .right {
    .van-icon-ellipsis {
      transform: rotate(90deg);
    }
  }

  .van-icon-arrow-left {
    font-size: 1.4rem;
    color: white;
  }
}
</style>