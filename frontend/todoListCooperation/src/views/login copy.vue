<template>
  <div class="">
    <div class="login-warpper__box">
      <div class="login-logo"></div>
      <div class="login-box">
        <div class="login-switch">
          <div class="login-switch__login" @click="toLoign">登录</div>
          <div class="login-switch__reg" @click="toReg">注册</div>
        </div>
        <div class="login-login__warpper" v-show="switchFlag">
          <div class="login-login__prompt login-prompt__account">账号：</div>
          <el-input
            class="login-login__account login-login__input"
            v-model="TempData.tempLoginAccount"
            placeholder="账号"
          ></el-input>
          <div class="login-login__prompt">密码：</div>
          <el-input
            class="login-login__password login-login__input"
            v-model="TempData.tempLoginPassword"
            placeholder="密码"
            show-password
          ></el-input>
          <el-button
            class="login-login__submit"
            type="primary"
            @click="loginSubmit()"
            >登录</el-button
          >
        </div>
        <div
          class="login-login__warpper"
          style="display: none"
          v-show="!switchFlag"
        >
          <div class="login-login__prompt">用户名：</div>
          <el-input
            class="login-login__password login-login__input"
            v-model="TempData.tempRegUserName"
            placeholder="用户名"
          ></el-input>
          <div class="login-login__prompt login-prompt__account">账号：</div>
          <el-input
            class="login-login__account login-login__input"
            v-model="TempData.tempRegAccount"
            placeholder="账号"
          ></el-input>
          <div class="login-login__prompt">密码：</div>
          <el-input
            class="login-login__password login-login__input"
            v-model="TempData.tempRegPassword"
            placeholder="密码"
            show-password
          ></el-input>
          <el-button
            class="login-login__submit"
            type="primary"
            @click="regSubmit()"
            >注册</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useURLStore } from "../stores/URL";
import { useTempDataStore } from "../stores/tempData";
import { toast, type ToastOptions } from "vue3-toastify";
import JSEncrypt from "jsencrypt";
import { pubKey } from "@/stores/keys";

const router = useRouter();
const URL = useURLStore();
const TempData = useTempDataStore();

//弹窗
const notify = () => {
  toast("欢迎来到任务分配清单", {
    theme: "auto",
    type: "success",
    transition: "slide",
    dangerouslyHTMLString: true,
  });
};

//向用户问好
notify();

//如果已经登陆了（可以获取到token），则进入用户主页
onBeforeMount(() => {
  if (localStorage.getItem("token")) {
    // router.push("/user")
  }
});

//登录和注册切换
const switchFlag = ref<boolean>(true);
const toLoign = () => {
  switchFlag.value = true;
};
const toReg = () => {
  switchFlag.value = false;
};

//登录
const loginSubmit = () => {
  //创建实例对象
  const encryptor = new JSEncrypt();

  encryptor.setPublicKey(pubKey);
  const rsaPassword = encryptor.encrypt(TempData.tempLoginPassword);
  console.log(rsaPassword);

  axios
    .post(URL.userLogin, {
      account: TempData.tempLoginAccount,
      password: rsaPassword,
    })
    .then((res) => {
      //通过res.data.code判断是否登录成功
      if (res.data.code == 200) {
        //登录成功
        localStorage.setItem("token", res.data.token);
        toast("登录成功!", {
          theme: "auto",
          type: "success",
          transition: "slide",
          dangerouslyHTMLString: true,
        });
        //保存个人id
        localStorage.setItem("user_id", res.data.user_id);
        router.push("/user/list");
      } else {
        toast("账号或密码错误", {
          theme: "auto",
          type: "warning",
          transition: "slide",
          dangerouslyHTMLString: true,
        });
      }
      //将返回的token存入localStorage
    })
    .catch((error) => {
      toast("网络异常", {
        theme: "auto",
        type: "error",
        transition: "slide",
        dangerouslyHTMLString: true,
      });
    });
};

