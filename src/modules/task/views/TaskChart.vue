<template>
    <div class="echarts-container">
        <!-- 图表类型选择器 -->
        <div class="chart-type-selector">
            <div
                v-for="type in chartTypes"
                :key="type.value"
                :class="[
                    'chart-type-btn',
                    { active: currentChartType === type.value },
                ]"
                @click="changeChartType(type.value)"
            >
                <span class="icon">{{ type.icon }}</span>
                <span class="label">{{ type.label }}</span>
            </div>
        </div>

        <!-- 图表容器 -->
        <div ref="chartContainer" class="chart-wrapper">
            <div ref="chartDom" class="chart"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { ECharts, EChartsOption } from 'echarts'

// 图表DOM引用
const chartDom = ref<HTMLElement | null>(null)
const chartContainer = ref<HTMLElement | null>(null)

// ECharts实例
let chartInstance: ECharts | null = null

// 响应式数据
const currentChartType = ref<'line' | 'bar' | 'pie' | 'radar'>('line')

// 图表类型选项
const chartTypes = [
    { value: 'line' as const, label: 'Line Chart', icon: '📈' },
    { value: 'bar' as const, label: 'Bar Chart', icon: '📊' },
    { value: 'pie' as const, label: 'Pie Chart', icon: '🥧' },
    { value: 'radar' as const, label: 'Radar Chart', icon: '📐' },
]

// 模拟数据
const chartData = ref([
    { name: 'Product A', value: 235, category: 'Electronics' },
    { name: 'Product B', value: 187, category: 'Clothing' },
    { name: 'Product C', value: 310, category: 'Books' },
    { name: 'Product D', value: 127, category: 'Home' },
    { name: 'Product E', value: 420, category: 'Electronics' },
    { name: 'Product F', value: 268, category: 'Clothing' },
    { name: 'Product G', value: 190, category: 'Books' },
    { name: 'Product H', value: 345, category: 'Home' },
])

// 计算统计数据
const totalValue = ref(0)
const averageValue = ref(0)
const maxValue = ref(0)

const calculateStats = () => {
    const values = chartData.value.map(item => item.value)
    totalValue.value = values.reduce((sum, val) => sum + val, 0)
    averageValue.value = totalValue.value / values.length
    maxValue.value = Math.max(...values)
}

