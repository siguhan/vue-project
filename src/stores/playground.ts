import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlaygroundStore = defineStore('playground', () => {
    const currentCode = ref('')

    return {
        currentCode,
    }
})
