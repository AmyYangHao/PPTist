<template>
  <div class="canvas-tool">
    <div class="left-handler">
      <IconBack
        class="handler-item"
        :class="{ disable: !canUndo }"
        v-tooltip="'撤销（Ctrl + Z）'"
        @click="undo()"
      />
      <IconNext
        class="handler-item"
        :class="{ disable: !canRedo }"
        v-tooltip="'重做（Ctrl + Y）'"
        @click="redo()"
      />
      <div class="more">
        <Divider type="vertical" style="height: 20px" />
        <Popover
          class="more-icon"
          trigger="click"
          v-model:value="moreVisible"
          :offset="10"
        >
          <template #content>
            <PopoverMenuItem
              center
              @click="
                toggleNotesPanel();
                moreVisible = false;
              "
              >批注面板</PopoverMenuItem
            >
            <PopoverMenuItem
              center
              @click="
                toggleSelectPanel();
                moreVisible = false;
              "
              >选择窗格</PopoverMenuItem
            >
            <PopoverMenuItem
              center
              @click="
                toggleSraechPanel();
                moreVisible = false;
              "
              >查找替换</PopoverMenuItem
            >
          </template>
          <IconMore class="handler-item" />
        </Popover>
        <IconComment
          class="handler-item"
          :class="{ active: showNotesPanel }"
          v-tooltip="'批注面板'"
          @click="toggleNotesPanel()"
        />
        <IconMoveOne
          class="handler-item"
          :class="{ active: showSelectPanel }"
          v-tooltip="'选择窗格'"
          @click="toggleSelectPanel()"
        />
        <IconSearch
          class="handler-item"
          :class="{ active: showSearchPanel }"
          v-tooltip="'查找/替换（Ctrl + F）'"
          @click="toggleSraechPanel()"
        />
      </div>
    </div>

    <div class="add-element-handler">
      <div class="handler-item group-btn" v-tooltip="'插入文字'">
        <IconFontSize
          class="icon"
          :class="{ active: creatingElement?.type === 'text' }"
          @click="drawText()"
        />

        <Popover
          trigger="click"
          v-model:value="textTypeSelectVisible"
          style="height: 100%"
          :offset="10"
        >
          <template #content>
            <PopoverMenuItem
              center
              @click="
                () => {
                  drawText();
                  textTypeSelectVisible = false;
                }
              "
              ><IconTextRotationNone /> 横向文本框</PopoverMenuItem
            >
            <PopoverMenuItem
              center
              @click="
                () => {
                  drawText(true);
                  textTypeSelectVisible = false;
                }
              "
              ><IconTextRotationDown /> 竖向文本框</PopoverMenuItem
            >
          </template>
          <IconDown class="arrow" />
        </Popover>
      </div>
      <div class="handler-item group-btn" v-tooltip="'插入形状'" :offset="10">
        <Popover
          trigger="click"
          style="height: 100%"
          v-model:value="shapePoolVisible"
          :offset="10"
        >
          <template #content>
            <ShapePool @select="(shape) => drawShape(shape)" />
          </template>
          <IconGraphicDesign
            class="icon"
            :class="{
              active: creatingCustomShape || creatingElement?.type === 'shape',
            }"
          />
        </Popover>

        <Popover
          trigger="click"
          v-model:value="shapeMenuVisible"
          style="height: 100%"
          :offset="10"
        >
          <template #content>
            <PopoverMenuItem
              center
              @click="
                () => {
                  drawCustomShape();
                  shapeMenuVisible = false;
                }
              "
              >自由绘制</PopoverMenuItem
            >
          </template>
          <IconDown class="arrow" />
        </Popover>
      </div>
      <FileInput @change="(files) => insertImageElement(files)">
        <IconPicture class="handler-item" v-tooltip="'插入图片'" />
      </FileInput>
      <Popover trigger="click" v-model:value="linePoolVisible" :offset="10">
        <template #content>
          <LinePool @select="(line) => drawLine(line)" />
        </template>
        <IconConnection
          class="handler-item"
          :class="{ active: creatingElement?.type === 'line' }"
          v-tooltip="'插入线条'"
        />
      </Popover>
      <Popover trigger="click" v-model:value="chartPoolVisible" :offset="10">
        <template #content>
          <ChartPool
            @select="
              (chart) => {
                createChartElement(chart);
                chartPoolVisible = false;
              }
            "
          />
        </template>
        <IconChartProportion class="handler-item" v-tooltip="'插入图表'" />
      </Popover>
      <Popover
        trigger="click"
        v-model:value="tableGeneratorVisible"
        :offset="10"
      >
        <template #content>
          <TableGenerator
            @close="tableGeneratorVisible = false"
            @insert="
              ({ row, col }) => {
                createTableElement(row, col);
                tableGeneratorVisible = false;
              }
            "
          />
        </template>
        <IconInsertTable class="handler-item" v-tooltip="'插入表格'" />
      </Popover>
      <IconFormula
        class="handler-item"
        v-tooltip="'插入公式'"
        @click="latexEditorVisible = true"
      />
      <Popover trigger="click" v-model:value="mediaInputVisible" :offset="10">
        <template #content>
          <MediaInput
            @close="mediaInputVisible = false"
            @insertVideo="
              (src) => {
                createVideoElement(src);
                mediaInputVisible = false;
              }
            "
            @insertAudio="
              (src) => {
                createAudioElement(src);
                mediaInputVisible = false;
              }
            "
          />
        </template>
        <IconVideoTwo class="handler-item" v-tooltip="'插入音视频'" />
      </Popover>
      <ToolIcon
        name="text-book"
        style="min-width: 68px"
        :disabled="globalStore.isDisableTopWidget"
        @click="songModalVisible = true"
      >
        教材欣赏
      </ToolIcon>

      <ToolIcon
        name="source-material"
        style="min-width: 56px"
        :disabled="globalStore.isDisableTopWidget"
        @click="sourceMaterialVisible = true"
      >
        素材库
      </ToolIcon>
      <Popover trigger="click" v-model:value="interactionPoolVisible">
        <template #content>
          <InteractionPool
            v-model:pool="interactionPoolVisible"
            v-model:visible="teachingMaterialVisible"
          />
        </template>
        <ToolIcon
          name="music"
          style="min-width: 56px"
          :disabled="globalStore.isDisableTopWidget"
        >
          AI互动
        </ToolIcon>
      </Popover>
    </div>

    <div class="right-handler">
      <IconMinus
        class="handler-item viewport-size"
        v-tooltip="'画布缩小（Ctrl + -）'"
        @click="scaleCanvas('-')"
      />
      <Popover trigger="click" v-model:value="canvasScaleVisible">
        <template #content>
          <PopoverMenuItem
            center
            v-for="item in canvasScalePresetList"
            :key="item"
            @click="applyCanvasPresetScale(item)"
            >{{ item }}%</PopoverMenuItem
          >
          <PopoverMenuItem
            center
            @click="
              resetCanvas();
              canvasScaleVisible = false;
            "
            >适应屏幕</PopoverMenuItem
          >
        </template>
        <span class="text">{{ canvasScalePercentage }}</span>
      </Popover>
      <IconPlus
        class="handler-item viewport-size"
        v-tooltip="'画布放大（Ctrl + =）'"
        @click="scaleCanvas('+')"
      />
      <IconFullScreen
        class="handler-item viewport-size-adaptation"
        v-tooltip="'适应屏幕（Ctrl + 0）'"
        @click="resetCanvas()"
      />
    </div>
    <Modal
      v-model:visible="teachingMaterialVisible"
      :width="1000"
      :close-button="true"
    >
      <TeachingMaterial @insert="insertFrameElement" />
    </Modal>
    <Modal
      v-model:visible="sourceMaterialVisible"
      :width="880"
      :close-button="true"
    >
      <div>
        <h3 style="color: #555; margin-bottom: 10px">素材库</h3>
        <div style="height: 490px">
          <Encyclopedia @insert="insertEncyclopedia" />
        </div>
      </div>
    </Modal>
    <Modal v-model:visible="songModalVisible" :width="880" :close-button="true">
      <div>
        <h3 style="color: #555; margin-bottom: 10px">歌曲列表</h3>
        <div style="height: 490px">
          <Song @insert="insertSong" />
        </div>
      </div>
    </Modal>

    <Modal v-model:visible="latexEditorVisible" :width="880">
      <LaTeXEditor
        @close="latexEditorVisible = false"
        @update="
          (data) => {
            createLatexElement(data);
            latexEditorVisible = false;
          }
        "
      />
    </Modal>
    <Modal v-model:visible="songModalVisible" :width="880" :close-button="true">
      <div>
        <h3 style="color: #555; margin-bottom: 10px">歌曲列表</h3>
        <div style="height: 490px">
          <Song @insert="insertSong" />
        </div>
      </div>
    </Modal>
    <Modal
      v-model:visible="teachingMaterialVisible"
      :width="1000"
      :close-button="true"
    >
      <TeachingMaterial @insert="insertFrameElement" />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from "vue";
