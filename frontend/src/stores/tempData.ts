import { defineStore } from "pinia";
import { ref } from "vue";

export const useTempDataStore = defineStore(
    "tempData",
    () => {
        let tempLoginAccount = ref("");
        let tempLoginPassword =ref("");

        let tempRegUserName = ref("");
        let tempRegAccount = ref("");
        let tempRegPassword = ref("");


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
