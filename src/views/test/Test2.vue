<template>
  <el-upload
      ref="uploadRef"
      class="upload-demo"
      :action="baseUrl+'system/file'"
      :headers="headers"
      :auto-upload="false"
  >
    <template #trigger>
      <el-button type="primary">select file</el-button>
    </template>

    <el-button class="ml-3" type="success" @click="submitUpload">
      upload to server
    </el-button>

    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { UploadInstance } from 'element-plus'
import {baseUrl} from "../../api/common";
import {Session} from "../../utils/storage";

const uploadRef = ref<UploadInstance>()
const headers = {
  Authorization: `Bearer ${Session.get('token')}`
}
const submitUpload = () => {
  uploadRef.value!.submit()
}
</script>
