const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../security');
const {
    createUser,
    getAllUsers,
    getUserByUuid,
    updateUser,
    deleteUser,
    resetUserTraffic,
    getUserByUsername
} = require('../crud');
const { UserCreateSchema, UserUpdateSchema } = require('../schemas');
const { validate } = require('../middlewares/validation');
const { addXrayUser, removeXrayUser } = require('../utils'); // 假设这些函数存在

// 所有用户路由都需要认证
router.use(authenticateToken);

/**
 * @route POST /api/users
 * @desc 创建新用户
 * @access Private (Admin)
 */
router.post('/', validate(UserCreateSchema), async (req, res) => {
    try {
        const newUser = await createUser(req.body);
        // 尝试同步到 Xray
        // 注意：Xray 通常使用 email 作为用户标识，这里我们用 username 替代
        await addXrayUser(newUser.uuid, newUser.username);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('创建用户失败:', error);
        if (error.code === 'ER_DUP_ENTRY') { // MySQL duplicate entry error code
            return res.status(409).json({ detail: '用户名或 UUID 已存在' });
        }
        res.status(500).json({ detail: '服务器内部错误' });
    }
});

/**
 * @route GET /api/users
 * @desc 获取所有用户
 * @access Private (Admin)
 */
router.get('/', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('获取用户列表失败:', error);
        res.status(500).json({ detail: '服务器内部错误' });
    }
});

/**
 * @route GET /api/users/:id
 * @desc 根据 ID 获取用户
 * @access Private (Admin)
 */
router.get('/:id', async (req, res) => {
    try {
        const user = await getUserByUuid(req.params.id); // 假设这里是 UUID
        if (!user) {
            return res.status(404).json({ detail: '用户未找到' });
        }
        res.json(user);
    } catch (error) {
        console.error('获取用户失败:', error);
        res.status(500).json({ detail: '服务器内部错误' });
    }
});

/**
 * @route PUT /api/users/:id
 * @desc 更新用户
 * @access Private (Admin)
 */
router.put('/:id', validate(UserUpdateSchema), async (req, res) => {
    try {
        const updatedUser = await updateUser(req.params.id, req.body); // 假设这里是 ID
        if (!updatedUser) {
            return res.status(404).json({ detail: '用户未找到' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('更新用户失败:', error);
        res.status(500).json({ detail: '服务器内部错误' });
    }
});

/**
 * @route DELETE /api/users/:id
 * @desc 删除用户
 * @access Private (Admin)
 */
router.delete('/:id', async (req, res) => {
    try {
        const userToDelete = await getUserByUuid(req.params.id); // 假设这里是 UUID
        if (!userToDelete) {
            return res.status(404).json({ detail: '用户未找到' });
        }
        const success = await deleteUser(userToDelete.id);
        if (success) {
            // 尝试从 Xray 删除用户
            await removeXrayUser(userToDelete.username);
            res.status(204).send(); // No Content
        } else {
            res.status(500).json({ detail: '删除用户失败' });
        }
    } catch (error) {
        console.error('删除用户失败:', error);
        res.status(500).json({ detail: '服务器内部错误' });
    }
});

/**
 * @route POST /api/users/:id/reset-traffic
 * @desc 重置用户流量
 * @access Private (Admin)
 */
router.post('/:id/reset-traffic', async (req, res) => {
    try {
        const user = await getUserByUuid(req.params.id); // 假设这里是 UUID
        if (!user) {
            return res.status(404).json({ detail: '用户未找到' });
        }
        const updatedUser = await resetUserTraffic(user.id);
        res.json(updatedUser);
    } catch (error) {
        console.error('重置用户流量失败:', error);
        res.status(500).json({ detail: '服务器内部错误' });
    }
});

module.exports = router;
