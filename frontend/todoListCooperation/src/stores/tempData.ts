import { de } from "element-plus/es/locales.mjs";
import { defineStore } from "pinia";

export const useTempDataStore = defineStore(
  "tempData",
  () => {
    let tempLoginAccount = "";
    let tempLoginPassword = "";

    let tempRegUserName = "";
    let tempRegAccount = "";
    let tempRegPassword = "";

    return {
      tempLoginAccount,
      tempLoginPassword,
      tempRegAccount,
      tempRegUserName,
      tempRegPassword,
    };
  },
  {
    persist: true,
  },
);
