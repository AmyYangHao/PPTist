<script setup lang="ts">
import { ref, shallowRef } from "vue";
import type { TabsPaneContext } from "element-plus";
import { interactionTemplate, myInteraction } from "./components/constants";

// -- props & emits
const emits = defineEmits<{
  (event: "insert", payload: string): void;
}>();

const activeName = ref("interactionTemplate");
const selected = ref(1);
const token = localStorage.getItem("AUTHORIZATION_TOKEN");
const render = shallowRef(interactionTemplate?.[0]?.component);

const handleClick = (tab: TabsPaneContext) => {
  switch (tab.paneName) {
    case "interactionTemplate":
      // insert("?type=pitch&source=ppt");
      selected.value = 1;
      render.value = interactionTemplate?.[0]?.component;
      break;
    case "myInteraction":
      selected.value = 1;
      render.value = myInteraction?.[0]?.component;
      break;
    default:
      break;
  }
};

const insert = (path: string) => {
  let host = import.meta.env.VITE_PLATFORM_HOST + "/ppt";
  const urlSrc = `${host}${path}&timestamp=${Date.now()}&token=${token}&hide_side_bar=1`;
  console.log("嵌入模块地址 >>>", urlSrc);
  emits("insert", urlSrc);
};

const onSelect = (item: any) => {
  selected.value = item.id;
  render.value = item.component;
};
</script>

<template>
  <h3 class="title">AI互动</h3>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane name="interactionTemplate" label="互动模板"> </el-tab-pane>
    <el-tab-pane name="myInteraction" label="我的互动"> </el-tab-pane>
  </el-tabs>
  <!-- 写在tab-pane标签中会被渲染两次 -->
  <div class="tab-content">
    <div class="menus">
      <div
        class="menus-item"
        :class="{ active: selected === item.id }"
        v-for="item in activeName === 'interactionTemplate'
          ? interactionTemplate
          : myInteraction"
        :key="item.id"
        @click="onSelect(item)"
      >
        {{ item?.label }}
      </div>
    </div>
    <div class="menus-content">
      <component :is="render" @insert="(url: string) => insert(url)" />
    </div>
  </div>
</template>

<style lang="scss">
.el-select__popper {
  z-index: 10000 !important;
}
.title {
  color: #555;
}
</style>

<style lang="scss" scoped>
.tab-content {
  display: flex;
  height: 490px;

  .menus {
    width: 140px;
    border-right: 1px solid #eee;
    padding: 15px;
    overflow-y: auto;

    .menus-item {
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      cursor: pointer;
      text-align: center;
      border-radius: 8px;
      margin-bottom: 8px;
      transition: background 0.3s;

      &.active,
      &:hover {
        background: #f5f5f5;
        color: #409eff;
      }
    }
  }
  .menus-content {
    flex: 1;
    padding: 15px;
  }
}
</style>
