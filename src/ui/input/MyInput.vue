<template>
    <div
        ref="wrapper"
        class="input-box"
        :class="{ isfocus: isfocus, disabled: isDisabled }"
        @click="onFocus"
        @mousedown="onMouseDown"
    >
        <input
            ref="inputRef"
            type="text"
            :value="props.modulValue"
            @input="$emit('update:modulValue', inputRef.value)"
            @blur="onBlur"
            :disabled="isDisabled"
        />
        <span v-if="props.clearable" class="clear-icon" @click="clearValue">
            <i class="el-icon" style="font-size: 12px">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                    <path
                        fill="currentColor"
                        d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
                    ></path>
                </svg>
            </i>
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps({
    modulValue: String,
    disabled: Boolean,
    clearable: Boolean,
})

const emit = defineEmits(['update:modulValue'])

const wrapper = ref()
const inputRef = ref()

const isDisabled = computed(() => !!props.disabled)

const flag = ref(false)
const isfocus = ref(false)

const onMouseDown = (e: any) => {
    if (e.target !== inputRef.value) flag.value = true
}

const onFocus = (e: any) => {
    // e.target → 事件最初触发的元素（即你点击的那个元素，span）
    // e.currentTarget → 当前正在处理事件的元素（即绑定回调的元素，div）
    flag.value = false
    if (document.activeElement !== inputRef.value) {
        inputRef.value.focus()
    }
    if (!isfocus.value) isfocus.value = true
}

const onBlur = (e: any) => {
    if (!flag.value) {
        isfocus.value = false
    }
}

const clearValue = () => {
    emit('update:modulValue', '')
}
</script>

<style scoped>
.input-box {
    display: flex;
    align-items: center;
    width: 250px;
    height: 32px;
    padding: 0 10px;
    color: #333;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    cursor: text;
    transition: border-color 0.2s, box-shadow 0.2s;
}

input {
    flex: auto;
    font-size: 14px;
    color: #333;
    border: none;
    outline: none;
}

/* 聚焦效果 */
.input-box.isfocus {
    border-color: #ff0000;
    box-shadow: 0 0 0 2px rgba(255, 8, 8, 0.2);
}

.input-box.disabled,
.input-box.disabled input {
    background-color: #f5f7fa;
    cursor: not-allowed;
    color: #c0c4cc;
}

.clear-icon {
    display: flex;
    align-items: center;
    cursor: pointer;
}
</style>