//注册
const regSubmit = () => {
  console.log(TempData);

  //注册校验
  if (
    TempData.tempRegAccount.length < 8 ||
    TempData.tempRegAccount.length > 24 ||
    TempData.tempRegAccount.length < 8 ||
    TempData.tempRegPassword.length > 24
  ) {
    console.log(
      TempData.tempRegAccount.length,
      TempData.tempLoginAccount.length,
    );

    //提示账号不符合要求
    toast("账号格式错误!", {
      theme: "auto",
      type: "warning",
      transition: "slide",
      dangerouslyHTMLString: true,
    });
    toast("账号应为8~24位\n密码应为8~24位", {
      theme: "auto",
      type: "info",
      transition: "slide",
      dangerouslyHTMLString: true,
    });
    return;
  }

  //用户名校验
  if (
    TempData.tempRegUserName.length <= 1 ||
    TempData.tempRegUserName.length > 8
  ) {
    toast("用户名格式错误！", {
      theme: "auto",
      type: "warning",
      transition: "slide",
      dangerouslyHTMLString: true,
    });
    toast("用户名应为2~8位", {
      theme: "auto",
      type: "info",
      transition: "slide",
      dangerouslyHTMLString: true,
    });
    return;
  }

  axios
    .post(URL.userReg, {
      user_name: TempData.tempRegUserName,
      account: TempData.tempRegAccount,
      password: TempData.tempRegPassword,
    })
    .then((res) => {
      if (res.data.code == 200) {
        //注册成功
        toast("注册成功", {
          theme: "auto",
          type: "success",
          transition: "slide",
          dangerouslyHTMLString: true,
        });
        //然后跳到登录界面
        toLoign();
      }
      if (res.data.code == 400) {
        toast("账号已被注册", {
          theme: "auto",
          type: "error",
          transition: "slide",
          dangerouslyHTMLString: true,
        });
      }
    })
    .catch((err) => {
      //网络错误
    });
};
</script>

<style scoped lang="scss">
// .login-warpper {
//     width: 100vw;
//     height: 100vh;
//     background-image: linear-gradient(to bottom, #CDF5FD, #A0E9FF, #89CFF3, #00A9FF);

//     .login-warpper__box {
//         margin: 0px auto;
//         position: relative;
//         display: flex;
//         width: 1024px;
//         height: 600px;
//         top: 10%;

//         >* {
//             width: 512px;
//             height: 100%;
//             margin: 0px 24px;
//         }

//         .login-logo {
//             border-radius: 24px;
//             background-image: url("./../assets/background.webp");
//             background-repeat: no-repeat;
//             background-position: center;
//             background-size: cover;
//             box-shadow: 1px 1px 24px 2px #ccc;
//         }

//         .login-box {
//             padding: 0px 24px;
//             display: flex;
//             flex-flow: column nowrap;
//             background-color: #FEFBF6;
//             border-radius: 24px;
//             box-shadow: 1px 1px 24px 2px #ccc;

//             // background-color: cadetblue;
//             .login-switch::after {
//                 position: absolute;
//                 content: "";
//                 width: 100%;
//                 left: 50%;
//                 bottom: 0px;
//                 transform: translateX(-50%);
//                 border-bottom: 1px solid #ccc;
//             }

//             .login-switch {
//                 position: relative;
//                 display: flex;
//                 height: 52px;
//                 margin: 8px 0px;

//                 >* {
//                     flex: 1;
//                     text-align: center;
//                     line-height: 52px;
//                     font-size: 1.5em;
//                     transition: .2s;
//                     cursor: pointer;
//                 }

//                 >*:hover {
//                     color: #40A2E3;
//                     transition: .2s;
//                 }

//                 .login-switch__login::after {
//                     position: absolute;
//                     left: 50%;
//                     top: 50%;
//                     transform: translateY(-50%);
//                     content: "";
//                     width: 0px;
//                     height: 80%;
//                     border-right: 1px solid #ccc;
//                 }
//             }

//             .login-login__warpper {
//                 position: relative;
//                 display: flex;
//                 flex-flow: column nowrap;
//                 flex: 1;
//                 padding-top: 20px;

//                 .login-login__prompt {
//                     margin-top: 24px;
//                     font-size: 1.2rem;
//                 }

//                 .login-login__input {
//                     margin-top: 4px;
//                     height: 40px;
//                 }

//                 .login-login__submit {
//                     position: absolute;
//                     left: 0px;
//                     bottom: 60px;
//                     width: 100%;
//                 }

//                 .el-button {
//                     height: 48px;
//                 }
//             }
//         }
//     }
// }
</style>
