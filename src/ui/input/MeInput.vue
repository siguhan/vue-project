<template>
    <div
        class="el-input-like"
        :class="{ 'is-focus': focused, 'is-disabled': disabled }"
        @mousedown="onMouseDown"
        @click="onClick"
    >
        <input
            ref="inputRef"
            :type="
                showPassword ? (passwordVisible ? 'password' : 'text') : type
            "
            class="el-input-like__inner"
            :value="modelValue"
            :disabled="disabled"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
        />

        <span
            v-if="clearable && modelValue && focused"
            class="inline-icon"
            @click="clearValue"
        >
            <i class="el-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                    <path
                        fill="currentColor"
                        d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
                    ></path>
                </svg>
            </i>
        </span>

        <span
            v-if="showPassword && modelValue"
            class="inline-icon"
            @click="onShowPassword"
        >
            <i class="el-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                    <path
                        fill="currentColor"
                        d="M876.8 156.8c0-9.6-3.2-16-9.6-22.4s-12.8-9.6-22.4-9.6-16 3.2-22.4 9.6L736 220.8c-64-32-137.6-51.2-224-60.8-160 16-288 73.6-377.6 176S0 496 0 512s48 73.6 134.4 176c22.4 25.6 44.8 48 73.6 67.2l-86.4 89.6c-6.4 6.4-9.6 12.8-9.6 22.4s3.2 16 9.6 22.4 12.8 9.6 22.4 9.6 16-3.2 22.4-9.6l704-710.4c3.2-6.4 6.4-12.8 6.4-22.4m-646.4 528Q115.2 579.2 76.8 512q43.2-72 153.6-172.8C304 272 400 230.4 512 224c64 3.2 124.8 19.2 176 44.8l-54.4 54.4C598.4 300.8 560 288 512 288c-64 0-115.2 22.4-160 64s-64 96-64 160c0 48 12.8 89.6 35.2 124.8L256 707.2c-9.6-6.4-19.2-16-25.6-22.4m140.8-96Q352 555.2 352 512c0-44.8 16-83.2 48-112s67.2-48 112-48c28.8 0 54.4 6.4 73.6 19.2zM889.599 336c-12.8-16-28.8-28.8-41.6-41.6l-48 48c73.6 67.2 124.8 124.8 150.4 169.6q-43.2 72-153.6 172.8c-73.6 67.2-172.8 108.8-284.8 115.2-51.2-3.2-99.2-12.8-140.8-28.8l-48 48c57.6 22.4 118.4 38.4 188.8 44.8 160-16 288-73.6 377.6-176S1024 528 1024 512s-48.001-73.6-134.401-176"
                    ></path>
                    <path
                        fill="currentColor"
                        d="M511.998 672c-12.8 0-25.6-3.2-38.4-6.4l-51.2 51.2c28.8 12.8 57.6 19.2 89.6 19.2 64 0 115.2-22.4 160-64 41.6-41.6 64-96 64-160 0-32-6.4-64-19.2-89.6l-51.2 51.2c3.2 12.8 6.4 25.6 6.4 38.4 0 44.8-16 83.2-48 112s-67.2 48-112 48"
                    ></path>
                </svg>
            </i>
        </span>
    </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'

const props = withDefaults(
    defineProps<{
        modelValue: string
        disabled?: boolean
        clearable?: boolean
        showPassword?: boolean
        type?: string
    }>(),
    {
        type: 'text', // 给 type 设置默认值
    }
)

const elForm = inject('elForm', null)
const elFormItem: any = inject('elFormItem', null)

const inputRef = ref<HTMLInputElement | null>(null)

const emit = defineEmits(['update:modelValue'])

const clearValue = () => {
    emit('update:modelValue', '')
}

const passwordVisible = ref(true)

const onShowPassword = () => {
    const inputEl = inputRef.value
    if (!inputEl) return

    const length = inputEl.value.length

    passwordVisible.value = !passwordVisible.value

    requestAnimationFrame(() => {
        inputEl.setSelectionRange(length, length)
        // inputRef.value!.value = ''
        // inputRef.value!.value = props.modelValue
    })
}

const focused = ref(false)

const onInput = (e: Event) => {
    emit('update:modelValue', (e.target as HTMLInputElement).value)
    onChange()
}

const onFocus = () => {
    focused.value = true
}

const onBlur = () => {
    focused.value = false
    elFormItem?.onFieldBlur()
}

const onChange = () => {
    elFormItem?.onFieldChange()
}

//  * mousedown 阶段阻止默认行为
//  * → 防止浏览器把焦点从 input 上“移走”
const onMouseDown = (e: MouseEvent) => {
    if (props.disabled) return
    if (e.target !== inputRef.value) {
        e.preventDefault()
    }
}

//  click 阶段再手动 focus（只在没聚焦时）
const onClick = () => {
    if (props.disabled) return
    if (document.activeElement !== inputRef.value) {
        inputRef.value?.focus()
    }
}
</script>

<style scoped>
.el-input-like {
    display: inline-flex;
    align-items: center;
    width: 100%;
    height: 32px;
    padding: 0 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    cursor: text;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.el-input-like.is-focus {
    border-color: #409eff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.el-input-like.is-disabled,
.el-input-like.is-disabled .el-input-like__inner {
    background: #f5f7fa;
    border-color: #e4e7ed;
    cursor: not-allowed;
}

.el-input-like__inner {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
}

.inline-icon {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-left: 6px;
}
.el-icon {
    display: block; /* 避免 inline svg 导致父元素高度坍塌 */
    font-size: 12px;
}
</style>
