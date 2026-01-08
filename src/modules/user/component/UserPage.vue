<template>
    <div class="table" ref="tableRef">
        <el-table
            :data="filterTableData"
            style="width: 100%"
            stripe
            show-overflow-tooltip
            size="large"
        >
            <el-table-column prop="id" label="Id" min-width="200" />
            <el-table-column prop="username" label="UserName" min-width="120">
                <template #default="{ row }">
                    <div class="fieldValue">
                        <el-input
                            v-if="row.isEditing"
                            v-model="row.username"
                            size="small"
                        />
                        <span
                            v-else
                            v-for="(item, index) in splitHighlight(
                                row.username,
                                searchValue
                            )"
                            :key="index"
                            :class="{ highlight: item.highlight }"
                        >
                            {{ item.text }}
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="email" label="Email" min-width="200">
                <template #default="{ row }">
                    <div class="fieldValue">
                        <el-input
                            v-if="row.isEditing"
                            v-model="row.email"
                            size="small"
                        />
                        <span
                            v-else
                            v-for="(item, index) in splitHighlight(
                                row.email,
                                searchValue
                            )"
                            :key="index"
                            :class="{ highlight: item.highlight }"
                        >
                            {{ item.text }}
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="password" label="Password" min-width="150" />
            <el-table-column prop="isLogin" label="Is Login" min-width="100" />
            <el-table-column
                prop="createTime"
                label="Create Time"
                min-width="200"
                sortable
            />
            <el-table-column fixed="right" label="Operations" min-width="120">
                <template #default="{ row }">
                    <div v-if="row.isEditing">
                        <el-button
                            link
                            type="success"
                            size="small"
                            @click="save(row)"
                        >
                            Save
                        </el-button>
                        <el-button link size="small" @click="cancel(row)">
                            Cancel
                        </el-button>
                    </div>
                    <div v-else>
                        <el-button
                            link
                            type="primary"
                            size="small"
                            @click="edit(row)"
                        >
                            Edit
                        </el-button>
                        <el-button
                            link
                            type="danger"
                            size="small"
                            @click="deleteUser(row)"
                        >
                            Delete
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="page">
        <el-pagination
            v-model:current-page="pageNum"
            v-model:page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        />
    </div>
</template>

<script setup lang="ts">
import { instance } from '@/axios'
import { computed, onMounted, ref, toRaw } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps(['searchValue'])

const tableRef = ref()

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 删除用户
const deleteUser = async (row: any) => {
    const user = toRaw(row)

    try {
        await ElMessageBox.confirm(
            `确定要删除用户「${user.username}」吗？`,
            '删除确认',
            {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }
        )

        await instance.delete(`/admin/user-delete/${user.id}`)

        ElMessage.success('删除成功')

        // 🔁 重新拉取分页数据
        getUserPage(false)
    } catch (err: any) {
        if (!(err === 'cancer')) ElMessage.error(err)
        // 用户点取消会进这里，不需要提示错误
    }
}

// 查找用户分页数据

const calcPageSize = () => {
    const tableEl = tableRef.value
    if (!tableEl) return

    const tableHeight = tableEl.clientHeight
    const rowHeight = 50
    pageSize.value = Math.floor((tableHeight - 48) / rowHeight)
}

const pageNum = ref(Number(route.query.pageNum) || 1)
const pageSize = ref(Number(route.query.pageSize) || 8) // 默认值先给 8
const total = ref(0)
const tableData = ref([])

// 缓存分页数据
const cachePageMap = new Map()
const maxCache = 10

const cachePage = (pageNum: number, data: any) => {
    const cacheCount = cachePageMap.size
    if (cacheCount >= maxCache) return
    cachePageMap.set(pageNum, data)
}

const getUserPage = async (useCache: boolean) => {
    router.push({
        query: {
            pageNum: pageNum.value,
            pageSize: pageSize.value,
        },
    })

    if (useCache) {
        const cacheData = cachePageMap.get(pageNum.value)
        if (cacheData) {
            tableData.value = cacheData
            return
        }
    } else {
        cachePageMap.clear()
    }

    const res: any = await instance.get('/admin/user-page', {
        params: {
            pageNum: pageNum.value,
            pageSize: pageSize.value,
        },
    })
    tableData.value = res.records
    total.value = res.total
    cachePage(pageNum.value, tableData.value)
}

const handleCurrentChange = (page: number) => {
    pageNum.value = page
    getUserPage(true)
}

const handleSizeChange = (size: number) => {
    pageSize.value = size
    pageNum.value = 1
    getUserPage(false)
}

onMounted(() => {
    calcPageSize()
    getUserPage(false)
})

const filterTableData = computed(() =>
    tableData.value.filter((data: any) => {
        if (props.searchValue) {
            return (
                data.username
                    .toLowerCase()
                    .includes(props.searchValue.toLowerCase()) ||
                data.email
                    .toLowerCase()
                    .includes(props.searchValue.toLowerCase())
            )
        } else {
            return true
        }
    })
)

const splitHighlight = (text: string, keyword: string) => {
    if (!keyword) return [{ text, highlight: false }]

    const reg = new RegExp(`(${keyword})`, 'gi')
    const parts = text.split(reg)

    return parts.map(part => ({
        text: part,
        highlight: part.toLowerCase() === keyword.toLowerCase(),
    }))
}

const edit = (row: any) => {
    row.isEditing = !row.isEditing
}

const save = async (row: any) => {
    try {
        const data = toRaw(row)
        const userInfo: any = await instance.put('/admin/user-update', data)
        if (userStore.userInfo.id === userInfo.id) {
            userStore.setUserInfo(userInfo)
        }
        row.isEditing = false
        ElMessage.success('User updated successfully')
    } catch (err: any) {
        ElMessage.error(err)
    }
}

const cancel = (row: any) => {
    row.isEditing = false
}

defineExpose({
    calcPageSize,
    getUserPage,
})
</script>

<style scoped>
.table {
    flex: 1;
    overflow: auto;
}

.page {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 20px;
}

.fieldValue {
    display: flex;
    align-items: center;
    height: 25px;
}

span {
    line-height: 25px;
}

.highlight {
    color: #f56c6c;
}
</style>
