import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/layout/Layout.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import UserList from '@/modules/user/views/UserList.vue'
import { Role } from '@/shared/roles'
import Home from '@/views/Home.vue'
import TaskChart from '@/modules/task/views/TaskChart.vue'

const routes = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/admin',
        component: Layout,
        // redirect: '/admin/user',
        meta: { role: Role.ADMIN },
        // beforeEnter: async (to: any, from: any) => {
        //     const authStore = useAuthStore()
        //     if (authStore.authInfo.role === Role.NON) {
        //         try {
        //             await authStore.initAuthInfo()
        //         } catch {
        //             return '/'
        //         }
        //     }
        //     if (authStore.authInfo.role !== to.meta.role) {
        //         return '/'
        //     } else {
        //         return true
        //     }
        // },
        children: [
            {
                path: 'user',
                component: UserList,
            },
            {
                path: 'task',
                component: TaskChart,
            },
        ],
    },
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/register',
        component: Register,
    },
    {
        path: '/playground',
        component: () => import('@/views/Playground.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
