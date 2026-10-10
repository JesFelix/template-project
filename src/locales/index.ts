import { computed } from "vue";
import { createI18n, useI18n as useVueI18n } from "vue-i18n";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import zhCN from "./zh-CN";
import enUS from "./en-US";

/** 支持的语言：key 是 vue-i18n / element-plus 共用的 locale 标识，value 是界面上显示的名称 */
export const SUPPORTED_LOCALES = {
  "zh-CN": "简体中文",
  "en-US": "English",
} as const;

export type SupportedLocale = keyof typeof SUPPORTED_LOCALES;

const STORAGE_KEY = "app:locale";
const FALLBACK_LOCALE: SupportedLocale = "zh-CN";

/** element-plus 内置文案（分页、空数据提示等）的对应语言包 */
const ELEMENT_PLUS_LOCALES: Record<SupportedLocale, typeof zhCn> = {
  "zh-CN": zhCn,
  "en-US": en,
};

function loadLocale(): SupportedLocale {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved !== null && saved in SUPPORTED_LOCALES) return saved as SupportedLocale;
  return FALLBACK_LOCALE;
}

export const i18n = createI18n({
  // 组合式 API：配合 useI18n / useI18nGlobal 使用，不做 Vue2 兼容
  legacy: false,
  // 让所有组件都能直接用 $t / $d 等（本项目推荐用下面的 useI18nGlobal 拿 t）
  globalInjection: true,
  locale: loadLocale(),
  fallbackLocale: FALLBACK_LOCALE,
  messages: { "zh-CN": zhCN, "en-US": enUS },
});

/**
 * 当前语言，可读可写。
 * 直接代理 i18n 内部的 locale，写入后所有 t() 立即响应式更新
 */
export const locale = computed<SupportedLocale>({
  get: () => i18n.global.locale.value as SupportedLocale,
  set: (value) => {
    i18n.global.locale.value = value;
  },
});

/** element-plus 语言包，跟随应用语言 */
export const elementPlusLocale = computed(() => ELEMENT_PLUS_LOCALES[locale.value]);

/** 把当前语言同步到 <html lang>（应用启动时调用一次，与 useTheme 的 applyTheme 对应） */
export function applyLocale(): void {
  document.documentElement.lang = locale.value;
}

/** 切换语言并持久化，下次启动自动应用 */
export function setLocale(value: SupportedLocale): void {
  locale.value = value;
  localStorage.setItem(STORAGE_KEY, value);
  applyLocale();
}

/** 语言下拉框的候选项，label/value 直接可绑 el-select */
export const localeOptions = Object.entries(SUPPORTED_LOCALES).map(([value, label]) => ({
  value,
  label,
}));

/**
 * 组件内使用 i18n 的统一入口。
 * useScope 必须是 global：组件自身没有 i18n 配置，走默认的 local scope
 * 会拿到一个不含任何消息的 composer，t() 会原样返回 key。
 */
export function useI18nGlobal() {
  return useVueI18n({ useScope: "global" });
}
