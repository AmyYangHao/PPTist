<template>
  <div class="tool-box" :class="{ disabled: $props.disabled }">
    <slot name="icon">
      <div
        class="tool-icon"
        :class="$props.name"
        style="background-size: 24px"
      />
    </slot>

    <slot />
  </div>
</template>

<script setup lang="ts">
// import { default } from '../hooks/useUniformDisplayElement';
defineProps({
  name: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.tool-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 12px;
  color: #212121;

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:not(.disabled):hover {
    background-color: #f5f5f5;
  }

  .tool-icon {
    width: 24px;
    height: 24px;
    object-fit: cover;
  }

  .fx {
    background: url("@/assets/icon/fx.png") no-repeat;
  }

  .table {
    background: url("@/assets/icon/table.png") no-repeat;
  }

  .playing {
    background: url("@/assets/icon/playing.png") no-repeat;
  }

  .more {
    background: url("@/assets/icon/more.png") no-repeat;
  }

  .text-book {
    background: url("@/assets/icon/text-book.png") no-repeat;
  }

  .video {
    background: url("@/assets/icon/video.png") no-repeat;
  }

  .source-material {
    background: url("@/assets/icon/source-material.png") no-repeat;
  }

  .question-bank {
    background: url("@/assets/icon/question-bank.png") no-repeat;
  }

  .chart {
    background: url("@/assets/icon/chart.png") no-repeat;
  }

  .image {
    background: url("@/assets/icon/image.png") no-repeat;
  }

  .line {
    background: url("@/assets/icon/line.png") no-repeat;
  }

  .shape {
    background: url("@/assets/icon/shape.png") no-repeat;
  }

  .music {
    background: url("@/assets/icon/music.png") no-repeat;
  }

  .text {
    background: url("@/assets/icon/text.png") no-repeat;
  }

  .back {
    background: url("@/assets/icon/back.png") no-repeat;
  }

  .edit {
    background: url("@/assets/icon/edit.png") no-repeat;
  }

  .forward {
    background: url("@/assets/icon/forward.png") no-repeat;
  }

  .compilation-and-creation {
    background: url("@/assets/icon/compilation-and-creation.png") no-repeat;
  }

  .rhythm {
    background: url("@/assets/icon/rhythm.png") no-repeat;
  }

  .spectrum-recognition {
    background: url("@/assets/icon/spectrum-recognition.png") no-repeat;
  }
}
</style>
