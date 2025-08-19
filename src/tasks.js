const cron = require('node-cron');
const { getXrayTrafficStats } = require('./utils');
const { getAllUsers, updateUser, resetUserTraffic } = require('./crud');

/**
 * 定时任务：从 Xray 获取流量统计并更新数据库
 */
async function updateTrafficStats() {
    console.log('开始更新流量统计...');
    try {
        const xrayStats = await getXrayTrafficStats();
        // 假设 xrayStats 结构为 { 'user>>>uuid1': { uplink: 100, downlink: 200 }, ... }
        // 实际需要根据 Xray API 返回的真实数据结构进行解析

        const users = await getAllUsers();
        for (const user of users) {
            // 假设 Xray 的用户标识与我们数据库中的 username 对应
            const userXrayTag = user.username; // 或者 user.uuid，取决于 Xray 配置
            const trafficData = xrayStats[userXrayTag]; // 假设直接通过 tag 获取

            if (trafficData && (trafficData.uplink || trafficData.downlink)) {
                const totalTraffic = (trafficData.uplink || 0) + (trafficData.downlink || 0);
                const newUsedTraffic = user.traffic_used + totalTraffic;

                await updateUser(user.id, { traffic_used: newUsedTraffic });
                console.log(`用户 ${user.username} 流量更新: ${newUsedTraffic} 字节`);
            }
        }
        console.log('流量统计更新完成。');
    } catch (error) {
        console.error('更新流量统计失败:', error);
    }
}

/**
 * 定时任务：每月1号重置所有用户流量
 */
async function monthlyTrafficReset() {
    console.log('开始每月流量重置...');
    try {
        const users = await getAllUsers();
        for (const user of users) {
            await resetUserTraffic(user.id);
            console.log(`用户 ${user.username} 流量已重置。`);
        }
        console.log('每月流量重置完成。');
    } catch (error) {
        console.error('每月流量重置失败:', error);
    }
}

/**
 * 定时任务：检查用户到期和流量超限
 */
async function checkUserStatus() {
    console.log('开始检查用户状态...');
    try {
        const users = await getAllUsers();
        for (const user of users) {
            let shouldDeactivate = false;
            let reason = [];

            // 检查到期时间
            if (user.due_date && new Date(user.due_date) < new Date()) {
                shouldDeactivate = true;
                reason.push('已到期');
            }

            // 检查流量是否超限
            if (user.traffic_limit > 0 && user.traffic_used >= user.traffic_limit) {
                shouldDeactivate = true;
                reason.push('流量超限');
            }

            if (shouldDeactivate && user.is_active) {
                await updateUser(user.id, { is_active: false });
                console.log(`用户 ${user.username} 已被禁用，原因: ${reason.join(', ')}`);
                // TODO: 调用 Xray API 禁用用户
            } else if (!shouldDeactivate && !user.is_active) {
                // 如果用户之前被禁用，但现在条件满足，可以考虑重新激活
                // 这取决于业务逻辑，这里暂时不自动激活
                // await updateUser(user.id, { is_active: true });
                // console.log(`用户 ${user.username} 已被重新激活。`);
            }
        }
        console.log('用户状态检查完成。');
    } catch (error) {
        console.error('检查用户状态失败:', error);
    }
}

/**
 * 启动所有定时任务
 */
function startScheduledTasks() {
    // 每 5 分钟更新一次流量统计
    cron.schedule('*/5 * * * *', updateTrafficStats);
    console.log('已安排每 5 分钟更新流量统计任务。');

    // 每月 1 号 0 点 0 分重置流量
    cron.schedule('0 0 1 * *', monthlyTrafficReset);
    console.log('已安排每月 1 号重置流量任务。');

    // 每小时检查一次用户状态
    cron.schedule('0 * * * *', checkUserStatus);
    console.log('已安排每小时检查用户状态任务。');
}

module.exports = {
    startScheduledTasks,
    updateTrafficStats, // 导出以便手动触发或测试
    monthlyTrafficReset,
    checkUserStatus
};
