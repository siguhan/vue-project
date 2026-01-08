<template>
    <div class="view" ref="viewRef" :class="{ viewDragger: isDragging }">
        <div class="editor" :style="{ width: editorWidth + '%' }">
            <Editor ref="editorCompRef" v-model="code" />
            <div class="dragger" @mousedown="startDrag"></div>
        </div>
        <div
            class="right"
            ref="chartRef"
            :style="{ width: 100 - editorWidth + '%' }"
        >
            <div class="chart">
                <iframe
                    ref="iframeRef"
                    :style="{
                        width: `${realWidth}%`,
                        height: `${realHeight}%`,
                        border: 'none',
                    }"
                ></iframe>
            </div>

            <div
                :class="{ hideOption: !isShowSetWh }"
                ref="operationRef"
                class="operation"
            >
                <el-form inline class="setwh-form" :model="setWhForm">
                    <el-form-item
                        class="setwh-item"
                        :label="isCompact ? 'w' : 'width'"
                    >
                        <div class="item-inline">
                            <el-input
                                class="setwh"
                                v-model="setWhForm.chartWidth"
                                @blur="handSetWidth"
                            ></el-input>
                            <span style="margin-left: 1px">%</span>
                        </div>
                    </el-form-item>
                    <el-form-item
                        class="setwh-item"
                        :label="isCompact ? 'h' : 'height'"
                    >
                        <div class="item-inline">
                            <el-input
                                class="setwh"
                                v-model="setWhForm.chartHeight"
                                @blur="handSetHeight"
                            ></el-input>
                            <span style="margin-left: 1px">%</span>
                        </div>
                    </el-form-item>
                </el-form>

                <el-button
                    type="danger"
                    plain
                    style="width: 100px"
                    @click="handSave"
                >
                    save
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch, watchEffect } from 'vue'
import Editor from '@/components/Editor.vue'
import html from './iframe/111.html?raw'
import { instance } from '@/axios'
import { ElMessage } from 'element-plus'
import { useCosUpload } from '@/composables/useCosUpload'
import { usePlaygroundStore } from '@/stores/playground'
const playgroundStore = usePlaygroundStore()

const setWhForm = reactive({
    chartWidth: '',
    chartHeight: '',
})

const realWidth = ref('100')
const realHeight = ref('100')

const handSetWidth = () => {
    if (!setWhForm.chartWidth) return
    realWidth.value = setWhForm.chartWidth
}

const handSetHeight = () => {
    if (!setWhForm.chartHeight) return
    realHeight.value = setWhForm.chartHeight
}

const code = ref(playgroundStore.currentCode)
playgroundStore.currentCode = ''

const iframeRef = ref<HTMLIFrameElement>()

const isShowSetWh = ref(false)
let isSave = false
const { uploadPreview } = useCosUpload()
const handMessage = async (e: MessageEvent) => {
    const { action, args, message, cmd_id } = e.data

    if (action === 'cmd_ok' && cmd_id === 1) {
        isShowSetWh.value = args.isShowSetWh
        isSave = args.isSave
    }

    if (action === 'cmd_ok' && cmd_id === 2) {
        try {
            const res: any = await uploadPreview(args.blob)

            const currentToken = localStorage.getItem('token')
            await instance.post(
                '/save-chart',
                {
                    code: code.value,
                    url: res.url,
                },
                {
                    headers: { satoken: currentToken },
                }
            )

            ElMessage.success('保存成功')
        } catch (e: any) {
            ElMessage.error(e || '保存失败')
        }
    }

    if (action === 'cmd_error') {
        isShowSetWh.value = false
        ElMessage.error(message)
    }

    if (action === 'console') {
        const { level, args } = e.data as { level: keyof Console; args: any[] }

        // 使用类型安全的调用
        ;(console[level] as (...args: any[]) => void)(...(args || []))
    }
}
onMounted(() => {
    const iframe = iframeRef.value!
    iframe.srcdoc = html
    iframe.onload = () => {
        iframeRef.value?.contentWindow?.postMessage(
            {
                action: 'eval',
                cmd_id: 1,
                args: {
                    script: code.value,
                },
            },
            '*'
        )
    }

    window.addEventListener('message', handMessage)
})

const operationRef = ref<HTMLElement | null>(null)
const isCompact = ref(false)

let observer: ResizeObserver | null = null

onMounted(() => {
    if (!operationRef.value) return

    observer = new ResizeObserver(entries => {
        const width = entries[0]!.contentRect.width
        isCompact.value = width < 340
    })

    observer.observe(operationRef.value)
})

onUnmounted(() => {
    window.removeEventListener('message', handMessage)
    observer?.disconnect()
})

watch(code, val => {
    console.log('watch', val)
    iframeRef.value?.contentWindow?.postMessage(
        {
            action: 'eval',
            cmd_id: 1,
            args: {
                script: val,
            },
        },
        '*'
    )
})

const handSave = async () => {
    if (!isSave) {
        ElMessage.warning('请编辑有效echarts组件')
        return
    }
    try {
        iframeRef.value?.contentWindow?.postMessage(
            {
                action: 'snapshot',
                cmd_id: 2,
            },
            '*'
        )
    } finally {
        isSave = false
    }
}

// ------------------ 拖拽逻辑 ------------------
const editorCompRef = ref<{
    enterDragging: () => void
    leaveDragging: () => void
}>()

const viewRef = ref<HTMLDivElement>()
const chartRef = ref<HTMLDivElement>()

const editorWidth = ref(50) // 初始宽度百分比

let isDragging = ref(false)
let startX = 0
let startWidth = 0

const startDrag = (e: MouseEvent) => {
    editorCompRef.value?.enterDragging()
    chartRef.value!.style.pointerEvents = 'none'
    isDragging.value = true
    startX = e.clientX
    startWidth = editorWidth.value
    document.body.style.userSelect = 'none' // 防止拖动时选中文本
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
    e.preventDefault() // 防止选中文本
}

const onDrag = (e: MouseEvent) => {
    if (!isDragging) return
    const delta = e.clientX - startX
    const containerWidth = viewRef.value!.offsetWidth
    let newWidth =
        (((startWidth * containerWidth) / 100 + delta) / containerWidth) * 100
    if (newWidth < 30) newWidth = 30
    if (newWidth > 70) newWidth = 70
    editorWidth.value = newWidth
}

const stopDrag = () => {
    isDragging.value = false
    editorCompRef.value?.leaveDragging()
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
    chartRef.value!.style.pointerEvents = 'auto'
}
</script>

<style scoped>
.view {
    width: 100%;
    height: 100vh;
    display: flex;
    padding: 10px;
}

.viewDragger {
    cursor: ew-resize;
}

.editor {
    border-right: 1px solid #ccc;
    display: flex;
    position: relative;
}

.dragger {
    position: absolute;
    z-index: 3;
    top: 0;
    bottom: 0;
    right: -5px;
    width: 10px;
    cursor: ew-resize;
}

.right {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.chart {
    flex: 1;
}

.hideOption {
    visibility: hidden;
}
.operation {
    display: flex;
    justify-content: space-between;
    padding: 15px 20px;
    margin-bottom: 10px;
}

.setwh-form {
    display: flex;
    flex-wrap: nowrap;
    min-width: 0; /* 非常关键 */
}

.setwh-item {
    margin-bottom: 0;
    flex-shrink: 1;
    min-width: 0; /* 非常关键 */
}

.item-inline {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
}

.setwh {
    min-width: 50px;
    max-width: 100px;
    width: 100%;
}
</style>
