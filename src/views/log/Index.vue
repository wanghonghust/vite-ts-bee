<template>
  <el-row class="role-table-row">
    <el-col>
      <el-table :data="logs" row-key="description" stripe class="role-table" max-height="780" highlight-current-row
                table-layout="fixed">
        <el-table-column label="编号" type="index" width="60"/>
        <el-table-column label="接口路径" sortable prop="fullPath"/>
        <el-table-column label="请求方式" sortable prop="method">
          <template #default="scope">
            <el-tag :type="tagInfo[scope.row.method]">{{ scope.row.method }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="IP" sortable prop="remoteIP"/>
        <el-table-column label="请求体" prop="body"/>
        <el-table-column label="响应体" prop="response">
          <template #default="scope">
            <template v-if="scope.row.response">
              <el-popover
                  placement="right"
                  title="响应体"
                  :width="350"
                  trigger="click"
              >
                <template #reference>
                  <el-button type="primary" link>查看详情</el-button>
                </template>
                <el-card shadow="hover" style="max-height: 300px;overflow:auto;">
                  <json-viewer
                      v-if="isJSON(scope.row.response)"
                      :value="JSON.parse(scope.row.response)"
                      copyable sort

                  ></json-viewer>
                  <span v-else>
                  {{scope.row.response}}
                </span>
                </el-card>
              </el-popover>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="响应状态码" prop="status"/>
        <el-table-column label="响应时间" prop="responseTime">
          <template #default="scope">
            {{ scope.row.responseTime }}ms
          </template>
        </el-table-column>
        <el-table-column label="用户ID" prop="userId">
        </el-table-column>
        <el-table-column label="请求时间" prop="createdAt">
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getLogs, Log} from "../../api/log";
import {isJSON} from "../../api/common";

const tagInfo = {
  GET: "",
  POST: "success",
  DELETE: "danger",
  PUT: "warning",
}
const logs = ref<Log[]>([])
onMounted(() => {
  getLogs().then((res) => {
    logs.value = res.data.data
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
div::-webkit-scrollbar {
  width: 0;
}
</style>
