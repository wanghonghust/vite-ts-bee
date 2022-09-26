<template>
  <el-row>
    <el-button type="primary" :icon="Plus" @click="addDialogVisible=true">新增</el-button>
    <el-button type="success" :icon="Edit" :disabled="selectedUsers.length!==1" @click="handleEdit(0,selectedUsers[0])">
      编辑
    </el-button>
    <el-button type="danger" :icon="Delete" :disabled="selectedUsers.length<1" @click="deleteUsers(selectedUsers)">删除
    </el-button>
  </el-row>
  <el-row class="user-table-row">
    <el-col>
      <el-table :data="userInfo" stripe class="user-table"
                @selection-change="handleSelectionChange" max-height="780" highlight-current-row table-layout="fixed">
        <el-table-column fixed type="selection"/>
        <el-table-column label="编号" type="index" width="60"/>
        <el-table-column prop="username" label="用户名" sortable>
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span style="margin-left: 10px">{{ scope.row.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="昵称">
          <template #default="scope">
            <div>{{ scope.row.nickname }}</div>
          </template>
        </el-table-column>
        <el-table-column label="所属角色" prop="role">
          <template #default="scope">
            <el-tag v-for="item in scope.row.role.map(item=>item.name)" class="ml-2" type="success">{{
                item
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="邮箱">
          <template #default="scope">
            <div>{{ scope.row.email }}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" sortable prop="createdAt">
          <template #default="scope">
            <div>{{ scope.row.createdAt }}</div>
          </template>
        </el-table-column>
        <el-table-column label="超级用户" sortable prop="isSuperUser">
          <template #default="scope">
            <div>{{ scope.row.isSuperUser ? "是" : "否" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            <el-switch class="ml-2" v-model="scope.row.state" @click="changeState(scope.$index,scope.row)"
                       active-text="启用"
                       inactive-text="禁用" inline-prompt></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)" :icon="Edit">编辑
            </el-button>
            <el-button
                size="small"
                type="danger"
                @click="userDelete(scope.$index, scope.row)"
                :icon="Delete">删除
            </el-button>
            <el-avatar style="margin: 0.2rem;" shape="square" :size="25"
                       :src="scope.row.avatar ? baseUrl + `system/file?id=` + scope.row.avatar:''"/>
            <el-button type="info" size="small" @click="editAvatar(scope.$index, scope.row)"
                       class="iconfont icon-shangchuantouxiang" circle></el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-col>
    <el-col>
      <el-pagination
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10,20, 40, 60, 80]"
          :disabled="false"
          background
          prev-text="上一页"
          next-text="下一页"
          layout="prev, pager, next, sizes,jumper, total"
          :total="total"
          @size-change="getUsers"
          @current-change="getUsers"
          class="pagination"
      />
    </el-col>
  </el-row>
  <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="40%" destroy-on-close :draggable="true"
             @open="getRoles">
    <el-form :model="editForm" ref="ruleFormRef" :rules="rules" status-icon>
      <el-form-item label="昵称" :label-width="formLabelWidth" prop="nickname">
        <el-input v-model="editForm.nickname" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
        <el-input v-model="editForm.email" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="超级用户" :label-width="formLabelWidth" prop="isSuperUser">
        <el-checkbox v-model="editForm.isSuperUser" size="large" />
      </el-form-item>
      <el-form-item label="角色" :label-width="formLabelWidth">
        <el-transfer
            v-model="editForm.role"
            style="text-align: left; display: inline-block"
            filterable
            :right-default-checked="editForm.role"
            :titles="['角色列表', '已选择角色']"
            :button-texts="['To left', 'To right']"
            :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}',
        }"
            :props="{
              key:'id',
              label:'name'
            }"
            :data="roles"

        >
        </el-transfer>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editCancel">取消</el-button>
        <el-button type="primary" @click="editConfirm(ruleFormRef)"
        >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="addDialogVisible" title="新增用户" width="40%" destroy-on-close :draggable="true" @open="getRoles">
    <el-form :model="addForm" ref="addFormRef" :rules="addRules" status-icon>
      <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
        <el-input v-model="addForm.username" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
        <el-input v-model="addForm.password" autocomplete="off" type="password" show-password/>
      </el-form-item>
      <el-form-item label="确认密码" :label-width="formLabelWidth" prop="password_c">
        <el-input v-model="addForm.password_c" autocomplete="off" type="password" show-password/>
      </el-form-item>
      <el-form-item label="昵称" :label-width="formLabelWidth" prop="nickname">
        <el-input v-model="addForm.nickname" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
        <el-input v-model="addForm.email" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="超级用户" :label-width="formLabelWidth" prop="isSuperUser">
        <el-checkbox v-model="addForm.isSuperUser" size="large" />
      </el-form-item>
      <el-form-item label="角色" :label-width="formLabelWidth">
        <el-transfer
            v-model="addForm.role"
            style="text-align: left; display: inline-block"
            filterable
            :titles="['角色列表', '已选择角色']"
            :button-texts="['To left', 'To right']"
            :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}',
        }"
            :props="{
              key:'id',
              label:'name'
            }"
            :data="roles"

        >
        </el-transfer>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addUser(addFormRef)"
        >确认</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="avatarDialogVisible" title="上传头像" width="25%" destroy-on-close :draggable="true">
    <el-upload
        ref="uploadRef"
        class="avatar-uploader"
        :action="baseUrl+'system/file'"
        :headers="headers"
        :show-file-list="false"
        :on-change="handleOnChange"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :auto-upload="false"
        :limit="1"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
      <el-icon v-else class="avatar-uploader-icon">
        <Plus/>
      </el-icon>
    </el-upload>
    <el-button type="danger" @click="cancelUpload" style="margin-left: 2rem;">取消上传</el-button>
    <el-button type="primary" @click="uploadAvatar" :disabled="imageUrl===''">上传头像</el-button>
  </el-dialog>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import {Delete, Edit, Plus} from '@element-plus/icons-vue'
