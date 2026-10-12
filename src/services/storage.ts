/**
 * 统一存储层
 *
 * SQLite（Tauri 后端）是唯一真源，localStorage 只作为启动时的同步缓存：
 * invoke 是异步的，而主题/语言必须在首帧渲染前应用，否则会闪一下旧样式。
 * 所以启动流程是「先吃缓存立即渲染 → 挂载后 initStorage() 与后端对账」。
 *
 * 浏览器环境（`npm run dev`）没有 Tauri 后端，invoke 会失败，此时自动退化为纯 localStorage。
 *
 * 业务代码不要直接碰 localStorage，一律走这个模块。
 */
import { ref } from "vue";
import { invoke } from "@tauri-apps/api/core";

/** 只缓存 app: 前缀的键，避免把别的来源的数据搅在一起 */
const NAMESPACE = "app:";

/** 内存缓存，与 localStorage 内容一致，供同步读取 */
const cache = new Map<string, string>();

/** 写入后端的途中。对账时跳过这些键，避免「用户刚改完又被后端旧值覆盖」 */
const inFlightWrites = new Set<string>();

function loadCache(): void {
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key?.startsWith(NAMESPACE)) cache.set(key, localStorage.getItem(key) ?? "");
  }
}
loadCache();

/** 是否已与后端对过账。组件可以 watch 它，确保读到的是后端数据 */
export const synced = ref(false);

/** 同步读字符串；只查内存缓存 */
export function readStorage(key: string): string | null {
  return cache.get(key) ?? null;
}

/**
 * 同步读对象配置：解析缓存里的 JSON 并与默认值合并。
 * 数据损坏或不存在时回退到 fallback。
 * 只适合对象型配置，数组/原始值请用 readStorage 自己处理。
 */
export function readObject<T extends object>(key: string, fallback: T): T {
  const raw = readStorage(key);
  if (raw === null) return { ...fallback };
  try {
    return { ...fallback, ...(JSON.parse(raw) as Partial<T>) };
  } catch {
    // 缓存损坏时回退到默认配置
    return { ...fallback };
  }
}

/** 写字符串：缓存与 localStorage 立即生效（同步可读），后端异步落库 */
export function writeStorage(key: string, value: string): void {
  cache.set(key, value);
  localStorage.setItem(key, value);
  syncToBackend(key, value);
}

/** 写对象配置 */
export function writeObject(key: string, value: object): void {
  writeStorage(key, JSON.stringify(value));
}

/** 删除：本地立即生效，后端异步删除 */
export function removeStorage(key: string): void {
  cache.delete(key);
  localStorage.removeItem(key);
  syncToBackend(key, null);
}

function syncToBackend(key: string, value: string | null): void {
  const task = value === null ? invoke("kv_delete", { key }) : invoke("kv_set", { key, value });
  inFlightWrites.add(key);
  void task
    .catch((err) => {
      // 失败不打断 UI：缓存还在，下次启动仍能顶上
      console.warn(`[storage] ${key} 未能写入 SQLite:`, err);
    })
    .finally(() => {
      inFlightWrites.delete(key);
    });
}

/**
 * 与 SQLite 对账：一次性拉回全部 KV，以后端为准刷新缓存。
 *
 * 以后端为准包含「删除」：缓存里有、后端没有的键会被丢弃，
 * 这样后端清库后本地不会把旧配置又写回去。
 *
 * 调用方应在 resolved 之后重放依赖持久化的副作用（主题、语言）。
 */
export async function initStorage(): Promise<void> {
  try {
    const remote = await invoke<Record<string, string>>("kv_get_all");

    for (const key of [...cache.keys()]) {
      if (!(key in remote)) cache.delete(key);
    }
    for (const [key, value] of Object.entries(remote)) {
      if (inFlightWrites.has(key)) continue; // 用户刚改过，别用旧值覆盖
      cache.set(key, value);
      localStorage.setItem(key, value); // 让缓存与后端保持一致
    }
  } catch (err) {
    // 浏览器环境没有 Tauri 后端，退化为纯 localStorage
    console.warn("[storage] 未能连接 SQLite，本次运行仅使用 localStorage 缓存:", err);
  } finally {
    // 失败也算「对完账」，否则 watch synced 的组件会一直等
    synced.value = true;
  }
}
