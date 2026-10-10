/**
 * 简体中文文案（基准语言）
 * 新增文案时先加到这里，en-US.ts 用 MessageSchema 做了类型约束，漏译会直接编译报错
 */
const zhCN = {
  app: {
    /** 侧边栏 Logo 文案 */
    name: "管理后台",
  },
  menu: {
    dashboard: "首页",
    theme: "主题设置",
    settings: "系统设置",
  },
  dashboard: {
    stats: {
      visits: "今日访问",
      newUsers: "新增用户",
      orders: "订单数量",
      todos: "待办事项",
    },
    usage: {
      title: "使用说明",
      intro: "这是管理系统后台的主布局示例页面。",
      // 拆成「文字 + 路径」是为了让路径保留 <code> 样式，标点由文案自己收尾
      menu: "左侧为可折叠菜单，配置文件：",
      header: "顶部为面包屑导航与用户下拉菜单",
      router: "路由配置文件：",
    },
  },
  theme: {
    appearance: "外观模式",
    light: "浅色",
    dark: "深色",
    primaryColor: "主题色",
    reset: "重置",
    tip: "主题偏好保存在本地，下次启动时会自动应用。",
    resetAction: "恢复默认主题",
  },
  settings: {
    title: "系统设置",
    basic: "基础设置",
    appName: "应用名称",
    appNamePlaceholder: "请输入应用名称",
    language: "界面语言",
    autoLaunch: "开机自动启动",
    dataAndCache: "数据与缓存",
    cacheDir: "缓存目录",
    cacheDirPlaceholder: "请选择缓存目录",
    browse: "浏览",
    autoCleanCache: "自动清理缓存",
    keepState: "退出时保留状态",
    save: "保存设置",
    reset: "恢复默认",
    toast: {
      chooseDir: "示例：可在此接入 Tauri 的 dialog 插件选择目录",
      saved: "设置已保存",
      resetDone: "已恢复默认设置",
    },
  },
};

/** 其他语言包需要与基准语言结构一致，否则在各自文件里编译报错 */
export type MessageSchema = typeof zhCN;

export default zhCN;
