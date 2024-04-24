<template>
    <div class="w-sreenh-screen bg-blue-300">
        <div
            class="container mx-auto flex h-screen w-screen items-center justify-center"
        >
            <div
                class="2xl:max-h-1024-['px'] container mx-4 hidden h-3/4 rounded-xl bg-slate-100 bg-login-bg bg-cover xl:block"
            ></div>
            <div
                class="container mx-4 flex h-3/4 flex-col justify-between rounded-xl bg-slate-100 px-8"
            >
                <div class="flex flex-col gap-8">
                    <div
                        class="flex items-center justify-center gap-4 border-b-2 border-gray-300"
                    >
                        <div class="my-4 h-12 w-40 text-xl font-thin">
                            <button
                                class="h-full w-full text-2xl text-gray-500 hover:font-normal hover:text-gray-800 active:text-black"
                                @click="toLoign()"
                            >
                                登录
                            </button>
                        </div>
                        <div class="h-12 w-40 text-xl font-thin">
                            <button
                                class="h-full w-full border-l-2 border-gray-300 text-2xl text-gray-500 hover:font-normal hover:text-gray-800"
                                @click="toReg()"
                            >
                                注册
                            </button>
                        </div>
                    </div>
                    <div class="flex flex-col gap-8" v-show="switchFlag">
                        <div>
                            <div
                                class="text-base font-thin before:relative before:top-0.5 before:text-center before:text-red-500 before:content-['*']"
                            >
                                账号:
                            </div>
                            <el-input
                                v-model="tempDateStore.tempLoginAccount"
                                class="h-12 w-full"
                                placeholder="请输入账号"
                            ></el-input>
                        </div>
                        <div>
                            <div
                                class="text-base font-thin before:relative before:top-0.5 before:text-center before:text-red-500 before:content-['*']"
                            >
                                密码:
                            </div>
                            <el-input
                                v-model="tempDateStore.tempLoginPassword"
                                class="h-12 w-full"
                                placeholder="请输入密码"
                                type="password"
                                show-password
                            ></el-input>
                        </div>
                    </div>
                    <div class="flex flex-col gap-8" v-show="!switchFlag">
                        <div>
                            <div
                                class="text-base font-thin before:relative before:top-0.5 before:text-center before:text-red-500 before:content-['*']"
                            >
                                用户名:
                            </div>
                            <el-input
                                v-model="tempDateStore.tempRegUserName"
                                class="h-12 w-full"
                                placeholder="请输入用户名"
                            ></el-input>
                        </div>
                        <div>
                            <div
                                class="text-base font-thin before:relative before:top-0.5 before:text-center before:text-red-500 before:content-['*']"
                            >
                                账号:
                            </div>
                            <el-input
                                v-model="tempDateStore.tempRegAccount"
                                class="h-12 w-full"
                                placeholder="请输入账号"
                            ></el-input>
                        </div>
                        <div>
                            <div
                                class="text-base font-thin before:relative before:top-0.5 before:text-center before:text-red-500 before:content-['*']"
                            >
                                密码:
                            </div>
                            <el-input
                                v-model="tempDateStore.tempRegPassword"
                                class="h-12"
                                placeholder="请输入密码"
                                type="password"
                                show-password
                            ></el-input>
                        </div>
                    </div>
                </div>
                <button
                    class="bottom-0 my-3 mb-8 h-12 w-full rounded-lg bg-blue-400 text-white shadow-sm hover:bg-blue-300"
                    @click="switchFlag ? loginSubmit() : regSubmit()"
                >
                    提交
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useURLStore } from "../stores/URL";
import { useTempDataStore } from "../stores/tempData";
import { useUserStore } from "@/stores/user";
import JSEncrypt from "jsencrypt";
import { pubKey } from "@/stores/keys";

import axiosAPI from "@/components/api/axiosAPI";
import Notice from "@/components/api/toastAPI";

const tempDateStore = useTempDataStore()
const router = useRouter();
const URL = useURLStore();

const notify = () => {
    Notice.successNotice("欢迎来到待办事项");
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
    const rsaPassword = encryptor.encrypt(tempDateStore.tempLoginPassword);
    console.log(rsaPassword);

    let result = axiosAPI.userLogin(
        tempDateStore.tempLoginAccount,
        rsaPassword as string,
    );
    result.then(({ status, userId }) => {
        if (status == 200) {
            useUserStore().userId = userId;
            Notice.successNotice("登录成功");
            router.push("/user/list");
        } else if (status == 400) {
            Notice.errorNotice("账号或密码错误");
        } else {
            Notice.errorNotice("网络异常");
        }
    });
};

//注册
const regSubmit = () => {
    console.log(tempDateStore);

    //注册校验
    if (
        tempDateStore.tempRegAccount.length < 8 ||
        tempDateStore.tempRegAccount.length > 24 ||
        tempDateStore.tempRegAccount.length < 8 ||
        tempDateStore.tempRegPassword.length > 24
    ) {
        //提示账号不符合要求
        Notice.warnNotice("账号格式错误!");
        Notice.warnNotice("账号应为8~24位\n密码应为8~24位");
        return;
    }

    //用户名校验
    if (
        tempDateStore.tempRegUserName.length <= 1 ||
        tempDateStore.tempRegUserName.length > 8
    ) {
        Notice.warnNotice("用户名格式错误！");
        Notice.warnNotice("用户名应为2~8位");
        return;
    }

    //校验成功，发送注册请求
    let result = axiosAPI.userReg(
        tempDateStore.tempRegUserName,
        tempDateStore.tempRegAccount,
        tempDateStore.tempRegPassword,
    );
    console.log(result);
    result.then((status) => {
        if (status === 200) {
            Notice.successNotice("注册成功");
        } else if (status === 400) {
            Notice.errorNotice("账号已被注册");
        } else {
            Notice.errorNotice("网络异常");
        }
    });
};
</script>
