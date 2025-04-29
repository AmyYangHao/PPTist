<template>
  <div
    class="base-element-frame lg-thumbnail"
    :style="{
      top: '0px',
      left: '0px',
      width: '1920px',
      height: '1080px',
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
    }"
  >
    <div class="element-content">
      <iframe :src="elementInfo.src" width="1920px" height="1080px" :frameborder="0"></iframe>
      <div class="mask"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/* __placeholder__ */
import { computed } from "vue";
import type { PropType } from "vue";
import type { PPTFrameElement } from "@/types/slides";

const props = defineProps({
  elementInfo: {
    type: Object as PropType<PPTFrameElement>,
    required: true,
  },
});
const scale = computed(() => {
  return props.elementInfo.width / 1920 < props.elementInfo.height / 1080 ? props.elementInfo.width / 1920 : props.elementInfo.height / 1080;
});
</script>

<style lang="scss" scoped>
.base-element-frame {
  position: absolute;
}
.element-content {
  width: 100%;
  height: 100%;
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
