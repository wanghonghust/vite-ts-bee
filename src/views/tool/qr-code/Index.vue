<template>
  <el-form
      ref="qrFormRef"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
  >
    <el-form-item label="url" prop="url" required class="form-input">
      <el-input v-model="ruleForm.url" type="text" placeholder="请输入路由"/>
    </el-form-item>
    <el-form-item label="size" prop="size" required class="form-input">
      <el-input v-model.number="ruleForm.size" type="text" placeholder="请输入图片尺寸"/>
    </el-form-item>
    <el-form-item>
      <el-empty :image-size="256" :image="qrImage" description=" "/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(qrFormRef)">生成二维码</el-button>
      <el-button v-if="qrImage" type="primary" @click="downLoadQr">下载</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import type {FormInstance} from 'element-plus'
import {ElMessage} from "element-plus";
import {genQRcode} from "../../../api/tool-qrcode";

const qrFormRef = ref<FormInstance>()
const qrImage = ref('')
const validateUrl = (rule: any, value: string, callback: any) => {
  if (value.trim() === '') {
    callback(new Error('请输入路由地址'))
  } else if (value.trim().length >= 256) {
    callback(new Error('路由长度应小于256'))
  } else {
    callback()
  }
}
const validateSize = (rule: any, value: number, callback: any) => {
  const patt = /^[1-9][0-9]*$/
  if (!patt.test(String(value))) {
    callback(new Error('请输入正整数'))
  } else if (value > 1024) {
    callback(new Error('图片尺寸应小于等于1024'))
  } else if (value < 128) {
    callback(new Error('图片尺寸应大于等于128'))
  } else {
    callback()
  }
}

const ruleForm = reactive({
  url: '',
  size: 256,//默认尺寸为256
})

const rules = reactive({
  url: [{validator: validateUrl, trigger: 'blur'}],
  size: [{validator: validateSize, trigger: 'blur'}],
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      genQRcode(ruleForm).then((res) => {
        ElMessage({
          type: "success",
          message: "生成二维码成功"
        })
        // 生成路由
        qrImage.value = URL.createObjectURL(res.data)
      }).catch((error) => {
      })
    } else {
      console.log('error submit!')
      return false
    }
  })
}
// 下载图片
const downLoadQr = () => {
  let a = document.createElement("a")
  let event = new MouseEvent("click")
  a.download = ""
  a.href = qrImage.value
  a.dispatchEvent(event)
}
</script>

<style scoped>
.form-input {
  width: 60%;
}

.el-empty {
  height: 356px;
}

@media screen and (max-width: 1000px) {
  .form-input {
    width: 100%;
  }

  :deep(.el-form-item__label) {
    width: auto !important;
  }
}
</style>
