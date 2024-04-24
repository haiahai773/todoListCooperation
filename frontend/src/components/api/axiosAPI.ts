import axios from "axios";
import { useURLStore } from "@/stores/URL";
import { useTodoStore } from "@/stores/todo";

const URL = useURLStore();
const Todo = useTodoStore();

//用户注册
async function userReg(
    userName: string,
    userAccount: string,
    userPassword: string,
) {
    let status = -1;
    await axios
        .post(URL.userReg, {
            user_name: userName,
            account: userAccount,
            password: userPassword,
        })
        .then((res) => {
            if (res.data.code == 200) {
                //成功登录返回true
                status = 200;
            } else if (res.data.code == 400) {
                //账号已被注册
                status = 400;
            }
        })
        .catch((err) => {
            status = 500;
        });
    return status;
}
//用户登录

async function userLogin(userAccount: string, userPassword: string) {
    let status = -1;
    let userId = -1;
    await axios
        .post(URL.userLogin, {
            account: userAccount,
            password: userPassword,
        })
        .then((res) => {
            //通过res.data.code判断是否登录成功
            if (res.data.code == 200) {
                //登录成功
                localStorage.setItem("token", res.data.token);
                //返回用户id
                localStorage.setItem("user_id", res.data.user_id);
                userId = res.data.user_id;
                status = 200;
            } else {
                status = 400;
            }
            //将返回的token存入localStorage
        })
        .catch((error) => {
            status = 500;
        });

    //登陆后，默认携带token
    //自动为axios默认添加授权头
    axios.defaults.headers.common["Authorization"] =
        `Bearer ${localStorage.getItem("token")}`;

    return {
        status,
        userId,
    };
}

//创建待办
async function createTodo(
    todoName: string,
    userId: number,
    startTime: Date = new Date(),
) {
    console.log(userId);
    let status = -1;
    await axios
        .post(URL.userCreateTodo, {
            event_name: todoName,
            start_time: startTime,
            end_time: startTime,
            target_id: userId,
        })
        .then((res) => {
            status = 200;
        })
        .catch((err) => {
            status = 500;
        });
    return status;
}
//获取待办

async function getTodoList() {
    let status = -1;
    //确保有token
    if (!localStorage.getItem("token")) {
        return 401;
    }
    //axios获取用户所有待办
    await axios
        .get(URL.userGetTodo, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((res) => {
            Todo.todoList = res.data.data;
            status = 200;
        })
        .catch((err) => {
            console.log(err);
            console.log(400);
        });
    return status;
}
//完成待办

export default {
    userReg,
    userLogin,
    createTodo,
    getTodoList,
};
