<template>
<!--<ip-input v-model:ip="ip"></ip-input>-->
  <div>{{ip}}</div>
  <ip-input2 v-model:ip="ip"></ip-input2>
</template>
<script setup>
import {ref} from "vue";
import IpInput2 from "../../components/common/IpInput2.vue";

const ip = ref("12")
</script>