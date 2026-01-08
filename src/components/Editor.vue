<template>
    <div ref="editorRef" class="editor-container"></div>
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'

const props = defineProps<{
    modelValue: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', val: string): void
}>()

const editorRef = ref<HTMLDivElement>()
let editor: monaco.editor.IStandaloneCodeEditor

const DEFAULT_COMMENT = '// The chart instance name is chart\n'

const editorCode = computed(() => {
    return props.modelValue
        ? `${DEFAULT_COMMENT}${props.modelValue}`
        : DEFAULT_COMMENT
})

function stripDefaultComment(code: string) {
    if (code.startsWith(DEFAULT_COMMENT)) {
        return code.slice(DEFAULT_COMMENT.length)
    }
    return code
}

onMounted(() => {
    editor = monaco.editor.create(editorRef.value!, {
        value: editorCode.value,
        language: 'javascript',
        theme: 'vs',
        automaticLayout: true,
        minimap: { enabled: false },
    })

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        const rawCode = editor.getValue()
        const pureCode = stripDefaultComment(rawCode)
        console.log('pureCode', pureCode)

        emit('update:modelValue', pureCode)
    })

    editor.onKeyDown(e => {
        if ((e.ctrlKey || e.metaKey) && e.keyCode === monaco.KeyCode.KeyS) {
            e.preventDefault()
        }
    })
})

onBeforeUnmount(() => {
    editor?.dispose()
})

defineExpose({
    enterDragging() {
        editor?.updateOptions({
            scrollbar: {
                vertical: 'hidden',
                horizontal: 'hidden',
            },
        })
    },
    leaveDragging() {
        editor?.updateOptions({
            scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
            },
        })
        editor?.layout()
    },
})
</script>

<style scoped>
.editor-container {
    width: 100%;
    height: 100%;
}
</style>
