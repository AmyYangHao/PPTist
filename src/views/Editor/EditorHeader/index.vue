<template>
  <div class="editor-header" v-if="isEdit">
    <div class="left">
      <Popover
        trigger="click"
        placement="bottom-start"
        v-model:value="mainMenuVisible"
      >
        <template #content>
          <!-- <FileInput
            accept="application/vnd.openxmlformats-officedocument.presentationml.presentation"
            @change="
              (files) => {
                importPPTXFile(files);
                mainMenuVisible = false;
              }
            "
          >
            <PopoverMenuItem>导入 pptx 文件</PopoverMenuItem>
          </FileInput> -->
          <!-- <FileInput
            accept=".pptist"
            @change="
              (files) => {
                importSpecificFile(files);
                mainMenuVisible = false;
              }
            "
          >
            <PopoverMenuItem>导入 pptist 文件</PopoverMenuItem>
          </FileInput> -->
          <!-- <PopoverMenuItem @click="setDialogForExport('pptx')"
            >导出文件</PopoverMenuItem> -->

          <PopoverMenuItem
            @click="
              resetSlides();
              mainMenuVisible = false;
            "
            >重置幻灯片</PopoverMenuItem
          >
          <PopoverMenuItem
            @click="
              mainMenuVisible = false;
              hotkeyDrawerVisible = true;
            "
            >快捷操作</PopoverMenuItem
          >
        </template>
        <div class="menu-item"><IconHamburgerButton class="icon" /></div>
      </Popover>

      <div class="title">
        <Input
          class="title-input"
          ref="titleInputRef"
          v-model:value="titleValue"
          @blur="handleUpdateTitle()"
          v-if="editingTitle"
        ></Input>
        <div class="title-text" @click="startEditTitle()" :title="title" v-else>
          {{ title }}
        </div>
      </div>
    </div>

    <div class="right">
      <div class="group-menu-item">
        <!-- <div
          class="menu-item"
          v-tooltip="'幻灯片放映（F5）'"
          @click="enterScreening()"
        >
          <IconPpt class="icon" size="18" />
        </div> -->

        <FileInput
          accept="application/vnd.openxmlformats-officedocument.presentationml.presentation"
          @change="
            (files) => {
              importPPTXFile(files);
              mainMenuVisible = false;
            }
          "
        >
          <div class="fck-import">导入pptx文件</div>
        </FileInput>

        <Popover trigger="click" center>
          <template #content>
            <PopoverMenuItem @click="enterScreeningFromStart()"
              >从头开始</PopoverMenuItem
            >
            <PopoverMenuItem @click="enterScreening()"
              >从当前页开始</PopoverMenuItem
            >
          </template>
          <div class="button play">
            <img :src="iconSaveSrc" width="18" />
            <span>放映</span>
          </div>
        </Popover>
      </div>
      <!-- <div class="menu-item" v-tooltip="'保存'" @click="onSave">
        <IconDownload class="icon" />
      </div> -->
      <div class="button save" @click="onSave">
        <img :src="iconPlaySrc" width="18" />
        <span>保存</span>
      </div>
    </div>

    <Drawer
      :width="320"
      v-model:visible="hotkeyDrawerVisible"
      placement="right"
    >
      <HotkeyDoc />
      <template v-slot:title>快捷操作</template>
    </Drawer>

    <FullscreenSpin :loading="exporting" tip="正在导入..." />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from "vue";
import { storeToRefs } from "pinia";
import { useMainStore, useSlidesStore } from "@/store";
import useScreening from "@/hooks/useScreening";
import useImport from "@/hooks/useImport";
import useSlideHandler from "@/hooks/useSlideHandler";
import type { DialogForExportTypes } from "@/types/export";
import useQuery from "@/hooks/useQuery";

import HotkeyDoc from "./HotkeyDoc.vue";
import FileInput from "@/components/FileInput.vue";
import FullscreenSpin from "@/components/FullscreenSpin.vue";
import Drawer from "@/components/Drawer.vue";
import Input from "@/components/Input.vue";
import Popover from "@/components/Popover.vue";
import PopoverMenuItem from "@/components/PopoverMenuItem.vue";
import { defaultCover } from "@/constants/defaultCover";
import useUploadFirstPpt from "@/hooks/useUploadFirstPpt";
import { base64ToFile } from "@/utils/helper";
import { apiCommon, apiCourse } from "@/api/apiServer";
import { ElMessage } from "element-plus";
import Bus from "@likg/bus";
import { savePPTtoS3 } from "@/utils/SaveUtils";
import iconPlaySrc from "@/assets/icon/play.png";
import iconSaveSrc from "@/assets/icon/save.png";
defineProps<{
  isEdit: boolean;
}>();

