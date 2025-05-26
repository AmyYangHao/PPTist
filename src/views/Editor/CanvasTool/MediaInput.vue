<template>
  <div class="media-input">
    <p class="title">上传音频或视频</p>
    <el-upload
      class="upload-demo"
      drag
      :action="actionUrl"
      accept=".mp3,.wav,.mp4,.mov"
      :headers="headers"
      :on-success="onSuccess"
      :before-upload="beforeUpload"
      :limit="1"
      :multiple="false"
      :on-exceed="handleExceed"
      :on-remove="onRemove"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">拖拽文件到这里 或 <em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">
          温馨提示：支持格式 .mp3 .wav .mp4 .mov（上传文件不超过500MB）
        </div>
      </template>
    </el-upload>

    <div class="footer">
      <el-button type="danger" @click="emit('close')">取消</el-button>
      <el-button type="primary" @click="onSure">确定</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Validator from "@likg/validator";

import { UploadFilled } from "@element-plus/icons-vue";
import { type UploadProps, ElMessage } from "element-plus";
type TypeKey = "video" | "audio";
interface TabItem {
  key: TypeKey;
  label: string;
}

const token = localStorage.getItem("AUTHORIZATION_TOKEN");
const headers = {
  "Access-Control-Allow-Origin": "*",
  Authorization: token ? `Bearer ${token}` : "",
};
const actionUrl =
  import.meta.env.VITE_API_HOST + "/mgr/textbook_courseware/upload_file/";

const url = ref("");

const emit = defineEmits<{
  (event: "insertVideo", payload: string): void;
  (event: "insertAudio", payload: string): void;
  (event: "close"): void;
}>();

const onSuccess = (resp: any) => {
  url.value = resp.data.full_path;
};
const onRemove = () => {
  url.value = "";
};
const onSure = () => {
  if (!url.value) {
    ElMessage.error("请上传音频或视频");
  }
  if (Validator.isAudio(url.value)) {
    console.log("插入音频");
    emit("insertAudio", url.value);
  }
  if (Validator.isVideo(url.value)) {
    console.log("插入视频");
    emit("insertVideo", url.value);
  }
};

const handleExceed = () => {
  ElMessage.error("只允许上传一个文件。");
};
const beforeUpload: UploadProps["beforeUpload"] = (rawFile) => {
  console.log(rawFile);

  if (
    !Validator.checkFile({
      type: "extension",
      file: rawFile,
      accept: ".mp3,.wav,.mp4,.mov",
    })
  ) {
    ElMessage.error("仅支持格式 .mp4, .mov, .mp3, .wav");
    return false;
  } else if (
    !Validator.checkFile({ type: "size", file: rawFile, maxSize: 1024 })
  ) {
    ElMessage.error("上传文件不超过1024MB");
    return false;
  }
  return true;
};
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 16px;
  color: #444;
}
.footer {
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
