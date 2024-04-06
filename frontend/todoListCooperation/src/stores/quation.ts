import { defineStore } from "pinia";
import { type todoEvent } from "@/interface/interface";

export const useQuationStore = defineStore(
  "todo",
  () => {
    let topleftList: Array<todoEvent> = [];
    let topRightList: Array<todoEvent> = [];
    let bottomleftList: Array<todoEvent> = [];
    let bottomRightList: Array<todoEvent> = [];

    return {
      topleftList,
      topRightList,
      bottomleftList,
      bottomRightList,
    };
  },
  {
    persist: true,
  },
);
