<template>
    <aside
        class="sidebar"
        :class="{ open: viewportStore.isOpen }"
        v-bind="$attrs"
    >
        <div class="dashboard-name">
            <span style="margin-right: 5px">Acme</span>
            <span
                class="nav-text"
                :class="{ hidden: viewportStore.isCollapse }"
            >
                Dashboard
            </span>
        </div>

        <nav class="nav" role="navigation">
            <RouterLink to="/admin/user">
                <el-icon size="25"><UserFilled /></el-icon>
                <span
                    class="nav-text"
                    :class="{ hidden: viewportStore.isCollapse }"
                >
                    用户管理
                </span>
            </RouterLink>
            <RouterLink to="/admin/echarts">
                <el-icon size="25"><List /></el-icon>
                <span
                    class="nav-text"
                    :class="{ hidden: viewportStore.isCollapse }"
                >
                    任务管理
                </span>
            </RouterLink>
        </nav>

        <div class="collapse-toggle">
            <div class="collapseBtn" @click="viewportStore.handleToggleSidebar">
                {{ viewportStore.isCollapse ? '⮞' : '⮜' }}
            </div>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { UserFilled, List } from '@element-plus/icons-vue'
import { useViewportStore } from '@/stores/viewport'
const viewportStore = useViewportStore()
</script>

<style scoped>
.sidebar {
    background-color: white;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-right: 1px solid #e2e8f0;
}

@media (max-width: 560px) {
    .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        z-index: 200;
        transform: translateX(-120%);
        transition: transform 0.28s ease;
    }
    .sidebar.open {
        transform: translateX(0);
        box-shadow: 0 8px 24px rgba(2, 6, 23, 0.12);
    }
}

.nav-text {
    white-space: nowrap;
    transition: opacity 0.2s ease, max-width 0.5s ease;
    max-width: 120px;
    overflow: hidden;
}

.nav-text.hidden {
    opacity: 0;
    pointer-events: none;
    max-width: 0;
}

.dashboard-name {
    height: 64px;
    display: flex;
    align-items: center;
    padding: 10px 12px;
}

.nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
}

.nav a {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 10px 12px;
    text-decoration: none;
    color: #0f172a;
}

.collapse-toggle {
    display: flex;
    flex: 1;
    align-items: end;
    justify-content: center;
    padding: 30px 0;
}

.collapseBtn {
    line-height: 28px;
    user-select: none;
    text-align: center;
    width: 30px;
    height: 30px;
    cursor: pointer;
    border-radius: 4px;
    border: #adadad 1px solid;
}
</style>
