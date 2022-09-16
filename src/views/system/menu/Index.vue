<template>
  <el-row>
    <el-button type="primary" :icon="Plus" @click="addDialogVisible=true">新增</el-button>
  </el-row>
  <el-row class="menu-table-row">
    <el-col>
      <el-table :data="menus" row-key="id" stripe class="menu-table"
                @selection-change="" max-height="780" highlight-current-row table-layout="fixed">
        <el-table-column label="编号" type="index" width="60"/>
        <el-table-column prop="label" label="菜单名" sortable></el-table-column>
        <el-table-column label="链接" prop="link"></el-table-column>
        <el-table-column label="图标" prop="icon">
          <template #default="scope">
            <i v-if="scope.row.icon" :class="scope.row.icon"></i>
          </template>
        </el-table-column>
        <el-table-column label="是否内链" prop="local">
          <template #default="scope">
            {{ scope.row.local ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createAt" sortable></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="success" size="small" @click="handleEdit(scope.$index,scope.row)" :icon="Edit">编辑
            </el-button>
            <el-button v-if="!scope.row.children" type="danger" size="small" @click="menuDelete(scope.$index,scope.row)"
                       :icon="Delete">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <el-dialog v-model="addDialogVisible" title="新增菜单" width="380px" destroy-on-close :draggable="true" @open="getMenus">
    <el-form :model="addForm" ref="addFormRef" :rules="addRules" status-icon>
      <el-form-item label="菜单名" :label-width="formLabelWidth" prop="label">
        <el-input v-model="addForm.label" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="父菜单" :label-width="formLabelWidth" prop="parentId">
        <el-tree-select
            v-model.number="addForm.parentId"
            :data="menus"
            check-strictly
            value-key="id"
            :render-after-expand="false"
        />
      </el-form-item>
      <el-form-item label="链接" :label-width="formLabelWidth" prop="link">
        <el-input v-model="addForm.link" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="图标" :label-width="formLabelWidth" prop="icon">
        <FilterSelect v-model="addForm.icon" :options="icons" pop-width="250px"/>
      </el-form-item>
      <el-form-item label="是否内链" :label-width="formLabelWidth" prop="local">
        <el-select v-model="addForm.local">
          <el-option :value="true" label="是"></el-option>
          <el-option :value="false" label="否"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addMenu(addFormRef)"
        >确认</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="editDialogVisible" title="编辑菜单" width="380px" destroy-on-close :draggable="true" @open="getMenus">
    <el-form :model="editForm" ref="editFormRef" :rules="addRules" status-icon>
      <el-form-item label="菜单名" :label-width="formLabelWidth" prop="label">
        <el-input v-model="editForm.label" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="父菜单" :label-width="formLabelWidth" prop="parentId">
        <el-tree-select
            v-model.number="editForm.parentId"
            :data="editMenus"
            check-strictly
            value-key="id"
            :clearable="true"
            :render-after-expand="false"
        />
      </el-form-item>
      <el-form-item label="链接" :label-width="formLabelWidth" prop="link">
        <el-input v-model="editForm.link" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="图标" :label-width="formLabelWidth" prop="icon">
        <FilterSelect v-model="editForm.icon" :options="icons" pop-width="250px"/>
      </el-form-item>
      <el-form-item label="是否内链" :label-width="formLabelWidth" prop="local">
        <el-select v-model="editForm.local">
          <el-option :value="true" label="是"></el-option>
          <el-option :value="false" label="否"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="editMenu(editFormRef)"
        >确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {Delete, Edit, Plus} from '@element-plus/icons-vue'
import {createMenu, deleteMenu, getAllMenu, Menu, treeFilter, updateMenu} from "../../../api/sys-menu";
import {Action, ElMessageBox, FormInstance, FormRules} from "element-plus/es";
import {ElMessage} from "element-plus";
import FilterSelect from "../../../components/common/FilterSelect.vue";
import icons from '../../../assets/fontello/icons.json'

const formLabelWidth = '80px'
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const addFormRef = ref<FormInstance>()
const editFormRef = ref<FormInstance>()


const addForm = reactive({
  label: '',
  parentId: undefined,
  link: '',
  icon: '',
  local: true,
})
const editForm = reactive({
  id: undefined,
  label: '',
  parentId: undefined,
  link: '',
  icon: '',
  local: true,
})
const editSource = ref({})
const addRules = reactive<FormRules>({
  label: [
    {required: true, message: '请输入菜单名', trigger: 'blur'},
    {min: 0, max: 64, message: '菜单名长度为小于64', trigger: 'blur'},
  ],
  link: [
    {min: 0, max: 128, message: '链接长度小于256', trigger: 'blur'},
  ],
  icon: [{min: 0, max: 64, message: '图标长度小于64', trigger: 'blur'},],
})
const menus = ref<Menu[]>([])
// 编辑是去掉本身
const editMenus = ref<Menu[]>([])
const getMenus = () => {
  getAllMenu().then((res) => {
    menus.value = res.data.menus
  }).catch(() => {
  })
}
onMounted(() => {
  getMenus()
})
const addMenu = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (addForm.parentId == "") {
        addForm.parentId = undefined
      }
      createMenu(addForm).then((res) => {
        addDialogVisible.value = false
        ElMessage({
          type: 'success',
          message: `新增菜单"${addForm.label}"成功。`,
        })
        getMenus()
      }).catch((error) => {
        ElMessage({
          type: 'error',
          message: error.response.data.msg,
        })
      })
    }
  })

}
const handleEdit = (index: number, row: Menu) => {
  editDialogVisible.value = true
  editForm.id = row.id
  editForm.label = row.label
  editForm.link = row.link
  editForm.icon = row.icon
  editForm.local = row.local
  editForm.parentId = row.parentId
  editSource.value = JSON.parse(JSON.stringify(editForm))
  editMenus.value = treeFilter(menus.value, row.id)
}
const editMenu = async (formEl: FormInstance | undefined) => {
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
        if (editForm.parentId == "") {
          editForm.parentId = undefined
        }
        updateMenu(editForm).then((res) => {
          editDialogVisible.value = false
          ElMessage({
            type: 'success',
            message: `修改菜单"${editForm.label}"成功。`,
          })
          getMenus()
        }).catch((error) => {
          console.log(error.response.data.msg)
          ElMessage({
            type: 'error',
            message: error.response.data.msg,
          })
        })
      }
    }
  })
}

const menuDelete = (index: number, row: Menu) => {
  ElMessageBox.confirm(
      `确认删除菜单"${row.label}"？`,
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
        deleteMenu({id: row.id}).then((res) => {
          ElMessage({
            type: 'success',
            message: `已删除菜单"${row.label}"。`,
          })
          getMenus()
        }).catch((error) => {
          ElMessage({
            type: 'error',
            message: `删除菜单"${row.label}失败"。`,
          })
        })

      }).catch((action: Action) => {
    ElMessage({
      type: 'info',
      message: `已取消删除菜单"${row.label}"。`
    })
  })
}
</script>

<style scoped>
.el-row {
  margin-bottom: 2rem;
}

.menu-table-row {
  width: calc(100% - 4rem);
  margin: 0 auto;
}

.menu-table {
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

</style>
