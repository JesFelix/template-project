import type { Component } from "vue";
import { HomeFilled } from "@element-plus/icons-vue";

export interface MenuItem {
  path: string;
  /** i18n key（如 menu.dashboard），展示前由菜单/面包屑用 t() 翻译 */
  title: string;
  icon: Component;
  children?: MenuItem[];
}

/** 菜单静态配置，后续可替换为接口下发或由路由表生成 */
export const menus: MenuItem[] = [
  { path: "/dashboard", title: "menu.dashboard", icon: HomeFilled },
];
