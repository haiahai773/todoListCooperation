<template>
    <div class="flex flex-col-reverse">
        <div
            class="relative flex flex-row items-center border px-2 text-sm text-gray-500"
            v-for="(item, index) in listConfig.list"
            :key="item.todo_id"
        >
            <el-checkbox
                size="large"
                v-model="item.is_checked"
                @change="doneTodo()"
            />
            <div class="">{{ item.event_name }}</div>
            <div class="">{{ item.orga_name }}</div>
            <div class="absolute right-0">
                {{ moment(item.start_time).format("MM.DD") }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import type { todoEvent } from "@/interface/interface";
import moment from "moment";

const props = defineProps({
    list: Array<todoEvent>,
});

console.log(props.list);

//传入数组，将数组中的元素渲染出来，并且支持发送请求
const listConfig = reactive({
    list: props.list as Array<todoEvent>,
});

const doneTodo = () => {};
</script>

<style scoped></style>
