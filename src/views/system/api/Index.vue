<template>
  <el-row class="role-table-row">
    <el-col>
      <el-table :data="apis" row-key="description" stripe class="role-table" max-height="780" highlight-current-row
                table-layout="fixed">
        <el-table-column label="编号" type="index" width="60"/>
        <el-table-column label="接口路径" sortable prop="path"/>
        <el-table-column label="请求方式" sortable prop="method">
          <template #default="scope">
            <el-tag :type="tagInfo[scope.row.method]">{{scope.row.method}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否被使用" prop="description">
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Api, getApiBackends} from "../../../api/api";
const tagInfo = {
  GET:"",
  POST:"success",
  DELETE:"danger",
  PUT:"warning",
}
const apis = ref<Api[]>([])
onMounted(() => {
  getApiBackends().then((res) => {
    apis.value = res.data.data
  })
})

</script>

<style scoped>
.el-row {
  margin-bottom: 2rem;
}

.role-table-row {
  width: calc(100% - 4rem);
  margin: 0 auto;
}

.role-table {
  width: 100%;
  height: 100%;
}

.pagination {
  margin-top: 2rem;
}

:deep(.el-pagination__sizes) {
  margin: 0 16px;
  font-weight: 400;
}

:deep(.el-pagination .el-select .el-input) {
  width: 128px;
}

:deep(.el-pagination__jump) {
  margin-left: 0;
}

.el-table .cell {
  display: flex;
  align-items: center;
}

.el-select {
  width: 100%;
}

.el-dialog {
  width: 40%;
}

.el-tag {
  margin-left: 0.25rem;
}
</style>
