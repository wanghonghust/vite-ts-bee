<template>
  <div class="login-content">
    <div class="login-main">
      <div class="logo">
        <el-image style="width: 100px; height: 100px" :src="logo"/>
        <span>Admin</span>
      </div>
      <el-tabs v-model="activeName" class="login-tabs" type="card">
        <el-tab-pane label="账号密码登录" name="first">
          <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px" size="large"
                   label-position="right">
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
        </el-tab-pane>
        <el-tab-pane label="短信登录" name="second">
          <el-form>
            <el-form-item prop="number">
              <el-input v-model="ruleForm.username" type="text" autocomplete="off" placeholder="请输入手机号">
                <template #prefix>
                  <el-icon class="el-input__icon">
                    <Cellphone/>
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-row style="margin-right: 2rem;">
                <el-col :span="16">
                  <el-input v-model="ruleForm.password" class="code" type="text" autocomplete="off" show-password
                            placeholder="请输入验证码">
                    <template #prefix>
                      <el-icon class="el-input__icon">
                        <lock/>
                      </el-icon>
                    </template>
                  </el-input>
                </el-col>
                <el-col :span="8">
                  <el-button type="primary" class="code-button" :disabled="btnDisabled" @click="getActCode">
                    {{ codeBtnText }}
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)" size="large">登录</el-button>
          </el-form>
        </el-tab-pane>

      </el-tabs>
    </div>
  </div>

</template>


<script lang="ts" setup>
import {reactive, ref} from 'vue'
import {ElMessage, FormInstance} from 'element-plus'
import {login} from "../../api/auth";
import router from "../../router";
import {Session} from "../../utils/storage";

const codeBtnText = ref("获取验证码")
const btnDisabled = ref(false)
const activeName = ref('first')
const logo = ref("/src/assets/OIP-C.png")
const ruleFormRef = ref<FormInstance>()
const getActCode = () => {
  let tmp = 60
  btnDisabled.value = true
  let inter = setInterval(() => {
    codeBtnText.value = String(tmp)
    tmp = tmp - 1
    if (tmp == -1) {
      clearInterval(inter)
      codeBtnText.value = "获取验证码"
      btnDisabled.value = false
    }

  }, 1000)
}

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
        const redirect = router.currentRoute.value.query.redirect
        if (redirect) {
          router.push(redirect)
        } else {
          router.push("/index")
        }
        ElMessage({
          message: '登录成功！',
          type: 'success',
        })
      }).catch((error: any) => {
        const status = error.response.status
        if (status === 403) {
          ElMessage({
            message: '用户已被禁用，请联系管理员处理！',
            type: 'error',
          })
        } else if (status === 401) {
          ElMessage({
            message: '登录失败，请检查账号、密码是否正确！',
            type: 'error',
          })
        } else {
          ElMessage({
            message: '网络连接错误！',
            type: 'error',
          })
        }

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
.login-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.login-content {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10%;
  background-image: url("/src/assets/bg.jpg");
  background-size: cover;
}

.login-main {
  width: 350px;
  padding: 2rem 2rem;
  background: rgb(145 145 145 / 20%);
  border-radius: 10px;
  backdrop-filter: blur(5px);
  box-shadow: 0 5px 15px rgb(193 193 193 / 80%);
}

:deep(.el-tabs__content) {
  border-radius: 10px;
}

:deep(.el-tabs--card>.el-tabs__header) {
  border: none;
  padding: 0 2rem;
  margin-bottom: 2rem;
}

:deep(.el-tabs--card>.el-tabs__header .el-tabs__item) {
  border: none;
}

:deep(.el-tabs--card>.el-tabs__header .el-tabs__nav) {
  border: none;
}

@media screen and (max-width: 480px) {
  .login-main {
    width: calc(100% - 90px);
  }

  :deep(.el-input__wrapper) {
    margin: 0 1rem !important;
  }

  .el-button {
    margin: 0 1rem !important;
    width: calc(100% - 2rem) !important;
    height: 42px;
  }

  .code-button {
    margin: 0 !important;
    width: calc(100% + 15px) !important;
    height: 42px;
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
  height: 40px;
  padding: 1px 15px;
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

.code {
  margin-right: 0;
}

:deep(.el-col>.el-input>.el-input__wrapper) {
  margin-right: 0.5rem;
}

.code-button {
  margin: 0;
  width: 106px;
  height: 42px;
}
</style>
