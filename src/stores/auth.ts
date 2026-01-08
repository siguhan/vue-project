import { instance } from '@/axios'
import { Role } from '@/shared/roles'
import type { AuthInfo } from '@/types/auth'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const authInfo = reactive<AuthInfo>({
        role: Role.NON,
        permissions: [],
    })

    const initAuthInfo = async () => {
        const currentToken = localStorage.getItem('token')
        const res: any = await instance.get('/auth', {
            headers: { satoken: currentToken },
        })
        authInfo.role = res.role
        authInfo.permissions = res.permissions
    }

    return {
        authInfo,
        initAuthInfo,
    }
})
