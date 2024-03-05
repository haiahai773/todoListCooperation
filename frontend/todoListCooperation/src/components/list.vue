<template>
    <div class="list-warpper">
        <div class="list-add__warpper">
            <div class="list-add__time">时间</div>
            <el-input></el-input>
        </div>
        <div class="list-list__warpper">
            <div class="list-list__noDone">
                <div class="list-list__item" v-for="(item, index) in Todo.todoList" id="index">
                    <el-checkbox></el-checkbox>
                    <div class="item-name">
                        {{ item.event_name }}
                    </div>
                    <div class="item-source">
                        {{ item.orga_name }}
                    </div>
                    <div class="item-start">
                        {{ moment(item.start_time).format("MM.DD") }}
                    </div>
                </div>
            </div>
            <div class="list-list__done">
                <div class="list-done__extend">
                    <el-icon>
                        <ArrowRight />
                    </el-icon>
                    已完成:
                </div>
                <div class="list-list__item" v-for="(item, index) in Todo.todoList" id="index">
                    <el-checkbox></el-checkbox>
                    <div class="item-name">
                        {{ item.event_name }}
                    </div>
                    <div class="item-source">
                        {{ item.orga_name }}
                    </div>
                    <div class="item-start">
                        {{ moment(item.start_time).format("MM.DD") }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { reactive } from "vue"
import axios from "axios"
import { useURLStore } from "../stores/URL"
import { useTodoStore } from "../stores/todo"
import moment from "moment"

const Todo = useTodoStore()

</script>

<style scoped lang="scss">
.list-warpper {
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    height: 100%;
    // background-color: aqua;

    .list-add__warpper {
        display: flex;
        align-items: center;
        height: 80px;
        width: 100%;
        // background-color: bisque;

        .list-add__time {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 80px;
            height: 40px;
            // background-color: aqua;
            margin: 0px 12px;
            border-radius: 4px;
            box-shadow: 1px 1px 8px 1px #ccc;
        }

        .el-input {
            height: 40px;
            margin-left: 0px;
            margin-right: 12px;
            box-shadow: 1px 1px 8px 1px #ccc;

            .el-input__wrapper {
                border-radius: 24px;
            }
        }
    }

    .list-list__warpper::-webkit-scrollbar {
        display: none;
    }

    .list-list__warpper {
        display: flex;
        flex-flow: column nowrap;
        flex: 1;
        // background-color: burlywood;
        overflow: scroll;

        .list-list__noDone {
            width: 100%;
            // background-color: aliceblue;

            .list-list__item {
                display: flex;
                flex-flow: row, nowrap;
                align-items: center;
                height: 36px;
                // background-color: aqua;
                margin: 8px 12px;
                border-radius: 12px;
                box-shadow: 1px 1px 8px 1px #ccc;

                .el-checkbox {
                    margin-left: 8px;
                    width: 30px;
                    height: 30px;
                }

                .item-name {
                    flex: 1;
                    font-size: 0.8rem;
                }

                .item-source {
                    width: 30px;
                    font-size: 0.9rem;
                }

                .item-start {
                    width: 60px;
                    font-size: 0.9rem;
                }
            }
        }

        .list-list__done {

            .list-done__extend {
                // background-color: cadetblue;
                height: 20px;
                display: flex;
                align-items: center;
                margin: 4px 12px;
                padding: 12px 4px;
                font-size: 1rem;
                border-radius: 12px;
                // box-shadow: 1px 1px 8px 1px #ccc;
                // line-height: ;
            }

            .list-list__item {
                display: flex;
                flex-flow: row, nowrap;
                align-items: center;
                height: 36px;
                // background-color: aqua;
                margin: 8px 12px;
                border-radius: 12px;
                box-shadow: 1px 1px 8px 1px #ccc;

                .el-checkbox {
                    margin-left: 8px;
                    width: 30px;
                    height: 30px;
                }

                .item-name {
                    flex: 1;
                    font-size: 0.8rem;
                }

                .item-source {
                    width: 30px;
                    font-size: 0.9rem;
                }

                .item-start {
                    width: 60px;
                    font-size: 0.9rem;
                }
            }
        }
    }
}
</style>