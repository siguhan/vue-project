<template>
    <div ref="chartRef" class="echart-container"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
    option: {
        type: Object,
        required: true,
    },
    theme: {
        type: String,
        default: null,
    },
})

const emits = defineEmits(['chartClick', 'legendClick'])

const chartRef = ref(null)
let chartInstance: any = null

onMounted(() => {
    chartInstance = echarts.init(chartRef.value, props.theme)
    chartInstance.setOption(props.option)
    window.addEventListener('resize', resize)
    chartInstance.on('click', (params: any) => {
        emits('chartClick', chartInstance, params)
    })

    chartInstance.on('legendselectchanged', (params: any) => {
        emits('legendClick', chartInstance, params)
    })
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', resize)
    chartInstance?.dispose()
})

const resize = () => {
    chartInstance?.resize()
}

watch(
    () => props.option,
    newOption => {
        chartInstance?.setOption(newOption, true)
    },
    { deep: true }
)

defineExpose({ chartInstance })
</script>

<style scoped>
.echart-container {
    width: 100%;
    height: 100%;
}
</style>
