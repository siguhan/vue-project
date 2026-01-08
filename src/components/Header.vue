<template>
    <div class="header">
        <div @click="viewportStore.handleToggleSidebar">
            <el-icon size="20">
                <Fold v-if="!viewportStore.isCollapse" />
                <Expand v-else />
            </el-icon>
        </div>
        <HeaderRight />
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useViewportStore } from '@/stores/viewport'
import { Fold, Expand } from '@element-plus/icons-vue'
import HeaderRight from './HeaderRight.vue'

const userStore = useUserStore()
const viewportStore = useViewportStore()
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
}
</style>
