require('dotenv').config();

const config = {
    PORT: process.env.PORT || 8000,
    DATABASE_URL: process.env.DATABASE_URL,
    SECRET_KEY: process.env.SECRET_KEY || 'your-super-secret-key', // 生产环境请务必修改
    ALGORITHM: 'HS256',
    ACCESS_TOKEN_EXPIRE_MINUTES: 30,
    XRAY_API_URL: process.env.XRAY_API_URL || 'http://localhost:8080/stats', // Xray API 地址
    XRAY_API_KEY: process.env.XRAY_API_KEY, // 如果 Xray API 需要认证
};

// 检查必要的环境变量
if (!config.DATABASE_URL) {
    console.warn('警告: 未设置 DATABASE_URL 环境变量。请在 .env 文件中配置。');
}
if (config.SECRET_KEY === 'your-super-secret-key') {
    console.warn('警告: SECRET_KEY 未修改，请在生产环境中使用更安全的密钥。');
}

module.exports = config;