const mainStore = useMainStore();
const slidesStore = useSlidesStore();
const { title, slides } = storeToRefs(slidesStore);
const { enterScreening, enterScreeningFromStart } = useScreening();
const { importSpecificFile, importPPTXFile, exporting } = useImport();
const { resetSlides } = useSlideHandler();
const { id: courseId } = useQuery<{ id: string }>();

const mainMenuVisible = ref(false);
const hotkeyDrawerVisible = ref(false);
const editingTitle = ref(false);
const titleInputRef = ref<InstanceType<typeof Input>>();
const { getFirstPPT } = useUploadFirstPpt();
const titleValue = ref("");

const startEditTitle = () => {
  titleValue.value = title.value;
  editingTitle.value = true;
  nextTick(() => titleInputRef.value?.focus());
};
const onSave = async () => {
  const content = JSON.stringify(slides.value);
  const hasIfr = slides.value[0].elements.some(
    (ele: any) => ele.type === "iframe"
  );
  console.log(hasIfr);

  let cover_url = defaultCover;
  if (!hasIfr) {
    const base64String = await getFirstPPT();
    console.log("base64String >>> ", base64String);
    const file = base64ToFile(base64String, "cover_url.png");
    console.log("file >>> ", file);
    const resp = await apiCommon.uploadFile(file);
    if (resp.code === 200) {
      cover_url = resp.data.full_path;
    }
  }

  if (!courseId) {
    return ElMessage.error("课程ID不存在");
  }
  Bus.$emit("TOGGLE_LOADING_STATUS", true);
  console.log("asdw", content);

  try {
    savePPTtoS3(+courseId, content, cover_url);
    // Bus.$emit("TOGGLE_LOADING_STATUS", false);
    // if (resp && resp.code === 200) {
    //   ElMessage.success("保存成功");
    // }
  } catch (error) {
    Bus.$emit("TOGGLE_LOADING_STATUS", false);
    console.log(error);
  }
};

const handleUpdateTitle = () => {
  slidesStore.setTitle(titleValue.value);
  editingTitle.value = false;
};

const goLink = (url: string) => {
  window.open(url);
  mainMenuVisible.value = false;
};

const setDialogForExport = (type: DialogForExportTypes) => {
  mainStore.setDialogForExport(type);
  mainMenuVisible.value = false;
};

const openMarkupPanel = () => {
  mainStore.setMarkupPanelState(true);
};

const openAIPPTDialog = () => {
  mainStore.setAIPPTDialogState(true);
};
</script>

<style lang="scss" scoped>
.editor-header {
  background-color: #fff;
  user-select: none;
  border-bottom: 1px solid $borderColor;
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
}
.left,
.right {
  display: flex;
  justify-content: center;
  align-items: center;
}
.menu-item {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding: 0 10px;
  border-radius: $borderRadius;
  cursor: pointer;

  .icon {
    font-size: 18px;
    color: #666;
  }
  .text {
    width: 18px;
    text-align: center;
    font-size: 17px;
  }
  .ai {
    background: linear-gradient(270deg, #d897fd, #33bcfc);
    background-clip: text;
    color: transparent;
    font-weight: 700;
  }

  &:hover {
    background-color: #f1f1f1;
  }
}
.group-menu-item {
  height: 30px;
  display: flex;
  margin: 0 8px;
  padding: 0 2px;
  border-radius: $borderRadius;

  &:hover {
    background-color: #f1f1f1;
  }

  .menu-item {
    padding: 0 3px;
  }
  .arrow-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
.title {
  height: 30px;
  margin-left: 2px;
  font-size: 13px;

  .title-input {
    width: 200px;
    height: 100%;
    padding-left: 0;
    padding-right: 0;

    ::v-deep(input) {
      height: 28px;
      line-height: 28px;
    }
  }
  .title-text {
    min-width: 20px;
    max-width: 400px;
    line-height: 30px;
    padding: 0 6px;
    border-radius: $borderRadius;
    cursor: pointer;

    @include ellipsis-oneline();

    &:hover {
      background-color: #f1f1f1;
    }
  }
}
.github-link {
  display: inline-block;
  height: 30px;
}
.button {
  width: 90px;
  height: 30px;
  background: red;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  gap: 4px;
  img {
    margin-right: 4px;
  }

  &.play {
    background: rgb(54, 169, 105);
  }
  &.save {
    background: rgb(223, 117, 30);
  }
}
.fck-import {
  width: 120px;
  height: 30px;
  border-radius: 5px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #4096ff;
  margin-right: 10px;
}
</style>
