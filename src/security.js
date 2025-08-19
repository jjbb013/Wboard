const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./config');

/**
 * 哈希密码
 * @param {string} password - 原始密码
 * @returns {Promise<string>} - 哈希后的密码
 */
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * 验证密码
 * @param {string} password - 原始密码
 * @param {string} hashedPassword - 哈希后的密码
 * @returns {Promise<boolean>} - 密码是否匹配
 */
async function verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}

/**
 * 创建 JWT token
 * @param {object} payload - token 负载
 * @returns {string} - JWT token
 */
function createAccessToken(payload) {
    const expiresIn = `${config.ACCESS_TOKEN_EXPIRE_MINUTES}m`;
    return jwt.sign(payload, config.SECRET_KEY, { algorithm: config.ALGORITHM, expiresIn });
}

/**
 * 验证 JWT token
 * @param {string} token - JWT token
 * @returns {object|null} - 解码后的负载或 null
 */
function verifyAccessToken(token) {
    try {
        return jwt.verify(token, config.SECRET_KEY, { algorithms: [config.ALGORITHM] });
    } catch (error) {
        return null;
    }
}

/**
 * JWT 认证中间件
 * @param {object} req - 请求对象
 * @param {object} res - 响应对象
 * @param {function} next - 下一个中间件
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ detail: '未提供认证令牌' });
    }

    const user = verifyAccessToken(token);
    if (!user) {
        return res.status(403).json({ detail: '无效或过期的认证令牌' });
    }

    req.user = user; // 将解码后的用户信息附加到请求对象
    next();
}

module.exports = {
    hashPassword,
    verifyPassword,
    createAccessToken,
    verifyAccessToken,
    authenticateToken
};
