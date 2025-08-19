// 用户相关的 Schema
const UserCreateSchema = {
    type: 'object',
    properties: {
        username: { type: 'string', minLength: 3, maxLength: 50 },
        password: { type: 'string', minLength: 6 },
        traffic_limit_gb: { type: 'number', minimum: 0 }, // GB
        due_date: { type: 'string', format: 'date-time', nullable: true }
    },
    required: ['username', 'password', 'traffic_limit_gb']
};

const UserUpdateSchema = {
    type: 'object',
    properties: {
        username: { type: 'string', minLength: 3, maxLength: 50 },
        traffic_limit_gb: { type: 'number', minimum: 0 }, // GB
        due_date: { type: 'string', format: 'date-time', nullable: true },
        is_active: { type: 'boolean' }
    }
};

const UserLoginSchema = {
    type: 'object',
    properties: {
        username: { type: 'string' },
        password: { type: 'string' }
    },
    required: ['username', 'password']
};

// 节点相关的 Schema
const NodeCreateSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1 },
        address: { type: 'string', minLength: 1 },
        port: { type: 'number', minimum: 1, maximum: 65535 },
        protocol_type: { type: 'string', enum: ['VLESS', 'VMess', 'Trojan', 'Shadowsocks'] }, // 示例协议类型
        config_details: { type: 'object', nullable: true } // 存储 JSON 对象
    },
    required: ['name', 'address', 'port', 'protocol_type']
};

const NodeUpdateSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1 },
        address: { type: 'string', minLength: 1 },
        port: { type: 'number', minimum: 1, maximum: 65535 },
        protocol_type: { type: 'string', enum: ['VLESS', 'VMess', 'Trojan', 'Shadowsocks'] },
        config_details: { type: 'object', nullable: true },
        is_active: { type: 'boolean' }
    }
};

module.exports = {
    UserCreateSchema,
    UserUpdateSchema,
    UserLoginSchema,
    NodeCreateSchema,
    NodeUpdateSchema
};
