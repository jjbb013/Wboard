const { getPool } = require('./database');
const { hashPassword } = require('./security');
const { v4: uuidv4 } = require('uuid');

// 用户相关操作

/**
 * 根据用户名获取用户
 * @param {string} username
 * @returns {Promise<object|null>} 用户对象或 null
 */
async function getUserByUsername(username) {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0] || null;
}

/**
 * 根据 UUID 获取用户
 * @param {string} user_uuid
 * @returns {Promise<object|null>} 用户对象或 null
 */
async function getUserByUuid(user_uuid) {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM users WHERE uuid = ?', [user_uuid]);
    return rows[0] || null;
}

/**
 * 创建新用户
 * @param {object} userData - 用户数据 (username, password, traffic_limit_gb, due_date)
 * @returns {Promise<object>} 创建后的用户对象
 */
async function createUser(userData) {
    const pool = getPool();
    const hashedPassword = await hashPassword(userData.password);
    const userUuid = uuidv4();
    const trafficLimitBytes = userData.traffic_limit_gb * 1024 * 1024 * 1024; // GB 转换为字节

    const [result] = await pool.execute(
        'INSERT INTO users (username, password_hash, uuid, traffic_limit, due_date) VALUES (?, ?, ?, ?, ?)',
        [userData.username, hashedPassword, userUuid, trafficLimitBytes, userData.due_date]
    );

    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
    return rows[0];
}

/**
 * 获取所有用户
 * @returns {Promise<Array<object>>} 用户列表
 */
async function getAllUsers() {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM users');
    return rows;
}

/**
 * 更新用户
 * @param {number} userId - 用户 ID
 * @param {object} updateData - 更新数据
 * @returns {Promise<object|null>} 更新后的用户对象或 null
 */
async function updateUser(userId, updateData) {
    const pool = getPool();
    const fields = [];
    const values = [];

    if (updateData.username !== undefined) {
        fields.push('username = ?');
        values.push(updateData.username);
    }
    if (updateData.traffic_limit_gb !== undefined) {
        fields.push('traffic_limit = ?');
        values.push(updateData.traffic_limit_gb * 1024 * 1024 * 1024);
    }
    if (updateData.due_date !== undefined) {
        fields.push('due_date = ?');
        values.push(updateData.due_date);
    }
    if (updateData.is_active !== undefined) {
        fields.push('is_active = ?');
        values.push(updateData.is_active);
    }
    if (updateData.traffic_used !== undefined) {
        fields.push('traffic_used = ?');
        values.push(updateData.traffic_used);
    }

    if (fields.length === 0) {
        return null; // 没有可更新的字段
    }

    values.push(userId);
    await pool.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);

    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
    return rows[0] || null;
}

/**
 * 删除用户
 * @param {number} userId - 用户 ID
 * @returns {Promise<boolean>} 是否成功删除
 */
async function deleteUser(userId) {
    const pool = getPool();
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
    return result.affectedRows > 0;
}

/**
 * 重置用户流量
 * @param {number} userId - 用户 ID
 * @returns {Promise<object|null>} 更新后的用户对象或 null
 */
async function resetUserTraffic(userId) {
    const pool = getPool();
    await pool.execute('UPDATE users SET traffic_used = 0 WHERE id = ?', [userId]);
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
    return rows[0] || null;
}

// 节点相关操作

/**
 * 创建新节点
 * @param {object} nodeData - 节点数据
 * @returns {Promise<object>} 创建后的节点对象
 */
async function createNode(nodeData) {
    const pool = getPool();
    const [result] = await pool.execute(
        'INSERT INTO nodes (name, address, port, protocol_type, config_details) VALUES (?, ?, ?, ?, ?)',
        [nodeData.name, nodeData.address, nodeData.port, nodeData.protocol_type, JSON.stringify(nodeData.config_details)]
    );
    const [rows] = await pool.execute('SELECT * FROM nodes WHERE id = ?', [result.insertId]);
    return rows[0];
}

/**
 * 获取所有节点
 * @returns {Promise<Array<object>>} 节点列表
 */
async function getAllNodes() {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM nodes');
    return rows;
}

/**
 * 更新节点
 * @param {number} nodeId - 节点 ID
 * @param {object} updateData - 更新数据
 * @returns {Promise<object|null>} 更新后的节点对象或 null
 */
async function updateNode(nodeId, updateData) {
    const pool = getPool();
    const fields = [];
    const values = [];

    if (updateData.name !== undefined) {
        fields.push('name = ?');
        values.push(updateData.name);
    }
    if (updateData.address !== undefined) {
        fields.push('address = ?');
        values.push(updateData.address);
    }
    if (updateData.port !== undefined) {
        fields.push('port = ?');
        values.push(updateData.port);
    }
    if (updateData.protocol_type !== undefined) {
        fields.push('protocol_type = ?');
        values.push(updateData.protocol_type);
    }
    if (updateData.config_details !== undefined) {
        fields.push('config_details = ?');
        values.push(JSON.stringify(updateData.config_details));
    }
    if (updateData.is_active !== undefined) {
        fields.push('is_active = ?');
        values.push(updateData.is_active);
    }

    if (fields.length === 0) {
        return null;
    }

    values.push(nodeId);
    await pool.execute(`UPDATE nodes SET ${fields.join(', ')} WHERE id = ?`, values);

    const [rows] = await pool.execute('SELECT * FROM nodes WHERE id = ?', [nodeId]);
    return rows[0] || null;
}

/**
 * 删除节点
 * @param {number} nodeId - 节点 ID
 * @returns {Promise<boolean>} 是否成功删除
 */
async function deleteNode(nodeId) {
    const pool = getPool();
    const [result] = await pool.execute('DELETE FROM nodes WHERE id = ?', [nodeId]);
    return result.affectedRows > 0;
}

module.exports = {
    getUserByUsername,
    getUserByUuid,
    createUser,
    getAllUsers,
    updateUser,
    deleteUser,
    resetUserTraffic,
    createNode,
    getAllNodes,
    updateNode,
    deleteNode
};
