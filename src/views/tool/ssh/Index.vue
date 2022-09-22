<template>
  <div></div>
  <el-button type="primary" @click="dialogVisible = true">新增ssh连接</el-button>
  <el-dialog
      v-model="dialogVisible"
      title="新建SSH连接"
      width="20%"
      @close="resetForm(ruleFormRef)"
  >
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
    >
      <el-form-item label="连接名称" prop="name">
        <el-input v-model="ruleForm.name"/>
      </el-form-item>
      <el-form-item label="IP地址" prop="ip">
        <el-input v-model="ruleForm.ip"/>
      </el-form-item>
      <el-form-item label="端口" prop="port">
        <el-input-number controls-position="right" v-model="ruleForm.port" :min="1"/>
      </el-form-item>
      <el-form-item label="用户名" prop="user">
        <el-input v-model="ruleForm.user"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" type="password"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <div ref="xterm" class="xterm" style="margin-top: 20px"/>
</template>
<script lang="ts" setup>
import 'xterm/css/xterm.css'
import {onBeforeUnmount, onMounted, reactive, ref} from "vue"
import {Terminal} from 'xterm'
import {FitAddon} from 'xterm-addon-fit'
import {AttachAddon} from 'xterm-addon-attach'
import {ElMessageBox} from "element-plus/es";
import {onBeforeRouteLeave} from "vue-router";

const xterm = ref(null)
const term = ref<Terminal>()
const socketURI = ref('ws://127.0.0.1:8088/tool/ws/1')
const socket = ref<WebSocket>()
const dialogVisible = ref(false)

const initTerm = () => {
  const term1 = new Terminal({
    fontSize: 16,
    cursorBlink: true,
    
  });
  const attachAddon = new AttachAddon(socket.value);
  const fitAddon = new FitAddon();
  term1.loadAddon(attachAddon);
  term1.loadAddon(fitAddon);
  if (xterm.value) {
    term1.open(xterm.value);
  }
  fitAddon.fit();
  term1.focus();
  term.value = term1
}

const initSocket = () => {
  socket.value = new WebSocket(socketURI.value);
  if (socket){
    socket.value.se
  }

  socketOnClose();
  socketOnOpen();
  socketOnError();
}
const socketOnOpen = () => {
  if (!socket.value) {
    return
  }
  socket.value.onopen = () => {
    // 链接成功后
    initTerm()
  }
}
const socketOnClose = () => {
  if (!socket.value) {
    return
  }

  socket.value.onclose = () => {
    // console.log('close socket')
  }
}

const socketOnError = () => {
  if (!socket.value) {
    return
  }
  socket.value.onerror = () => {
    // console.log('socket 链接失败')
  }
}
const al = (event: any) => {
  if (event) {
    event.returnValue = "...";
  }
  return "..."
}
onMounted(() => {
  initSocket()
  window.addEventListener('beforeunload', al)
})


onBeforeUnmount(() => {
  socket.value && socket.value.close()
  term.value && term.value.dispose()
})

onBeforeRouteLeave((to, from, next) => {
  window.removeEventListener('beforeunload', al)
  ElMessageBox.confirm('离开页面，ssh将断开', '提示', {confirmButtonText: '确定', cancelButtonText: '取消'})
      .then(() => {
        socket.value && socket.value.close()
        term.value && term.value.dispose()
        next(true)
      })
      .catch(() => {
        next(false)
      });
})

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  name: '',
  ip: '',
  port: 22,
  user: '',
  password: '',
})

const rules = reactive({
  name: [{required: true, trigger: 'blur', message: "连接名必填"}],
  ip: [{required: true, trigger: 'blur', message: "ip地址必填"}],
  port: [{type: 'number', required: true, trigger: 'blur', message: "端口号必填"}],
  user: [{required: true, trigger: 'blur', message: "用户名必填"}],
  password: [{required: true, trigger: 'blur', message: "密码必填"}],
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

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

</script>
