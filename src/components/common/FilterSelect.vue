<template>
  <el-popover :visible="popVisiable" :width="popWidth">
    <template #reference>
      <el-input  v-model="modelValue" @click="onClickOutside" @input="onInput"  @change="$emit('onChange')" style="width: {{width}}">
        <template #prefix>
          <i v-if="modelValue" :class="modelValue"></i>
        </template>
      </el-input>
    </template>
    <el-input v-model="searchText" placeholder="请输入图标名称" :suffix-icon="Search" @keyup="searchIcons"/>
    <el-row :gutter="5" style="max-height: 200px;overflow: auto;margin-top: 1rem;">
      <el-col v-for="(item,idx) in searchRes" :key="idx" :span="12">
        <el-tag type="info"  style="justify-content: start;margin-bottom: 5px;" @click="selectIcon(item)">
          <i :class="item.value"></i> <span class="i-name">{{ item.label }}</span>
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
    type: Array < Icon >,
    default: []
  },
  width: {type:String,required: false,default:"100%"},
  modelValue: String,
  popWidth:{type:String,required: false,default:"350px"}
})

const {options} = toRefs(props)
const popVisiable = ref(false)
const searchRes = ref<Icon[]>(options.value)
const onClickOutside = () => {
  popVisiable.value = !popVisiable.value
}
const searchText = ref("")
const selected = ref<Icon>({
  label: "",
  value: "",
})
const emits=defineEmits(["input","update:modelValue","onChange"])

const value = ref('')
const selectIcon = (tag: Icon) => {
  selected.value = tag
  emits("update:modelValue",selected.value.value)
  popVisiable.value = false
}
const searchIcons = () => {
  searchRes.value = options.value.filter((item) => item.label.includes(searchText.value))
}
const onInput=(e:Event)=> {
  emits("update:modelValue", e);
  emits("input", e);
}
</script>
<style scoped>
.el-tag:hover {
  cursor: pointer;
}
</style>
