<template>
  <div
    class="editable-element-frame lg-screen"
    :style="{
      top: '0px',
      left: '0px',
      width: '1920px',
      height: '1080px',
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
    }"
  >
    <div class="element-content" v-contextmenu="contextmenus" @mousedown="($event) => handleSelectElement($event)" @touchstart="($event) => handleSelectElement($event)">
      <iframe
        :src="elementInfo.src"
        width="1920px"
        height="1080px"
        :frameborder="0"
        :allowfullscreen="true"
        allow="microphone *"
        sandbox="allow-same-origin allow-scripts allow-same-origin allow-forms"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
/* __placeholder__ */
import type { PropType } from "vue";
import type { PPTFrameElement } from "@/types/slides";
import type { ContextmenuItem } from "@/components/Contextmenu/types";
import { computed } from "vue";

const props = defineProps({
  elementInfo: {
    type: Object as PropType<PPTFrameElement>,
    required: true,
  },
  selectElement: {
    type: Function as PropType<(e: MouseEvent | TouchEvent, element: PPTFrameElement, canMove?: boolean) => void>,
    required: true,
  },
  contextmenus: {
    type: Function as PropType<() => ContextmenuItem[] | null>,
  },
});

const scale = computed(() => {
  return props.elementInfo.width / 1920 < props.elementInfo.height / 1080 ? props.elementInfo.width / 1920 : props.elementInfo.height / 1080;
});

const handleSelectElement = (e: MouseEvent | TouchEvent, canMove = false) => {
  e.stopPropagation();
  props.selectElement(e, props.elementInfo, canMove);
};
</script>

<style lang="scss" scoped>
.editable-element-frame {
  position: absolute;
}
.element-content {
  width: 100%;
  height: 100%;
  cursor: move;
}
.drag-handler {
  position: absolute;

  &.top {
    height: 20px;
    left: 0;
    right: 0;
    top: 0;
  }
  &.bottom {
    height: 20px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  &.left {
    width: 20px;
    top: 0;
    bottom: 0;
    left: 0;
  }
  &.right {
    width: 20px;
    top: 0;
    bottom: 0;
    right: 0;
  }
}
</style>
