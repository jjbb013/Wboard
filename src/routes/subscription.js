const express = require('express');
const router = express.Router();
const { getUserByUuid, getAllNodes } = require('../crud');
const { generateSubscriptionContent } = require('../utils');

/**
 * @route GET /sub/:user_uuid
 * @desc 获取用户订阅链接内容
 * @access Public
 */
router.get('/:user_uuid', async (req, res) => {
    try {
        const userUuid = req.params.user_uuid;
        const user = await getUserByUuid(userUuid);

        if (!user || !user.is_active || (user.due_date && new Date(user.due_date) < new Date()) || user.traffic_used >= user.traffic_limit) {
            return res.status(404).send('订阅无效或已过期/超量。');
        }

        const nodes = await getAllNodes();
        const subscriptionContent = generateSubscriptionContent(nodes, user);

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.send(subscriptionContent);

    } catch (error) {
        console.error('生成订阅链接失败:', error);
        res.status(500).send('服务器内部错误。');
    }
});

module.exports = router;
