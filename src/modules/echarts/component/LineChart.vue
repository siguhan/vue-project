<template>
    <div style="width: 100%; height: 400px">
        <LayoutEChart :option="option" @legend-click="handleLegend" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

import LayoutEChart from '../component/LayoutEChart.vue'

const lineChartRef = ref(null)

const dataPV = [1200, 1400, 1600, 1500, 1800, 2000, 2200]
const dataUV = [800, 900, 1000, 980, 1100, 1300, 1400]

let lastValidMax = Math.max(...dataPV, ...dataUV)
const placeholderData = [0, lastValidMax]

const seriesMap: any = {
    PV: dataPV,
    UV: dataUV,
}

function getVisibleMax(selected: any) {
    const visibleSeries = Object.keys(selected)
        .filter(name => selected[name]) // 只要当前显示的
        .map(name => seriesMap[name])
        .filter(Boolean)
    if (!visibleSeries.length) return null

    return Math.max(...visibleSeries.flat())
}

function updatePlaceholder(chart: any, max: number) {
    chart.setOption({
        series: [
            {
                name: '__axis_holder__',
                type: 'line',
                data: [0, max],
                showSymbol: false,
                lineStyle: { opacity: 0 },
                tooltip: { show: false },
                silent: true,
            },
        ],
    })
}

const option = {
    title: [
        {
            text: '近 7 天访问趋势',
        },
        {
            text: 'PV / UV',
        },
    ],

    tooltip: {
        trigger: 'axis',
    },

    legend: {
        data: ['PV', 'UV'],
    },

    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },

    yAxis: {
        type: 'value',
        name: '访问量',
        nameLocation: 'end',
    },

    series: [
        {
            name: 'PV',
            type: 'line',
            smooth: true,
            data: dataPV,
        },
        {
            name: 'UV',
            type: 'line',
            smooth: true,
            data: dataUV,
        },
        {
            name: '__axis_holder__',
            type: 'line',
            data: placeholderData, // 只用于刻度计算
            showSymbol: false,
            lineStyle: {
                opacity: 0,
            },
            tooltip: {
                show: false,
            },
            silent: true, // 不响应事件
        },
    ],
}

const handleLegend = (chartInstance: any, e: any) => {
    const max = getVisibleMax(e.selected)
    if (max != null) {
        if (lastValidMax !== max) {
            console.log('update placeholder')
            lastValidMax = max
            updatePlaceholder(chartInstance, max)
        }
    } else {
        // 所有折线都隐藏，用“最后一次”的最大值
        updatePlaceholder(chartInstance, lastValidMax)
    }
}
</script>
