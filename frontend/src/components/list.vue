<template>
    <div
        class="mt-12 flex h-full w-full justify-center overflow-y-scroll rounded-lg bg-white"
    >
        <div class="container flex h-full w-full flex-col px-8">
            <div class="shadow-box flex flex-row justify-start rounded-xl pt-4">
                <div
                    class="crsor-pointer flex h-full w-64 items-center justify-center border-b-4 border-white py-2 text-lg text-gray-900 duration-100 hover:border-b-blue-500 hover:font-medium hover:text-gray-500"
                >
                    <div>全部</div>
                </div>
                <div
                    class="flex h-full w-64 cursor-pointer items-center justify-center border-b-4 border-white py-2 text-lg text-gray-900 duration-100 hover:border-b-blue-500 hover:font-medium hover:text-gray-500"
                >
                    <div>日</div>
                </div>
                <div
                    class="flex h-full w-64 cursor-pointer items-center justify-center border-b-4 border-white py-2 text-lg text-gray-900 duration-100 hover:border-b-blue-500 hover:font-medium hover:text-gray-500"
                >
                    <div>周</div>
                </div>
                <div
                    class="flex h-full w-64 cursor-pointer items-center justify-center border-b-4 border-white py-2 text-lg text-gray-900 duration-100 hover:border-b-blue-500 hover:font-medium hover:text-gray-500"
                >
                    <div>月</div>
                </div>
            </div>

            <div class="flex flex-row items-center shadow-lg">
                <el-input
                    class="h-12"
                    v-model="tempTodo.event_name"
                    @keydown.enter="submitTodo()"
                    placeholder="请输入任务："
                ></el-input>
                <el-button size="large" type="primary" @click="submitTodo()"
                    >添加</el-button
                >
            </div>

            <div class="flex flex-col overflow-y-scroll">
                <div
                    class="flex items-center"
                    @click="displayTodoListFlag = !displayTodoListFlag"
                >
                    <el-icon
                        ><ArrowDown
                            class="duration-300"
                            :class="displayTodoListFlag ? '' : ' -rotate-90'"
                    /></el-icon>
                    <div class="cursor-pointer font-medium hover:text-gray-500">
                        待完成
                    </div>
                </div>
                <div
                    class="flex flex-col overflow-y-scroll"
                    v-show="displayTodoListFlag"
                >
                    <listItem class="overflow-y-scroll" :list="Todo.todoList" />
                </div>

                <div
                    class="flex items-center"
                    @click="dispalyDoneListFlag = !dispalyDoneListFlag"
                >
                    <el-icon
                        ><ArrowDown
                            class="duration-300"
                            :class="dispalyDoneListFlag ? '' : ' -rotate-90'"
                    /></el-icon>
                    <div class="cursor-pointer font-medium hover:text-gray-500">
                        已完成
                    </div>
                </div>
                <div class="flex flex-col" v-show="dispalyDoneListFlag">
                    <div
                        class="relative flex flex-row items-center border px-2 text-sm text-gray-500"
                        v-for="(item, index) in Todo.doneList"
                    >
                        <el-checkbox
                            size="large"
                            v-model="Todo.doneList[index].is_checked"
                            @change="
                                doneChange(Todo.doneList, Todo.todoList, index)
                            "
                        />
                        <div class="">{{ item.event_name }}</div>
                        <div class="">{{ item.orga_name }}</div>
                        <div class="absolute right-0">
                            {{ moment(item.start_time).format("MM.DD") }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { reactive } from "vue";
import axios from "axios";
import { useURLStore } from "../stores/URL";
import { useTodoStore } from "../stores/todo";
import { useQuationStore } from "@/stores/quation";
import { useUserStore } from "@/stores/user";
import moment from "moment";

import { type TempTodo } from "../interface/interface";
import { type todoEvent } from "@/interface/interface";

import listItem from "@/components/components/listItem.vue";
import Notice from "@/components/api/toastAPI";
import axiosAPI from "./api/axiosAPI";
import { praseRawTodo } from "./api/todoAPI";
import toastAPI from "@/components/api/toastAPI";

const Todo = useTodoStore();
const URL = useURLStore();
const Quation = useQuationStore();
const User = useUserStore();

const displayTodoListFlag = ref(true);
const dispalyDoneListFlag = ref(false);
console.log(Todo.todoList);

onBeforeUnmount(() => {
    //获取新增部分，然后添加进Quatino.topleftList
    // let newCount = Todo.todoList.length - Quation.topleftList.length
    // let quationLength = Quation.topleftList.length
    // for(let i=0; i<newCount; i++){
    //     Quation.topleftList.push() = JSON.parse(JSON.stringify(Todo.todoList))[quationLength + i]
    // }
});

const tempTodo = reactive<TempTodo>({
    event_name: "",
    start_time: new Date().getTime(),
    is_checked: false,
    target_id: User.userId,
});

const submitTodo = () => {
    //如果事件名为空，则直接返回
    if (tempTodo.event_name.length <= 0) {
        return;
    }
    //事件名不为空，通过正则表达式匹配空格，规定格式：时间 事件名
    let parsedDate = praseRawTodo(tempTodo.event_name);
    //如果解析成功，praseResult是含有待办名称和开始时间的对象
    console.log(parsedDate);
    let result = axiosAPI.createTodo(
        tempTodo.event_name,
        User.userId as number,
        parsedDate as Date,
    );
    console.log(result);
    result.catch((status) => {
        if (status === 200) {
            Notice.successNotice("添加成功");
        } else {
            Notice.errorNotice("网络异常");
        }
    });

    //然后把新增项添加到Quation里
    Quation.topleftList.push(JSON.parse(JSON.stringify(tempTodo)));
};

//通过check-box完成待办 抽象函数，将target指定的值删除，添加到nextTaregt中，然后根据当前值判断使用哪一个接口
const doneChange = (
    target: Array<todoEvent>,
    nextTarget: Array<todoEvent>,
    index: number,
): void => {
    //如果当前的值为false，则undo待办
    if (target[index].is_checked == false) {
        axios
            .post(
                URL.userUndoTodo,
                {
                    todo_id: target[index].todo_id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
            )
            .catch((err) => {
                toastAPI.errorNotice("网络异常");
            });

        //undo待办后，添加
        target.splice(index, 1);
        return;
    }

    //如果当前的值为true，即完成待办
    axios
        .post(
            URL.userDoneTodo,
            {
                todo_id: target[index].todo_id,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            },
        )
        .catch((err) => {
            toastAPI.errorNotice("网络异常");
        });
    //完成待办，将待办添加到已完成里
    nextTarget.push(target[index]);
    //然后隐藏待办，而不是删除，这样下标index更好维护
    target.splice(index, 1);
    //隐藏通过v-show来实现，绑定自己的is_checked属性
};
</script>

<style scoped lang="scss">
.el-checkbox {
    width: 24px;
    height: 32px;
    .el-checkbox__inner {
        width: 32px;
        height: 32px;
    }
}

.el-collapse-item__header {
    font-size: 24px;
}

* {
    overflow: scroll;
}
</style>
