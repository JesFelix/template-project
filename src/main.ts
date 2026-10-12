import { createApp } from "vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from "./App.vue";
import router from "./router";
import { applyTheme, reloadTheme } from "./composables/useTheme";
import { i18n, applyLocale, reloadLocale } from "./locales";
import { initStorage } from "./services/storage";

const app =createApp(App);
app.use(i18n)
app.use(ElementPlus)
app.use(router)

// 主题/语言必须在首帧前应用：invoke 是异步的，所以先吃 localStorage 缓存立即渲染
applyTheme()
applyLocale()
app.mount("#app")

// 挂载后与 SQLite 对账；缓存落后于后端时修正并重放，避免界面停在旧配置上
void initStorage().then(() => {
  reloadTheme()
  reloadLocale()
})
