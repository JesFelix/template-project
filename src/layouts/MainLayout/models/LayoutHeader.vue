<template>
  <el-header class="layout-header" height="50px">
    <div class="header-left">
      <el-icon class="collapse-btn" @click="emit('toggle')">
        <Expand v-if="collapse" />
        <Fold v-else />
      </el-icon>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="(item, index) in breadcrumbs"
          :key="item.path"
          :to="index === breadcrumbs.length - 1 ? undefined : item.path"
        >
          {{ item.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="header-right">
      <el-tooltip content="主题设置" placement="bottom">
        <el-icon
          class="header-action"
          :class="{ active: route.path === '/theme' }"
          @click="goTo('/theme')"
        >
          <Brush />
        </el-icon>
      </el-tooltip>
      <el-tooltip content="系统设置" placement="bottom">
        <el-icon
          class="header-action"
          :class="{ active: route.path === '/settings' }"
          @click="goTo('/settings')"
        >
          <Setting />
        </el-icon>
      </el-tooltip>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Brush, Expand, Fold, Setting } from "@element-plus/icons-vue";
import { menus } from "./menus";

defineProps<{ collapse: boolean }>();
const emit = defineEmits<{ toggle: [] }>();

const route = useRoute();
const router = useRouter();

/** 面包屑：根据当前路由在菜单配置中的位置生成 */
const breadcrumbs = computed(() => {
  const items = [{ path: "/dashboard", title: "首页" }];
  if (route.path === "/dashboard") return items;

  for (const menu of menus) {
    const child = menu.children?.find((c) => c.path === route.path);
    if (child) {
      items.push({ path: menu.path, title: menu.title });
      items.push({ path: child.path, title: child.title });
      return items;
    }
    if (menu.path === route.path) {
      items.push({ path: menu.path, title: menu.title });
      return items;
    }
  }

  // 不在菜单中的路由（如主题、设置页），回退到路由 meta.title
  const title = route.meta.title;
  if (typeof title === "string" && title.length > 0) {
    items.push({ path: route.path, title });
  }
  return items;
});

const goTo = (path: string) => {
  if (route.path !== path) router.push(path);
};
</script>

<style lang="scss" scoped>
/* ---------- 顶栏 ---------- */
.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background-color: var(--el-bg-color-overlay);
  border-bottom: 1px solid var(--el-border-color-light);

  .header-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .collapse-btn {
    font-size: 18px;
    color: var(--el-text-color-regular);
    cursor: pointer;

    &:hover {
      color: var(--el-color-primary);
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .header-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: 18px;
    color: var(--el-text-color-regular);
    cursor: pointer;
    border-radius: 4px;
    transition:
      color 0.2s,
      background-color 0.2s;

    &:hover {
      color: var(--el-color-primary);
      background-color: var(--el-fill-color);
    }

    &.active {
      color: var(--el-color-primary);
    }
  }
}
</style>