import { storeToRefs } from "pinia";
import { useMainStore, useSnapshotStore, useGlobalStore } from "@/store";
import { getImageDataURL } from "@/utils/image";
import type { ShapePoolItem } from "@/configs/shapes";
import type { LinePoolItem } from "@/configs/lines";
import useScaleCanvas from "@/hooks/useScaleCanvas";
import useHistorySnapshot from "@/hooks/useHistorySnapshot";
import useCreateElement from "@/hooks/useCreateElement";

import ShapePool from "./ShapePool.vue";
import LinePool from "./LinePool.vue";
import ChartPool from "./ChartPool.vue";
import TableGenerator from "./TableGenerator.vue";
import MediaInput from "./MediaInput.vue";
import LaTeXEditor from "@/components/LaTeXEditor/index.vue";
import FileInput from "@/components/FileInput.vue";
import Modal from "@/components/Modal.vue";
import Divider from "@/components/Divider.vue";
import ToolIcon from "@/components/ToolIcon.vue";
import Popover from "@/components/Popover.vue";
import PopoverMenuItem from "@/components/PopoverMenuItem.vue";
//AI音乐自定义组件
import Encyclopedia from "@/components/TeachingMaterial/components/Encyclopedia.vue";
import Song from "@/components/TeachingMaterial/components/Song.vue";
import useSlideHandler from "../../../hooks/useSlideHandler";
import InteractionPool from "./InteractionPool.vue";
import TeachingMaterial from "@/components/TeachingMaterial/TeachingMaterial.vue";

