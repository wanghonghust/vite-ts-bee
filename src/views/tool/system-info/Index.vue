<template>
  <el-row :gutter="20">
    <el-col :md="24" :lg="12">
      <el-card>
        <el-descriptions :column="2" direction="horizontal" title="系统信息">
          <el-descriptions-item label="主机名：">{{ systemInfos.host?.hostname }}</el-descriptions-item>
          <el-descriptions-item label="OS：">{{ systemInfos.host?.os }}</el-descriptions-item>
          <el-descriptions-item label="平台：">{{ systemInfos.host?.platform }}</el-descriptions-item>
          <el-descriptions-item label="平台版本：">{{ systemInfos.host?.platformVersion }}</el-descriptions-item>
          <el-descriptions-item label="内核架构：">{{ systemInfos.host?.kernelArch }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-col>
    <el-col :md="24" :lg="12">
      <el-card>
        <el-descriptions :column="2" direction="horizontal" title="CPU信息">
          <el-descriptions-item label="处理器：">{{ systemInfos.cpuInfo?.modelName }}</el-descriptions-item>
          <el-descriptions-item label="核心数：">{{ systemInfos.cpuInfo?.cores }}</el-descriptions-item>
          <el-descriptions-item label="CPU：" :span="2">
            <el-progress
                :text-inside="true"
                :stroke-width="16"
                :percentage="Number(systemInfos.cpuInfo?.cpuPercent?.toFixed(2))? Number(systemInfos.cpuInfo?.cpuPercent?.toFixed(2)) : 0"
                status="success"
            />
          </el-descriptions-item>
          <el-descriptions-item label="RAM" :span="2">
            <el-progress
                :text-inside="true"
                :stroke-width="16"
                :percentage="Number(systemInfos.memInfo?.usedPercent.toFixed(2)) ? Number(systemInfos.memInfo?.usedPercent.toFixed(2)) : 0"
                status="success"
            />
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :md="24" :lg="12" v-for="item in systemInfos.disk">
      <el-card>
        <el-descriptions :column="2" direction="horizontal" title="硬盘信息">
          <el-descriptions-item label="硬盘名称：">{{ item.device }}</el-descriptions-item>
          <el-descriptions-item label="fstype：">{{ item.fstype }}</el-descriptions-item>
          <el-descriptions-item label="大小：">{{
              (item.total / 1024 / 1024 / 1024).toFixed(2)
            }}GB
          </el-descriptions-item>
          <el-descriptions-item label="已使用：">{{
              (item.used / 1024 / 1024 / 1024).toFixed(2)
            }}GB
          </el-descriptions-item>
          <el-descriptions-item label="未使用：">{{
              (item.free / 1024 / 1024 / 1024).toFixed(2)
            }}GB
          </el-descriptions-item>
          <el-descriptions-item label="使用率：" :span="2">
            <el-progress
                :text-inside="true"
                :stroke-width="16"
                :percentage="Number(item.usedPercent.toFixed(2))"
                status="exception"
            />
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref} from "vue";
import {systemInfo} from "../../../api/tool-system-info";
import {ElMessage} from "element-plus";

const timer = ref<number>()
const systemInfos = ref({})
const getSystemInfo = () => {
  systemInfo().then((res) => {
    systemInfos.value = res.data.data
  }).catch((err) => {
    ElMessage({
      type: "error",
      message: "获取系统信息失败"
    })
  })
  return getSystemInfo
}
onMounted(() => {
  timer.value = setInterval(getSystemInfo(), 2000)
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
})

</script>

<style>
.el-col {
  margin-bottom: 1rem;
}
</style>
