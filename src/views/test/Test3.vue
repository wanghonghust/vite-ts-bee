<template>
  <!-- 要给外层div指定合适的宽度 -->
  <div style="width: 60%;">
    <BaiduCalendar @change="change"  :range="range"/>
  </div>
</template>
<script setup >
import {BaiduCalendar} from "vue-baidu-calendar"
//date改变触发事件
const change = (obj)=>{

}
const range = [1995,2100] //设置年份范围 默认[2010,2030]
</script>
<style scoped>
:deep(.op-calendar-pc-backtoday){
  height: auto;
}

:deep(.op-calendar-pc-left){
  border: 2px solid #f0f0f0;
  border-right: none;
}
:deep(.op-calendar-pc-right) {
  border: 2px solid #d5d5d5;
}
</style>