import type {Action, UploadInstance, UploadProps} from 'element-plus'
import {ElMessage, ElMessageBox, FormInstance, FormRules} from 'element-plus'
import {createUser, deleteUser, editUser, editUserAvatar, getPageUser} from "../../../api/auth"
import {Session} from "../../../utils/storage";
import {getAllRole, Role} from "../../../api/sys-role";
import {baseUrl} from "../../../api/common";

const uploadRef = ref<UploadInstance>()
const addDialogVisible = ref(false)
const dialogFormVisible = ref(false)
const avatarDialogVisible = ref(false)
const formLabelWidth = '80px'
const dialogTitle = ref("")
const ruleFormRef = ref<FormInstance>()
const addFormRef = ref<FormInstance>()
const selectedUsers = ref<UserInfo[]>([])
const imageUrl = ref('')
const avatarUserId = ref(0)
const headers = {
  Authorization: `Bearer ${Session.get('token')}`
}

const editForm = reactive({
  id: 0,
  nickname: '',
  email: '',
  username: '',
  role: [],
  isSuperUser:false,
})
const editSource = ref({})
const addForm = reactive({
  nickname: '',
  email: '',
  username: '',
  password: '',
  password_c: '',
  role: [],
  isSuperUser:false,
})

const rules = reactive<FormRules>({
  email: [
    {required: true, message: '请输入邮箱', trigger: 'blur', type: 'email'},
  ],
  nickname: [
    {required: true, message: '请输入昵称', trigger: 'blur'},
    {min: 2, max: 15, message: '昵称长度为2到15', trigger: 'blur'},
  ]
})

interface UserInfo {
  avatar: number,
  createdAt: string,
  email: string,
  id: number,
  nickname: string,
  state: boolean,
  username: string
  role: Array<any>,
  isSuperUser:boolean,
}

const userInfo: UserInfo[] = reactive([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

const dialogMsg = ref("")
const roles = ref<Role[]>([])
const getRoles = () => {
  getAllRole().then((res) => {
    if (res.data.data) {
      roles.value = res.data.data
    }
  }).catch(() => {
  })
}
const handleOnChange = (file: any, fileList: any) => {
  // 只允许上传一次，保留最新对的文件
  fileList.splice(0, fileList.length - 1)
  imageUrl.value = URL.createObjectURL(file.raw)
}

const uploadAvatar = () => {
  uploadRef.value!.submit()
}

const cancelUpload = () => {
  avatarDialogVisible.value = false
}

const handleEdit = (index: number, row: any) => {
  dialogFormVisible.value = true
  dialogTitle.value = `编辑${row.username}`
  editForm.id = row.id
  editForm.username = row.username
  editForm.nickname = row.nickname
  editForm.email = row.email
  editForm.isSuperUser = row.isSuperUser
  editForm.role = row.role.map(item => item.id)
  editSource.value = JSON.parse(JSON.stringify(editForm))

}
const editAvatar = (index: number, row: any) => {
  avatarDialogVisible.value = true
  avatarUserId.value = row.id
  imageUrl.value = ''

  if (row.avatar !== null) {
    imageUrl.value = baseUrl + `system/file?id=` + row.avatar
  }

}
const editConfirm = async (formEl: FormInstance | undefined) => {
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
        editUser(editForm).then((res) => {
          dialogFormVisible.value = false
          ElMessage({
            type: 'success',
            message: `修改"${editForm.username}"成功。`,
          })
        }).catch((error) => {
          ElMessage({
            type: 'error',
            message: `修改"${editForm.username}"失败。`,
          })
        })
      }
    } else {
      ElMessage({
        type: 'warning',
        message: `请正确填写表单"。`,
      })
    }
  })
}

const editCancel = () => {
  dialogFormVisible.value = false
  ElMessage({
    type: 'info',
    message: `已取消修改"${editForm.username}"。`,
  })
}

