<template>
  <el-card shadow="never" class="settings-page">
    <template #header>
      <span>{{ t("settings.title") }}</span>
    </template>

    <el-form :model="form" label-width="140px">
      <el-divider content-position="left">{{ t("settings.basic") }}</el-divider>

      <el-form-item :label="t('settings.appName')">
        <el-input
          v-model="form.appName"
          :placeholder="t('settings.appNamePlaceholder')"
          style="max-width: 320px"
        />
      </el-form-item>

      <!--
        界面语言不做本地表单持久化：它由 i18n 模块自己管（app:locale），
        这里只做单向读取 + change 回调，避免出现两份语言状态互相打架
      -->
      <el-form-item :label="t('settings.language')">
        <el-select :model-value="locale" style="width: 320px" @change="handleLocaleChange">
          <el-option v-for="item in localeOptions" :key="item.value" v-bind="item" />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('settings.autoLaunch')">
        <el-switch v-model="form.autoLaunch" />
      </el-form-item>

      <el-divider content-position="left">{{ t("settings.dataAndCache") }}</el-divider>

      <el-form-item :label="t('settings.cacheDir')">
        <el-input
          v-model="form.cacheDir"
          :placeholder="t('settings.cacheDirPlaceholder')"
          style="max-width: 480px"
        >
          <template #append>
            <el-button @click="chooseCacheDir">{{ t("settings.browse") }}</el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item :label="t('settings.autoCleanCache')">
        <el-switch v-model="form.autoCleanCache" />
      </el-form-item>

      <el-form-item :label="t('settings.keepState')">
        <el-switch v-model="form.keepState" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveSettings">{{ t("settings.save") }}</el-button>
        <el-button @click="resetSettings">{{ t("settings.reset") }}</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import {
  SUPPORTED_LOCALES,
  setLocale,
  useI18nGlobal,
  locale,
  localeOptions,
} from "../../locales";
import type { SupportedLocale } from "../../locales";

const { t } = useI18nGlobal();

interface SettingsForm {
  appName: string;
  autoLaunch: boolean;
  cacheDir: string;
  autoCleanCache: boolean;
  keepState: boolean;
}

const STORAGE_KEY = "app:settings";

const defaultForm: SettingsForm = {
  appName: "Template App",
  autoLaunch: true,
  cacheDir: "D:\\TemplateApp\\cache",
  autoCleanCache: false,
  keepState: true,
};

const form = ref<SettingsForm>({ ...defaultForm });

try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) form.value = { ...defaultForm, ...(JSON.parse(raw) as Partial<SettingsForm>) };
} catch {
  // 本地数据损坏时回退到默认配置
}

// el-select 拿到的是宽泛类型，先校验再交给 setLocale 统一写入 i18n 并持久化
const handleLocaleChange = (value: unknown) => {
  if (typeof value === "string" && value in SUPPORTED_LOCALES) {
    setLocale(value as SupportedLocale);
  }
};

const chooseCacheDir = () => {
  // 离线工具：可调用 Tauri 的 dialog 插件选择目录
  ElMessage.info(t("settings.toast.chooseDir"));
};

const saveSettings = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(form.value));
  ElMessage.success(t("settings.toast.saved"));
};

const resetSettings = () => {
  form.value = { ...defaultForm };
  localStorage.removeItem(STORAGE_KEY);
  ElMessage.success(t("settings.toast.resetDone"));
};
</script>

<style lang="scss" scoped>
.settings-page {
  max-width: 1080px;
}
</style>
