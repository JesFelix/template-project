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
        meta: { title: "首页" },
      },
      {
        path: "theme",
        name: "Theme",
        component: () => import("../views/theme/index.vue"),
        meta: { title: "主题设置" },
      },
      {
        path: "settings",
        name: "Settings",
        component: () => import("../views/settings/index.vue"),
        meta: { title: "系统设置" },
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
