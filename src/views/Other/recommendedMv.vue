<template>
  <div id="recommendedMv">
  <van-sticky>
    <header id="header">
      <van-nav-bar
        title="音乐MV"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />

      <van-tabs
        background="#24292e"
        title-inactive-color="#CCCCCC"
        title-active-color="#CCCCCC"
        color="#FF9900"
        v-model="activeIndex"
        @click="tableClick"
      >
        <van-tab v-for="(item, index) in tableList" :title="item" :key="index">
        </van-tab>
      </van-tabs>

      <ul class="label">
        <li v-for="(item, index) in headerList" :key="index" :class="{active:currIndex == index}" @click="lableBtn(item,index)">
          <span>{{ item }}</span>
        </li>
      </ul>
    </header>
  </van-sticky>
    <main>
      <ul class="mainList">
        <li v-for="(item,index) in AllArray" :key="index">
          <img :src="item.cover">
          <p>{{item.name}}</p>
          <p>{{item.artistName}}</p>
        </li>
        <li class="loading">
        <van-loading size="24px" v-if="loadingStart == true">加载中...</van-loading>
        </li>
      </ul>
    </main>
  </div>
</template>

<script>
import Api from "../../api/api.js";
export default {
  data() {
    return {
      tableList: ["全部", "最新", "网易出品", "推荐"],
      headerList: ["全部", "内地", "港台", "欧美", "日本", "韩国"],
      activeIndex:0,
      currIndex:0,
      currName:'',
      activeName:'',
      pageSize:30,
      AllArray:[],
      count:'',
      loadingStart:false,
    };
  },
  mounted(){
     this.AllBtn();
     window.onscroll = ()=>{
         this.scrope()
     }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },

    lableBtn(item,index){
        this.currIndex = index;
        this.activeName = item;
        this.pageSize = 30;
        this.AllArray = [];
        this.AllBtn()
    },

    //获取全部接口
    AllBtn(){
       let url = '';
       if(this.activeIndex == 0){
            url = Api.API.mvAll
       }else if(this.activeIndex == 1){
            url = Api.API.mvFirst
       }
       if(this.activeName == '全部'){
           this.activeName = '';
       }
       this.$axios.post(url + "?area=" + this.activeName + "&&limit=" + this.pageSize).then(res=>{
           this.AllArray = res.data.data;
           this.count = res.data.count;
       })
    },

    //网易出品接口
    exclusivercmdBtn(){
         this.$axios.post(Api.API.exclusivercmd + "?limit=" + this.pageSize).then(res=>{
           this.AllArray = res.data.data;
       })
    },


    //滑到底部获取数据
    scrope(){
    var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
    //变量windowHeight是可视区的高度
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    //变量scrollHeight是滚动条的总高度
    var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
           //滚动条到底部的条件
           if(scrollTop+windowHeight==scrollHeight){
            //写后台加载数据的函数 
            this.pageSize += 30;
            if(this.pageSize <= this.count || this.activeName == '网易出品'){
               this.loadingStart = true;
                setTimeout(()=>{
                  this.loadingStart = false;   
                  this.AllBtn()
                },2000)
            }      
          }   
    },

    //切换标签
    tableClick(){
        console.log(this.activeName)
        if(this.activeName == '全部' || this.activeName == '最新'){
        this.currIndex = 0;
        this.activeName = '';
        this.pageSize = 30;
        this.AllArray = [];
        this.AllBtn();
        }else if(this.activeName == '网易出品'){
               this.pageSize = 30;
               this.AllArray = [];
               this.exclusivercmdBtn();
        }

    }
  }
};
</script>

<style lang="scss" scoped>
#recommendedMv {
  width: 100%;
  min-height: 100vh;
  background: rgb(36, 41, 46);
  #header{
       background: rgb(36, 41, 46);
  }
  .active{
      background:#FF9900!important;
  }
  .van-nav-bar {
    background: rgb(36, 41, 46);
  }
  .label {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 0.8rem 1.5rem;
    li {
      color: white;
      border-radius: 10px;
      padding: 0.2rem 0.6rem;
      font-size: 0.8rem;
      margin-right: 0.55rem;
      background: #484855;
    }
  }
  .mainList{
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      li{
          width: 50%;
          box-sizing: border-box;
          padding: 0.5rem 0.5rem;
          img{
              width: 100%;
              height: 7rem;
          }
          p{
              color: white;
              overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1; /*行数*/
             line-height: 1.4rem;
          }
      }
  }
  .loading{
      width: 100%!important;
      display: flex;
      justify-content: center;
  }
}
</style>

<style lang="scss">
#recommendedMv {
  .van-nav-bar__title,
  .van-nav-bar__text,
  .van-icon-arrow-left {
    color: white;
  }
  .van-hairline--bottom::after {
    border-bottom-width: 0px;
  }
}
</style>