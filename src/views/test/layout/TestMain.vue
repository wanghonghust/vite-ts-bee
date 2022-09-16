<template>

  <el-tabs
      v-model="editableTabsValue"
      type="card"
      class="demo-tabs"
      closable
      @tab-remove="removeTab"
      @tab-click="changeTab"
  >
    <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
        class="tab-content"
    >
    </el-tab-pane>
    <div class="main">
      <el-scrollbar>
        <router-view/>
      </el-scrollbar>
    </div>
  </el-tabs>
</template>
<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import bus from "../../../utils/bus";
import {reloadRouter} from "../../../api/common";
import {TabsPaneContext} from "element-plus";
import Event from "vite";

let tabIndex = 2
const changeTab = (tab:TabsPaneContext,event:Event) => {
  reloadRouter(`/test/test${tabIndex}`)
  console.log(tab.index,tab.props.name,tab)
}
const editableTabsValue = ref('2')
const editableTabs = ref([])
onMounted(()=>{
  bus.on("editableTabs",(parma:any)=>{
    editableTabs.value = parma.value
  })
})
const removeTab = (targetName: string) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }

  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
}
</script>
<style scoped>
:deep(.el-tabs__content) {
  padding: 5px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

:deep(.el-tabs__header) {
  border-bottom: none;
  box-shadow: 0 2px 10px rgb(218 218 218 / 86%);
  padding-bottom: 1px;
}

.main {
  border-radius: 5px;
  height: calc(100vh - 140px);
  box-shadow: 0 2px 10px rgb(218 218 218 / 86%);
}
</style>
