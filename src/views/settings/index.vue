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
        这里只做单向读取，change 直接交给 setLocale 校验并写入，
        避免出现两份语言状态互相打架（顶栏的语言切换图标用的是同一套）
      -->
      <el-form-item :label="t('settings.language')">
        <el-select :model-value="locale" style="width: 320px" @change="setLocale">
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
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { setLocale, useI18nGlobal, locale, localeOptions } from "../../locales";
import { readObject, removeStorage, synced, writeObject } from "../../services/storage";

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

const loadForm = () => readObject(STORAGE_KEY, defaultForm);

// 先吃 localStorage 缓存立即渲染；SQLite 里的数据可能更新，对账完再刷一次
const form = ref<SettingsForm>(loadForm());

watch(
  synced,
  (ready) => {
    if (ready) form.value = loadForm();
  },
  { immediate: true },
);

const chooseCacheDir = () => {
  // 离线工具：可调用 Tauri 的 dialog 插件选择目录
  ElMessage.info(t("settings.toast.chooseDir"));
};

const saveSettings = () => {
  writeObject(STORAGE_KEY, form.value);
  ElMessage.success(t("settings.toast.saved"));
};

const resetSettings = () => {
  form.value = { ...defaultForm };
  removeStorage(STORAGE_KEY);
  ElMessage.success(t("settings.toast.resetDone"));
};
</script>

<style lang="scss" scoped>
.settings-page {
  max-width: 1080px;
}
</style>
