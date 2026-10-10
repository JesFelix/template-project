<template>
  <el-card shadow="never" class="settings-page">
    <template #header>
      <span>系统设置</span>
    </template>

    <el-form :model="form" label-width="140px">
      <el-divider content-position="left">基础设置</el-divider>

      <el-form-item label="应用名称">
        <el-input v-model="form.appName" placeholder="请输入应用名称" style="max-width: 320px" />
      </el-form-item>

      <el-form-item label="界面语言">
        <el-select v-model="form.language" style="width: 320px">
          <el-option label="简体中文" value="zh-CN" />
          <el-option label="English" value="en-US" />
        </el-select>
      </el-form-item>

      <el-form-item label="开机自动启动">
        <el-switch v-model="form.autoLaunch" />
      </el-form-item>

      <el-divider content-position="left">数据与缓存</el-divider>

      <el-form-item label="缓存目录">
        <el-input v-model="form.cacheDir" placeholder="请选择缓存目录" style="max-width: 480px">
          <template #append>
            <el-button @click="chooseCacheDir">浏览</el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="自动清理缓存">
        <el-switch v-model="form.autoCleanCache" />
      </el-form-item>

      <el-form-item label="退出时保留状态">
        <el-switch v-model="form.keepState" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveSettings">保存设置</el-button>
        <el-button @click="resetSettings">恢复默认</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";

interface SettingsForm {
  appName: string;
  language: string;
  autoLaunch: boolean;
  cacheDir: string;
  autoCleanCache: boolean;
  keepState: boolean;
}

const STORAGE_KEY = "app:settings";

const defaultForm: SettingsForm = {
  appName: "Template App",
  language: "zh-CN",
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

const chooseCacheDir = () => {
  // 离线工具：可调用 Tauri 的 dialog 插件选择目录
  ElMessage.info("示例：可在此接入 Tauri 的 dialog 插件选择目录");
};

const saveSettings = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(form.value));
  ElMessage.success("设置已保存");
};

const resetSettings = () => {
  form.value = { ...defaultForm };
  localStorage.removeItem(STORAGE_KEY);
  ElMessage.success("已恢复默认设置");
};
</script>

<style lang="scss" scoped>
.settings-page {
  max-width: 760px;
}
</style>
