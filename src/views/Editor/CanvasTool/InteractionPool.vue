<template>
  <div class="shape-pool">
    <div class="category" v-for="item in list" :key="item.name">
      <div class="category-name">{{ item.name }}</div>
      <div class="shape-list">
        <template v-for="(it, index) in item.children" :key="index">
          <Button
            v-if="it.type === 'button'"
            @click="
              modelValue = true;
              poolVisible = false;
            "
            >{{ it.name }}</Button
          >
          <ToolIcon v-else :name="it.icon" @click="clickHandle(it.key)">
            {{ it.name }}
          </ToolIcon>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from "@/components/Button.vue";
import ToolIcon from "@/components/ToolIcon.vue";
import { useGlobalStore } from "@/store";

const list = [
  {
    name: "引用AI互动",
    children: [
      {
        type: "button",
        name: "点击引用",
        icon: undefined,
        key: "import",
      },
    ],
  },
  {
    name: "自定义AI互动",
    children: [
      {
        type: "toolIcon",
        name: "节奏训练",
        icon: "rhythm",
        key: "rhythm",
      },
      {
        type: "toolIcon",
        name: "趣味识谱",
        icon: "spectrum-recognition",
        key: "spectrum-recognition",
      },
      {
        type: "toolIcon",
        name: "编创",
        icon: "compilation-and-creation",
        key: "compilation-and-creation",
      },
    ],
  },
];

const modelValue = defineModel("visible");
const poolVisible = defineModel("pool");

const globalStore = useGlobalStore();

const clickHandle = (key: string) => {
  let host = import.meta.env.VITE_PLATFORM_HOST;
  let tk = localStorage.getItem("AUTHORIZATION_TOKEN");
  switch (key) {
    // -- 节奏训练
    case "rhythm":
      host += "/ppt/custom-rhythm";
      break;
    // -- 趣味识谱
    case "spectrum-recognition":
      host += "/ppt/custom-fun-sheet-music";
      break;
    // -- 自由编创
    case "compilation-and-creation":
      host += "/ppt/custom-compose-music";
      break;
  }
  globalStore.customPageUrl = host + "?token=" + tk;
  poolVisible.value = false;
};
</script>

<style lang="scss" scoped>
.shape-pool {
  width: 200px;
  max-height: 520px;
  overflow: auto;
  margin-top: -12px;
  margin-bottom: -12px;
  margin-right: -12px;
  padding-right: 12px;
  padding-top: 12px;
}

.category-name {
  width: 100%;
  font-size: 13px;
  margin-bottom: 10px;
  border-left: 4px solid #aaa;
  background-color: #eee;
  padding: 2px 0 2px 10px;
}

.shape-list {
  @include flex-grid-layout();

  margin-bottom: 10px;
}

.shape-item {
  @include flex-grid-layout-children(10, 8%);

  height: 0;
  padding-bottom: 8%;
  flex-shrink: 0;
}
</style>
