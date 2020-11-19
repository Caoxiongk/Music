<template>
<div id="MyLogin">
    <img :src="loginImg" alt="" id="loginImg">
    <ul id="MyLoginInput">
        <li>
            <van-field v-model="username" placeholder="请输入手机号码或者邮箱" />
        </li>
        <li>
            <van-field type="password" v-model="password" placeholder="请输入密码" />
        </li>
        <li>
            <van-button type="primary" color="linear-gradient(to right, #ff6034, #ee0a24)" @click="LoginBtn">登录</van-button>
        </li>
        <li class="RegisterNow">
            <span @click="forgetBtn()">忘记密码</span>
            <span @click="registered()">立即注册</span>
        </li>
    </ul>

    <van-popup v-model="showPopup" position="bottom" :style="{ height: 'auto' }" id="showPopup">
        <h2>{{topName}}</h2>
        <ul>
            <li>
                <van-field v-model="poPup.username" placeholder="请输入手机号码" />
            </li>
            <li>
                <van-field type="password" v-model="poPup.password" placeholder="请输入密码" />
            </li>
            <li>
                <van-field v-model="poPup.VerificationCode" placeholder="请输入验证码" />
                <van-button type="primary" @click="codeBtn()" v-if="codeStart == 30">发送验证码</van-button>
                <van-button type="primary" v-else>{{codeStart}}后在发送</van-button>
            </li>
            <li>
                <van-button type="primary" style="width:100%;line-height: 16px;padding: 10px 16px !important;height: auto;" @click="submitBtn()">提交</van-button>
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
import loginImg from '../../assets/default.png';
import Api from '../../api/api.js';
@Component({})
export default class MyLogin extends Vue {
    loginImg: any = loginImg;
    username: string = '';
    password: string = '';
    startIndex: number = 0;
    showPopup: boolean = false;
    topName: string = '忘记密码';
    codeStart: number = 30;
    timer: any = null;
    startName: string = '';
    poPup = {
        username: '',
        password: '',
        VerificationCode: '',
    }
    //登录
    LoginBtn() {
        let api = '';
        console.log(Api.API)

        if (this.username.indexOf('@') == 0) {
            api = Api.API.emailLogin + "?email=" + this.username + "&&password=" + this.password
        } else {
            api = Api.API.cellphone + "?phone=" + this.username + "&&password=" + this.password
        };
        console.log(api);
        if (this.username && this.password) {
            (this as any).$axios.post(api).then((res: any) => {
                console.log(res.data)
                if (res.data.code == 200) {
                    this.$notify({
                        type: 'success',
                        message: '登录成功'
                    });
                    localStorage.setItem('usernameCookie', res.data.cookie);
                    localStorage.setItem('userId', res.data.account.id)
                    this.$router.push({
                        path: localStorage.getItem('currentRoute')
                    })
                } else {
                    this.$notify({
                        type: 'danger',
                        message: '登录失败'
                    });
                }

            })
        } else {
            this.$notify({
                type: 'danger',
                message: '请检查用户名或者密码是否填写正确'
            });
        }
    };

    //忘记密码
    forgetBtn() {
        this.showPopup = true;
        this.topName = '忘记密码';
        this.startName = "修改";
        this.poPup = {
            username: '',
            password: '',
            VerificationCode: '',
        }
    };

    //注册
    registered() {
        this.showPopup = true;
        this.topName = '注册账号';
        this.startName = "注册";
        this.poPup = {
            username: '',
            password: '',
            VerificationCode: '',
        }
    };

    //发送验证码
    codeBtn() {
        if (this.poPup.username) {
            (this as any).$axios.post(Api.API.captchaVerify + "?phone=" + this.poPup.username).then((res: any) => {
                if (res.data.code == 200) {
                    this.timer = setInterval(() => {
                        if (this.codeStart > 0) {
                            this.codeStart--;
                            console.log(this.codeStart)
                        } else {
                            this.codeStart = 30
                            this.clearSet();

                        }
                    }, 1000)
                }
            })
        } else {
            this.$notify({
                type: 'danger',
                message: '请检查手机号码是否已填写'
            });
        }
    };

    //清楚定时器
    clearSet() {
        clearInterval(this.timer);
    };

    //提交
    submitBtn() {
        //验证验证码是否正确
        if (this.poPup.username && this.poPup.password && this.poPup.VerificationCode) {
            (this as any).$axios.post(Api.API.captchaSent + "?phone=" + this.poPup.username + "&&captcha=" + this.poPup.VerificationCode).then((res: any) => {
                if (res.data.code == 200) {
                    this.registeredBtn()
                } else {
                    this.$notify({
                        type: 'danger',
                        message: '验证码错误'
                    });
                }
            })
        }
    };

    //registered
    registeredBtn() {
        (this as any).$axios.post(Api.API.captchaSent + "?phone=" + this.poPup.username + "&&password=" + this.poPup.password + "&&captcha=" + this.poPup.VerificationCode).then(res => {
            console.log(res.data)
            if (res.data.code == 200) {
                this.$notify({
                    type: 'success',
                    message: this.startName + '成功'
                });
                this.showPopup = false;
                this.poPup = {
                    username: '',
                    password: '',
                    VerificationCode: '',
                }
            } else {
                this.$notify({
                    type: 'danger',
                    message: this.startName + '失败'
                });
            }
        })
    }

}
</script>

<style lang="scss" scoped>
#MyLogin {
    background: url('../../assets/loginBgc.jpg') no-repeat;
    background-size: cover;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;

    #loginImg {
        width: 7rem;
        height: 7rem;
        border-radius: 50%;
        margin-top: 6rem;
        margin-bottom: 1rem;
    }

    #MyLoginInput {
        width: 100%;
        list-style: none;
        display: flex;
        flex-direction: column;
        align-items: center;

        li {
            width: 70%;
            margin-bottom: 1rem;

            .van-button {
                width: 100%;
            }
        }

        .RegisterNow {
            display: flex;
            justify-content: space-between;
            color: white;
        }
    }

    #showPopup {
        padding: 1rem 0.5rem;
        box-sizing: border-box;
        background: rgba(10, 10, 10, .5);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        h2 {
            margin-bottom: 1rem;
            color: white;
            text-align: center;
        }

        .van-field {
            line-height: 16px;
        }

        ul {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;

            li {
                width: 80%;
                margin-bottom: 1rem;
            }

            li:nth-child(3) {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .van-field {
                    line-height: 16px;
                    width: 50%;
                }

                .van-button {
                    line-height: 16px;
                    padding: 10px 16px !important;
                    height: auto;
                    width: 45%;
                }
            }
        }
    }
}
</style>
