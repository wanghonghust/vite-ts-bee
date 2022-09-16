<template>
  <div class="login-content">
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px" size="large"
             label-position="right">
      <div class="logo">
        <el-image style="width: 100px; height: 100px" :src="logo"/>
        <span>Admin</span>
      </div>
      <el-form-item prop="username">
        <el-input v-model="ruleForm.username" type="text" autocomplete="off" placeholder="请输入账号">
          <template #prefix>
            <el-icon class="el-input__icon">
              <userFilled/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="ruleForm.password" type="text" autocomplete="off" show-password placeholder="请输入密码">
          <template #prefix>
            <el-icon class="el-input__icon">
              <lock/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
    </el-form>
  </div>

</template>


<script lang="ts" setup>
import {reactive, ref} from 'vue'
import {ElMessage, FormInstance} from 'element-plus'
import {login} from "../../api/auth";
import 'element-plus/es/components/message/style/css'
import router from "../../router";
import {Session} from "../../utils/storage";

const logo = ref("/src/assets/OIP-C.png")
const ruleFormRef = ref<FormInstance>()
const validateUsername = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入用户账号！'))
  } else {
    callback()
  }
}
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码！'))
  } else {
    callback()
  }
}

const ruleForm = reactive({
  username: '',
  password: '',
})

const rules = reactive({
  username: [{validator: validateUsername, trigger: 'blur'}],
  password: [{validator: validatePass, trigger: 'blur'}],
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      login(ruleForm).then(async (res: any) => {
        Session.set("token", res.data.data.token)
        Session.set("user", res.data.data.user)
        Session.set("username", res.data.data.username)
        Session.set("email", res.data.data.email)
        Session.set("avatar", res.data.data.avatar)
        Session.set("createAt", res.data.data.createAt)
        await router.push("/index")
        ElMessage({
          message: '登录成功！',
          type: 'success',
        })
      }).catch((error: any) => {
        ElMessage({
          message: '登录失败，请检查账号、密码是否正确！',
          type: 'error',
        })
      })
    } else {
      return false
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style scoped>
.login-content {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: self-start;
  padding-top: 10%;
  background-image: url("/src/assets/bg.jpg");
  background-size: cover;
}

.el-form {
  width: 350px;
  padding: 2rem 2rem;
  background: rgba(241, 228, 210, 0.2);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  box-shadow: 0 5px 15px rgb(152 152 152 / 80%);
}

@media screen and (max-width: 480px) {
  .el-form {
    width: calc(100% - 100px);
  }
}

.el-input {
  width: 100%;
}

.el-form-item {
  margin-bottom: 28px;
}

:deep(.el-input__wrapper) {
  margin: 0 2rem;
}

:deep(.el-form-item__content) {
  margin-left: 0 !important;
}

:deep(.el-form-item__error) {
  font-size: 14px;
  padding-left: 2rem;
}

.el-button {
  margin: 0 2rem;
  width: calc(100% - 4rem);
}

.logo {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  text-align: center;
  vertical-align: center;
  align-items: center;
}

.logo > span {
  font-size: 28px;
  color: #263238;
  font-weight: bold;
}
</style>
