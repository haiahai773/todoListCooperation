<template>
  <div class="quation-warpper">
    <div class="quation-top">
      <div class="quation-topleft quation">
        <div class="prompt">重要且紧急</div>
        <div class="list" ref="TL">
          <div
            class="list-list__item"
            v-for="(item, index) in Quation.topleftList"
            :key="item.todo_id"
          >
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
      <div class="quation-topright quation">
        <div class="prompt">重要不紧急</div>
        <div class="list" ref="TR">
          <div
            class="list-list__item"
            v-for="(item, index) in Quation.topRightList"
            :key="item.todo_id"
          >
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
    <div class="quation-bottom">
      <div class="quation-bottomleft quation">
        <div class="prompt">紧急不重要</div>
        <div class="list" ref="BL">
          <div
            class="list-list__item"
            v-for="(item, index) in Quation.bottomleftList"
            :key="item.todo_id"
          >
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
      <div class="quation-bottomright quation">
        <div class="prompt">不紧急不重要</div>
        <div class="list" ref="BR">
          <div
            class="list-list__item"
            v-for="(item, index) in Quation.bottomRightList"
            :key="item.todo_id"
          >
            <!-- <el-checkbox v-model="Quation.bottomRightList[index].is_checked" @change="doneChange(Quation.bottomRightList, Todo.doneList, index)"></el-checkbox> -->
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useURLStore } from "@/stores/URL";
import { useTodoStore } from "@/stores/todo";
import { useQuationStore } from "@/stores/quation";
import moment from "moment";
import { toast, type ToastOptions } from "vue3-toastify";
import { useDraggable } from "vue-draggable-plus";

import { type todoEvent } from "@/interface/interface";

const Todo = useTodoStore();
const Quation = useQuationStore();
const URL = useURLStore();

const TL = ref();
const TR = ref();
const BL = ref();
const BR = ref();

//多框拖拽
useDraggable(TL, Quation.topleftList as any, {
  animation: 150,
  ghostClass: "ghost",
  group: "people",
});

useDraggable(TR, Quation.topRightList as any, {
  animation: 150,
  ghostClass: "ghost",
  group: "people",
});

useDraggable(BL, Quation.bottomleftList as any, {
  animation: 150,
  ghostClass: "ghost",
  group: "people",
});

useDraggable(BR, Quation.bottomRightList as any, {
  animation: 150,
  ghostClass: "ghost",
  group: "people",
});

const doneChange = (
  target: Array<todoEvent>,
  nextTarget: Array<todoEvent>,
  index: number,
) => {
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
  //隐藏通过v-show来实现，绑定自己的is_checked属性
};
</script>

<style scoped lang="scss">
.prompt {
  width: 100%;
  font: 1rem;
}

.quation {
  display: flex;
  flex-flow: column nowrap;
  border: 1px solid #ccc;
  padding: 4px 8px;
}

.list {
  flex: 1;
  // background-color: aqua;
}

.list-list__item {
  cursor: pointer;
  display: flex;
  flex-flow: row, nowrap;
  align-items: center;
  height: 36px;
  // background-color: aqua;
  margin: 8px 0px;
  border-radius: 12px;
  box-shadow: 1px 1px 8px 1px #ccc;
  padding-left: 12px;

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

.quation-warpper {
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  border: 1px solid #ccc;
  padding: 12px 12px;

  .quation-top {
    display: flex;
    flex: 1;

    .quation-topleft {
      flex: 1;
    }

    .quation-topright {
      flex: 1;
    }
  }

  .quation-bottom {
    display: flex;
    flex: 1;

    .quation-bottomleft {
      flex: 1;
    }

    .quation-bottomright {
      flex: 1;
    }
  }
}
</style>
