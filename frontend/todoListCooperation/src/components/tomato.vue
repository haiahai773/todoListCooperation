<template>
  <div class="tomato-warpper">
    <div class="tomato-prompt">番茄学习</div>
    <div class="tomato-countdown">
      {{ minutes }} : {{ seconds < 10 ? "0" + seconds : seconds }}
    </div>
    <div class="tomato-button">
      <el-button @click="doAsync()">{{ status }}</el-button>
      <el-button @click="reset()" v-show="flag == 2">中止</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { toast, type ToastOptions } from "vue3-toastify";

//0表示未开始状态(开始) 1表示开始计时状态(暂停) 2表示暂停状态(中止|继续)
const flag = ref<number>(0);

const status = ref<string>("开始");

// 定义总秒数，25分钟 * 60秒
const totalSeconds = ref(25 * 60);
// 分钟
const minutes = ref(0);
// 秒
const seconds = ref(0);
// 停止器
var stop: number = 0;

const changeStatus = () => {
  flag.value = (flag.value + 1) % 3;

  if (flag.value == 0) {
    status.value = "开始";
  } else if (flag.value == 1) {
    status.value = "暂停";
  } else {
    status.value = "继续";
  }
};

// 初始化
minutes.value = Math.floor(totalSeconds.value / 60);
seconds.value = totalSeconds.value % 60;

// 更新分钟和秒的函数
const updateTimer = () => {
  minutes.value = Math.floor(totalSeconds.value / 60);
  seconds.value = totalSeconds.value % 60;
};

// 倒计时函数
const countdown = () => {
  if (totalSeconds.value > 0) {
    totalSeconds.value--;
    updateTimer();
  } else {
    clearInterval(stop);
    flag.value = 0; // 倒计时结束，重置标志位
  }
};

console.log(flag.value);
const countdownHandler = () => {
  //修改后为1，说明之前是0，按下后应当开始计时
  console.log(flag.value, status.value);

  if (flag.value == 1) {
    updateTimer();
    stop = setInterval(countdown, 1000);
  }

  //修改后为2，说明之前是1，按下后应当停止计时
  else if (flag.value == 2) {
    clearInterval(stop);
  }

  //修改后是0，说明之前是2，按下后应该继续
  else {
    //回到暂停状态
    flag.value = 1;
    countdown();
  }
};

const reset = () => {
  totalSeconds.value = 25 * 60;
  updateTimer();
  flag.value = 0;
  status.value = "开始";
};

const doAsync = async () => {
  await changeStatus();
  await countdownHandler();
};
</script>

<style scoped lang="scss">
.tomato-warpper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column nowrap;
  height: 100%;
  width: 100%;
  // background-color: aqua;

  .tomato-prompt {
    font-size: 3rem;
  }

  .tomato-countdown {
    font-size: 5rem;
    margin: 5%;
  }

  .el-button {
    width: 240px;
    height: 48px;
    font-size: 2rem;
  }
}
</style>
