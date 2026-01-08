<template>
    <div class="container">
        <div class="header">
            <h2 style="margin-right: 50px; cursor: pointer">vue</h2>
            <div class="header-options">
                <router-link to="/echarts">echarts组件</router-link>
                <router-link to="/playground">演练场</router-link>
            </div>
            <HeaderRight />
        </div>

        <div class="main" ref="waterfallContainer">
            <div
                class="column"
                v-for="(colData, index) in columns"
                :key="index"
            >
                <div
                    class="img-wrapper"
                    v-for="item in colData"
                    :key="item.id"
                    @click="handToPlayground(item.id)"
                >
                    <img :src="item.url" alt="chart" />
                </div>
            </div>
        </div>
        <div></div>
    </div>
</template>

<script setup lang="ts">
import { instance } from '@/axios'
import HeaderRight from '@/components/HeaderRight.vue'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePlaygroundStore } from '@/stores/playground'
const playgroundStore = usePlaygroundStore()

const handToPlayground = async (id: number) => {
    const code: any = await instance.get(`/code/${id}`)
    playgroundStore.currentCode = code
    router.push('/playground')
}
const router = useRouter()

interface ChartItem {
    id: number
    url: string
}

// 原始数据
const list = ref<ChartItem[]>([])
// 分组后的二维数组数据 [[col1_items], [col2_items]...]
const columns = ref<ChartItem[][]>([])
// 容器 DOM 引用
const waterfallContainer = ref<HTMLElement | null>(null)

// 瀑布流配置
const MIN_COL_WIDTH = 250 // 最小列宽
const MAX_COLS = 4 // 最大列数
const GAP = 12 // 间距 (用于精确计算，虽flex gap可自动处理，但逻辑上保留)

// 核心：计算布局函数
const calculateLayout = () => {
    if (!waterfallContainer.value || list.value.length === 0) return

    const containerWidth = waterfallContainer.value.clientWidth

    // 1. 计算当前宽度能容纳几列
    // Math.floor(宽度 / 最小宽度)
    let colCount = Math.floor(containerWidth / MIN_COL_WIDTH)

    // 2. 限制列数范围
    if (colCount > MAX_COLS) colCount = MAX_COLS
    if (colCount < 1) colCount = 1

    // 3. 初始化列数组
    const newColumns: ChartItem[][] = Array.from({ length: colCount }, () => [])

    // 4. 横向优先分配 (Round-Robin 分配法)
    // index 0 -> 第1列, index 1 -> 第2列... index 4 -> 第1列
    list.value.forEach((item, index) => {
        const colIndex = index % colCount
        newColumns[colIndex]!.push(item)
    })

    columns.value = newColumns
}

// 监听器：使用 ResizeObserver 监听容器大小变化，比 window.resize 更准确
let resizeObserver: ResizeObserver | null = null

// 定义一个计时器变量
let resizeTimer: ReturnType<typeof setTimeout> | null = null

const initResizeObserver = () => {
    if (!waterfallContainer.value) return

    resizeObserver = new ResizeObserver(() => {
        // 1. 如果之前有正在等待执行的任务，先清除它
        if (resizeTimer) clearTimeout(resizeTimer)

        // 2. 设置一个新的定时器，延迟执行 (例如 200ms)
        resizeTimer = setTimeout(() => {
            calculateLayout()
        }, 150)
    })

    resizeObserver.observe(waterfallContainer.value)
}

const fetchAllChart = async () => {
    try {
        const res: any = await instance.get('/all-chart')
        list.value = res
        // 数据获取后立即计算一次布局
        calculateLayout()
    } catch (error) {
        console.error(error)
    }
}

onMounted(() => {
    fetchAllChart()
    initResizeObserver()
})

onUnmounted(() => {
    if (resizeObserver) resizeObserver.disconnect()
    if (resizeTimer) clearTimeout(resizeTimer)
})

// 如果 list 数据可能会在外部变化，需要监听 list 重新布局
watch(
    () => list.value,
    () => {
        calculateLayout()
    }
)
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
    height: 64px;
}

.header-options {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    gap: 25px;
    font-weight: 450;
    font-size: 14px;
}

/* 瀑布流容器 */
.main {
    display: flex;
    flex-direction: row; /* 横向排列列容器 */
    justify-content: flex-start;
    align-items: flex-start;
    gap: 12px; /* 列之间的间距 */
    padding: 16px;
    box-sizing: border-box;
    width: 100%;
}

/* 每一列 */
.column {
    display: flex;
    flex-direction: column; /* 列内部垂直排列 */
    gap: 12px; /* 图片上下间距 */
    flex: 1; /* 每列等宽 */
    /* 防止某些极端情况下列宽被压缩 */
    min-width: 0;
}

.img-wrapper {
    width: 100%;
    cursor: pointer;
}

img {
    width: 100%;
    height: auto;
    display: block; /* 消除图片底部默认留白 */
    object-fit: cover;
}
</style>
