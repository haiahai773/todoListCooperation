import { defineStore } from "pinia";
import { type todoEvent } from "@/interface/interface";

export const useTodoStore = defineStore(
  "todo",
  () => {
    let todoList: Array<todoEvent> = [];
    let doneList: Array<todoEvent> = [];
    return {
      todoList,
      doneList,
    };
  },
  {
    persist: true,
  },
);