const mainStore = useMainStore();
const {
  creatingElement,
  creatingCustomShape,
  showSelectPanel,
  showSearchPanel,
  showNotesPanel,
} = storeToRefs(mainStore);
const { canUndo, canRedo } = storeToRefs(useSnapshotStore());

const { redo, undo } = useHistorySnapshot();
const { resetSlides, createSlide } = useSlideHandler();

const {
  scaleCanvas,
  setCanvasScalePercentage,
  resetCanvas,
  canvasScalePercentage,
} = useScaleCanvas();

const canvasScalePresetList = [200, 150, 125, 100, 75, 50];
const canvasScaleVisible = ref(false);

const applyCanvasPresetScale = (value: number) => {
  setCanvasScalePercentage(value);
  canvasScaleVisible.value = false;
};

const {
  createImageElement,
  createChartElement,
  createTableElement,
  createLatexElement,
  createVideoElement,
  createAudioElement,
  createFrameElement,
} = useCreateElement();

const insertImageElement = (files: FileList) => {
  const imageFile = files[0];
  if (!imageFile) return;
  getImageDataURL(imageFile).then((dataURL) => createImageElement(dataURL));
};

const shapePoolVisible = ref(false);
const linePoolVisible = ref(false);
const chartPoolVisible = ref(false);
const tableGeneratorVisible = ref(false);
const mediaInputVisible = ref(false);
const latexEditorVisible = ref(false);
const textTypeSelectVisible = ref(false);
const shapeMenuVisible = ref(false);
const moreVisible = ref(false);
//AI音乐教室
const globalStore = useGlobalStore();
const songModalVisible = ref(false);
const teachingMaterialVisible = ref(false);
const sourceMaterialVisible = ref(false);
const interactionPoolVisible = ref(false);

const insertSong = (query: string) => {
  const token = localStorage.getItem("AUTHORIZATION_TOKEN");
  let host = import.meta.env.VITE_PLATFORM_HOST + "/ppt";
  const urlSrc = `${host}${query}&timestamp=${Date.now()}&token=${token}&hide_side_bar=1`;
  insertFrameElement(urlSrc);
  songModalVisible.value = false;
};

