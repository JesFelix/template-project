import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    /** 页面标题（用于面包屑） */
    title?: string;
  }
}
