import { defineStore } from "pinia";
import { type todoEvent } from "@/interface/interface";
import { ref } from "vue"

export const useTodoStore = defineStore(
    "todo",
    () => {
        let todoList = ref<Array<todoEvent>>([]);
        let doneList = ref<Array<todoEvent>>([]);
        return {
            todoList,
            doneList,
        };
    },
    {
        persist: true,
    },
);
