<template>
    <div ref="pieChartRef" style="width: 600px; height: 400px"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
const pieChartRef = ref()

onMounted(() => {
    const chart: any = echarts.init(pieChartRef.value)
    const option = {
        // backgroundColor: '#2c343c',

        title: {
            text: 'Customized Pie',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#101010',
            },
        },

        tooltip: {
            trigger: 'item',
        },

        // 把「数据值」映射成「视觉效果」（颜色、大小、透明度等）
        visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
                colorLightness: [1, 0],
            },
            dimension: 0,
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [
                    { name: 'Direct', value: 335 },
                    { name: 'Email', value: 310 },
                    { name: 'Union Ads', value: 274 },
                    { name: 'Video Ads', value: 235 },
                    { name: 'Search Engine', value: 400 },
                ].sort(function (a, b) {
                    return b.value - a.value
                }),
                roseType: 'radius',
                // label: {
                //     color: 'rgba(255, 255, 255, 0.3)',
                // },
                labelLine: {
                    lineStyle: {
                        color: 'rgba(99, 99, 99, 0.8)',
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20,
                },
                itemStyle: {
                    color: '#c23531',
                    shadowBlur: 150,
                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                },

                animationType: 'scale',
                // animationEasing: 'elasticOut',
                animationDelay: function (idx: any) {
                    return idx * 100
                },
            },
        ],
    }

    chart.setOption(option)
})
</script>

<style scoped></style>
