<template>
  <div class="theme-page">
    <el-card shadow="never">
      <template #header>
        <span>{{ t("theme.appearance") }}</span>
      </template>
      <div class="mode-group">
        <div
          class="mode-item"
          :class="{ active: config.mode === 'light' }"
          @click="setMode('light')"
        >
          <el-icon :size="26">
            <Sunny />
          </el-icon>
          <span>{{ t("theme.light") }}</span>
        </div>
        <div class="mode-item" :class="{ active: config.mode === 'dark' }" @click="setMode('dark')">
          <el-icon :size="26">
            <Moon />
          </el-icon>
          <span>{{ t("theme.dark") }}</span>
        </div>
      </div>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <span>{{ t("theme.primaryColor") }}</span>
      </template>
      <div class="color-group">
        <span
          v-for="color in presetColors"
          :key="color"
          class="color-dot"
          :class="{ active: config.primaryColor === color }"
          :style="{ backgroundColor: color }"
          @click="setPrimaryColor(color)"
        >
          <el-icon v-if="config.primaryColor === color">
            <Check />
          </el-icon>
        </span>
        <el-color-picker :model-value="config.primaryColor" @change="handleColorChange" />
      </div>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <span>{{ t("theme.reset") }}</span>
      </template>
      <p class="tip">{{ t("theme.tip") }}</p>
      <el-button @click="resetTheme">{{ t("theme.resetAction") }}</el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Check, Moon, Sunny } from "@element-plus/icons-vue";
import { useTheme } from "../../composables/useTheme";
import { useI18nGlobal } from "../../locales";

const { t } = useI18nGlobal();
const { config, setMode, setPrimaryColor, resetTheme } = useTheme();

const presetColors = [
  "#409eff",
  "#67c23a",
  "#e6a23c",
  "#f56c6c",
  "#909399",
  "#722ed1",
  "#13c2c2",
  "#eb2f96",
];

const handleColorChange = (color: unknown) => {
  if (typeof color === "string") setPrimaryColor(color);
};
</script>

<style lang="scss" scoped>
.theme-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1080px;
}

.mode-group {
  display: flex;
  gap: 16px;
}

.mode-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 120px;
  height: 90px;
  font-size: 14px;
  color: var(--el-text-color-regular);
  cursor: pointer;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  transition:
    border-color 0.2s,
    color 0.2s;

  &:hover {
    border-color: var(--el-color-primary);
  }

  &.active {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary);
  }
}

.color-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.color-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 10%);
  transition: transform 0.15s;

  &:hover {
    transform: scale(1.12);
  }

  &.active {
    outline: 2px solid var(--el-color-primary);
    outline-offset: 2px;
  }
}

.tip {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
</style>
