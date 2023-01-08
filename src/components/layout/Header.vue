<template>
  <el-menu
      class="nav"
      mode="horizontal"
      :ellipsis="false">
    <div style="padding: 0.5rem;" v-if="menuVertical">
      <el-link class="expand" @click="toggle" :underline="false">
        <el-icon class="nav-item">
          <Fold v-if="!isCollapse"/>
          <Expand v-else/>
        </el-icon>
      </el-link>
    </div>
    <div v-if="menuVertical" class="flex-grow"/>
    <div>
      <el-link :underline="false" @click="fullScreen">
        <el-icon class="nav-item">
          <FullScreen/>
        </el-icon>
      </el-link>
    </div>
    <div class="nav-item">
      <el-switch
          v-model="isDark"
          inline-prompt
          active-color="#4e4e4e"
          inactive-color="#b9b9b9"
          :active-icon="Moon"
          :inactive-icon="Sunny"
          @change="toggleDark"
      />
    </div>
    <el-sub-menu index="2">
      <template #title>
        <el-avatar :size="32" :src="userinfo.avatar ? baseUrl + `system/file?id=` + userinfo.avatar:''"/>
        {{ userinfo.username }}
      </template>
      <el-menu-item index="2-1" @click="logOut">
        <span>注销</span>
      </el-menu-item>
      <el-menu-item index="2-2" @click="reloadRouter('/usercenter')">
        <span>个人中心</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup>
import {useDark, useToggle} from "@vueuse/core";
import {getUserInfo, logout} from "../../api/auth";
import screenfull from "screenfull";
import {inject, onMounted, ref, toRefs} from "vue";
import {Session} from "../../utils/storage";
import {Moon, Sunny} from '@element-plus/icons-vue'
import {reloadRouter,baseUrl} from "../../api/common"


const props = defineProps({
  isCollapse: Boolean,
})
const userinfo = ref({})
const {isCollapse} = toRefs(props)
const menuVertical = inject("menuVertical")
const emits = defineEmits(["update:isCollapse","update:menuVertical"])
const userId = Session.get("user")
const isDark = useDark()
const toggleDark = useToggle(isDark)
const logOut = () => {
  logout()
}
const fullScreen = () => {
  screenfull.toggle()
}
const toggle = () => {
  emits('update:isCollapse', !props.isCollapse)
  Session.set("isCollapse", !props.isCollapse)
}
onMounted(() => {
  getUserInfo(userId).then((res) => {
    userinfo.value = res.data
  })
  return {
    userinfo
  }
})
</script>

<style scoped>
.nav-item {
  font-size: 24px;
  margin-right: 0.5rem;
}

.flex-grow {
  flex-grow: 1;
}

.logo {
  width: 40px;
  line-height: 100%;
}

.el-avatar {
  margin: 0.5rem;
}

.expand {
  border: none;
  height: 100%;
}
@media screen and (max-width: 1000px) {
  .flex-grow {
    flex-grow:0;
  }
  .nav{
    justify-content: space-between;
  }
}
</style>
