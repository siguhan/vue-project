<template>
    <div class="me-form-item" :class="`is-label-${labelPosition}`">
        <label
            v-if="label"
            ref="labelRef"
            style="padding-right: 12px"
            :style="labelStyle"
        >
            {{ label }}
        </label>
        <div class="me-form-item__content">
            <slot></slot>
            <div
                v-if="errorMessage"
                style="
                    position: absolute;
                    bottom: -1.4em;
                    color: red;
                    font-size: 12px;
                "
            >
                {{ errorMessage }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    computed,
    inject,
    nextTick,
    onMounted,
    onUnmounted,
    provide,
    ref,
} from 'vue'
import Schema from 'async-validator'

const props = defineProps({
    label: String,
    labelPosition: String,
    labelWidth: String || Number,
    prop: String,
    required: {
        type: Boolean,
        default: false,
    },
})

const elForm: any = inject('elForm', null)

const model = elForm?.model
const rules = elForm?.rules

const labelPosition = computed(() => {
    return props.labelPosition || elForm?.labelPosition || 'right'
})

const labelWidth = computed(() => {
    const width = props.labelWidth || elForm?.labelWidth || ''
    if (!width) return ''
    if (width === 'auto')
        return elForm.maxLabelWidth.value
            ? `${elForm.maxLabelWidth.value}px`
            : ''
    if (typeof width === 'number') return width + 'px'
    if (width.endsWith('px')) {
        return width
    } else {
        return width + 'px'
    }
})

const labelStyle = computed(() => {
    if (labelPosition.value === 'top') {
        return {}
    } else {
        return {
            width: labelWidth.value,
            textAlign: labelPosition.value,
        }
    }
})

const errorMessage = ref('')
const validate = async (trigger: string) => {
    const fieldName = props.prop
    if (fieldName) {
        const value = model[fieldName]
        const fieldModel = { [fieldName]: value } //校验对象

        const fieldRules = rules[fieldName]
        if (!fieldRules || fieldRules.length === 0) return true

        let filteredRules: any = []
        if (!trigger) {
            filteredRules = fieldRules
        } else {
            filteredRules = fieldRules.filter((rule: any) => {
                const fieldTrigger = rule.trigger
                if (!fieldTrigger) return true
                if (typeof fieldTrigger === 'string') {
                    return fieldTrigger === trigger
                } else {
                    return fieldTrigger.includes(trigger)
                }
            })
        }

        if (filteredRules.length === 0) return true
        // 校验规则
        const descriptor = {
            [fieldName]: filteredRules,
        }

        const validator = new Schema(descriptor) //校验器

        try {
            await validator.validate(fieldModel)
            errorMessage.value = ''
            return true
        } catch (err: any) {
            errorMessage.value = err.errors?.[0]?.message || '校验失败'
            console.log(errorMessage.value)
            return false
        }
    }
}

const lastTrigger = ref('')
const onFieldBlur = () => {
    if (lastTrigger.value === 'change') return
    validate('blur')
}

const onFieldChange = () => {
    lastTrigger.value = 'change'
    validate('change')
}

const formItemContext = {
    prop: props.prop,
    validate,
    onFieldBlur,
    onFieldChange,
}

const labelRef = ref()
onMounted(async () => {
    const width = props.labelWidth || elForm?.labelWidth || ''
    if (
        labelRef.value &&
        elForm &&
        elForm.labelPosition !== 'top' &&
        props.labelPosition !== 'top' &&
        width === 'auto'
    ) {
        await nextTick()

        const width = labelRef.value.offsetWidth
        elForm.updateLabelWidth(width)
    }
    elForm.addField(formItemContext)
})

onUnmounted(() => {
    elForm.removeField(formItemContext)
})

provide('elFormItem', formItemContext)
</script>

<style scoped>
.me-form-item {
    display: flex;
    margin-bottom: 24px;
}

.is-label-top {
    flex-direction: column;
    gap: 10px;
}
.me-form-item__content {
    flex: 1;
    position: relative;
}
</style>
