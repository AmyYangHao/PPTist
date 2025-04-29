<!-- views/components/element/FrameElement/index.vue -->

<template>
  <div
    class="editable-element-frame"
    :style="{
      top: '0px',
      left: '0px',
      width: '1920px',
      height: '1080px',
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
    }"
  >
    <div class="element-content" v-contextmenu="contextmenus" @mousedown="($event) => handleSelectElement($event, false)" @touchstart="($event) => handleSelectElement($event, false)">
      <iframe :id="elementInfo.id" :src="elementInfo.src" width="1920px" height="1080px" :frameborder="0" :allowfullscreen="true"></iframe>
      <div class="mask"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/* __placeholder__ */
import { computed } from "vue";
import type { PropType } from "vue";
import type { PPTFrameElement } from "@/types/slides";
import type { ContextmenuItem } from "@/components/Contextmenu/types";

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

const handleSelectElement = (e: MouseEvent | TouchEvent, canMove = true) => {
  e.stopPropagation();
  props.selectElement(e, props.elementInfo, canMove);
};

const scale = computed(() => {
  return props.elementInfo.width / 1920 < props.elementInfo.height / 1080 ? props.elementInfo.width / 1920 : props.elementInfo.height / 1080;
});
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

.mask {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
