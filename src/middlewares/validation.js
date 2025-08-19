const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

/**
 * JSON Schema 验证中间件
 * @param {object} schema - 用于验证请求体的 JSON Schema
 */
function validate(schema) {
    return (req, res, next) => {
        const validateFn = ajv.compile(schema);
        const valid = validateFn(req.body);
        if (!valid) {
            const errors = validateFn.errors.map(err => ({
                path: err.instancePath,
                message: err.message
            }));
            return res.status(400).json({ detail: '请求体验证失败', errors });
        }
        next();
    };
}

module.exports = {
    validate
};
