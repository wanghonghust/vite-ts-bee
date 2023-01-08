<template>
  <div class="ip-input">
    <template v-for="(item,index) in ipArray">
      <el-input v-model="item.value" maxlength="3" minlength="1" @input="checkVal(item)"
                @keydown="keyDown(index,item,$event)" :ref="setItemRef"/>
      <div v-if="index!==3" class="dot">.</div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue'
import IpInput from "./IpInput.vue";

defineProps({
  ip: {
    type: String
  }
})
const inputRef = ref<any>([])
const ipArray = ref([{value: ""}, {value: ""}, {value: ""}, {value: ""}])
const emits = defineEmits(["update:ip"])
const checkVal = (item: Object) => {
  item.value = item.value.replace(/\D/g, '')
  const tmp = parseInt(item.value, 10)
  if (!isNaN(tmp)) {
    item.value = tmp > 255 ? 255 : tmp.toString()
  }
}
const keyDown = (index: number, item: Object, e: KeyboardEvent) => {
  if (e.key === "ArrowLeft") {
    if (index !== 0 && e.currentTarget.selectionStart === 0) {
      inputRef.value[index - 1].focus();
    }
  } else if (e.key === "ArrowRight") {
    if (index !== 3 && e.currentTarget.selectionStart === item.value.toString().length) {
      inputRef.value[index + 1].focus();
    }
  } else if (e.key === "Backspace") {
    if (index !== 0 && item.value === '') {
      inputRef.value[index - 1].focus();
    }
  } else if (e.key === "Enter" || e.key === " " || e.key === ".") {
    if (index !== 3) {
      inputRef.value[index + 1].focus();
    }
  } else if (item.value.length === 3) {
    if (index !== 3) {
      inputRef.value[index + 1].focus();
    }
  }
}

const setItemRef = (el: any) => {
  if (el && !inputRef.value.includes(el)) {
    inputRef.value.push(el);
  }
}
watch(() => [ipArray.value[0].value, ipArray.value[1].value, ipArray.value[2].value, ipArray.value[3].value], ([newFirst, newSecond, newThird, newLast], [oldFirst, oldSecond, oldThird, oldLast]) => {
  let tmp = [newFirst, newSecond, newThird, newLast].join(".")
  let ipv4Regexp = /^(?!\.)((^|\.)([1-9]?\d|1\d\d|2(5[0-5]|[0-4]\d))){4}$/gm
  if (ipv4Regexp.test(tmp)) {
    emits("update:ip", tmp)
  }
})
</script>

<style scoped>
:deep(.el-input__wrapper) {
  box-shadow: none;
  border-radius: 0;
  text-align: center;
}

:deep(.el-input__inner) {
  text-align: center;
}

.ip-input {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  border: 1px var(--el-border-style) var(--el-border-color);
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  transition: var(--el-transition-box-shadow);
}

.dot {
  font-size: 14px;
  line-height: var(--el-input-inner-height)
}

.ip-input:hover,ip-input:focus {
  border: #409eff solid 1px;
}
</style>