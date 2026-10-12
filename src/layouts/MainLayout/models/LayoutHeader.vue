<template>
  <el-header class="layout-header" height="50px">
    <div class="header-left">
      <el-icon class="collapse-btn" @click="emit('toggle')">
        <Expand v-if="collapse" />
        <Fold v-else />
      </el-icon>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path"
          :to="index === breadcrumbs.length - 1 ? undefined : item.path">
          {{ t(item.title) }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="header-right">
      <!--
        语言切换：用下拉而不是单击直接切，之后往 SUPPORTED_LOCALES 里加语言不用改这里；
        下拉展开期间禁用外层 tooltip，免得提示浮层压在语言菜单上
      -->
      <el-tooltip :content="t('header.language')" placement="bottom" :disabled="localeMenuVisible">
        <el-dropdown trigger="click" placement="bottom-end" @command="setLocale"
          @visible-change="localeMenuVisible = $event">
          <el-icon class="header-action" :aria-label="t('header.language')">
            <!--
              图标来自 iconfont：导出的 path 都带死 fill="#333333"，改成 currentColor
              才能跟着 .header-action 的 hover / 深色主题变色；宽高用 1em 对齐旁边两个图标的 18px
            -->
            <svg t="1791791017235" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="6210" width="1em" height="1em">
              <path
                d="M257.706667 343.04h184.32V392.533333h-124.586667v69.973334h105.813333v51.2h-105.813333v80.213333h129.706667v51.2H257.706667V343.04zM506.88 343.04h61.44l87.04 160.426667 30.72 64.853333h1.706667c-3.413333-30.72-8.533333-71.68-8.533334-105.813333v-119.466667h56.32v302.08h-61.44l-87.04-162.133333-30.72-64.853334h-1.706666c3.413333 32.426667 6.826667 69.973333 6.826666 105.813334v121.173333h-56.32V343.04z"
                fill="currentColor" p-id="6211"></path>
              <path
                d="M498.346667 933.546667C250.88 933.546667 51.2 732.16 51.2 486.4S250.88 39.253333 498.346667 39.253333 945.493333 238.933333 945.493333 486.4c0 37.546667-5.12 73.386667-13.653333 109.226667-3.413333 13.653333-17.066667 22.186667-30.72 18.773333-13.653333-3.413333-22.186667-17.066667-18.773333-30.72 8.533333-30.72 11.946667-63.146667 11.946666-97.28C894.293333 267.946667 716.8 90.453333 498.346667 90.453333S102.4 267.946667 102.4 486.4s177.493333 395.946667 395.946667 395.946667c13.653333 0 25.6 11.946667 25.6 25.6s-11.946667 25.6-25.6 25.6z"
                fill="currentColor" p-id="6212"></path>
              <path
                d="M947.2 795.306667H629.76c-13.653333 0-25.6-11.946667-25.6-25.6s11.946667-25.6 25.6-25.6h264.533333l-30.72-39.253334c-8.533333-11.946667-6.826667-27.306667 5.12-35.84 10.24-8.533333 27.306667-6.826667 35.84 5.12l64.853334 81.92c6.826667 8.533333 6.826667 18.773333 3.413333 27.306667s-15.36 11.946667-25.6 11.946667zM694.613333 983.04c-6.826667 0-15.36-3.413333-20.48-10.24l-64.853333-81.92c-6.826667-8.533333-6.826667-18.773333-3.413333-27.306667s13.653333-13.653333 22.186666-13.653333h317.44c13.653333 0 25.6 11.946667 25.6 25.6s-11.946667 25.6-25.6 25.6H682.666667l30.72 39.253333c8.533333 11.946667 6.826667 27.306667-5.12 35.84-3.413333 5.12-8.533333 6.826667-13.653334 6.826667z"
                fill="currentColor" p-id="6213"></path>
            </svg>
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(label, code) in SUPPORTED_LOCALES" :key="code" :command="code">
                <!--
                  外层 el-icon 恒定渲染只做占位（.el-icon 固定 1em 宽，EP 对菜单里的 i 还带 5px 右边距），
                  只按需显示里面的对号，当前语言切换时菜单宽度才不会跳
                -->
                <el-icon>
                  <Check v-if="locale === code" />
                </el-icon>
                <span>{{ label }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-tooltip>
      <el-tooltip :content="t('menu.theme')" placement="bottom">
        <el-icon class="header-action" :class="{ active: route.path === '/theme' }" @click="goTo('/theme')">
          <Brush />
        </el-icon>
      </el-tooltip>
      <el-tooltip :content="t('menu.settings')" placement="bottom">
        <el-icon class="header-action" :class="{ active: route.path === '/settings' }" @click="goTo('/settings')">
          <Setting />
        </el-icon>
      </el-tooltip>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Brush, Check, Expand, Fold, Setting } from "@element-plus/icons-vue";
import { menus } from "./menus";
import { SUPPORTED_LOCALES, setLocale, useI18nGlobal, locale } from "../../../locales";

defineProps<{ collapse: boolean }>();
const emit = defineEmits<{ toggle: [] }>();

const route = useRoute();
const router = useRouter();
const { t } = useI18nGlobal();

/** 语言下拉的展开状态，用于和外层 tooltip 互斥 */
const localeMenuVisible = ref(false);

/**
 * 面包屑：根据当前路由在菜单配置中的位置生成
 * title 存的是 i18n key，由模板统一 t() 翻译，切换语言时才会跟着变
 */
const breadcrumbs = computed(() => {
  const items = [{ path: "/dashboard", title: "menu.dashboard" }];
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
