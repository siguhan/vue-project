import axios from 'axios'
import { ElMessage } from 'element-plus'

export const instance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000,
})

instance.interceptors.response.use(
    res => {
        if (res.data.code !== 10000) {
            return Promise.reject(res.data.message)
        }
        return res.data.data
    },
    err => {
        ElMessage.error(err)
        return Promise.reject()
    }
)
