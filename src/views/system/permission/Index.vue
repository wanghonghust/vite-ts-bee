<template>
  <el-row>
    <el-button type="primary" :icon="Plus" @click="addDialogVisible=true">新增</el-button>
    <el-button type="success" :icon="Edit" :disabled="selectedPerms.length!==1" @click="handleEdit(0,selectedPerms[0])">
      编辑
    </el-button>
    <el-button type="danger" :icon="Delete"
               :disabled="selectedPerms.length===0"
               @click="permDelete(0,selectedPerms)">删除
    </el-button>
  </el-row>
  <el-row class="role-table-row">
    <el-col>
      <el-table :data="permission" row-key="id" stripe class="role-table"
                @selection-change="handleSelectionChange" max-height="780" highlight-current-row table-layout="fixed">
        <el-table-column fixed type="selection"/>
        <el-table-column label="编号" type="index" width="60"/>
        <el-table-column label="权限名" sortable prop="name">
          <template #default="scope">
            <el-popover
                v-if="scope.row.desc"
                placement="top-start"
                :width="200"
                trigger="hover"
                :content="scope.row.desc"
            >
              <template #reference>
                <span>{{ scope.row.name }}</span>
              </template>
            </el-popover>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权限类型" prop="type" sortable></el-table-column>
        <el-table-column label="是否被使用" prop="deleteAble" sortable>
          <template #default="scope">
            <el-tag type="danger" v-if="scope.row.deleteAble">否</el-tag>
            <el-tag type="success" v-else>是</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createdAt" sortable></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="success" size="small" @click="handleEdit(scope.$index,scope.row)" :icon="Edit">编辑
            </el-button>
            <el-button  type="danger" size="small"
                       @click="permDelete(scope.$index,[scope.row])"
                       :icon="Delete">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <el-dialog v-model="addDialogVisible" title="新增权限" width="20%" destroy-on-close :draggable="true"
             @close="resetFields(addFormRef)">
    <el-form :model="addForm" ref="addFormRef" :rules="addRules" status-icon>
      <el-form-item label="权限名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="addForm.name" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="权限类型" :label-width="formLabelWidth" prop="type">
        <el-input v-model="addForm.type" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="权限描述" :label-width="formLabelWidth" prop="desc">
        <el-input v-model="addForm.desc" type="textarea" :rows="4"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addPerm(addFormRef)"
        >确认</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="editDialogVisible" title="编辑权限" width="20%" destroy-on-close :draggable="true">
    <el-form :model="editForm" ref="editFormRef" :rules="addRules" status-icon>
      <el-form-item label="权限名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="editForm.name" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="权限类型" :label-width="formLabelWidth" prop="type">
        <el-input v-model="editForm.type" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="权限描述" :label-width="formLabelWidth" prop="desc">
        <el-input v-model="editForm.desc" type="textarea" :rows="4"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="editPerm(editFormRef)"
        >确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {Delete, Edit, Plus} from '@element-plus/icons-vue'
import {createPerm, deletePerm, getAllPerm, SysPermission, updatePerm} from "../../../api/sys-permission";
import {Action, ElMessageBox, FormInstance, FormRules} from "element-plus/es";
import {ElMessage} from "element-plus";
import {resetFields} from "../../../api/common";

const formLabelWidth = '80px'
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const addFormRef = ref<FormInstance>()
const editFormRef = ref<FormInstance>()
const permission = ref<SysPermission[]>()
const selectedPerms = ref<SysPermission[]>([])


const addForm = reactive({
  name: '',
  type: '',
  desc: '',

})
const editForm = reactive({
  id: undefined,
  type: '',
  name: '',
  desc: ''

})
const editSource = ref({})
const addRules = reactive<FormRules>({
  name: [
    {required: true, message: '请输入权限名', trigger: 'blur'},
    {min: 0, max: 64, message: '权限名长度为小于64', trigger: 'blur'},
  ],
  type: [
    {required: true, message: '请输入权限类型', trigger: 'blur'},
    {min: 0, max: 64, message: '权限类型长度为小于64', trigger: 'blur'},
  ]
})


const getPerm = () => {
  getAllPerm().then((res) => {
    permission.value = res.data.data
  }).catch(() => {

  })
}
onMounted(() => {
  getPerm()
})

const addPerm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      createPerm(addForm).then((res) => {
        addDialogVisible.value = false
        ElMessage({
          type: 'success',
          message: `新增权限"${addForm.name}"成功。`,
        })
        formEl?.resetFields()
        getPerm()
      }).catch((error) => {
        ElMessage({
          type: 'error',
          message: error.response.data.msg,
        })
      })
    }
  })

}
const handleEdit = (index: number, row: SysPermission) => {
  editDialogVisible.value = true
  editForm.id = row.id
  editForm.type = row.type
  editForm.name = row.name
  editForm.desc = row.desc
  // 深拷贝，保存原始信息
  editSource.value = JSON.parse(JSON.stringify(editForm))

}
const editPerm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 判断数据是否有更改，未做更改不允许提交
      if (JSON.stringify(editForm) === JSON.stringify(editSource.value)) {
        ElMessage({
          type: 'warning',
          message: "数据未作更改",
        })
      } else {
        updatePerm(editForm).then((res) => {
          editDialogVisible.value = false
          ElMessage({
            type: 'success',
            message: `修改权限"${editForm.name}"成功。`,
          })
          getPerm()
        }).catch((error) => {
          ElMessage({
            type: 'error',
            message: error.response.data.msg,
          })
        })
      }
    }
  })
}

const permDelete = (index: number, rows: SysPermission[]) => {
  const name = rows.map(item => item.name).join()
  const permsId = rows.map(item => item.id)
  ElMessageBox.confirm(
      `确认删除权限"${name}"？`,
      '警告',
      {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        draggable: true,
      }
  )
      .then(() => {
        deletePerm({id: permsId}).then((res) => {
          ElMessage({
            type: 'success',
            message: `已删除权限"${name}"。`,
          })
          getPerm()
        }).catch((error) => {
          ElMessage({
            type: 'error',
            message: `删除权限"${name}失败"。`,
          })
        })

      }).catch((action: Action) => {
    ElMessage({
      type: 'info',
      message: `已取消删除权限"${name}"。`
    })
  })
}

const handleSelectionChange = (val: SysPermission[]) => {
  selectedPerms.value = val
}

</script>

<style scoped>
.el-row {
  margin-bottom: 2rem;
}

.role-table-row {
  width: calc(100% - 4rem);
  margin: 0 auto;
}

.role-table {
  width: 100%;
  height: 100%;
}

.pagination {
  margin-top: 2rem;
}

:deep(.el-pagination__sizes) {
  margin: 0 16px;
  font-weight: 400;
}

:deep(.el-pagination .el-select .el-input) {
  width: 128px;
}

:deep(.el-pagination__jump) {
  margin-left: 0;
}

.el-table .cell {
  display: flex;
  align-items: center;
}

.el-select {
  width: 100%;
}

.el-dialog {
  width: 40%;
}

.el-tag {
  margin-left: 0.25rem;
}
</style>
