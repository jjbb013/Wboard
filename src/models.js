const { getPool } = require('./database');

async function initializeDatabase() {
    const pool = getPool();
    try {
        // 用户表
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                uuid VARCHAR(36) NOT NULL UNIQUE,
                traffic_limit BIGINT NOT NULL, -- 流量限制，单位字节
                traffic_used BIGINT DEFAULT 0, -- 已用流量，单位字节
                due_date DATETIME, -- 到期时间
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);

        // 节点表
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS nodes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                address VARCHAR(255) NOT NULL,
                port INT NOT NULL,
                protocol_type VARCHAR(50) NOT NULL, -- 例如 VLESS, VMess
                config_details JSON, -- 存储节点配置的 JSON 字符串
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);

        console.log('数据库表结构检查/创建完成。');
    } catch (error) {
        console.error('初始化数据库失败:', error);
        process.exit(1);
    }
}

module.exports = {
    initializeDatabase
};
