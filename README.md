# Wboard (Node.js 版本)

Wboard 是一个轻量级、非商业化的代理服务分享与管理工具，旨在帮助您轻松地与朋友分享和管理代理服务。此版本已从 Python/FastAPI 重构为 Node.js，并适配 Northflank 的 MySQL 服务。

## 核心功能

*   **用户管理**: 添加/删除用户，分配流量/时长，查看用量，重置流量。
*   **节点管理**: 添加/删除代理服务器节点信息。
*   **订阅服务**: 根据用户 UUID 动态生成包含可用节点的配置文件。
*   **流量统计**: 定时从代理后端（如 Xray）获取流量数据并更新到数据库。
*   **自动任务**: 每月自动重置用户流量；自动禁用到期或流量超出的用户。

## 技术栈

*   **后端**: Node.js (Express.js)
*   **数据库**: MySQL (适配 Northflank MySQL 服务)
*   **ORM/驱动**: `mysql2/promise`
*   **认证**: JWT (jsonwebtoken, bcryptjs)
*   **定时任务**: `node-cron`
*   **HTTP 客户端**: `axios` (用于与 Xray API 交互)
*   **视图引擎**: EJS
*   **环境变量**: `dotenv`
*   **JSON Schema 验证**: `ajv`
*   **UUID 生成**: `uuid`

## 部署到 Northflank

### 1. 准备 Northflank 服务

1.  **创建 MySQL 数据库**: 在 Northflank 项目中，创建一个新的 MySQL 数据库服务。记下其连接字符串（通常会自动注入到服务中，或在数据库详情页查看）。
2.  **创建 Node.js 服务**: 创建一个新的服务，选择 `Build and Deploy a Container`，并选择 `Node.js` 作为语言。

### 2. 配置环境变量

Northflank 会自动将 MySQL 数据库的连接信息注入到您的 Node.js 服务中，通常以 `MYSQL_CONNECTOR_URI` 或类似的名称。您需要在 `.env.example` 中配置 `DATABASE_URL`，并在 Northflank 服务中确保 `DATABASE_URL` 环境变量指向正确的 MySQL 连接字符串。

**重要**: 在生产环境中，请务必修改 `SECRET_KEY` 为一个强随机字符串。

### 3. Dockerfile

项目根目录已提供 `Dockerfile`，Northflank 会自动使用它来构建您的应用。

### 4. 部署

1.  将您的代码推送到 Git 仓库（例如 GitHub）。
2.  在 Northflank 服务配置中，连接到您的 Git 仓库。
3.  配置构建设置，确保使用项目根目录的 `Dockerfile`。
4.  部署服务。

## 本地开发

### 1. 环境准备

*   安装 Node.js (推荐 LTS 版本，如 18 或更高)。
*   安装 MySQL 数据库 (例如 Docker Desktop 运行 MySQL 容器)。

### 2. 克隆项目

```bash
git clone https://github.com/jjbb013/Wboard.git
cd Wboard
```

### 3. 安装依赖

```bash
npm install
```

### 4. 配置环境变量

复制 `.env.example` 为 `.env`，并根据您的本地 MySQL 配置修改 `DATABASE_URL`。

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```
PORT=8000
DATABASE_URL="mysql://root:password@localhost:3306/wboard_db?sslmode=REQUIRED" # 根据你的本地MySQL配置修改
SECRET_KEY="your-development-secret-key"
XRAY_API_URL="http://localhost:8080/stats" # 如果需要与Xray交互，请配置
```

### 5. 运行应用

```bash
node src/app.js
```

应用将在 `http://localhost:8000` 运行。

### 6. 数据库初始化

首次运行应用时，`src/app.js` 会自动连接数据库并创建 `users` 和 `nodes` 表（如果不存在）。

### 7. Xray API 交互 (待完善)

请注意，与 Xray API 的交互（添加/删除用户，获取流量统计）在 `src/utils.js` 中目前是占位符实现，因为 Xray 的 API 通常是 gRPC 协议。在实际部署中，您需要：

1.  确保您的 Xray 服务开启了 API 功能。
2.  根据 Xray 的 gRPC 协议，使用 Node.js 的 gRPC 客户端库（如 `@grpc/grpc-js`）来实现 `addXrayUser`, `removeXrayUser`, `getXrayTrafficStats` 等函数。

## API 文档 (待完善)

目前没有自动生成的 API 文档。请参考 `src/routes/auth.js`, `src/routes/users.js`, `src/routes/nodes.js` 中的路由定义。

## 贡献

欢迎贡献！如果您有任何改进建议或发现 Bug，请提交 Issue 或 Pull Request。
