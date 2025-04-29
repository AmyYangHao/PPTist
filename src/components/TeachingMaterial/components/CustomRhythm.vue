<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { apiCommon } from "@/api/apiServer";
import { getJsonValue } from "../utils";
import message from "@/utils/message";

interface StateProps {
  tableData: API.CustomList[];
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
  tableData: [],
});

const pagenation = reactive<Pagenation>({
  current: 1,
  total: 0,
});

const editData = reactive<Partial<Omit<API.CustomList, "source_tonics">>>({
  id: undefined,
  name: undefined,
});

onMounted(() => {
  fetchTableData();
});

const fetchTableData = async () => {
  const resp = await apiCommon.getRhythmList({
    page: pagenation.current,
    size: 8,
  });
  state.tableData = resp.data.items;
  pagenation.total = resp.data.count;
};

const onInsert = (scope: API.CustomList) => {
  emits("insert", `?q=train_rhythm&id=${scope.id}&source=ppt&trainType=自定义节奏训练`);
};

const onCurrentChange = (v: number) => {
  pagenation.current = v;

  fetchTableData();
};

const updateHandle = () => {
  if (!editData.name?.trim()) return message.warning("请输入名称");
  apiCommon.updateRhythm({ id: editData.id!, title: editData.name! }).then(() => {
    message.success("修改成功");
    fetchTableData();
    editData.id = undefined;
    editData.name = undefined;
  });
};

const removeHandle = (scope: API.CustomList) => {
  apiCommon.deleteRhythm(scope.id).then(() => {
    message.success("删除成功");
    fetchTableData();
  });
};

const formatter = (_: API.CustomList, _column: API.CustomList, cellValue: string) => {
  return getJsonValue(cellValue, "timeSignature");
};
</script>

<template>
  <el-table :data="state.tableData" style="width: 100%" highlight-current-row empty-text="暂无数据">
    <el-table-column type="index" width="80" label="序号" />
    <el-table-column prop="name" label="节奏训练名称" width="310">
      <template #default="scope">
        <template v-if="scope.row.id === editData.id">
          <el-space>
            <el-input v-model="editData.name" maxlength="15" show-word-limit />
            <el-button type="primary" link @click="updateHandle">保存</el-button>
            <el-button
              link
              @click="
                editData.id = undefined;
                editData.name = undefined;
              "
              >取消</el-button
            >
          </el-space>
        </template>
        <span v-else>{{ scope.row.name }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="source_tonics" label="节拍" width="80" :formatter="formatter" />
    <el-table-column prop="create_time" label="上传时间" width="170" />
    <el-table-column label="操作" fixed="right" width="150" align="center">
      <template #default="{ row }">
        <el-button
          link
          size="small"
          type="primary"
          @click.prevent="
            editData.id = row.id;
            editData.name = row.name;
          "
          >重命名</el-button
        >
        <el-button link size="small" type="primary" @click.prevent="removeHandle(row)">删除</el-button>
        <el-button link type="danger" size="small" @click.prevent="onInsert(row)">插入</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination" v-show="pagenation.total">
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
