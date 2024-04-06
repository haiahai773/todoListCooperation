<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<style lang="scss">
* {
  box-sizing: border-box;
  // overflow: hidden;
}

body,
html {
  height: 100vh;
  width: 100vw;
  padding: 0px;
  margin: 0px;
  overflow: hidden;
}
</style>
