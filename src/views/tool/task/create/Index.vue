<template>
  <el-form ref="formRef" :model="form" label-width="120px" :rules="rules">
    <el-form-item label="任务名称" prop="name">
      <el-input v-model="form.name"/>
    </el-form-item>
    <el-form-item label="时区" prop="TZone">
      <el-select v-model="form.TZone" placeholder="请选择时区">
        <el-option label="上海" value="shanghai"/>
        <el-option label="北京" value="beijing"/>
      </el-select>
    </el-form-item>
    <el-form-item label="执行时间">
      <el-date-picker
          v-model="form.time"
          type="datetime"
          placeholder="选择时间和日期"
      />
    </el-form-item>
    <el-form-item label="任务类型" prop="type">
      <el-radio-group v-model="form.type">
        <el-radio :label="0">定时任务</el-radio>
        <el-radio :label="1">周期任务</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="任务描述">
      <el-input v-model="form.desc" type="textarea"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit(formRef)">新建任务</el-button>
      <el-button type="warning" @click="onCancel(formRef)">取消创建</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import {FormInstance, FormRules} from "element-plus/es";
import {createTask} from "../../../../api/async_task";
import {ElMessage} from "element-plus";

const formRef = ref<FormInstance>()
// do not use same name with ref
const form = reactive({
  name: '',
  TZone: 'shanghai',
  time: new Date(),
  type: 0,
  desc: '',
})
const rules = reactive<FormRules>({
  name: [
    {required: true, message: '请输入任务名称', trigger: 'blur', type: 'string'},
    {min: 1, max: 15, message: '昵称长度为1到15', trigger: 'blur'},
  ],
  TZone: [
    {required: true, message: '请选择时区', trigger: 'blur', type: 'string'},
  ],
  type: [
    {required: true, message: '请选择任务类型', trigger: 'blur', type: 'number'},
  ]
})
const onSubmit = async (formRef1: FormInstance) => {
  if (!formRef1) return
  await formRef1.validate((valid, fields) => {
    if (valid) {
      createTask(form).then((res) => {
        ElMessage({
          type: "success",
          message: "创建任务成功"
        })
      }).catch((error) => {
        ElMessage({
          type: "error",
          message: error.response.data.msg
        })
      })
    }
  })
}
const onCancel = (form: FormInstance) => {
  form?.resetFields()
}
</script>
