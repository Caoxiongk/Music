<template>
    <div id="RecommendedDaily">
       <header id="header" :style="{'background':`url(${topImg}) no-repeat`,'background-size':'cover'}">
            <van-nav-bar
                title=""
                left-arrow
                @click-left="onClickLeft"
                @click-right="onClickRight"
             />
             <h1>每日推荐</h1>
             <div class="playAll">
             <van-icon name="play-circle-o" size="19"/>
             <p>播放全部</p>
             </div>
       </header>

       <main id="main">
         <ul class="SongList">
           <li>
             <div class="left">
              <img :src="topImg">
              <div>
                <p>
                  <span>庸人自扰</span>
                  <span>得一人心</span>
                </p>
                <p>
                 <span>庸人自扰</span>\
                 <span>-</span>
                  <span>得一人心</span>
                </p>
              </div>
             </div>
             <div class="right">
             <van-icon name="music-o" size="21" color="#999aaa"/>
             <van-icon name="ellipsis" size="21" color="#999aaa"/>
             </div>
           </li>

                <li>
             <div class="left">
              <img :src="topImg">
              <div>
                <p>
                  <span>庸人自扰</span>
                  <span>得一人心</span>
                </p>
                <p>
                 <span>庸人自扰</span>\
                 <span>-</span>
                  <span>得一人心</span>
                </p>
              </div>
             </div>
             <div class="right">
             <van-icon name="music-o" size="21" color="#999aaa"/>
             <van-icon name="ellipsis" size="21" color="#999aaa"/>
             </div>
           </li>

                <li>
             <div class="left">
              <img :src="topImg">
              <div>
                <p>
                  <span>庸人自扰</span>
                  <span>得一人心</span>
                </p>
                <p>
                 <span>庸人自扰</span>\
                 <span>-</span>
                  <span>得一人心</span>
                </p>
              </div>
             </div>
             <div class="right">
             <van-icon name="music-o" size="21" color="#999aaa"/>
             <van-icon name="ellipsis" size="21" color="#999aaa"/>
             </div>
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
import topImg from '../../assets/recommended.jpg';

@Component({
    components: {},
})
export default class RecommendedDaily extends Vue {
    topImg:any = topImg;
}
</script>

<style lang="scss" scoped>
#RecommendedDaily{
#header{
width: 100%;
height: 13rem;
background-size:cover;
position: relative;
display: flex;
align-items: center;
.van-nav-bar{
    position: absolute;
    top: 0;
    background:transparent;
}
h1{
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
    padding: 0 0.5rem;
}
.playAll{
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
     p{
         padding: 0 0.5rem;
     }
}
}

#main{
    .SongList{
        list-style: none;
        li{
            display: flex;
            padding: 0.3rem 0.5rem;
            .left{
                width: 85%;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                div{
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                    padding: 0.1rem 0.5rem;
                    box-sizing: border-box;
                    width: 85%;
                }
                img{
                    width: 15%;
                    height: 2.5rem;
                    border-radius: 4px;
                }
                p{
                   overflow:hidden;//内容溢出处理
                    white-space:nowrap;//文字超出时不换行
                    text-overflow:ellipsis;//文字溢出处理
                }
                p:first-child{
                   font-size: 0.9rem;
                   span:nth-child(2){
                       color: #999aaa;
                       margin-left:0.5rem;
                   }
                }
                p:nth-child(2){
                    font-size: 0.7rem;
                     color: #999aaa;
                     span:nth-child(2){
                         padding:0 0.3rem;
                     }
                }
            }
            .right{
                width: 15%;
                display: flex;
                justify-content: space-around;
                align-items: center;
            }
        }
    }
}
}
</style>

<style lang="scss">
#RecommendedDaily{
.van-nav-bar__left{
        padding: 0 8px;
}
.right{
 .van-icon-ellipsis{
transform: rotate(90deg);
}
}

.van-icon-arrow-left{
    font-size: 1.4rem;
    color:white
}
}

</style>