<template>
  <template v-for="(item,index) in props.subMenu" :key="String(index)">
    <el-sub-menu v-if="item.children" :index="String(item.id)">
      <template #title>
        <i v-if="item.icon" :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </template>
      <SubMenu :subMenu="item.children"/>
    </el-sub-menu>
    <el-menu-item v-else-if="item.local" :index="item.link">
      <i v-if="item.icon" :class="item.icon"></i>
      <template #title>
        <span>{{ item.label }}</span>
      </template>
    </el-menu-item>
    <el-link v-else :underline="false" :href="item.link">
      <el-menu-item index="" :key="item.link">
        <i v-if="item.icon" :class="item.icon"></i>
        <template #title>
          <span>{{ item.label }}</span>
        </template>
      </el-menu-item>
    </el-link>
  </template>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "SubMenu",
  props: {
    subMenu: Array,
  },
  setup(props) {
    return {
      props
    }
  }
})
</script>
<style scoped>
.svg-inline--fa{
  width: 24px;
  height: 18px;
  margin-right: 5px;
}
.icon-hello{
  font-size: 18px;
}
</style>
