<template>
    <form action="">
        <slot></slot>
    </form>
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'

const props = defineProps({
    model: {
        type: Object,
        required: true,
    },
    rules: {
        type: Object,
        default: () => ({}),
    },
    labelPosition: {
        type: String,
        default: 'right',
    },
    labelWidth: {
        type: String || Number,
        default: '',
    },
})

const maxLabelWidth = ref(0)
const updateLabelWidth = (width: number) => {
    if (width > maxLabelWidth.value) {
        maxLabelWidth.value = width
    }
}

const fields: any = []
const addField = (field: any) => {
    fields.push(field)
}
const removeField = (field: any) => {
    if (field.prop) {
        fields.splice(fields.indexOf(field), 1)
    }
}
const validate = async () => {
    const results = await Promise.all(
        fields.map((field: any) => field.validate())
    )
    return results.every(Boolean)
}
const validateField = async (props: string) => {
    const propList = Array.isArray(props) ? props : [props]
    const promises = propList.map(prop => {
        const field = fields.find((f: any) => f.prop === prop)
        if (!field) return true
        return field.validate()
    })

    const results = await Promise.all(promises)
    return results.every(Boolean)
}

provide('elForm', {
    model: props.model,
    rules: props.rules,
    labelPosition: props.labelPosition,
    labelWidth: props.labelWidth,
    maxLabelWidth,
    addField,
    removeField,
    updateLabelWidth,
})

defineExpose({
    validate,
    validateField,
})
</script>

<style scoped></style>