const insertEncyclopedia = (path: string) => {
  const token = localStorage.getItem("AUTHORIZATION_TOKEN");
  let host = import.meta.env.VITE_PLATFORM_HOST + "/ppt";
  const urlSrc = `${host}${path}&timestamp=${Date.now()}&token=${token}&hide_side_bar=1`;
  insertFrameElement(urlSrc);
  sourceMaterialVisible.value = false;
};
const insertFrameElement = (src: string) => {
  createSlide();
  globalStore.isDisableTopWidget = true;
  teachingMaterialVisible.value = false;
  createFrameElement(src, (id?: string) => {
    // --- 监听iframe加载完成发送数据
    nextTick(() => {
      if (id) {
        const ifr: HTMLIFrameElement | null = document.querySelector(`#${id}`);
        console.log("sdfkjh", ifr);

        if (ifr) {
          // -- 如果是插入AI作曲，处理数据格式发送给客户端存在本地用于作曲页读取展示
          // -- 客户端项目/index.tsx 页面中接收并存储
          if (/proty/.test(src)) {
            setTimeout(() => {
              // -- 处理数据格式
              const paragraphsArr = globalStore.selectPoetInfo?.paragraphs
                .replace(/([，。？！])/g, "$1*")
                .split("*")
                .filter((_: any) => _);
              const postData = {
                category: 0,
                poet_serial_number:
                  globalStore.selectPoetInfo?.poet_serial_number,
                poet_info: {
                  ...globalStore.selectPoetInfo,
                  paragraphs: paragraphsArr,
                },
                time: Date.now(),
              };
              // eslint-disable-next-line no-console
              console.log("PPTist 发送数据：", postData);
              ifr.contentWindow?.postMessage(
                {
                  type: "protyInPPTist",
                  data: postData,
                },
                "*"
              );
            }, 2000);
          }
        }
      }
    });
  });
};

// 绘制文字范围
const drawText = (vertical = false) => {
  mainStore.setCreatingElement({
    type: "text",
    vertical,
  });
};

// 绘制形状范围
const drawShape = (shape: ShapePoolItem) => {
  mainStore.setCreatingElement({
    type: "shape",
    data: shape,
  });
  shapePoolVisible.value = false;
};
// 绘制自定义任意多边形
const drawCustomShape = () => {
  mainStore.setCreatingCustomShapeState(true);
  shapePoolVisible.value = false;
};

// 绘制线条路径
const drawLine = (line: LinePoolItem) => {
  mainStore.setCreatingElement({
    type: "line",
    data: line,
  });
  linePoolVisible.value = false;
};

// 打开选择面板
const toggleSelectPanel = () => {
  mainStore.setSelectPanelState(!showSelectPanel.value);
};

// 打开搜索替换面板
const toggleSraechPanel = () => {
  mainStore.setSearchPanelState(!showSearchPanel.value);
};

// 打开批注面板
const toggleNotesPanel = () => {
  mainStore.setNotesPanelState(!showNotesPanel.value);
};
</script>

<style lang="scss" scoped>
.canvas-tool {
  position: relative;
  border-bottom: 1px solid $borderColor;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  font-size: 13px;
  user-select: none;
}
.left-handler,
.more {
  display: flex;
  align-items: center;
}
.more-icon {
  display: none;
}
.add-element-handler {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;

  .handler-item {
    width: 32px;
    height: 42px;

    &:not(.group-btn):hover {
      background-color: #f1f1f1;
    }

    &.active {
      color: $themeColor;
    }

    &.group-btn {
      width: auto;
      margin-right: 5px;

      &:hover {
        background-color: #f3f3f3;
      }

      .icon,
      .arrow {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .icon {
        width: 26px;
        padding: 0 2px;

        &:hover {
          background-color: #e9e9e9;
        }
        &.active {
          color: $themeColor;
        }
      }
      .arrow {
        font-size: 12px;

        &:hover {
          background-color: #e9e9e9;
        }
      }
    }
  }
}
.handler-item {
  height: 30px;
  font-size: 14px;
  margin: 0 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: $borderRadius;
  overflow: hidden;
  cursor: pointer;

  &.disable {
    opacity: 0.5;
  }
}
.left-handler,
.right-handler {
  .handler-item {
    padding: 0 8px;

    &.active,
    &:not(.disable):hover {
      background-color: #f1f1f1;
    }
  }
}
.right-handler {
  display: flex;
  align-items: center;

  .text {
    display: inline-block;
    width: 40px;
    text-align: center;
    cursor: pointer;
  }

  .viewport-size {
    font-size: 13px;
  }
}

@media screen and (width <= 1200px) {
  .right-handler .text {
    display: none;
  }
  .more > .handler-item {
    display: none;
  }
  .more-icon {
    display: block;
  }
}
@media screen and (width <= 1000px) {
  .left-handler,
  .right-handler {
    display: none;
  }
}
</style>
