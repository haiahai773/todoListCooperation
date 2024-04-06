<template>
  <el-calendar>
    <template #date-cell="{ data }">
      <p :class="data.isSelected ? 'is-selected' : ''">
        {{ data.day.split("-").slice(1).join(".") }}
        {{ data.isSelected ? "✔️" : "" }}
      </p>
    </template>
  </el-calendar>
</template>

<script setup lang="ts">
const data = {};
</script>

<style scoped lang="scss">
.is-selected {
  color: #1989fa;
}
</style>
