const axios = require('axios');
const config = require('./config');

/**
 * 生成订阅链接内容 (Clash/V2RayN 格式)
 * 这是一个简化示例，实际需要根据 Xray 节点配置生成
 * @param {Array<object>} nodes - 节点列表
 * @param {object} user - 用户信息
 * @returns {string} 订阅链接内容
 */
function generateSubscriptionContent(nodes, user) {
    // 这是一个非常简化的示例，实际需要根据不同的协议和客户端生成复杂的配置
    // 例如，Clash 需要 YAML 格式，V2RayN 需要 base64 编码的 JSON 数组
    // 这里仅返回一个占位符，实际开发中需要根据具体需求实现
    let content = `# Wboard 订阅链接\n\n`;
    content += `用户: ${user.username}\n`;
    content += `已用流量: ${(user.traffic_used / (1024 * 1024 * 1024)).toFixed(2)} GB\n`;
    content += `总流量: ${(user.traffic_limit / (1024 * 1024 * 1024)).toFixed(2)} GB\n`;
    content += `到期时间: ${user.due_date ? new Date(user.due_date).toLocaleString() : '无限制'}\n\n`;

    if (nodes && nodes.length > 0) {
        content += `可用节点:\n`;
        nodes.forEach(node => {
            content += `- ${node.name} (${node.protocol_type}://${node.address}:${node.port})\n`;
            // 实际这里需要根据 node.config_details 生成客户端可用的配置字符串
        });
    } else {
        content += `暂无可用节点。\n`;
    }

    return content;
}

/**
 * 从 Xray API 获取用户流量统计
 * @returns {Promise<object>} 包含用户流量数据的对象
 */
async function getXrayTrafficStats() {
    try {
        const headers = {};
        if (config.XRAY_API_KEY) {
            headers['X-API-Key'] = config.XRAY_API_KEY; // 假设 Xray API 使用 X-API-Key 认证
        }
        const response = await axios.post(config.XRAY_API_URL, {
            // Xray API 请求体示例，根据实际 Xray 配置调整
            // 假设 Xray API 提供了获取所有用户流量的接口
            command: 'stats',
            tag: 'user>>>', // 假设用户标签以 'user>>>' 开头
            field: 'traffic',
            reset: false
        }, { headers });
        // 实际需要解析 Xray API 返回的数据结构
        console.log('Xray API 响应:', response.data);
        return response.data;
    } catch (error) {
        console.error('获取 Xray 流量统计失败:', error.message);
        // 根据错误类型决定是否抛出，或者返回空对象
        return {};
    }
}

/**
 * 调用 Xray API 添加用户
 * @param {string} uuid - 用户 UUID
 * @param {string} email - 用户邮箱 (Xray 通常用 email 作为用户标识)
 * @returns {Promise<boolean>} 是否成功
 */
async function addXrayUser(uuid, email) {
    try {
        const headers = {};
        if (config.XRAY_API_KEY) {
            headers['X-API-Key'] = config.XRAY_API_KEY;
        }
        // 这是一个示例，实际需要根据 Xray 的 Protobuf API 结构来构建请求
        // 通常需要使用 gRPC 客户端来与 Xray API 交互，axios 无法直接调用 gRPC
        // 如果 Xray 提供了 HTTP JSON API，则可以使用 axios
        console.warn('警告: addXrayUser 功能需要与 Xray 的 gRPC API 交互，axios 无法直接实现。');
        console.warn('请考虑使用专门的 gRPC 客户端库 (如 @grpc/grpc-js) 来实现此功能。');
        console.warn(`尝试添加 Xray 用户: UUID=${uuid}, Email=${email}`);

        // 假设 Xray 有一个 HTTP API 来添加用户 (这通常不是 Xray 的默认行为)
        // const response = await axios.post(`${config.XRAY_API_URL}/add_user`, {
        //     uuid: uuid,
        //     email: email,
        //     protocol: 'vless' // 示例
        // }, { headers });
        // return response.status === 200;
        return true; // 暂时返回 true，等待 gRPC 实现
    } catch (error) {
        console.error('添加 Xray 用户失败:', error.message);
        return false;
    }
}

/**
 * 调用 Xray API 删除用户
 * @param {string} email - 用户邮箱 (Xray 通常用 email 作为用户标识)
 * @returns {Promise<boolean>} 是否成功
 */
async function removeXrayUser(email) {
    try {
        const headers = {};
        if (config.XRAY_API_KEY) {
            headers['X-API-Key'] = config.XRAY_API_KEY;
        }
        console.warn('警告: removeXrayUser 功能需要与 Xray 的 gRPC API 交互，axios 无法直接实现。');
        console.warn('请考虑使用专门的 gRPC 客户端库 (如 @grpc/grpc-js) 来实现此功能。');
        console.warn(`尝试删除 Xray 用户: Email=${email}`);
        // const response = await axios.post(`${config.XRAY_API_URL}/remove_user`, {
        //     email: email
        // }, { headers });
        // return response.status === 200;
        return true; // 暂时返回 true，等待 gRPC 实现
    } catch (error) {
        console.error('删除 Xray 用户失败:', error.message);
        return false;
    }
}


module.exports = {
    generateSubscriptionContent,
    getXrayTrafficStats,
    addXrayUser,
    removeXrayUser
};
