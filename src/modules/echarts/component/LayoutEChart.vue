<template>
    <BaseEChart :option="option" v-on="$attrs" />
</template>

<script setup lang="ts">
import BaseEChart from '../component/BaseEChart.vue'

const layoutOption = {
    title: [
        {
            left: 30,
            top: 20,
        },
        {
            right: 25,
            top: 36,
            textStyle: {
                fontSize: 12,
                color: '#999',
            },
        },
    ],

    legend: [
        {
            top: 70,
            right: 25,
            selectedMode: true,
        },
    ],

    grid: {
        top: 100,
        left: 40,
        right: 30,
        bottom: 40,
        containLabel: true,
    },

    yAxis: {
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
}

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

const option = deepMerge(layoutOption, props.option)

function isObject(obj: any) {
    return obj && typeof obj === 'object' && !Array.isArray(obj)
}
function deepMerge(target: any, source: any) {
    const result = { ...target }

    for (const key in source) {
        if (isObject(source[key]) && Array.isArray(target[key])) {
            source[key] = [source[key]]
        }
    }

    for (const key in source) {
        const sourceVal = source[key]
        const targetVal = target[key]

        // 1️⃣ 数组 + 数组 → 按 index merge（核心）
        if (Array.isArray(sourceVal) && Array.isArray(targetVal)) {
            result[key] = targetVal.map((item, index) => {
                if (sourceVal[index] == null) {
                    return item
                }
                return deepMerge(item, sourceVal[index])
            })
            continue
        }

        // 2️⃣ 对象 + 对象 → 递归
        if (isObject(sourceVal) && isObject(targetVal)) {
            result[key] = deepMerge(targetVal, sourceVal)
            continue
        }

        // 3️⃣ 其他 → 覆盖
        result[key] = sourceVal
    }

    return result
}
</script>

<style scoped></style>
