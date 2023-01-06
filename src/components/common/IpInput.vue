<template>
  <div class="ip-input">
    <el-input v-model="first" maxlength="3" minlength="1" @keyup="keyUp(1,$event)" @keydown="keyDown(1,$event)"
              ref="ref1"/>
    <div class="dot">.</div>
    <el-input v-model="second" maxlength="3" minlength="1" @keyup="keyUp(2,$event)" @keydown="keyDown(2,$event)"
              ref="ref2"/>
    <span class="dot">.</span>
    <el-input v-model="third" maxlength="3" minlength="1" @keyup="keyUp(3,$event)" @keydown="keyDown(3,$event)"
              ref="ref3"/>
    <span class="dot">.</span>
    <el-input v-model="last" maxlength="3" minlength="1" @keyup="keyUp(4,$event)" @keydown="keyDown(4,$event)"
              ref="ref4"/>
  </div>
</template>
<script lang="ts" setup>
import {ref, watch} from 'vue'

defineProps({
  ip: {
    type: String
  }
})
const emits = defineEmits(["update:ip"])
const first = ref("")
const second = ref("")
const third = ref("")
const last = ref("")
const ref1 = ref(null)
const ref2 = ref(null)
const ref3 = ref(null)
const ref4 = ref(null)
const keyUp = (index: number, e: KeyboardEvent) => {
  if (index === 1) {
    first.value = first.value.replace(/\D/g, '')
    if (Number(first.value) <= 0 || Number(first.value) > 255) {
      first.value = first.value.slice(0, -1)
    }
  }
  if (index === 2) {
    second.value = second.value.replace(/\D/g, '')
    if ((second.value.startsWith("0") && second.value.length > 1) || Number(second.value) > 255) {
      second.value = second.value.slice(0, -1)
    }
  }
  if (index === 3) {
    third.value = third.value.replace(/\D/g, '')
    if ((third.value.startsWith("0") && third.value.length > 1) || Number(third.value) > 255) {
      third.value = third.value.slice(0, -1)
    }
  }
  if (index === 4) {
    last.value = last.value.replace(/\D/g, '')
    if ((last.value.startsWith("0") && last.value.length > 1) || Number(last.value) > 255) {
      last.value = last.value.slice(0, -1)
    }
  }
}
const keyDown = (index: number, e: KeyboardEvent) => {
  const pos = e.target.selectionStart
  if (index === 1) {
    first.value = first.value.replace(/\D/g, '')
    if (Number(first.value) <= 0 || Number(first.value) > 255) {
      first.value = first.value.slice(0, -1)
    }
    if ((first.value.length === 3 || (first.value.length > 0 && e.key === ".")) && e.key != "Backspace"&&e.key!="ArrowLeft") {
      ref2.value.focus()
    }
  }
  if (index === 2) {
    second.value = second.value.replace(/\D/g, '')
    if (second.value.length === 0 && e.key === "Backspace") {
      ref1.value.focus()
    }
    if ((second.value.startsWith("0") && second.value.length > 1) || Number(second.value) > 255) {
      second.value = second.value.slice(0, -1)
    }
    if ((second.value.length === 3 || (second.value.length > 0 && e.key === ".")) && e.key != "Backspace"&&e.key!="ArrowLeft") {
      ref3.value.focus()
    }
  }
  if (index === 3) {
    third.value = third.value.replace(/\D/g, '')
    if (third.value.length === 0 && e.key === "Backspace") {
      ref2.value.focus()
    }
    if ((third.value.startsWith("0") && third.value.length > 1) || Number(third.value) > 255) {
      third.value = third.value.slice(0, -1)
    }
    if ((third.value.length === 3 || (third.value.length > 0 && e.key === ".")) && e.key != "Backspace"&&e.key!="ArrowLeft") {
      ref4.value.focus()
    }
  }
  if (index === 4) {
    last.value = last.value.replace(/\D/g, '')
    if ((last.value.startsWith("0") && last.value.length > 1) || Number(last.value) > 255) {
      last.value = last.value.slice(0, -1)
    }
    if (last.value.length === 0 && e.key === "Backspace") {
      ref3.value.focus()
    }
  }
}
watch(() => [first.value, second.value, third.value, last.value], ([newFirst, newSecond, newThird, newLast], [oldFirst, oldSecond, oldThird, oldLast]) => {
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
  width: 200px;
  border: black solid 1.5px;
  border-radius: 5px;
}

.dot {
  font-size: 14px;
  line-height: 30px;
}
</style>