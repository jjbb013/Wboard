const mysql = require('mysql2/promise');
const config = require('./config');

let pool;

async function connectToDatabase() {
    try {
        // Northflank MySQL 连接字符串通常是这样的：
        // mysql://user:password@host:port/database?sslmode=REQUIRED
        const dbUrl = new URL(config.DATABASE_URL);

        const connectionConfig = {
            host: dbUrl.hostname,
            user: dbUrl.username,
            password: dbUrl.password,
            database: dbUrl.pathname.substring(1), // 移除开头的 '/'
            port: dbUrl.port ? parseInt(dbUrl.port) : 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            ssl: {
                rejectUnauthorized: false // Northflank 通常使用自签名证书，或者需要特定的CA证书。这里设置为false以简化，生产环境应更严格。
            }
        };

        // 检查是否显式设置了 sslmode=REQUIRED 或 ssl=true
        if (dbUrl.searchParams.get('sslmode') === 'REQUIRED' || dbUrl.searchParams.get('ssl') === 'true') {
            connectionConfig.ssl = {
                rejectUnauthorized: false // 生产环境请根据实际情况配置CA证书
            };
        } else {
            // 如果没有明确要求 SSL，则不设置 SSL 选项，让驱动自动协商
            delete connectionConfig.ssl;
        }

        pool = mysql.createPool(connectionConfig);
        console.log('成功连接到 MySQL 数据库！');
    } catch (error) {
        console.error('数据库连接失败:', error);
        process.exit(1); // 连接失败则退出应用
    }
}

function getPool() {
    if (!pool) {
        throw new Error('数据库连接池未初始化。请先调用 connectToDatabase()。');
    }
    return pool;
}

module.exports = {
    connectToDatabase,
    getPool
};
