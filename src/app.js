const express = require('express');
const path = require('path');
const { connectToDatabase } = require('./database');
const { initializeDatabase } = require('./models');
const { startScheduledTasks } = require('./tasks');
const config = require('./config');

// 导入路由
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const nodeRoutes = require('./routes/nodes');
const subscriptionRoutes = require('./routes/subscription');

const app = express();

// 中间件
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL-encoded 请求体

// 设置视图引擎为 EJS (或你选择的模板引擎)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // 模板文件放在 src/views 目录下

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public'))); // 假设有 public 目录存放静态资源

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/nodes', nodeRoutes);
app.use('/sub', subscriptionRoutes); // 订阅路由不需要 /api 前缀

// 页面路由 (示例)
app.get('/', (req, res) => {
    res.render('index', { title: 'Wboard Home' }); // 渲染 index.ejs
});

app.get('/login', (req, res) => {
    res.render('login'); // 渲染 login.ejs
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ detail: '服务器内部错误', message: err.message });
});

// 启动服务器
async function startServer() {
    await connectToDatabase(); // 连接数据库
    await initializeDatabase(); // 初始化数据库表结构
    startScheduledTasks(); // 启动定时任务

    app.listen(config.PORT, () => {
        console.log(`服务器运行在 http://localhost:${config.PORT}`);
    });
}

startServer();

module.exports = app; // 导出 app 实例，方便测试
