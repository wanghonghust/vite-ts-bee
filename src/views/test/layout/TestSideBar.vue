<template>
  <el-menu
      default-active="/test/test1"
      class="el-menu-vertical-demo"
      @select="handleSelect"
      :router="true"
  >
    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <location/>
        </el-icon>
        <span>Navigator One</span>
      </template>
      <el-menu-item index="/test/test1" @click="testEv($event)">测试1</el-menu-item>
      <el-menu-item index="/test/test2" @click="testEv($event)">测试2</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="2">
      <el-icon>
        <icon-menu/>
      </el-icon>
      <span>Navigator Two</span>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <template #title>
        <el-icon>
          <document/>
        </el-icon>
        <span>Navigator Three</span>
      </template>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon>
        <setting/>
      </el-icon>
      <span>Navigator Four</span>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import {Document, Location, Menu as IconMenu, Setting,} from '@element-plus/icons-vue'
import {ref} from "vue";
import bus from "../../../utils/bus";

interface Tab {
  title: string,
  name: string,
}

const cureentItemTitle = ref()
const editableTabs = ref<Tab[]>([])

const handleSelect = (key: string, keyPath: string[], item: any, routeResult: any) => {
  editableTabs.value.push({
    title: cureentItemTitle.value,
    name: key,
  })
  bus.emit("editableTabs", editableTabs)

}
const testEv = (e: Event) => {
  // cureentItemTitle.value = e.target.innerHTML
  console.log(e.target)
}
</script>
