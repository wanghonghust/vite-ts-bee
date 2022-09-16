<template>
  <div>
    <el-row :gutter="20">
      <el-col :md="8" :sm="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>用户信息</span>
            </div>
          </template>
          <div class="avatar">
            <el-avatar :size="80" :src="userinfo.avatar ? baseUrl + `system/file?id=` + userinfo.avatar:''"/>
          </div>
          <div class="info">
            <div>
              <i class="iconfont icon-yonghu">
              </i>
              <span>用户名称</span>
            </div>
            <div>
              <span>{{ userinfo.username }}</span>
            </div>
          </div>
          <div class="info">
            <div>
              <i class="iconfont icon-youxiang">
              </i>
              <span>用户邮箱</span>
            </div>
            <div>
              <span>{{ userinfo.email }}</span>
            </div>
          </div>
          <div class="info">
            <div>
              <i class="iconfont icon-daodianriqi">
              </i>
              <span>创建日期</span>
            </div>
            <div>
              <span v-text="userinfo.createdAt"></span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="16" :sm="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>基本信息</span>
            </div>
          </template>
          <el-tabs v-model="activeName" class="tabs">
            <el-tab-pane label="基本资料" name="first">
              <el-form
                  ref="ruleFormRef"
                  :model="ruleForm"
                  status-icon
                  :rules="rules"
                  label-width="120px"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="ruleForm.username" type="text" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input
                      v-model="ruleForm.email"
                      type="email"
                      autocomplete="off"
                  />
                </el-form-item>
                <el-form-item>
                  <div class="form-btn">
                    <el-button type="primary" @click="submitForm(ruleFormRef)"
                    >Submit
                    </el-button
                    >
                    <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="second">
              <el-form
                  ref="changeFormRef"
                  :model="changeForm"
                  status-icon
                  :rules="changeRules"
                  label-width="120px"
              >
                <el-form-item label="旧密码" prop="oldPassword">
                  <el-input v-model="changeForm.oldPassword" type="password" autocomplete="off" show-password/>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input v-model="changeForm.newPassword" type="password" autocomplete="off" show-password/>
                </el-form-item>
                <el-form-item label="确认密码" prop="confPassword">
                  <el-input v-model="changeForm.confPassword" type="password" autocomplete="off" show-password/>
                </el-form-item>
                <el-form-item>
                  <div class="form-btn">
                    <el-button type="primary" @click="changePass(changeFormRef)"
                    >Submit
                    </el-button
                    >
                    <el-button @click="resetForm(changeFormRef)">Reset</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import {Session} from "../../utils/storage";
import {onMounted, reactive, ref} from "vue";
import type {FormInstance} from 'element-plus'
import {ElMessage} from "element-plus";
import {changePwd, getUserInfo} from "../../api/auth";
import {baseUrl} from "../../api/common";
const activeName = ref('first')
const userId = Session.get("user")
const userinfo = ref({})

const ruleFormRef = ref<FormInstance>()
const changeFormRef = ref<FormInstance>()
const ruleForm = ref(userinfo)
const changeForm = reactive({
  id: Session.get("user"),
  oldPassword: "",
  newPassword: "",
  confPassword: ""
})
onMounted(() => {
  getUserInfo(userId).then((res) => {
    userinfo.value = res.data
  })
  return {
    userinfo
  }
})
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入用户名'))
  } else {
    if (ruleForm.username !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}
const validateOldPass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入旧密码'))
  } else {
    callback()
  }
}
const isPassValid = (value: string) => {
  if (value.length < 8 || value.length > 20) {
    return false
  }
  return true
}
const validateNewPass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else if (value == changeForm.oldPassword) {
    callback(new Error('新密码不能与旧密码相同'))
  } else if (!isPassValid(value)) {
    callback(new Error('密码长度大于等于8位小于等于20位'))
  } else {
    callback()
  }
}
const validateConfPass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入确认密码'))
  } else if (value != changeForm.newPassword) {
    callback(new Error('确认密码与新密码不相同'))
  } else {
    callback()
  }
}

const rules = reactive({
  username: [{validator: validatePass, trigger: 'blur', required: true,}],
  email: [{message: "请输入邮箱", trigger: 'blur', required: true, type: "email"}],
})
const changeRules = reactive({
  oldPassword: [{validator: validateOldPass, trigger: 'blur', required: true, type: "password"}],
  newPassword: [{validator: validateNewPass, trigger: 'blur', required: true, type: "password"}],
  confPassword: [{validator: validateConfPass, trigger: 'blur', required: true, type: "password"}],
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const changePass = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      changePwd(changeForm).then((res) => {
        ElMessage({
          type: "success",
          message: "修改密码成功"
        })
      }).catch(() => {
        ElMessage({
          type: "error",
          message: "修改密码失败"
        })
      })
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

</script>
<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--el-card-border-color);
}

.info > div {
  display: flex;
  align-items: center;
}

.info > div > i {
  margin: 0.2rem;
}

.el-card__body {
  display: flex;
  flex-direction: column;
}

.el-col {
  margin-bottom: 20px;
}

.el-col:last-child {
  margin-bottom: 0px;
}

.tabs {
  width: 100%;
}

.el-form-item__label {
  width: 80px !important;
}

.el-form-item__content {
  margin-left: 0px !important;
}

.form-btn {
  margin-left: 80px;
}

.avatar {
  display: flex;
  justify-content: center;
}
</style>
