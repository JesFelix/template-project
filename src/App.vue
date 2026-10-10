<template>
  <!--
    el-config-provider 负责 element-plus 内置文案（分页、空数据等）的语言；
    应用自己的文案走 vue-i18n，两者通过 locale 同步
  -->
  <el-config-provider :locale="elementPlusLocale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { elementPlusLocale } from "./locales";
</script>

<style lang="scss">
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--el-bg-color);
}
</style>
