import "./assets/style.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";
import Elementplus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import vue3Toastify from "vue3-toastify";
import type { ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

const pinia = createPinia();

pinia.use(
  createPersistedState({
    storage: sessionStorage,
  }),
);

app.use(pinia);
app.use(router);
app.use(Elementplus);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(vue3Toastify, {
  autuClose: 3000,
} as ToastContainerOptions);

app.mount("#app");
