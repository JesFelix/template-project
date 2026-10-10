import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    /** 页面标题：存 i18n key（如 menu.dashboard），展示前需用 t() 翻译 */
    title?: string;
  }
}
