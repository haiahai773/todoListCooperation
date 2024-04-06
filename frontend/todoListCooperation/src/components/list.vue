<template>
  <div class="list-warpper">
    <div class="list-add__warpper">
      <!-- <div class="list-add__time">时间</div> -->
      <el-input
        v-model="tempTodo.event_name"
        @keydown.enter="submmitTodo()"
        placeholder="回车添加事件"
      ></el-input>
    </div>
    <div class="list-list__warpper">
      <div class="list-list__noDone">
        <div
          class="list-list__item"
          v-for="(item, index) in Todo.todoList"
          :key="index"
        >
          <el-checkbox
            v-model="Todo.todoList[index].is_checked"
            @change="debouncedChange(Todo.todoList, Todo.doneList, index)"
          >
          </el-checkbox>
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
      <div class="list-done__extend">
        <el-icon>
          <ArrowRight />
        </el-icon>
        已完成:
      </div>
      <div class="list-list__done">
        <!-- 通过order属性实现倒叙 -->
        <div
          class="list-list__item"
          v-for="(item, index) in Todo.doneList"
          id="index"
        >
          <el-checkbox
            v-model="Todo.doneList[index].is_checked"
            @change="doneChange(Todo.doneList, Todo.todoList, index)"
          ></el-checkbox>
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
import { onMounted, onBeforeUnmount } from "vue";
import { reactive } from "vue";
import axios from "axios";
import { useURLStore } from "../stores/URL";
import { useTodoStore } from "../stores/todo";
import { useQuationStore } from "@/stores/quation";
import moment from "moment";
import { toast, type ToastOptions } from "vue3-toastify";
import { debounce } from "../components/api/debounce";

import { type TempTodo } from "../interface/interface";
import { type todoEvent } from "@/interface/interface";

const Todo = useTodoStore();
const URL = useURLStore();
const Quation = useQuationStore();

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
  target_id: Number(localStorage.getItem("user_id")),
});

const submmitTodo = () => {
  //如果事件名为空，则直接返回
  if (tempTodo.event_name.length <= 0) {
    return;
  }

  //事件名不为空，通过正则表达式匹配空格，规定格式：时间 事件名
  axios
    .post(URL.userCreateTodo, {
      event_name: tempTodo.event_name,
      start_time: 1709308800,
      end_time: 1709308800,
      target_id: tempTodo.target_id,
    })
    .then((res) => {
      console.log(tempTodo);
      //成功添加清空input
      tempTodo.event_name = "";
      //重新发送get请求，更新清单列表
      //axios获取用户所有待办
      axios
        .get(URL.userGetTodo, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          Todo.todoList = res.data.data;
        })
        .catch((err) => {
          console.log(err);

          toast("网络异常", {
            theme: "auto",
            type: "error",
            transition: "slide",
            dangerouslyHTMLString: true,
          });
        });
    })
    .catch((err) => {
      toast("网络异常", {
        theme: "auto",
        type: "error",
        transition: "slide",
        dangerouslyHTMLString: true,
      });
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
        toast("网络异常", {
          theme: "auto",
          type: "error",
          transition: "slide",
          dangerouslyHTMLString: true,
        });
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
      toast("网络异常", {
        theme: "auto",
        type: "error",
        transition: "slide",
        dangerouslyHTMLString: true,
      });
    });
  //完成待办，将待办添加到已完成里
  nextTarget.push(target[index]);
  //然后隐藏待办，而不是删除，这样下标index更好维护
  target.splice(index, 1);
  //隐藏通过v-show来实现，绑定自己的is_checked属性
};

const debouncedChange = (
  target: Array<todoEvent>,
  nextTarget: Array<todoEvent>,
  index: number,
) => {
  //如果当前的值为false，则undo待办
  //timer计时器标识
  console.log("触发事件：" + index);
  let timer: number | null = null(function t(
    target: Array<todoEvent>,
    nextTarget: Array<todoEvent>,
    index: number,
  ) {
    if (timer != null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      console.log("正式执行：" + index);
      doneChange(target, nextTarget, index);
      clearTimeout(timer as number);
      timer = null;
    }, 1000);
  })(timer, target, nextTarget, index);
};
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
      margin-left: 12px;
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

    .list-list__done {
      display: flex;
      flex-flow: column-reverse nowrap;

      .list-list__item {
        display: flex;
        flex-flow: row, nowrap;
        align-items: center;
        height: 36px;
        // background-color: aqua;
        margin: 8px 12px;
        border-radius: 12px;
        box-shadow: 1px 1px 8px 1px #ccc;
        transition: 0.5s;

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
