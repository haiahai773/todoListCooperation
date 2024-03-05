<template>
    <div class="user-warpper">
        <div class="user-box">
            <div class="user-sidebar">
                <div class="user-sidebar__warpper">
                    <div class="user-list" @click="toPath('/user/list')"><el-icon class="icon">
                            <Tickets />
                        </el-icon>清单</div>
                    <div class="user-calendar" @click="toPath('/user/calendar')"><el-icon class="icon">
                            <Calendar />
                        </el-icon>日历</div>
                    <div class="user-quation" @click="toPath('/user/quation')"><el-icon class="icon">
                            <CollectionTag />
                        </el-icon>四象限</div>
                    <div class="user-tomato" @click="toPath('/user/tomato')"><el-icon class="icon">
                            <Timer />
                        </el-icon>番茄钟</div>
                </div>
                <div class="user-sidebar__user" @click="toPath('/login')">
                    <el-icon>
                        <Avatar color="" style=" width: 60%; height: 60%;" />
                    </el-icon>
                </div>
            </div>
            <div class="user-content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useURLStore } from "@/stores/URL"
import { useTodoStore } from "@/stores/todo"
import { toast, type ToastOptions } from "vue3-toastify"
import axios from "axios"

const URL = useURLStore()
const Todo = useTodoStore()

//自动为axios默认添加授权头
// axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`

//axios获取用户所有待办
axios.get(URL.userGetTodo,{
    headers:{
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
}).then((res) => {
    console.log(Todo.todoList)
    Todo.todoList = res.data.data
}).catch((err) => {
    console.log(err);
    
    toast("网络异常", {
        "theme": "auto",
        "type": "error",
        "transition": "slide",
        "dangerouslyHTMLString": true
    })
})

const router = useRouter()

const toPath = (path: string) => {
    router.push(path)
}
</script>

<style scoped lang="scss">
.icon {
    margin-right: 4px;
}

.user-warpper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    // background-image: radial-gradient(circle at top left, #00A9FF, #89CFF3, #A0E9FF, #57C5B6);

    .user-box {
        display: flex;
        height: 90%;
        width: 95%;

        >* {
            margin: 0px 24px;
        }

        .user-sidebar {
            display: flex;
            flex-flow: column nowrap;
            width: 200px;
            height: 100%;
            // background-color: #A0E9FF;
            // background-image: radial-gradient(circle at left top, #DDE6ED #9DB2BF);
            border-radius: 40px;
            box-shadow: 1px 1px 12px 1px #88888c;

            .user-sidebar__warpper {
                display: flex;
                flex-flow: column nowrap;
                justify-content: space-evenly;
                flex-flow: column nowrap;
                flex: 1;
                width: 100%;
                padding: 20px 0px;


                >* {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 80px;
                    margin: 16px 16px;
                    border-radius: 24px;
                    line-height: 1;
                    font-size: 24px;
                    // background-color: #00A9FF;
                    transition: .2s;
                    cursor: pointer;
                    box-shadow: 1px 1px 8px 1px #88888c;
                }

                >*:hover {
                    transition: .2s;
                    transform: scale(1.03);
                    box-shadow: 1px 1px 16px 1px rgb(59, 61, 74);
                }
            }

            .user-sidebar__user {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 200px;
                height: 200px;

                .el-icon {
                    width: 60%;
                    height: 60%;
                    border-radius: 50%;
                    box-shadow: 1px 1px 8px 1px #88888c;
                    transition: .5s;
                    cursor: pointer;
                }

                .el-icon:hover {
                    transition: .2s;
                    transform: scale(1.03);
                    box-shadow: 1px 1px 16px 1px rgb(59, 61, 74);
                }
            }
        }

        .user-content {
            flex: 1;
            height: 100%;
            background-color: #EEEEEE;
            border-radius: 40px;
            box-shadow: 1px 1px 8px 1px #88888c;
            padding: 20px;
            min-width: 800px;
        }
    }
}
</style>