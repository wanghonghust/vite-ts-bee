<template>
  <iframe :src="baseUrl+'swagger/index.html'" class="api" height="1000">
  </iframe>
</template>

<script setup>
import {baseUrl} from "../../api/common"
</script>

<style scoped>
.api {
  width: 100%;
  height: 100%;
}
</style>
