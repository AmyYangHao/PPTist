<template>
  <div class="pptist-editor">
    <EditorHeader class="layout-header" :isEdit="isEdit" />
    <div class="layout-content">
      <Thumbnails class="layout-content-left" :isEdit="isEdit" />
      <div class="layout-content-center" :class="{ preview: !isEdit }">
        <div v-if="!isEdit" class="mask" @click.stop=""></div>
        <CanvasTool class="center-top" />
        <Canvas
          class="center-body"
          :style="{ height: `calc(100% - ${remarkHeight + 40}px)` }"
        />
        <Remark
          class="center-bottom"
          v-model:height="remarkHeight"
          :style="{ height: `${remarkHeight}px` }"
        />
      </div>
      <Toolbar class="layout-content-right" />
    </div>
  </div>

  <SelectPanel v-if="showSelectPanel" />
  <SearchPanel v-if="showSearchPanel" />
  <NotesPanel v-if="showNotesPanel" />
  <MarkupPanel v-if="showMarkupPanel" />

  <Modal
    :visible="!!dialogForExport"
    :width="680"
    @closed="closeExportDialog()"
  >
    <ExportDialog />
  </Modal>

  <Modal
    :visible="showAIPPTDialog"
    :width="680"
    :closeOnClickMask="false"
    :closeOnEsc="false"
    closeButton
    @closed="closeAIPPTDialog()"
  >
    <AIPPTDialog />
  </Modal>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useMainStore } from "@/store";
import useGlobalHotkey from "@/hooks/useGlobalHotkey";
import usePasteEvent from "@/hooks/usePasteEvent";

import EditorHeader from "./EditorHeader/index.vue";
import Canvas from "./Canvas/index.vue";
import CanvasTool from "./CanvasTool/index.vue";
import Thumbnails from "./Thumbnails/index.vue";
import Toolbar from "./Toolbar/index.vue";
import Remark from "./Remark/index.vue";
import ExportDialog from "./ExportDialog/index.vue";
import SelectPanel from "./SelectPanel.vue";
import SearchPanel from "./SearchPanel.vue";
import NotesPanel from "./NotesPanel.vue";
import MarkupPanel from "./MarkupPanel.vue";
import AIPPTDialog from "./AIPPTDialog.vue";
import Modal from "@/components/Modal.vue";
import useQuery from "@/hooks/useQuery";

const mainStore = useMainStore();
const {
  dialogForExport,
  showSelectPanel,
  showSearchPanel,
  showNotesPanel,
  showMarkupPanel,
  showAIPPTDialog,
} = storeToRefs(mainStore);
const closeExportDialog = () => mainStore.setDialogForExport("");
const closeAIPPTDialog = () => mainStore.setAIPPTDialogState(false);
const t = useQuery<string>("t");
const isEdit = t !== "preview";

const remarkHeight = ref(40);

useGlobalHotkey();
usePasteEvent();
</script>

<style lang="scss" scoped>
.pptist-editor {
  height: 100%;
}
.layout-header {
  height: 40px;
}
.layout-content {
  height: calc(100% - 40px);
  display: flex;
}
.layout-content-left {
  width: 160px;
  height: 100%;
  flex-shrink: 0;
}
.layout-content-center {
  width: calc(100% - 160px - 260px);
  position: relative;

  &.preview {
    width: calc(100% - 160px);
  }

  .mask {
    width: 100%;
    height: 100%;
    background: transparent;
    position: absolute;
    left: 0;
    z-index: 10;
    pointer-events: visible;
  }
  .center-top {
    height: 52px;
  }
}
.layout-content-right {
  width: 260px;
  height: 100%;
}
</style>
