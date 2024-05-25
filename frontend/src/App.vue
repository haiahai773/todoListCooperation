<template>
    <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<style lang="scss">
* {
    box-sizing: border-box;
}
*::-webkit-scrollbar {
    display: none;
}

body,
html {
    height: 100vh;
    width: 100vw;
    padding: 0px;
    margin: 0px;
}
</style>
