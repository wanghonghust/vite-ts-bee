<template>
  <el-menu
      :default-active="currentPath"
      class="aside"
      :router="true"
      :collapse="isCollapse">
    <el-menu-item index="/index">
      <el-icon>
        <el-image class="logo" src="/src/assets/OIP-C.png"></el-image>
      </el-icon>
      <template #title style="text-align: end">
        <el-link href="/" :underline="false">Admin</el-link>
      </template>
    </el-menu-item>
    <el-sub-menu index="1">
      <template #title>
        <el-icon class="iconfont icon-xitongguanli">
        </el-icon>
        <span>系统管理</span>
      </template>
      <el-menu-item index="/admin/sys-user">
        <el-icon class="iconfont icon-yonghu"></el-icon>
        <span>用户管理</span>
      </el-menu-item>
      <el-menu-item index="/admin/sys-role">
        <el-icon class="iconfont icon-jiaoseguanli"></el-icon>
        <span>角色管理</span>
      </el-menu-item>
      <el-menu-item index="/admin/sys-menu">
        <el-icon class="iconfont icon-caidanguanli"></el-icon>
        <span>菜单管理</span>
      </el-menu-item>
      <el-sub-menu index="1-3">
        <template #title>
          <el-icon class="iconfont icon-xitongquanxian"></el-icon>
          <span>权限管理</span>
        </template>
        <el-menu-item index="1-3-1">
          <template #title>
            <el-icon class="iconfont icon-xitongquanxian"></el-icon>
            <span>系统权限</span>
          </template>
        </el-menu-item>
        <el-menu-item index="1-3-2">
          <template #title>
            <el-icon class="iconfont icon-caidanguanli"></el-icon>
            <span>菜单权限</span>
          </template>
        </el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="2">
      <template #title>
        <el-icon>
          <document/>
        </el-icon>
        <el-link href="/admin/sys-role" :underline="false">用户管理</el-link>
      </template>
    </el-menu-item>
    <el-menu-item index="3" @click="reloadRouter('/test/test1')">
      <el-icon>
        <document/>
      </el-icon>
      <template #title>
        <span>测试</span>
      </template>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon>
        <document/>
      </el-icon>
      <template #title>Navigator Three</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import {onMounted, ref, toRefs} from "vue";
import {reloadRouter} from "../../api/common"
import router from "../../router/index";
import {getAllMenu} from "../../api/sys-menu";

interface Menu {
  id: number,
  label: string,
  parentId: number | null,
  link: string,
  icon: string,
  children?: Menu[] | null,
  createAt: string,
}

const props = defineProps({
  isCollapse: Boolean,
})
const currentPath = ref(router.currentRoute.value.fullPath)

const {isCollapse} = toRefs(props)

const menus = ref<Menu[]>([])
const getMenus = () => {
  getAllMenu().then((res) => {
    menus.value = res.data.menus
  }).catch(() => {
  })
}
onMounted(() => {
  getMenus()
})
</script>

<style scoped>
.el-menu {
  width: 200px;
}
</style>
