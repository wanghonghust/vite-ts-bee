<template>
  <el-row class="role-table-row">
    <el-col>
      <el-table :data="tasks" row-key="description" stripe class="role-table" max-height="780" highlight-current-row
                table-layout="fixed">
        <el-table-column label="编号" type="index" width="60"/>
        <el-table-column label="UUID" sortable prop="uid"/>
        <el-table-column label="名称" sortable prop="name"/>
        <el-table-column label="注册名称" prop="registerName"/>
        <el-table-column label="类型" prop="type">
          <template #default="scope">
            {{!scope.row.type?"异步任务":"周期任务"}}
          </template>
        </el-table-column>
        <el-table-column label="时区" prop="TZone"/>
        <el-table-column label="任务描述" prop="desc"/>
        <el-table-column label="创建时间" prop="createdAt"/>
        <el-table-column label="执行时间" prop="time"/>
        <el-table-column label="任务状态" prop="state">
          <template #default="scope">
            <el-icon v-if="scope.row.state==='PENDING'"  class="is-loading" color="#409EFC">
              <Loading />
            </el-icon>
            <el-icon v-else-if="scope.row.state==='SUCCESS'"  color="#72d039">
              <SuccessFilled />
            </el-icon>
            <el-icon v-else-if="scope.row.state==='FAILURE'" color="#ff3030" >
              <CircleCloseFilled />
            </el-icon>
            <span>{{scope.row.state}}</span>
          </template>
        </el-table-column>
        <el-table-column label="结果" prop="result">
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getTask, Task} from "../../../../api/async_task";
import {Loading,SuccessFilled,CircleCloseFilled} from "@element-plus/icons-vue";
// const state = {
//   "PENDING":{
//   },
//   "RECEIVED":,
//   "STARTED":,
//   "RETRY":,
//   "SUCCESS":,
//   "FAILURE":,
// }
const tasks = ref<Task[]>([])
onMounted(() => {
  getTask().then((res) => {
    tasks.value = res.data.data
  })
})

</script>

<style scoped>

</style>
