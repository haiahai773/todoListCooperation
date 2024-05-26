<template>
    <div id="warpper" class="flex h-screen w-screen">
        <div
            id="sideBar"
            class="hidden flex-col justify-between bg-blue-400 lg:w-48 xl:flex xl:min-w-36"
        >
            <div class="flex w-full flex-col gap-4">
                <div class="h-32 w-full"></div>
                <div
                    class="flex h-16 w-full cursor-pointer items-center justify-start gap-4 shadow hover:bg-blue-500"
                    :class="flag == 0 ? 'bg-blue-500' : ''"
                    @click="toPath(0, 'list')"
                >
                    <el-icon className="w-8 ml-6"
                        ><Tickets color="#e0e0e0"
                    /></el-icon>
                    <div class="flex-1 text-lg font-bold text-gray-200">
                        清单
                    </div>
                </div>
                <div
                    class="flex h-16 w-full cursor-pointer items-center justify-start gap-4 border-gray-200 shadow hover:bg-blue-500"
                    :class="flag == 2 ? 'bg-blue-500' : ''"
                    @click="toPath(2, 'note')"
                >
                    <el-icon className="w-8 ml-6"
                        ><Memo color="#e0e0e0"
                    /></el-icon>
                    <div class="flex-1 text-lg font-bold text-gray-200">
                        笔记
                    </div>
                </div>
                <div
                    class="flex h-16 w-full cursor-pointer items-center justify-start gap-4 border-gray-200 shadow hover:bg-blue-500"
                    :class="flag == 4 ? 'bg-blue-500' : ''"
                    @click="toPath(4, 'tomato')"
                >
                    <el-icon className="w-8 ml-6"
                        ><Timer color="#e0e0e0"
                    /></el-icon>
                    <div class="flex-1 text-lg font-bold text-gray-200">
                        番茄钟
                    </div>
                </div>
            </div>
            <div class="my-12 flex h-32 items-center justify-center">
                <div
                    class="h-28 w-28 cursor-pointer rounded-full bg-white p-1 text-gray-200 ring-8 duration-100 hover:scale-105"
                >
                    <el-icon className="" style="overflow: hidden"
                        ><User color="rgb(96,165,250)"
                    /></el-icon>
                </div>
            </div>
        </div>
        <div id="content" class="flex h-full w-full flex-1 flex-col bg-white">
            <RouterView />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import { ref } from "vue";

import axiosAPI from "@/components/api/axiosAPI";
import toastAPI from "@/components/api/toastAPI";

//0表示清单 1表示日历 2表示笔记 3表示四象限 4表示番茄钟
let flag = ref(0);

let result = axiosAPI.getTodoList();
result.then((status) => {
    if (status === 200) {
        toastAPI.successNotice("成功获取待办事项");
    } else if (status === 401) {
        toastAPI.errorNotice("登录已失效");
    } else if (status === 400) {
        toastAPI.errorNotice("网络异常");
    }
});

const router = useRouter();

const toPath = (nextflag: number, path: string) => {
    flag.value = nextflag;
    router.push(path);
};
</script>

<style scoped lang="scss"></style>
