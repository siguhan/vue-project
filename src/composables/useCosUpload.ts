import { instance } from '@/axios'
import { getCosConfig } from '@/config/cos'
import COS from 'cos-js-sdk-v5'

export const useCosUpload = () => {
    const initCos = async () => {
        let credentials: any = null
        try {
            // 获取临时凭证
            try {
                credentials = await instance.get('/cos/sts')
            } catch (err) {
                throw new Error(
                    `获取临时凭证失败: ${
                        err instanceof Error ? err.message : '未知错误'
                    }`
                )
            }

            // 创建COS实例
            const cosInstance = new COS({
                getAuthorization: function (_options, callback) {
                    callback({
                        TmpSecretId: credentials.tmpSecretId,
                        TmpSecretKey: credentials.tmpSecretKey,
                        SecurityToken: credentials.sessionToken,
                        StartTime: Math.round(Date.now() / 1000), // 当前时间戳（秒）
                        ExpiredTime: credentials.expiredTime, // 过期时间戳（秒）
                    })
                },
            })

            return cosInstance
        } catch (error) {
            throw new Error(
                `初始化COS失败: ${
                    error instanceof Error ? error.message : '未知错误'
                }`
            )
        }
    }

    /**
     * 生成唯一的文件key
     */
    const generateFileKey = () => {
        return `echarts/${Date.now()}_${Math.random()
            .toString(36)
            .slice(2, 6)}.png`
    }

    const uploadPreview = async (blob: Blob) => {
        const cos = await initCos()

        // 生成文件key
        const fileKey = generateFileKey()

        // 获取COS配置
        const config = getCosConfig()
        const bucketName = config.bucket
        const region = config.region

        return new Promise((resolve, reject) => {
            cos.putObject(
                {
                    Bucket: bucketName,
                    Region: region,
                    Key: fileKey,
                    Body: blob,
                },
                function (err, data) {
                    if (err) {
                        reject(new Error(err.message || '上传失败'))
                        return
                    } else {
                        const result = {
                            url: `https://${data.Location}`,
                            key: fileKey,
                            location: data.Location,
                        }

                        console.log('上传成功:', result)
                        resolve(result)
                    }
                }
            )
        })
    }

    return {
        uploadPreview,
    }
}
