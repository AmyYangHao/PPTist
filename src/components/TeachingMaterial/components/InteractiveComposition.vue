<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { apiCommon } from "@/api/apiServer";
import { watch } from "vue";

interface StateProps {
  formData: { classify_id?: number; keyword: string };
  classifyOptions: API.classifyOptions[];
  tableData: API.BeatItemProps[];
}

interface Pagenation {
  current: number;
  total: number;
}

// -- props & emits
const emits = defineEmits<{
  (event: "insert", payload: string): void;
}>();

const state = reactive<StateProps>({
  formData: {
    keyword: "",
  },
  classifyOptions: [],
  tableData: [],
});

const pagenation = reactive<Pagenation>({
  current: 1,
  total: 0,
});

onMounted(() => {
  fetchOptions(3);
  fetchTableData();
});

const fetchOptions = async (scope: number) => {
  const resp = await apiCommon.getOptions(scope);
  state.classifyOptions = resp.data;
};

const fetchTableData = async () => {
  const resp = await apiCommon.getInteractList({
    page: pagenation.current,
    size: 8,
    keyword: state.formData.keyword,
    classify_id: state.formData.classify_id,
  });
  state.tableData = resp.data.items;
  pagenation.total = resp.data.count;
};

const onSearch = () => {
  pagenation.current = 1;
  fetchTableData();
};
const onInsert = (scope: API.BeatItemProps) => {
  emits("insert", `?q=interactive_creation&id=${scope.id}&source=ppt`);
};

const onCurrentChange = (v: number) => {
  pagenation.current = v;
  fetchTableData();
};

watch(
  () => state.formData.classify_id,
  (v) => {
    pagenation.current = 1;
    state.formData.keyword = "";
    fetchTableData();
  }
);
</script>

<template>
  <el-form :inline="true" :model="state.formData" class="demo-form-inline">
    <el-form-item>
      <el-select clearable v-model="state.formData.classify_id" placeholder="请选择模板类型" style="width: 150px">
        <el-option v-for="item in state.classifyOptions" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-input v-model="state.formData.keyword" style="width: 240px" clearable placeholder="请输入模板名称" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSearch">查询</el-button>
    </el-form-item>
  </el-form>

  <el-table :data="state.tableData" style="width: 100%" highlight-current-row empty-text="暂无数据">
    <el-table-column type="index" width="80" label="序号" />
    <el-table-column prop="name" label="模板" />
    <el-table-column prop="signature" label="节拍" />
    <el-table-column label="操作" fixed="right" width="100">
      <template #default="scope">
        <el-button type="danger" size="small" @click.prevent="onInsert(scope.row)">插入</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination">
    <span class="total">共 {{ pagenation.total }} 条</span>
    <el-pagination :page-size="8" :current-page="pagenation.current" @current-change="onCurrentChange" layout="prev, pager, next" :total="pagenation.total" />
  </div>
</template>

<style lang="scss" scoped>
.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
  color: #333;
  .total {
    margin-right: 12px;
  }
}
</style>
