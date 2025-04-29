<script setup lang="ts">
import { reactive, onMounted } from "vue";
import type { Option } from "./constants";
import { apiCommon } from "@/api/apiServer";

interface StateProps {
  keyword: string;
  tableData: any;
  textbookTypeId?: number;
  textbookTypes: Option[];
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
  keyword: "",
  textbookTypeId: undefined,
  textbookTypes: [],
  tableData: [],
});

const pagenation = reactive<Pagenation>({
  current: 1,
  total: 0,
});

onMounted(() => {
  fetchTableData();
  getTextbookTypes();
});

const getTextbookTypes = async () => {
  const resp = await apiCommon.getTextbookTypes();
  if (resp.code === 200) {
    state.textbookTypes = resp.data.map((item: any) => ({
      id: item.id,
      label: item.name,
    }));
  }
};
const fetchTableData = async () => {
  const resp = await apiCommon.getSongs({
    keyword: state.keyword || undefined,
    textbook_type_id: state.textbookTypeId,
    page: pagenation.current,
    size: 8,
  });
  state.tableData = resp.data.items.map((item: any) => ({
    ...item,
    directories_label: item.directories_label.join(", "),
  }));
  pagenation.total = resp.data.count;
};

const onSearch = () => {
  pagenation.current = 1;
  fetchTableData();
};
const onInsert = (scope: API.BaikeItemProps) => {
  emits("insert", `?q=song&id=${scope.id}&source=ppt`);
};

const onCurrentChange = (v: number) => {
  pagenation.current = v;
  fetchTableData();
};
console.log(state);
</script>

<template>
  <el-form :inline="true" class="demo-form-inline">
    <el-form-item>
      <el-select
        clearable
        v-model="state.textbookTypeId"
        style="width: 150px"
        placeholder="请选择教材版本"
      >
        <el-option
          v-for="item in state.textbookTypes"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-input
        v-model="state.keyword"
        style="width: 240px"
        clearable
        placeholder="歌曲名称"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSearch">查询</el-button>
    </el-form-item>
  </el-form>

  <el-table
    :data="state.tableData"
    style="width: 100%"
    highlight-current-row
    empty-text="暂无数据"
  >
    <el-table-column type="index" width="80" label="序号" />
    <el-table-column
      prop="name"
      label="歌曲名称"
      width="180"
      show-overflow-tooltip
    />
    <el-table-column prop="signature" label="拍号" width="60" />
    <el-table-column
      prop="directories_label"
      label="教材版本"
      show-overflow-tooltip
    >
      <!-- <template #default="{ row }">
        <div class="ellipsis-cell">
          {{ row.directories_label.join(", ") }}
        </div>
      </template> -->
    </el-table-column>
    <el-table-column label="操作" fixed="right" width="100">
      <template #default="scope">
        <el-button
          type="danger"
          size="small"
          @click.prevent="onInsert(scope.row)"
          >插入</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination">
    <span class="total">共 {{ pagenation.total }} 条</span>
    <el-pagination
      :page-size="8"
      :current-page="pagenation.current"
      @current-change="onCurrentChange"
      layout="prev, pager, next"
      :total="pagenation.total"
    />
  </div>
</template>

<style lang="scss" scoped>
.demo-form-inline {
  width: 100%;
  display: inline-block;
}
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
/* 设置单元格文本超出省略号样式 */
.ellipsis-cell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
}
</style>
