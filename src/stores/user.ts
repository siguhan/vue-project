import { instance } from '@/axios'
import type { UserInfo } from '@/types/user'
import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
    const isUserInfoReady = ref(false)

    const token = ref(localStorage.getItem('token') || '')

    const userInfo = reactive<UserInfo>({
        id: '',
        isLogin: false,
        username: '',
        email: '',
    })

    const setToken = (newToken: string) => {
        token.value = newToken
        localStorage.setItem('token', newToken)
    }

    const setUserInfo = (info: UserInfo) => {
        userInfo.id = info.id
        userInfo.isLogin = info.isLogin
        userInfo.username = info.username
        userInfo.email = info.email
    }

    const initUserInfo = async () => {
        try {
            const currentToken = localStorage.getItem('token')
            if (!currentToken) return
            const res: any = await instance.get('/user/info', {
                headers: { satoken: currentToken },
            })
            setUserInfo(res)
        } catch (err: any) {
        } finally {
            isUserInfoReady.value = true
        }
    }

    const logout = async () => {
        try {
            const currentToken = localStorage.getItem('token')
            userInfo.id = ''
            userInfo.isLogin = false
            userInfo.username = ''
            userInfo.email = ''
            token.value = ''
            localStorage.removeItem('token')
            await instance.post('/logout', null, {
                headers: { satoken: currentToken },
            })

            ElMessage.success('Logout successful')

            router.replace('/')
        } catch {
            router.replace('/')
        }
    }

    return {
        isUserInfoReady,
        userInfo,
        token,
        setToken,
        setUserInfo,
        initUserInfo,
        logout,
    }
})
