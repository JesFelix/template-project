import { ref } from "vue";

export type ThemeMode = "light" | "dark";

export interface ThemeConfig {
  /** 外观模式 */
  mode: ThemeMode;
  /** 主题色（十六进制） */
  primaryColor: string;
}

const STORAGE_KEY = "app:theme";

const DEFAULT_CONFIG: ThemeConfig = {
  mode: "light",
  primaryColor: "#409eff",
};

/** 解析 #rgb / #rrggbb 为 [r, g, b] */
function parseHex(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
  const num = Number.parseInt(full, 16);
  return [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff];
}

/** 将 color 与 target 按 weight（target 的占比）混合 */
function mix(color: string, target: string, weight: number): string {
  const [r1, g1, b1] = parseHex(color);
  const [r2, g2, b2] = parseHex(target);
  const channel = (a: number, b: number) =>
    Math.round(a * (1 - weight) + b * weight)
      .toString(16)
      .padStart(2, "0");
  return `#${channel(r1, r2)}${channel(g1, g2)}${channel(b1, b2)}`;
}

function loadConfig(): ThemeConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_CONFIG, ...(JSON.parse(raw) as Partial<ThemeConfig>) };
  } catch {
    // 本地数据损坏时回退到默认配置
  }
  return { ...DEFAULT_CONFIG };
}

const config = ref<ThemeConfig>(loadConfig());

/** 把当前配置应用到 document（应用启动时调用一次，避免主题闪烁） */
export function applyTheme(): void {
  const { mode, primaryColor } = config.value;
  const root = document.documentElement;

  root.classList.toggle("dark", mode === "dark");

  // 主题色及其衍生色（对应 element-plus 的 CSS 变量）
  root.style.setProperty("--el-color-primary", primaryColor);
  for (const level of [3, 5, 7, 8, 9]) {
    root.style.setProperty(
      `--el-color-primary-light-${level}`,
      mix(primaryColor, "#ffffff", level / 10),
    );
  }
  root.style.setProperty("--el-color-primary-dark-2", mix(primaryColor, "#000000", 0.2));
}

function persist(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config.value));
}

export function useTheme() {
  const setMode = (mode: ThemeMode) => {
    config.value.mode = mode;
    persist();
    applyTheme();
  };

  const setPrimaryColor = (color: string) => {
    if (!color) return;
    config.value.primaryColor = color;
    persist();
    applyTheme();
  };

  const resetTheme = () => {
    config.value = { ...DEFAULT_CONFIG };
    persist();
    applyTheme();
  };

  return { config, setMode, setPrimaryColor, resetTheme };
}
