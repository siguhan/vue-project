// COS配置
export const cosConfig = {
  // 您需要根据实际配置替换这些值
  bucket: 'lzy1115-1379546303', // 替换为您的实际bucket名称，例如：'my-app-1234567890'
  region: 'ap-guangzhou', // 替换为您的实际region，例如：'ap-beijing'
} as const;

// 获取配置的辅助函数
export const getCosConfig = () => {
  // 这里可以添加环境变量的逻辑
  // 例如从 import.meta.env 中读取配置
  return cosConfig;
};
