<template>
  <el-row>
    <el-button type="primary" :icon="Plus" @click="addDialogVisible=true">新增</el-button>
    <el-button type="success" :icon="Edit" :disabled="selectedRoles.length!==1" @click="handleEdit(0,selectedRoles[0])">
      编辑
    </el-button>
    <el-button type="danger" :icon="Delete" :disabled="selectedRoles.length<1" @click="roleDelete(0,selectedRoles)">删除
    </el-button>
  </el-row>
  <el-row class="role-table-row">
    <el-col>
      <el-table :data="roles" row-key="id" stripe class="role-table"
                @selection-change="handleSelectionChange" max-height="780" highlight-current-row table-layout="fixed">
        <el-table-column fixed type="selection"/>
        <el-table-column label="编号" type="index" width="60"/>
        <el-table-column prop="name" label="角色名" sortable></el-table-column>
        <el-table-column label="权限">
          <template #default="scope">
            <el-popover v-if="scope.row.permission.length>0"
                        placement="bottom"
                        title="权限详情"
                        :width="350"
                        popper-class="overflow-auto"
                        trigger="click">
              <el-row :gutter="10">
                <el-col v-for="item in scope.row.permission.map(item1 => item1.type+' : '+item1.name)" :span="12"
                        style="margin-bottom: 5px">
                  <el-tag class="ml-2" type="success">{{ item }}</el-tag>
                </el-col>
              </el-row>
              <template #reference>
                <el-button type="primary" link>权限列表</el-button>
              </template>
            </el-popover>

          </template>
        </el-table-column>
        <el-table-column label="菜单">
          <template #default="scope">
            <el-tree :data="scope.row.menu" :props="defaultProps" empty-text=""></el-tree>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createdAt" sortable></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="success" size="small" @click="handleEdit(scope.$index,scope.row)" :icon="Edit">编辑
            </el-button>
            <el-button type="danger" size="small" @click="roleDelete(scope.$index,[scope.row])"
                       :icon="Delete">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <el-dialog v-model="addDialogVisible" title="新增角色" width="45%" destroy-on-close :draggable="true"
             @open="getMenusAndPerms">
    <el-form :model="addForm" ref="addFormRef" :rules="addRules" status-icon>
      <el-form-item label="角色" :label-width="formLabelWidth" prop="name">
        <el-input v-model="addForm.name" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="系统权限" :label-width="formLabelWidth">
        <el-transfer
            v-model="addForm.permission"
            style="text-align: left; display: inline-block"
            filterable
            :render-content="renderFunc"
            :titles="['权限列表', '已选择权限']"
            :button-texts="['To left', 'To right']"
            :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}',
        }"
            :props="{
              key:'id',
              label:'name'
            }"
            :data="permission"
            @mouseover.native="addTitle"
        >
        </el-transfer>
      </el-form-item>
      <el-form-item label="菜单权限" :label-width="formLabelWidth">
        <el-tree
            ref="menuAddRef"
            :data="menus"
            show-checkbox
            node-key="id"
            highlight-current
            :props="defaultProps"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addRole(addFormRef)"
        >确认</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="editDialogVisible" title="编辑角色" width="45%" destroy-on-close :draggable="true"
             @open="getMenusAndPerms">
    <el-form :model="editForm" ref="editFormRef" :rules="addRules" status-icon>
      <el-form-item label="角色" :label-width="formLabelWidth" prop="name">
        <el-input v-model="editForm.name" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="系统权限" :label-width="formLabelWidth">
        <el-transfer
            v-model="editForm.permission"
            style="text-align: left; display: inline-block"
            filterable
            :render-content="renderFunc"
            :titles="['权限列表', '已选择权限']"
            :right-default-checked="editForm.permission"
            :button-texts="['To left', 'To right']"
            :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}',
        }"
            :props="{
              key:'id',
              label:'name'
            }"
            :data="permission"
            @mouseover.native="addTitle"
        >
        </el-transfer>
      </el-form-item>
      <el-form-item label="菜单权限" :label-width="formLabelWidth">
        <el-tree
            ref="menuEditRef"
            :data="menus"
            show-checkbox
            node-key="id"
            highlight-current
            :props="defaultProps"
            :default-checked-keys="editForm.menu"
        />
      </el-form-item>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="editRole(editFormRef)"
        >确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, VNode, VNodeProps} from "vue";
