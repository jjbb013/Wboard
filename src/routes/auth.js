const express = require('express');
const router = express.Router();
const { getUserByUsername } = require('../crud');
const { verifyPassword, createAccessToken } = require('../security');
const { UserLoginSchema } = require('../schemas');
const { validate } = require('../middlewares/validation'); // 假设有验证中间件

/**
 * @route POST /api/token
 * @desc 用户登录并获取 JWT token
 * @access Public
 */
router.post('/token', validate(UserLoginSchema), async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(400).json({ detail: '用户名或密码不正确' });
        }

        const passwordMatch = await verifyPassword(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(400).json({ detail: '用户名或密码不正确' });
        }

        const accessToken = createAccessToken({ sub: user.username, id: user.id, uuid: user.uuid });
        res.json({ access_token: accessToken, token_type: 'bearer' });

    } catch (error) {
        console.error('登录失败:', error);
        res.status(500).json({ detail: '服务器内部错误' });
    }
});

module.exports = router;
