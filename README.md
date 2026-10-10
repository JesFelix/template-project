# Template Project

基于 **Tauri 2 + Vue 3 + TypeScript** 的桌面管理后台模板，开箱即用地提供了后台主布局、明暗主题切换、Element Plus 集成与路由示例，适合快速搭建桌面管理应用或离线工具。

![](./public/home-page.png)

## 技术栈

| 类别 | 技术 |
| ---- | ---- |
| 桌面框架 | Tauri 2（Rust） |
| 前端框架 | Vue 3（`<script setup>`）+ TypeScript |
| 构建工具 | Vite |
| UI 组件 | Element Plus + @element-plus/icons-vue |
| 路由 | Vue Router 5（hash 模式） |
| 样式 | SCSS |

## 功能特性

- 管理后台主布局：可折叠侧边栏 + 顶栏（面包屑导航、快捷入口），见 `src/layouts/MainLayout/`
- 三个示例页面：首页、主题设置、系统设置
- 主题系统：明亮 / 暗黑模式 + 主题色切换，偏好保存在 `localStorage`，启动时统一应用以避免主题闪烁（`src/composables/useTheme.ts`）
- Element Plus 全量引入，同时加载明、暗两套 CSS 变量
- 路由使用 hash 模式，避免桌面端打包后刷新 / 深链接出现 404
- Tauri 侧已集成 opener 插件与 `greet` 示例命令（`src-tauri/src/lib.rs`）

## 环境要求

- Node.js 22+（开发验证版本 v22.14.0）与 npm 10+
- Rust 工具链（[rustup](https://rustup.rs) 安装，自带 cargo）
- Tauri 各平台前置依赖见官方文档：https://tauri.app/start/prerequisites/

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2a. 仅启动前端（浏览器调试，http://localhost:1420）
npm run dev

# 2b. 启动完整桌面应用（推荐，会自动拉起前端 dev server）
npm run tauri dev
```

> 开发服务器固定占用 **1420 端口**（`strictPort: true`），端口被占用时会直接失败，而不是自动换端口。

## 常用命令

| 命令 | 说明 |
| ---- | ---- |
| `npm run dev` | 启动前端开发服务器（仅浏览器，不加载 Tauri API） |
| `npm run tauri dev` | 启动桌面应用开发模式（前端 + Rust 热重载） |
| `npm run build` | 类型检查（`vue-tsc --noEmit`）+ 构建前端产物到 `dist/` |
| `npx vue-tsc --noEmit` | 仅执行类型检查 |
| `npm run tauri build` | 打包桌面应用（内部先执行 `npm run build`），产物位于 `src-tauri/target/release/bundle/` |

## 项目结构

```
├─ src/                      # 前端源码
│  ├─ main.ts                # 应用入口（Element Plus、路由、主题初始化）
│  ├─ router/index.ts        # 路由配置（hash 模式，meta.title 用于面包屑）
│  ├─ layouts/MainLayout/    # 后台主布局（侧边栏 / 顶栏 / 菜单配置）
│  ├─ views/                 # 页面：dashboard / theme / settings
│  ├─ composables/           # 组合式函数（useTheme）
│  └─ stores/ components/ utils/   # 预留目录
├─ src-tauri/                # Rust / Tauri 侧
│  ├─ src/lib.rs             # Tauri 入口与自定义命令
│  ├─ capabilities/          # 窗口 / 插件权限配置
│  └─ tauri.conf.json        # Tauri 配置（dev/build 脚本、窗口、打包）
└─ vite.config.ts            # Vite 配置（为 Tauri 定制：固定端口、忽略 src-tauri）
```

## 常见开发任务

- **新增页面**：在 `src/router/index.ts` 注册路由并填写 `meta.title`（面包屑依赖它）
- **侧边栏菜单**：在 `src/layouts/MainLayout/models/menus.ts` 添加菜单项；主题 / 设置页不占用菜单，由顶栏图标进入
- **调用 Rust 能力**：在 `src-tauri/src/lib.rs` 定义 `#[tauri::command]` 并注册到 `invoke_handler`，前端通过 `@tauri-apps/api` 的 `invoke()` 调用

## 推荐 IDE

VS Code + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## License

[Apache-2.0](./LICENSE)
