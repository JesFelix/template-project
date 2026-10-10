<template>
  <div class="dashboard">
    <el-row :gutter="16">
      <el-col v-for="item in stats" :key="item.label" :xs="12" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">{{ item.label }}</div>
          <div class="stat-value">{{ item.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="welcome-card">
      <template #header>
        <span>{{ t("dashboard.usage.title") }}</span>
      </template>
      <p>{{ t("dashboard.usage.intro") }}</p>
      <ul>
        <li>
          {{ t("dashboard.usage.menu") }}<code>src/layouts/MainLayout/index.vue</code>
        </li>
        <li>{{ t("dashboard.usage.header") }}</li>
        <li>
          {{ t("dashboard.usage.router") }}<code>src/router/index.ts</code>
        </li>
      </ul>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useI18nGlobal } from "../../locales";

const { t } = useI18nGlobal();

// label 存 i18n key，模板里由 t() 翻译
const stats = [
  { label: "dashboard.stats.visits", value: 1024 },
  { label: "dashboard.stats.newUsers", value: 68 },
  { label: "dashboard.stats.orders", value: 356 },
  { label: "dashboard.stats.todos", value: 12 },
];
</script>

<style lang="scss" scoped>
.dashboard {
  max-width: 1440px;
}

.stat-card {
  margin-bottom: 16px;

  .stat-label {
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }

  .stat-value {
    margin-top: 8px;
    font-size: 24px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }
}

.welcome-card {
  p {
    margin: 0 0 8px;
  }

  ul {
    margin: 0;
    padding-left: 20px;
    color: var(--el-text-color-regular);
    line-height: 1.8;
  }

  code {
    padding: 0 4px;
    background: var(--el-fill-color);
    border-radius: 3px;
  }
}
</style>
