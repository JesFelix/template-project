//! SQLite 持久层
//!
//! 所有业务数据都以 SQLite 为唯一真源，前端的 localStorage 只作为启动时的同步缓存
//! （`invoke` 是异步的，而主题/语言必须在首帧渲染前应用）。

use rusqlite::{params, Connection};
use std::{collections::HashMap, path::Path, sync::Mutex, sync::MutexGuard};

/// 前端通过 KV 命令读写的数据。
/// 命令可能被并发调用，所以连接套一层 Mutex 串行化。
pub struct Db(Mutex<Connection>);

impl Db {
    /// 打开（必要时创建）数据库并初始化表结构。
    ///
    /// 用 KV 表而不是按业务拆表：前端存的本来就是整块 JSON 配置，
    /// 拆表只会逼着两边各维护一份结构定义。
    pub fn open(path: &Path) -> Result<Self, String> {
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent).map_err(|e| format!("创建数据目录失败: {e}"))?;
        }

        let conn = Connection::open(path).map_err(|e| format!("打开数据库失败: {e}"))?;

        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS kv (
                key        TEXT PRIMARY KEY,
                value      TEXT NOT NULL,
                updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            );",
        )
        .map_err(|e| format!("建表失败: {e}"))?;

        Ok(Self(Mutex::new(conn)))
    }

    /// 读出全部 KV。前端启动时一次 IPC 拉全量，避免逐条读
    pub fn read_all(&self) -> Result<HashMap<String, String>, String> {
        let conn = self.lock()?;
        let mut stmt = conn
            .prepare("SELECT key, value FROM kv")
            .map_err(|e| format!("查询失败: {e}"))?;

        let rows = stmt
            .query_map([], |row| {
                Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?))
            })
            .map_err(|e| format!("查询失败: {e}"))?;

        rows.collect::<Result<HashMap<String, String>, _>>()
            .map_err(|e| format!("读取结果失败: {e}"))
    }

    /// 写入单个键（存在则覆盖）
    pub fn set(&self, key: &str, value: &str) -> Result<(), String> {
        let conn = self.lock()?;
        conn.execute(
            "INSERT INTO kv (key, value, updated_at) VALUES (?1, ?2, datetime('now'))
             ON CONFLICT(key) DO UPDATE SET
               value      = excluded.value,
               updated_at = excluded.updated_at",
            params![key, value],
        )
        .map_err(|e| format!("写入失败: {e}"))?;
        Ok(())
    }

    /// 删除单个键。后端删掉后，前端下次对账会把本地缓存一并丢弃
    pub fn delete(&self, key: &str) -> Result<(), String> {
        let conn = self.lock()?;
        conn.execute("DELETE FROM kv WHERE key = ?1", params![key])
            .map_err(|e| format!("删除失败: {e}"))?;
        Ok(())
    }

    fn lock(&self) -> Result<MutexGuard<'_, Connection>, String> {
        // 锁中毒说明某个持锁线程 panic 过，此时连接状态不可信，直接报错给前端降级处理
        self.0.lock().map_err(|_| "数据库锁已失效".to_string())
    }
}