// 图表配置
const getChartOptions = (): EChartsOption => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

    // 基础配色方案
    const colorPalette = isDarkMode
        ? ['#3fb1e3', '#6be6c1', '#626c91', '#a0a7e6', '#c4ebad', '#96dee8']
        : ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272']

    const grid = {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top: '10%',
        containLabel: true,
    }

    // 根据图表类型返回不同的配置
    switch (currentChartType.value) {
        case 'line':
            return {
                // color: colorPalette,
                // grid: { ...grid, bottom: '15%' },
                // tooltip: {
                //     trigger: 'axis',
                //     backgroundColor: isDarkMode
                //         ? 'rgba(30, 30, 40, 0.9)'
                //         : 'rgba(255, 255, 255, 0.9)',
                //     borderColor: isDarkMode ? '#555' : '#ddd',
                //     textStyle: {
                //         color: isDarkMode ? '#fff' : '#333',
                //     },
                // },
                // legend: {
                //     data: ['Sales Trend'],
                //     bottom: 0,
                //     textStyle: {
                //         color: isDarkMode ? '#aaa' : '#666',
                //     },
                // },
                xAxis: {
                    type: 'category',
                    data: chartData.value.map(item => item.name),
                    // axisLine: {
                    //     lineStyle: {
                    //         color: isDarkMode ? '#555' : '#ccc',
                    //     },
                    // },
                    // axisLabel: {
                    //     color: isDarkMode ? '#aaa' : '#666',
                    //     rotate: 45,
                    // },
                },
                yAxis: {
                    type: 'value',
                    // axisLine: {
                    //     lineStyle: {
                    //         color: isDarkMode ? '#555' : '#ccc',
                    //     },
                    // },
                    // axisLabel: {
                    //     color: isDarkMode ? '#aaa' : '#666',
                    // },
                    // splitLine: {
                    //     lineStyle: {
                    //         color: isDarkMode ? '#333' : '#eee',
                    //         type: 'dashed',
                    //     },
                    // },
                },
                series: [
                    {
                        name: 'Sales Trend',
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        data: chartData.value.map(item => item.value),
                        lineStyle: {
                            width: 3,
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    {
                                        offset: 0,
                                        color: colorPalette[0] + '80',
                                    },
                                    {
                                        offset: 1,
                                        color: colorPalette[0] + '10',
                                    },
                                ]
                            ),
                        },
                    },
                ],
            }

        case 'bar':
            return {
                color: colorPalette,
                grid,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                    backgroundColor: isDarkMode
                        ? 'rgba(30, 30, 40, 0.9)'
                        : 'rgba(255, 255, 255, 0.9)',
                    borderColor: isDarkMode ? '#555' : '#ddd',
                    textStyle: {
                        color: isDarkMode ? '#fff' : '#333',
                    },
                },
                xAxis: {
                    type: 'category',
                    data: chartData.value.map(item => item.name),
                    axisLine: {
                        lineStyle: {
                            color: isDarkMode ? '#555' : '#ccc',
                        },
                    },
                    axisLabel: {
                        color: isDarkMode ? '#aaa' : '#666',
                        rotate: 45,
                    },
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: isDarkMode ? '#555' : '#ccc',
                        },
                    },
                    axisLabel: {
                        color: isDarkMode ? '#aaa' : '#666',
                    },
                    splitLine: {
                        lineStyle: {
                            color: isDarkMode ? '#333' : '#eee',
                            type: 'dashed',
                        },
                    },
                },
                series: [
                    {
                        type: 'bar',
                        data: chartData.value.map(item => item.value),
                        barWidth: '60%',
                        itemStyle: {
                            borderRadius: [4, 4, 0, 0],
                            shadowColor: isDarkMode
                                ? 'rgba(0, 0, 0, 0.5)'
                                : 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 4,
                        },
                    },
                ],
            }

        case 'pie':
            return {
                color: colorPalette,
                tooltip: {
                    trigger: 'item',
                    backgroundColor: isDarkMode
                        ? 'rgba(30, 30, 40, 0.9)'
                        : 'rgba(255, 255, 255, 0.9)',
                    borderColor: isDarkMode ? '#555' : '#ddd',
                    textStyle: {
                        color: isDarkMode ? '#fff' : '#333',
                    },
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    right: 10,
                    top: 20,
                    bottom: 20,
                    textStyle: {
                        color: isDarkMode ? '#aaa' : '#666',
                    },
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 6,
                            borderColor: isDarkMode ? '#222' : '#fff',
                            borderWidth: 2,
                        },
                        label: {
                            show: true,
                            formatter: '{b}: {d}%',
                            color: isDarkMode ? '#fff' : '#333',
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 16,
                                fontWeight: 'bold',
                            },
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                        data: chartData.value.map(item => ({
                            name: item.name,
                            value: item.value,
                        })),
                    },
                ],
            }

        case 'radar':
            const categories = Array.from(
                new Set(chartData.value.map(item => item.category))
            )

            return {
                color: colorPalette,
                tooltip: {
                    trigger: 'item',
                    backgroundColor: isDarkMode
                        ? 'rgba(30, 30, 40, 0.9)'
                        : 'rgba(255, 255, 255, 0.9)',
                    borderColor: isDarkMode ? '#555' : '#ddd',
                    textStyle: {
                        color: isDarkMode ? '#fff' : '#333',
                    },
                },
                legend: {
                    data: ['Performance'],
                    bottom: 0,
                    textStyle: {
                        color: isDarkMode ? '#aaa' : '#666',
                    },
                },
                radar: {
                    indicator: categories.map(cat => ({ name: cat, max: 500 })),
                    shape: 'circle',
                    splitNumber: 5,
                    axisName: {
                        color: isDarkMode ? '#aaa' : '#666',
                    },
                    splitLine: {
                        lineStyle: {
                            color: isDarkMode ? '#333' : '#eee',
                            type: 'dashed',
                        },
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: isDarkMode
                                ? [
                                      'rgba(255,255,255,0.02)',
                                      'rgba(255,255,255,0.05)',
                                  ]
                                : [
                                      'rgba(255,255,255,0.8)',
                                      'rgba(255,255,255,0.2)',
                                  ],
                        },
                    },
                },
                series: [
                    {
                        type: 'radar',
                        data: [
                            {
                                value: categories.map(cat => {
                                    const itemsInCategory =
                                        chartData.value.filter(
                                            item => item.category === cat
                                        )
                                    return (
                                        itemsInCategory.reduce(
                                            (sum, item) => sum + item.value,
                                            0
                                        ) / itemsInCategory.length
                                    )
                                }),
                                name: 'Performance',
                                symbol: 'circle',
                                symbolSize: 8,
                                lineStyle: {
                                    width: 3,
                                },
                                areaStyle: {
                                    color: new echarts.graphic.LinearGradient(
                                        0,
                                        0,
                                        0,
                                        1,
                                        [
                                            {
                                                offset: 0,
                                                color: colorPalette[0] + '99',
                                            },
                                            {
                                                offset: 1,
                                                color: colorPalette[0] + '20',
                                            },
                                        ]
                                    ),
                                },
                            },
                        ],
                    },
                ],
            }
    }
}

