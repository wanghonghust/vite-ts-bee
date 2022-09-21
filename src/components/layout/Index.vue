<template>
  <el-container>
    <el-aside ref="aside">
      <KeepAlive>
        <SideBar v-if="menuVertical" :key="menuVertical" :isCollapse="isCollapse"/>
      </KeepAlive>
    </el-aside>
    <el-container>
      <el-header ref="header">
        <Header v-model:isCollapse="isCollapse" :key="menuVertical"/>
      </el-header>
      <el-collapse v-if="!menuVertical" accordion style="margin-bottom: 10px">
        <el-collapse-item name="1">
          <template #title>
            <el-tag class="iconfont icon-xitongguanli"></el-tag>
          </template>
          <SideBar :key="menuVertical" v-model:isCollapse="isCollapse"/>
        </el-collapse-item>
      </el-collapse>
      <el-main>
        <el-card :body-style="{height:'calc(100% - 40px)'}">
          <router-view :key="$route.fullPath"/>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import {onMounted, provide, ref} from "vue";
import {Session} from "../../utils/storage";
import {authenticate} from "../../api/auth";
import router from "../../router";
import {ElMessage, ElMessageBox} from "element-plus/es";

const menuVertical = ref(window.innerWidth > 1000)
const coll = Session.get("isCollapse")
const isCollapse = ref(!!coll)
provide("menuVertical",menuVertical)
window.onresize = () => {
  menuVertical.value = window.innerWidth > 1000
  if (menuVertical.value) {
    isCollapse.value = false
  }

}
onMounted(() => {
  // 页面刷新，验证登录是否过期
  authenticate().then(() => {
    if (location.pathname === "/login") {
      router.replace("/index")
    }
  }).catch((error) => {
    const code = error.response.status
    if (code === 401) {
      if (error.response.data.code == 1) {
        Session.clear(); // 清除浏览器全部临时缓存
        router.push({path: "/login", query: {redirect: router.currentRoute.value.fullPath}})
      } else if (error.response.data.code == 1002) {
        ElMessageBox.alert('登录状态已过期，请重新登录', '提示', {confirmButtonText: '确定'})
            .then(() => {
              Session.clear(); // 清除浏览器全部临时缓存
              router.push({path: "/login", query: {redirect: router.currentRoute.value.fullPath}}) // 去登录页
            })
            .catch(() => {
            });
      } else {
        ElMessage.error(error.response.data.msg);
        Session.clear(); // 清除浏览器全部临时缓存
        router.push({path: "/login", query: {redirect: router.currentRoute.value.fullPath}});
      }
    } else if (code === 403) {
      ElMessage.error('无访问权限');
    } else if (error.code === "ERR_NETWORK") {
      ElMessage.error('网络连接错误');
    } else if (error.code === "ERR_BAD_REQUEST") {
      ElMessage.error('接口路径找不到');
    } else if (error.code === "ERR_BAD_RESPONSE") {
      ElMessage.error('网络超时');
    }
  })
})


</script>
<style scoped>

.el-menu {
  align-items: center;
}

.el-container {
  overflow: hidden;
}

.el-menu-item, .el-sub-menu__title, .el-menu-item > * {
  font-size: 16px;
  font-weight: 500;
}

.el-header {
  padding: 0;
  position: relative;
  width: 100%;
  top: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 0 6px 0 rgb(139 140 141 / 35%);
}

.el-menu--horizontal {
  border: none;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-container {
  width: 100vw;
}

@media screen and (max-width: 1000px) {
  .el-main {
    padding-top: 0px;
  }
}

:deep(.el-collapse-item__wrap) {
  border-bottom: none;
}

:deep(.el-collapse-item__content) {
  padding-bottom: 0;
}

:deep(.el-collapse-item__header) {
  padding: 0 20px;
}
.el-card{
  height: calc(100% - 2px);
}
</style>
