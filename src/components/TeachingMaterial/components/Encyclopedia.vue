<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { apiCommon } from "@/api/apiServer";
// eslint-disable-next-line no-duplicate-imports
import { watch } from "vue";
import type { Option } from "./constants";
import { MusicalInstrumentTypeSelectOptiopns } from "./constants";

interface StateProps {
  formData: { type: 1 | 2; classify_id?: number; keyword: string };
  placeholder: string;
  classifyOptions: API.classifyOptions[];
  tableData: API.BaikeItemProps[];
  selectOptions: Option[];
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
    type: 1,
    keyword: "",
  },
  placeholder: "请选择类型",
  classifyOptions: [],
  tableData: [],
  selectOptions: [],
});

const pagenation = reactive<Pagenation>({
  current: 1,
  total: 0,
});

const options1 = [
  { value: 1, label: "乐器" },
  { value: 2, label: "音乐家" },
];
const scope = {
  1: 2,
  2: 12,
};
onMounted(() => {
  fetchOptions(scope[2]);
  fetchTableData();
  getTreeOptions();
});

const fetchOptions = async (scope: number) => {
  const resp = await apiCommon.getOptions(scope);
  state.classifyOptions = resp.data;
};

const getTreeOptions = async () => {
  const resp = await apiCommon.getOptions(scope[1]);
  const options = MusicalInstrumentTypeSelectOptiopns?.map((parent) => {
    const parentIt = resp.data?.find((it) => it?.label === parent?.label);
    let children: Option[] = [];

    if (parent?.children) {
      children = parent.children.map((item) => {
        const it = resp.data?.find((it) => it?.label === item?.label);
        return {
          label: item.label,
          // 因数据中子节点id会有重复，这里加上父级id生成唯一键，提交表单时再还原
          id: `${parentIt?.id}-${it?.id}`,
        };
      });
    }
    return {
      label: parent.label,
      id: `${parentIt?.id}-${parentIt?.id}`,
      children,
    };
  });
  state.selectOptions = options;
};
const fetchTableData = async () => {
  const id = state.formData.classify_id;
  const classify_id = state.formData.type === 2 ? id : String(id)?.split("-")?.[1];
  const resp = await apiCommon.getWikiList({
    page: pagenation.current,
    size: 8,
    type: state.formData.type,
    keyword: state.formData.keyword,
    classify_id: classify_id ? +classify_id : undefined,
  });
  state.tableData = resp.data.items;
  pagenation.total = resp.data.count;
};

const onSearch = () => {
  pagenation.current = 1;
  fetchTableData();
};
const onInsert = (scope: API.BaikeItemProps) => {
  emits("insert", `?q=${state.formData.type === 1 ? "instrument" : "musician"}&id=${scope.id}&source=ppt`);
};

const onCurrentChange = (v: number) => {
  state.formData.keyword = "";
  pagenation.current = v;
  fetchTableData();
};

watch(
  () => state.formData.classify_id,
  (v) => {
    pagenation.current = 1;
    fetchTableData();
  }
);
watch(
  () => state.formData.type,
  (v) => {
    pagenation.current = 1;
    state.placeholder = v === 1 ? "请选择类型" : "请选择国籍";
    state.formData.classify_id = undefined;
    state.formData.keyword = "";
    fetchOptions(scope[2]);
    fetchTableData();
  }
);
</script>

<template>
  <el-form :inline="true" :model="state.formData" class="demo-form-inline">
    <el-form-item>
      <el-select clearable v-model="state.formData.type" style="width: 100px" placeholder="请选择">
        <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-select clearable v-if="state.formData.type === 2" v-model="state.formData.classify_id" :placeholder="state.placeholder" style="width: 150px">
        <el-option v-for="item in state.classifyOptions" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>

      <el-tree-select
        clearable
        v-else
        :placeholder="state.placeholder"
        v-model="state.formData.classify_id"
        :data="state.selectOptions"
        :props="{
          value: 'id',
        }"
        check-strictly
        :render-after-expand="false"
        style="width: 150px"
      />
    </el-form-item>
    <el-form-item>
      <el-input v-model="state.formData.keyword" style="width: 240px" clearable placeholder="请输入关键字" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSearch">查询</el-button>
    </el-form-item>
  </el-form>

  <el-table :data="state.tableData" style="width: 100%" highlight-current-row empty-text="暂无数据">
    <el-table-column type="index" width="80" label="序号" />
    <el-table-column prop="classify_names" :label="state.formData.type === 1 ? '乐器类型' : '音乐家国籍'" />
    <el-table-column prop="name" :label="state.formData.type === 1 ? '乐器名称' : '音乐家名字'" />
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
