import { createApp } from "vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from "./App.vue";
import router from "./router";
import { applyTheme } from "./composables/useTheme";
import { i18n, applyLocale } from "./locales";

const app =createApp(App);
app.use(i18n)
app.use(ElementPlus)
app.use(router)
applyTheme()
applyLocale()
app.mount("#app");
