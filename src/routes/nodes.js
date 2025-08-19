const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../security');
const {
    createNode,
    getAllNodes,
    updateNode,
    deleteNode
} = require('../crud');
const { NodeCreateSchema, NodeUpdateSchema } = require('../schemas');
const { validate } = require('../middlewares/validation');

// 所有节点路由都需要认证
router.use(authenticateToken);

/**
 * @route POST /api/nodes
 * @desc 创建新节点
 * @access Private (Admin)
 */
router.post('/', validate(NodeCreateSchema), async (req, res) => {
    try {
        const newNode = await createNode(req.body);
        res.status(201).json(newNode);
    } catch (error) {
        console.error('创建节点失败:', error);
        res.status(500).json({ detail: '服务器内部错误' });
    }
});

/**
 * @route GET /api/nodes
 * @desc 获取所有节点
 * @access Private (Admin)
 */
router.get('/', async (req, res) => {
    try {
        const nodes = await getAllNodes();
        res.json(nodes);
    } catch (error) {
        console.error('获取节点列表失败:', error);
        res.status(500).json({ detail: '服务器内部错误' });
    }
});

/**
 * @route PUT /api/nodes/:id
 * @desc 更新节点
 * @access Private (Admin)
 */
router.put('/:id', validate(NodeUpdateSchema), async (req, res) => {
    try {
        const updatedNode = await updateNode(req.params.id, req.body);
        if (!updatedNode) {
            return res.status(404).json({ detail: '节点未找到' });
        }
        res.json(updatedNode);
    } catch (error) {
        console.error('更新节点失败:', error);
        res.status(500).json({ detail: '服务器内部错误' });
    }
});

/**
 * @route DELETE /api/nodes/:id
 * @desc 删除节点
 * @access Private (Admin)
 */
router.delete('/:id', async (req, res) => {
    try {
        const success = await deleteNode(req.params.id);
        if (success) {
            res.status(204).send(); // No Content
        } else {
            res.status(404).json({ detail: '节点未找到' });
        }
    } catch (error) {
        console.error('删除节点失败:', error);
        res.status(500).json({ detail: '服务器内部错误' });
    }
});

module.exports = router;