// 初始化图表
const initChart = () => {
    if (!chartDom.value) return

    // 销毁现有实例
    if (chartInstance) {
        chartInstance.dispose()
    }

    // 创建新实例
    chartInstance = echarts.init(chartDom.value)
    updateChart()

    // 添加窗口大小变化监听
    window.addEventListener('resize', handleResize)
}

// 更新图表
const updateChart = () => {
    if (!chartInstance) return

    const options = getChartOptions()
    chartInstance.setOption(options)
}

// 处理窗口大小变化
const handleResize = () => {
    if (chartInstance) {
        chartInstance.resize()
    }
}

// 切换图表类型
const changeChartType = (type: 'line' | 'bar' | 'pie' | 'radar') => {
    currentChartType.value = type
}

// 监听图表类型变化
watch(currentChartType, () => {
    updateChart()
})

// 监听数据变化
watch(
    chartData,
    () => {
        calculateStats()
        updateChart()
    },
    { deep: true }
)

// 生命周期
onMounted(() => {
    nextTick(() => {
        initChart()
        calculateStats()
    })
})

onUnmounted(() => {
    if (chartInstance) {
        chartInstance.dispose()
    }
    window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.echarts-container {
    display: flex;
    flex-direction: column;
    height: 600px;
    max-width: 100%;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

@media (prefers-color-scheme: dark) {
    .echarts-container {
        background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
}

.chart-type-selector {
    display: flex;
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

@media (prefers-color-scheme: dark) {
    .chart-type-selector {
        background: rgba(40, 40, 60, 0.8);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
}

.chart-type-btn {
    display: flex;
    align-items: center;
    padding: 10px 18px;
    margin-right: 12px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(0, 0, 0, 0.05);
    font-weight: 500;
}

@media (prefers-color-scheme: dark) {
    .chart-type-btn {
        background: rgba(60, 60, 80, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.05);
        color: #ddd;
    }
}

.chart-type-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

@media (prefers-color-scheme: dark) {
    .chart-type-btn:hover {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
}

.chart-type-btn.active {
    background: linear-gradient(135deg, #5470c6 0%, #3ba272 100%);
    color: white;
    box-shadow: 0 5px 15px rgba(84, 112, 198, 0.3);
}

.chart-type-btn .icon {
    margin-right: 8px;
    font-size: 18px;
}

.chart-type-btn .label {
    font-size: 14px;
}

.chart-wrapper {
    flex: 1;
    padding: 20px;
    position: relative;
}

.chart {
    width: 100%;
    height: 100%;
    min-height: 300px;
}

.stat-item:last-child {
    border-right: none;
}

@media (max-width: 768px) {
    .echarts-container {
        height: 700px;
    }

    .chart-type-selector {
        flex-wrap: wrap;
        justify-content: center;
    }

    .chart-type-btn {
        margin-bottom: 8px;
    }

    .chart-stats {
        flex-wrap: wrap;
    }

    .stat-item {
        flex: 0 0 50%;
        border-right: none;
        margin-bottom: 15px;
        padding: 0 10px;
    }

    .stat-item:nth-child(2n) {
        border-left: 1px solid rgba(0, 0, 0, 0.05);
    }

    @media (prefers-color-scheme: dark) {
        .stat-item:nth-child(2n) {
            border-left: 1px solid rgba(255, 255, 255, 0.05);
        }
    }
}
</style>
