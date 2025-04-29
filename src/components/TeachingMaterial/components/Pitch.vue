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
      name: "模唱训练",
    },
    {
      id: 2,
      name: "构唱训练",
    },
    {
      id: 3,
      name: "听音训练",
    },
  ],
});

const onInsert = ({ id }: { id: number }) => {
  if (id === 1) {
    emits("insert", `?q=train_pitch_imitation&source=ppt`);
  } else if (id === 2) {
    emits("insert", `?q=train_pitch_composition&source=ppt`);
  } else if (id === 3) {
    emits("insert", `?q=train_pitch_ear&source=ppt`);
  }
};
</script>

<template>
  <el-table :data="state.tableData" style="width: 100%" highlight-current-row empty-text="暂无数据">
    <el-table-column type="index" width="60" label="序号" />
    <el-table-column prop="name" label="音高互动名称" />
    <el-table-column label="操作" fixed="right" width="100">
      <template #default="scope">
        <el-button type="danger" size="small" @click.prevent="onInsert(scope.row)">插入</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style lang="scss" scoped></style>
