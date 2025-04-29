<script setup lang="ts">
import { reactive } from "vue";

// -- props & emits
const emits = defineEmits<{
  (event: "insert", payload: string): void;
}>();

const state = reactive({
  tableData: [
    {
      id: 1,
      name: "默认趣味识谱",
      pitch: "1，2，3，4，5，6，7",
      source: "basic",
      type: "五线谱，数字简谱，唱名，音名",
    },
  ],
});

const onInsert = () => {
  emits("insert", `?q=train_fun_sheet_music&source=ppt`);
};
</script>

<template>
  <el-table :data="state.tableData" style="width: 100%" highlight-current-row empty-text="暂无数据">
    <el-table-column type="index" width="60" label="序号" />
    <el-table-column prop="name" label="趣味识谱名称" />
    <el-table-column prop="type" label="类型" />
    <el-table-column prop="pitch" label="音高" />
    <el-table-column label="操作" fixed="right" width="100">
      <template #default="scope">
        <el-button type="danger" size="small" @click.prevent="onInsert">插入</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style lang="scss" scoped></style>