import {Delete, Edit, Plus} from '@element-plus/icons-vue'
import {createRole, deleteRole, getAllRole, Role, updateRole} from "../../../api/sys-role";
import {getAllPerm, SysPermission} from "../../../api/sys-permission";
import {Action, ElMessageBox, ElTree, FormInstance, FormRules} from "element-plus/es";
import {ElMessage} from "element-plus";
import {getAllMenu, Menu} from "../../../api/sys-menu";

interface Tree {
  id: number
  label: string
  children?: Tree[]
}

const formLabelWidth = '80px'
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const addFormRef = ref<FormInstance>()
const editFormRef = ref<FormInstance>()
const permission = ref<SysPermission[]>()
const selectedRoles = ref<Role[]>([])
const menuEditRef = ref<InstanceType<typeof ElTree>>()
const menuAddRef = ref<InstanceType<typeof ElTree>>()
const menus = ref<Menu[]>([])
const defaultProps = {
  children: 'children',
  label: 'label',
}
const addForm = reactive({
  name: '',
  permission: [],
  menu: []
})
const editForm = reactive({
  id: undefined,
  name: '',
  permission: [],
  menu: []

})
const editSource = ref({})

const getMenus = () => {
  getAllMenu().then((res) => {
    menus.value = res.data.menus
  }).catch(() => {
  })
}

const addRules = reactive<FormRules>({
  name: [
    {required: true, message: '请输入角色名', trigger: 'blur'},
    {min: 0, max: 64, message: '角色名长度为小于64', trigger: 'blur'},
  ]
})

const roles = ref<Role[]>([])
const getRoles = () => {
  getAllRole().then((res) => {
    roles.value = res.data.data
  }).catch(() => {
  })
}


const getPerm = () => {
  getAllPerm().then((res) => {
    if (res.data.data) {
      permission.value = res.data.data
    }
  }).catch(() => {

  })
}

const getMenusAndPerms = () => {
  getMenus()
  getPerm()
}
onMounted(() => {
  getRoles()
})
const addRole = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      addForm.menu = menuAddRef.value?.getCheckedKeys()
      console.log(menuAddRef.value?.getCheckedKeys())
      createRole(addForm).then((res) => {
        addDialogVisible.value = false
        ElMessage({
          type: 'success',
          message: `新增角色"${addForm.name}"成功。`,
        })
        addForm.name = ""
        addForm.permission = []
        getRoles()
      }).catch((error) => {
        ElMessage({
          type: 'error',
          message: error.response.data.msg,
        })
      })
    }
  })

}

interface Option {
  id: number
  name: string
  type: string
}

const renderFunc = (
    h: (type: string, props: VNodeProps | null, children?: string) => VNode,
    option: Option
) => {
  return h('span', null, option.type + " : " + option.name)
}

const handleEdit = (index: number, row: Role) => {
  editDialogVisible.value = true
  editForm.id = row.id
  editForm.name = row.name
  editForm.permission = row.permission.map(item => item.id)
  editForm.menu = row.menuId
  editSource.value = JSON.parse(JSON.stringify(editForm))

}
const editRole = async (formEl: FormInstance | undefined) => {
  editForm.menu = menuEditRef.value?.getCheckedKeys()
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
        updateRole(editForm).then((res) => {
          editDialogVisible.value = false
          ElMessage({
            type: 'success',
            message: `修改菜单"${editForm.name}"成功。`,
          })
          getRoles()
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

const roleDelete = (index: number, rows: Role[]) => {
  const name = rows.map(item => item.name).join()
  const rolesId = rows.map(item => item.id)
  ElMessageBox.confirm(
      `确认删除角色"${name}"？`,
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
        deleteRole({id: rolesId}).then((res) => {
          ElMessage({
            type: 'success',
            message: `已删除角色"${name}"。`,
          })
          getRoles()
        }).catch((error) => {
          ElMessage({
            type: 'error',
            message: `删除角色"${name}失败"。`,
          })
        })

      }).catch((action: Action) => {
    ElMessage({
      type: 'info',
      message: `已取消删除角色"${name}"。`
    })
  })
}

const handleSelectionChange = (val: Role[]) => {
  selectedRoles.value = val
}

const addTitle = (e: Event) => {
  //手动给鼠标划过的元素添加一个title
  let target_el = e.target as HTMLInputElement;
  if (target_el.title) return;
  target_el.title = target_el.innerText;
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
