<template>
  <el-menu
      class="side-menu"
      :default-active="currentPath"
      :router="true"
      unique-opened
      background-color="#181e21"
      text-color="#fff"
      active-text-color="#74b1ff"
      :collapse="isCollapse">
    <el-menu-item index="/index">
      <el-icon>
        <el-image class="logo" src="/OIP-C.png"></el-image>
      </el-icon>
      <template #title style="text-align: end">
        <el-link href="/" :underline="false" style="font-size: 18px">Admin</el-link>
      </template>
    </el-menu-item>
    <SubMenu :subMenu="menus"/>
  </el-menu>
</template>

<script setup lang="ts">
import {onMounted, ref, toRefs} from "vue";
import router from "../../router/index";
import SubMenu from "./SubMenu.vue";
import {getAllMenu} from "../../api/sys-menu";
import {getUserInfo} from "../../api/auth";
import {Session} from "../../utils/storage";


interface Menu {
  id: number,
  label: string,
  parentId: number | null,
  link: string,
  icon: string,
  children?: Menu[] | null,
  createAt: string,
}

const userId = Session.get("user")
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
const getUserMenus = () => {
  getUserInfo(userId).then((res) => {
    menus.value = res.data.menu
  })
}

onMounted(() => {
  getUserMenus()
})
</script>

<style scoped>
:deep(.el-sub-menu__title > span) {
  padding-right: 1rem;
}

:deep(.el-sub-menu .el-menu-item) {
  min-width: auto;
}

.el-menu {
  border-right: none;
}

</style>
