import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useViewportStore = defineStore('viewport', () => {
    const isMobile = ref(false)

    const checkScreen = () => {
        isMobile.value = window.innerWidth <= 560
    }

    const isCollapse = ref(false)
    const collapse = () => {
        isCollapse.value = !isCollapse.value
    }

    const isOpen = ref(false)
    const openSidebar = () => {
        isOpen.value = !isOpen.value
    }

    const handleToggleSidebar = () => {
        if (isMobile.value) {
            openSidebar()
        } else {
            collapse()
        }
    }

    return {
        isMobile,
        checkScreen,
        isCollapse,
        isOpen,
        handleToggleSidebar,
    }
})
