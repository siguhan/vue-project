<template>
    <div class="user-list">
        <div class="options">
            <el-input
                v-model="searchValue"
                class="search"
                placeholder="Type to search"
            />
            <el-button type="primary" plain @click="openAddModel">
                add user
            </el-button>
            <teleport to="body">
                <div v-if="isShowAddUser" class="add-user-view">
                    <div class="add-user-box">
                        <h2>添加用户</h2>
                        <el-icon class="close-icon" @click="closeAddModel">
                            <Close />
                        </el-icon>
                        <el-form
                            style="width: 100%"
                            label-position="right"
                            label-width="auto"
                        >
                            <el-form-item label="Username">
                                <el-input
                                    v-model="addUserInfo.username"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="Email">
                                <el-input
                                    v-model="addUserInfo.email"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="Password">
                                <el-input
                                    v-model="addUserInfo.password"
                                ></el-input>
                            </el-form-item>
                            <div class="addSubmit">
                                <div style="width: 150px">
                                    <el-select
                                        v-model="addUserInfo.role"
                                        placeholder="role"
                                    >
                                        <el-option
                                            v-for="item in roles"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </div>

                                <el-button type="danger" plain @click="addUser">
                                    submmit
                                </el-button>
                            </div>
                        </el-form>
                    </div>
                </div>
            </teleport>
        </div>
        <div class="table-and-page">
            <UserPage ref="userPage" :searchValue="searchValue" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { instance } from '@/axios'
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { Role } from '@/shared/roles'
import UserPage from '../component/UserPage.vue'

const userPage: any = ref()
const searchValue = ref('')
let userList: any = ref([])

const getUserList = async () => {
    const res: any = await instance.get('/admin/user-list')
    userList.value = res.map((item: any) => ({
        ...item,
        isEditing: false, // 👈 行编辑状态
    }))
}

// 添加用户
const roles = [
    {
        value: Role.ADMIN,
        label: 'admin',
    },
    {
        value: Role.USER,
        label: 'user',
    },
]
const isShowAddUser = ref(false)
const closeAddModel = () => {
    isShowAddUser.value = false
}

const openAddModel = async () => {
    isShowAddUser.value = true
}

const addUserInfo = reactive({
    username: '',
    email: '',
    password: '',
    role: Role.USER,
})

const addUser = async () => {
    try {
        await instance.post('/admin/user-add', {
            username: addUserInfo.username,
            email: addUserInfo.email,
            password: addUserInfo.password,
            role: addUserInfo.role,
        })
        ElMessage.success('添加成功')
        isShowAddUser.value = false
        userPage.value.getUserPage(false)
    } catch (err: any) {
        ElMessage.error(err || '添加失败')
    }
}
</script>

<style scoped>
.user-list {
    display: flex;
    flex-direction: column;
    padding: 12px;
    overflow: hidden;
    width: 100%;
}

.options {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 24px;
}

.table-and-page {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.search {
    min-width: 200px;
    max-width: 300px;
}

.add-user-view {
    position: fixed;
    z-index: 99;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.add-user-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20vh;
    background-color: white;
    min-width: 300px;
    max-width: 400px;
    width: 100%;
    border-radius: 8px;
    padding: 12px 16px 25px 16px;
    position: relative;
}

h2 {
    margin-bottom: 20px;
    width: 100%;
    text-align: center;
}

.close-icon {
    position: absolute;
    top: 16px;
    right: 20px;
    cursor: pointer;
}

.addSubmit {
    display: flex;
    gap: 12px;
    justify-content: space-between;
    margin-top: 30px;
}
</style>
