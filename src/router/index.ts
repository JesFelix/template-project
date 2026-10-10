import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import MainLayout from "../layouts/MainLayout/index.vue";

/**
 * 路由配置
 * 使用 hash 模式：避免 Tauri 打包后静态资源在刷新/深链接时出现 404
 */
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: MainLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("../views/dashboard/index.vue"),
        // meta.title 存的是 i18n key，展示前由面包屑用 t() 翻译
        meta: { title: "menu.dashboard" },
      },
      {
        path: "theme",
        name: "Theme",
        component: () => import("../views/theme/index.vue"),
        meta: { title: "menu.theme" },
      },
      {
        path: "settings",
        name: "Settings",
        component: () => import("../views/settings/index.vue"),
        meta: { title: "menu.settings" },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
