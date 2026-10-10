<template>
  <!--
    direction 必须显式声明：
    el-container 默认横向排列，它是通过「插槽子组件名是否为 ElHeader/ElFooter」
    来猜纵向的；aside/header 被封装成自定义组件后猜测会失效，导致布局错乱
  -->
  <el-container class="main-layout" direction="horizontal">
    <!-- 侧边栏 -->
    <LayoutAside :collapse="isCollapse" />

    <!-- 右侧主体 -->
    <el-container class="layout-body" direction="vertical">
      <!-- 顶栏 -->
      <LayoutHeader :collapse="isCollapse" @toggle="isCollapse = !isCollapse" />

      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LayoutAside from "./models/LayoutAside.vue";
import LayoutHeader from "./models/LayoutHeader.vue";

/** 侧边栏折叠状态：通过 props 下发给 aside/header，通过 header 的 toggle 事件更新 */
const isCollapse = ref(false);
</script>

<style lang="scss" scoped>
.main-layout {
  height: 100vh;
  overflow: hidden;
}

/* ---------- 内容区 ---------- */
.layout-main {
  display: flex;
  padding: 16px;
  overflow-y: auto;
  background-color: var(--el-bg-color-page);

  // 页面根元素：撑满可用宽度并整体居中（水平 + 垂直）
  // 内容超过可视区时 auto 边距会自动归零，回退为顶部对齐，不会裁剪
  > * {
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }
}
</style>
