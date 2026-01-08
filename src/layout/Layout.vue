<template>
    <div class="container">
        <Sidebar :class="{ areaSidebar: !viewportStore.isMobile }" />
        <Header class="areaHeader" />
        <RouterView class="areaMain" />
    </div>
    <Teleport to="body">
        <div
            v-if="viewportStore.isMobile && viewportStore.isOpen"
            class="sidebar-overlay"
            @click="viewportStore.handleToggleSidebar"
        ></div>
    </Teleport>
</template>

<script setup lang="ts">
import { Teleport } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import Header from '@/components/Header.vue'
import { useViewportStore } from '@/stores/viewport'
const viewportStore = useViewportStore()
</script>

<style scoped>
.sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 100;
}
.container {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 64px 1fr;
    grid-template-areas:
        'sidebar header'
        'sidebar main';
    min-height: 100vh;
    width: 100%;
}

.areaSidebar {
    grid-area: sidebar;
}

.areaHeader {
    grid-area: header;
}

.areaMain {
    grid-area: main;
}

@media (max-width: 560px) {
    .container {
        grid-template-columns: 1fr;
        grid-template-areas: 'header' 'main';
    }
}
</style>
