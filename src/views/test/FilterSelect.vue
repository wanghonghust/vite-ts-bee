<template>
  <el-popover :visible="popVisiable" :width="width">
    <template #reference>
      <el-input ref="buttonRef" v-model="selected.label" @click="onClickOutside" style="width: 200px">
        <template #prefix>
          <font-awesome-icon v-if="selected.value" :icon="selected.value"/>
        </template>
      </el-input>
    </template>
    <el-input v-model="searchText" placeholder="请输入图标名称" :suffix-icon="Search" @keyup="searchIcons"/>
    <el-row :gutter="5" style="max-height: 200px;overflow: auto;margin-top: 1rem;">
      <el-col v-for="item in searchRes" :span="12">
        <el-tag type="info" :key="item" style="justify-content: start;margin-bottom: 5px;" @click="selectIcon(item)">
          <font-awesome-icon :icon="item.value"/>
          <span style="margin-left: 5px;">{{ item.label }}</span>
        </el-tag>
      </el-col>
    </el-row>
  </el-popover>

</template>
<script lang="ts">
export default {
  name: 'FilterSelect',
}
</script>
<script lang="ts" setup>
import {ref, toRefs} from "vue"
import {Search} from '@element-plus/icons-vue'

interface Icon {
  label: string
  value: string
}

const props = defineProps({
  options: {
    type: Array<Icon>,
    default: []
  },
  width: String,
})
const {options} = toRefs(props)
const popVisiable = ref(false)
const buttonRef = ref()
const searchRes = ref<Icon[]>(options.value)
const onClickOutside = () => {
  popVisiable.value = !popVisiable.value
}
const searchText = ref("")
const selected = ref<Icon>({
  label: "",
  value: "",
})
const value = ref('')
const selectIcon = (tag: Icon) => {
  selected.value = tag
  popVisiable.value = false
}
const searchIcons = () => {
    searchRes.value = options.value.filter((item) => item.label.includes(searchText.value))
}

</script>
<style scoped>
.el-tag:hover {
  cursor: pointer;
}
</style>