const changeState = (index: number, row: any) => {
  if (!row.state) {
    dialogMsg.value = `确认要停用用户"${row.username}"？`
  } else {
    dialogMsg.value = `确认要启用用户"${row.username}"？`
  }
  ElMessageBox.confirm(
      dialogMsg.value,
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
        let param = {id: row.id, state: row.state}
        editUser(param).then((res) => {
          ElMessage({
            type: 'success',
            message: `已修改"${row.username}"的状态。`,
          })
        }).catch((error) => {
          ElMessage({
            type: 'error',
            message: `修改"${row.username}"的状态失败。`,
          })
          row.state = !row.state
        })

      })
      .catch((action: Action) => {
        ElMessage({
          type: 'info',
          message: `已取消修改"${row.username}"的状态。`
        })
        row.state = !row.state
      })

}

const userDelete = (index: number, row: any) => {
  ElMessageBox.confirm(
      `确认删除用户"${row.username}"？`,
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
        deleteUser([row.id]).then((res) => {
          ElMessage({
            type: 'success',
            message: `已删除用户"${row.username}"。`,
          })
        }).catch((error) => {
          ElMessage({
            type: 'error',
            message: `删除用户"${row.username}失败"。`,
          })
        })

      }).catch((action: Action) => {
    ElMessage({
      type: 'info',
      message: `已取消删除用户"${row.username}"。`
    })
  })
}

const deleteUsers = (users: UserInfo[]) => {
  const id = users.map(item => item.id)
  const names = users.map(item => item.username).join()
  ElMessageBox.confirm(
      `确认删除用户"${names}"？`,
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
        deleteUser(id).then((res) => {
          ElMessage({
            type: 'success',
            message: `已删除用户"${names}"。`,
          })
        }).catch((error) => {
          ElMessage({
            type: 'error',
            message: `删除用户"${names}失败"。`,
          })
        })

      }).catch((action: Action) => {
    ElMessage({
      type: 'info',
      message: `已取消删除用户"${names}"。`
    })
  })
}
const handleSelectionChange = (val: UserInfo[]) => {
  selectedUsers.value = val
}

const addUser = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      createUser(addForm).then((res) => {
        ElMessage({
          type: 'success',
          message: `新增"${addForm.username}"成功。`,
        })
        formEl.resetFields()
        addDialogVisible.value = false
      }).catch((error) => {
        ElMessage({
          type: 'error',
          message: `修改"${addForm.username}"失败。`,
        })
      })

    } else {
      ElMessage({
        type: 'warning',
        message: `请正确填写表单"。`,
      })
    }
  })
}

const validatePass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入用户密码！'))
  } else {
    callback()
  }
}
const validateCPass = (rule: any, value: string, callback: any) => {
  if (value !== addForm.password) {
    callback(new Error('确认密码与新密码不相同！'))
  } else {
    callback()
  }
}
const checkUsername = (rule: any, value: string, callback: any) => {
  const patt1 = /^[A-z]/
  const patt2 = /(\d|_)*/
  const valid = patt1.test(value) && (patt2.test(value))
  if (!valid) {
    callback(new Error('用户名需以英文开始，由纯英文或英文和数字及下划线组成！'))
  } else {
    callback()
  }
}

const getUsers = () => {
  let param = {
    page: currentPage.value,
    perPage: pageSize.value
  }
  let data: any
  getPageUser(param).then((res) => {
    data = res.data
    userInfo.splice(0, userInfo.length)
    for (let item of data.data) {
      userInfo.push(item)
    }
    total.value = data.count
  }).catch((error) => {
    console.log(error.response)
  })
}

const addRules = reactive<FormRules>({
  username: [
    {required: true, message: '请输入昵称', trigger: 'blur'},
    {validator: checkUsername, trigger: 'blur'},
    {min: 5, max: 20, message: '用户名长度为5到20', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 8, max: 20, message: '密码长度为8到20', trigger: 'blur'},
  ],
  password_c: [{required: true, validator: validateCPass, trigger: 'blur'}],
  nickname: [{min: 8, max: 20, message: '昵称长度为8到20', trigger: 'blur'},],
  email: [
    {required: true, message: '请输入邮箱', trigger: 'blur', type: 'email'},
  ]
})

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  const param = {
    id: avatarUserId.value,
    avatar: response.id
  }
  avatarDialogVisible.value = false
  editUserAvatar(param).then((res) => {
    ElMessage({
      type: 'success',
      message: `头像修改成功。`,
    })
  }).catch((error) => {
    ElMessage({
      type: 'error',
      message: `头像修改失败。`,
    })
  })
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('头像文件需为jpeg或png格式！')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像大小不允许超过2MB！')
    return false
  }

  return true
}
onMounted(() => {
  getUsers()
})
</script>
<style scoped>
.el-row {
  margin-bottom: 2rem;
}

.user-table-row {
  width: calc(100% - 4rem);
  margin: 0 auto;
}

.user-table {
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

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.el-dialog__body {
  display: flex;
  align-items: end;
}

.el-table .cell {
  display: flex;
  align-items: center;
}

.el-tag {
  margin-left: 0.25rem;
}
</style>
