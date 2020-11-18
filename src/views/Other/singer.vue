<template>
<div id="singer">
    <header id="header">
        <ul>
            <li v-for="(item,index) in singerType" :key="index" :class="{active:singerTypeIndex == index}" @click="singerTypeBtn(item,index)">
                <span>{{item.name}}</span>
            </li>
        </ul>

        <ul>
            <li v-for="(item,index) in singerArea" :key="index" :class="{active:singerAreaIndex == index}" @click="singerAreaBtn(item,index)">
                <span>{{item.name}}</span>
            </li>
        </ul>
    </header>

    <main>
        <van-index-bar>
            <div v-for="(item,index) in singerArray" :key="index" class="singerItem">
                <van-index-anchor :index="item.letter" style="color:red" />
                <van-cell v-for="items in item.Array" :key="items.id" :title="items.name" @click="DetailsSinger(items)" />
            </div>
        </van-index-bar>
    </main>
</div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'vue-property-decorator';
import Api from '../../api/api.js';
import Pinyin from '../../JS/ChinesePY.js';
@Component({})
export default class singer extends Vue {
    singerTypeIndex: number = 0;
    singerAreaIndex: number = 0;
    singerTypeId: any = -1;
    singerAreaId: any = -1;
    Page: number = 2;
    singerArray: Array < any > = [];
    singerType: Array < any > = [{
            name: '全部',
            id: '-1'
        },
        {
            name: '男歌手',
            id: '1'
        },
        {
            name: '女歌手',
            id: '2'
        },
        {
            name: '乐队',
            id: '3'
        }
    ];
    singerArea: Array < any > = [{
            name: '全部',
            id: '-1'
        },
        {
            name: '华语',
            id: '7'
        },
        {
            name: '欧美',
            id: '96'
        },
        {
            name: '日本',
            id: '8'
        },
        {
            name: '韩国',
            id: '16'
        },
        {
            name: '其他',
            id: '0'
        }
    ];
    mounted() {
        console.log('123')
        let a = '你';
        let b = Pinyin.GetHP(a);
        console.log(b)
        console.log(b.toLocaleUpperCase())
        this.details()

    };
    singerTypeBtn(item: any, index: number) {
        console.log(item)
        this.singerTypeIndex = index;
        this.singerTypeId = item.id;
        console.log(this.singerAreaId)
        this.details()
    };

    singerAreaBtn(item: any, index: number) {
        this.singerAreaIndex = index;
        this.singerAreaId = item.id;
        console.log(this.singerAreaId)
        this.details()
    };

    //详情
    details() {
        let listType: any = [];
        let CapitalLetters: any = [];
        let Children: Array < any > = [];
        this.singerArray = [];
        (this as any).$axios.post(Api.API.artistList, null, {
            params: {
                type: this.singerTypeId,
                area: this.singerAreaId,
                limit: this.Page * 30
            }
        }).then((res: any) => {
            console.log('111111')
            console.log(res.data)
            //获取数据并插入首字母
            res.data.artists.forEach((x: any) => {
                (this as any).$set(x, 'letter', Pinyin.GetHP(x.name).toLocaleUpperCase().substring(0, 1))
                listType.push(x)
                console.log('111111')
            })
            //获取首字母
            CapitalLetters = listType.map((x: any) => x.letter)
            //对首字母进行排序
            let compareFunction = (a: any, b: any) => {
                return a.localeCompare(b);
            }
            CapitalLetters.sort(compareFunction);
            //对首字母进行去重
            CapitalLetters = Array.from(new Set(CapitalLetters))
            console.log('123123')
            console.log(CapitalLetters)
            //重组数据
            CapitalLetters.forEach((x: any) => {
                Children = [];
                res.data.artists.forEach((y: any) => {
                    if (y.letter.indexOf(x) != -1) {
                        Children.push(y)
                        this.singerArray.push({
                            letter: x,
                            Array: Children
                        })
                    }
                })
            })
            //对象数组去重
            let obj: any = {};
            this.singerArray = this.singerArray.reduce((cur: any, next: any) => {
                obj[next.letter] ? "" : obj[next.letter] = true && cur.push(next);
                return cur;
            }, []);
        })
    };

    //跳转到歌手详情页
    DetailsSinger(items: any) {
        console.log(items)
        let list: any = {
            id: items.id,
            name: items.name,
            img: items.picUrl
        }
        this.$router.push({
            path: '/DetailsSinger',
            query: {
                list: JSON.stringify(list)
            }
        })
    }

}
</script>

<style lang="scss" scoped>
// #singer {
//     background: rgb(36, 41, 45);
//     height: 100vh;
// }

.active {
    background: #FF9900 !important;
}

#header {
    ul {
        list-style: none;
        display: flex;
        box-sizing: border-box;
        padding: 0.5rem 0.8rem;

        li {
            background: rgb(72, 72, 85);
            color: white;
            border-radius: 10px;
            padding: 0.2rem 0.6rem;
            font-size: 0.8rem;
            margin-right: 0.5rem;
        }
    }
}

main {

    .van-index-anchor,
    .van-cell {
        background: rgb(72, 72, 85) !important;
        color: white !important;
    }

    .singerItem:last-child {
        padding-bottom: 5rem;
    }
}
</style><style lang="scss">
#singer {
    .van-index-anchor {
        color: white;
    }

    .van-index-bar__sidebar {
        display: none;
    }
}
</style>
