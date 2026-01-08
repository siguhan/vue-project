// global.d.ts 或 window.d.ts
export {} // 确保文件是模块

declare global {
    interface Window {
        __chart__: any // 或更具体的类型
    }
}
