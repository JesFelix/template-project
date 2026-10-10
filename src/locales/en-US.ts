import type { MessageSchema } from "./zh-CN";

/**
 * English messages
 * Structurally constrained by MessageSchema (zh-CN), so a missing key fails `vue-tsc`
 */
const enUS: MessageSchema = {
  app: {
    name: "Admin Console",
  },
  menu: {
    dashboard: "Dashboard",
    theme: "Theme",
    settings: "Settings",
  },
  dashboard: {
    stats: {
      visits: "Visits Today",
      newUsers: "New Users",
      orders: "Orders",
      todos: "To-dos",
    },
    usage: {
      title: "Getting Started",
      intro: "This page demonstrates the main layout of the admin console.",
      // Split into text + path so the path keeps its <code> styling; each message ends with its own punctuation
      menu: "The collapsible menu on the left is configured in ",
      header: "The header holds the breadcrumb and the top-right actions",
      router: "The route configuration lives in ",
    },
  },
  theme: {
    appearance: "Appearance",
    light: "Light",
    dark: "Dark",
    primaryColor: "Primary Color",
    reset: "Reset",
    tip: "Your theme preference is stored locally and re-applied on the next launch.",
    resetAction: "Restore Default Theme",
  },
  settings: {
    title: "System Settings",
    basic: "General",
    appName: "App Name",
    appNamePlaceholder: "Enter the app name",
    language: "Language",
    autoLaunch: "Launch at Startup",
    dataAndCache: "Data & Cache",
    cacheDir: "Cache Directory",
    cacheDirPlaceholder: "Pick a cache directory",
    browse: "Browse",
    autoCleanCache: "Auto-clean Cache",
    keepState: "Keep State on Exit",
    save: "Save Settings",
    reset: "Restore Defaults",
    toast: {
      chooseDir: "Demo: hook up Tauri's dialog plugin here to pick a directory",
      saved: "Settings saved",
      resetDone: "Default settings restored",
    },
  },
};

export default enUS;
