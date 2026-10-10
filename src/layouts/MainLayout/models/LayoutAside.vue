<template>
  <el-aside :width="collapse ? '64px' : '220px'" class="layout-aside">
    <div class="layout-logo">
      <el-icon :size="22">
        <Monitor />
      </el-icon>
      <span v-show="!collapse" class="logo-text">管理后台</span>
    </div>
    <el-scrollbar class="menu-scrollbar">
      <el-menu
        class="layout-menu"
        :default-active="route.path"
        :collapse="collapse"
        :collapse-transition="false"
        router
      >
        <template v-for="item in menus" :key="item.path">
          <el-sub-menu v-if="item.children?.length" :index="item.path">
            <template #title>
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
              <el-icon><component :is="child.icon" /></el-icon>
              <template #title>{{ child.title }}</template>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="item.path">
            <el-icon><component :is="item.icon" /></el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { Monitor } from "@element-plus/icons-vue";
import { menus } from "./menus";

defineProps<{ collapse: boolean }>();

const route = useRoute();
</script>

<style lang="scss" scoped>
/* ---------- 侧边栏 ---------- */
.layout-aside {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #001529;
  transition: width 0.2s;

  .layout-logo {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 50px;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .menu-scrollbar {
    flex: 1;
    min-height: 0;
  }

  // 深色菜单主题（覆盖 element-plus 的 CSS 变量）
  .layout-menu {
    width: 100%;
    border-right: none;
    --el-menu-bg-color: #001529;
    --el-menu-text-color: #bfcbd9;
    --el-menu-hover-bg-color: #000c17;
    --el-menu-active-color: var(--el-color-primary);
    --el-menu-item-height: 48px;
    --el-menu-sub-item-height: 48px;
  }

  // 子菜单展开箭头颜色
  :deep(.el-sub-menu__icon-arrow) {
    color: #bfcbd9;
  }
}
</style>
