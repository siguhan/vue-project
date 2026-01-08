<template>
    <BaseEChart :option="option" @legend-click="handleLegend" />
</template>

<script setup lang="ts">
import BaseEChart from '../component/BaseEChart.vue'

const legendList = [
    { name: '订单量', right: 125 },
    { name: '用户量', right: 25 },
    { name: '点击量', right: 225 },
]

const generateLegends = () => {
    return legendList.map(item => ({
        top: 70,
        right: item.right,
        selectedMode: true,
        data: [item.name],
    }))
}

const legends = generateLegends()

const option: any = {
    title: {
        text: '各业务线订单量对比',
        left: 30,
        top: 20,
    },

    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
    },

    legend: legends,

    grid: {
        top: 100,
        left: 40,
        right: 30,
        bottom: 40,
        containLabel: true,
    },

    xAxis: {
        type: 'category',
        data: ['电商', '外卖', '出行', '金融'],
    },

    yAxis: {
        type: 'value',
        name: '订单量',
        nameGap: 25,
        nameTextStyle: {
            align: 'right',
            padding: [0, 6, 0, 0],
        },
        axisLabel: {
            align: 'right',
            margin: 8,
        },
    },

    series: [
        {
            name: '订单量',
            type: 'bar',
            barWidth: 35,
            data: [3200, 2800, 1500, 2100],
            label: {
                show: true,
                position: 'top',
            },
        },
        {
            name: '用户量',
            type: 'line',
            data: [2200, 1800, 500, 1100],
            smooth: true,
        },
        {
            name: '点击量',
            type: 'line',
            data: [5800, 5500, 3000, 4000],
            smooth: true,
        },
    ],
}

const handleLegend = (chartInstance: any, params: any) => {
    const selected = params.selected
    const activeNames = Object.keys(selected).filter(k => selected[k])

    const legends = chartInstance.getOption().legend

    // 只剩一个开启 → 禁用它
    if (activeNames.length === 1) {
        chartInstance.setOption({
            legend: legends.map((l: any) => ({
                ...l,
                selectedMode: l.data.includes(activeNames[0]) ? false : true,
            })),
        })
    } else {
        // 多个开启 → 全部恢复可点
        chartInstance.setOption({
            legend: legends.map((l: any) => ({
                ...l,
                selectedMode: true,
            })),
        })
    }
}
</script>

<style scoped></style>
