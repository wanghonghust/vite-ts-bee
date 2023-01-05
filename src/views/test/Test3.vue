<template>
  <el-button type="primary" @click="dialogVisible = true">新增ssh连接</el-button>
  <el-dialog
      v-model="dialogVisible"
      title="新建SSH连接"
      @close="resetForm(ruleFormRef)"
      width="20%"
      draggable
  >
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="85px"
        class="demo-ruleForm"
        label-position="left"
    >
      <el-form-item label="连接名称" prop="name">
        <el-input v-model="ruleForm.name"/>
      </el-form-item>
      <el-form-item label="HOST" prop="host">
        <el-input v-model="ruleForm.host"/>
      </el-form-item>
      <el-form-item label="端口" prop="port">
        <el-input-number controls-position="right" v-model="ruleForm.port" :min="1"/>
      </el-form-item>
      <el-form-item label="用户名" prop="user">
        <el-input v-model="ruleForm.user"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" type="password" show-password/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <el-tabs
      v-if="editableTabs.length>0"
      v-model="editableTabsValue"
      type="border-card"
      style="margin-top: 0.5rem;"
      closable
      @tab-remove="removeTab"
  >
    <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :name="item.name"
    >
      <template #label>
        <el-popover
            placement="right"
            :width="350"
            trigger="hover"
        >
          <template #reference>
            <span>{{ item.title }}</span>
          </template>
          <el-descriptions title="Session" :column="1">
            <el-descriptions-item label="Title:">{{ item.title }}</el-descriptions-item>
            <el-descriptions-item label="Host:">{{ item.host }}</el-descriptions-item>
            <el-descriptions-item label="Port:">{{ item.port }}</el-descriptions-item>
            <el-descriptions-item label="User:">{{ item.user }}</el-descriptions-item>
            <el-descriptions-item label="Session Id:">{{ item.sessionId }}</el-descriptions-item>
          </el-descriptions>
        </el-popover>
      </template>
      <div :id="item.sessionId" class="xterm" style="margin-top: 0.5rem"/>
    </el-tab-pane>
  </el-tabs>

</template>
<script lang="ts" setup>
import 'xterm/css/xterm.css'
import {onBeforeUnmount, reactive, ref} from "vue"
import {Terminal} from 'xterm'
import {FitAddon} from 'xterm-addon-fit'
import {AttachAddon} from 'xterm-addon-attach'
import {FormInstance} from "element-plus/es";
import {onBeforeRouteLeave} from "vue-router";
import {sshConfig} from "../../api/ssh";
import {ElMessage} from "element-plus";
import {baseUrl} from "../../api/common";

const addr = baseUrl.replace("http", "ws")
const socketURI = ref(addr + 'tool/ws/1')
const dialogVisible = ref(false)
const confirmF = ref(false)

interface Tab {
  title?: string
  name?: string
  host?: string
  port?: number
  user?:string
  sessionId: string
  socket?: WebSocket
  term?: Terminal
}

const editableTabsValue = ref('测试')
const editableTabs = ref<Tab[]>([])
const initTerm = (item: Tab) => {
  const term1 = new Terminal({
    rendererType: "canvas",
    fontSize: 16,
    cursorBlink: true,
    windowsMode: true,
  });
  item.term = term1
  const attachAddon = new AttachAddon(item.socket);
  const fitAddon = new FitAddon();
  item.term.loadAddon(attachAddon);
  item.term.loadAddon(fitAddon);
  const ele = document.getElementById(item.sessionId) as HTMLElement
  term1.open(ele);
  fitAddon.fit();
  item.term.focus();
}
const initSocket = (item: Tab) => {
  item.socket = new WebSocket(socketURI.value);
  socketOnClose(item);
  socketOnOpen(item);
  const status = socketOnError(item);
  return status
}
const socketOnOpen = (item: Tab) => {
  if (!item.socket) {
    return
  }
  item.socket.onopen = () => {
    // 链接成功后
    initTerm(item)
  }
}
const socketOnClose = (item: Tab) => {
  if (!item.socket) {
    return
  }

  item.socket.onclose = () => {
    // console.log('close socket')
  }
}
const socketOnError = (item: Tab) => {
  let status = true
  if (!item.socket) {
    return status
  }
  item.socket.onerror = () => {
    // console.log('socket 链接失败')
    status = false
  }
  return status
}
const al = (event: any) => {
  if (event) {
    event.returnValue = "...";
  }
  return "..."
}
onBeforeUnmount(() => {
  editableTabs.value.forEach(item => {
    item.socket && item.socket.close()
    item.term && item.term.dispose()
  })
})
onBeforeRouteLeave((to, from, next) => {
  if (editableTabs.value.length === 0) {
    next(true)
    return
  }
  const res = confirm('离开页面，ssh将断开')
  if (res) {
    editableTabs.value.forEach(item => {
      item.socket && item.socket.close()
      item.term && item.term.dispose()
    })
    window.removeEventListener('beforeunload', al)
    next(true)
  } else {
    next(false)
  }
})
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  name: '测试',
  host: '****************',
  port: 22,
  user: 'root',
  password: '****************',
})
const rules = reactive({
  name: [{required: true, trigger: 'blur', message: "连接名必填"}],
  host: [{required: true, trigger: 'blur', message: "host必填"}],
  port: [{type: 'number', required: true, trigger: 'blur', message: "端口号必填"}],
  user: [{required: true, trigger: 'blur', message: "用户名必填"}],
  password: [{required: true, trigger: 'blur', message: "密码必填"}],
})
const configSSH = async () => {
  let data = await sshConfig(ruleForm)
  let tmpTab: Tab = {sessionId: ""}
  if (data.status === 200) {
    window.addEventListener('beforeunload', al)
    confirmF.value = true
    dialogVisible.value = false
    tmpTab = data.data.session
    return tmpTab
  } else {
    confirmF.value = false
    ElMessage({
      message: "SSH 连接失败",
      type: "error"
    })
    return undefined
  }
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const tab: Tab = await configSSH()
      addTab(tab)
      initSocket(tab)
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
const addTab = (item: Tab) => {
  editableTabs.value?.push(item)
  item.title = item.name
  item.name = item.sessionId
  editableTabsValue.value = item.sessionId
}
const removeTab = (targetName: string) => {
  const res = confirm('确定关闭SSH?')
  if (!res) {
    return
  }
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs?.forEach((tab, index) => {
      if (tab.name === targetName) {
        // 关闭socket 同时销毁终端
        tab.socket?.close()
        tab.term?.dispose()
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }
  editableTabsValue.value = activeName
  editableTabs.value = tabs?.filter((tab) => tab.name !== targetName)
  if (editableTabs.value.length === 0) {
    window.removeEventListener('beforeunload', al)
  }
}
</script>

