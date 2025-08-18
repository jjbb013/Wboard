# Wboard - 轻量级代理服务分享与管理工具

Wboard 是一个基于 FastAPI 构建的轻量级面板，旨在帮助您轻松地与朋友分享和管理代理服务。

## 功能特性 (MVP)

-   **用户管理**: 添加/删除用户，设置流量和有效期。
-   **节点管理**: 集中管理您的所有代理节点。
-   **订阅服务**: 为每个用户生成专属的订阅链接。
-   **流量统计**: 自动从 Xray-core API 获取并更新用户流量。
-   **Web 界面**: 提供简洁的管理后台和用户仪表盘。

## 技术栈

-   **后端**: FastAPI
-   **数据库**: MySQL (适配 Northflank)
-   **ORM**: SQLAlchemy
-   **前端**: Jinja2 模板 + Bootstrap

---

## 本地开发与运行

1.  **克隆仓库**
    ```bash
    git clone <your-repo-url>
    cd Wboard
    ```

2.  **创建虚拟环境并安装依赖**
    ```bash
    python -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate
    pip install -r requirements.txt
    ```

3.  **配置环境变量**
    复制 `.env.example` 为 `.env` 文件，并根据您的本地环境修改其中的配置，特别是 `DATABASE_URL`。
    ```bash
    cp .env.example .env
    ```

4.  **运行应用**
    ```bash
    uvicorn app.main:app --reload
    ```
    应用将在 `http://127.0.0.1:8000` 上运行。

---

## 在 Northflank 上部署

按照以下步骤，您可以轻松地将 Wboard 部署到 Northflank 的免费容器服务中。

1.  **准备代码仓库**
    将本项目代码上传到您的 GitHub 或 GitLab 仓库。

2.  **在 Northflank 创建项目**
    登录 Northflank，创建一个新项目。

3.  **创建 MySQL 数据库 Addon**
    -   在项目中，选择 "Add new" -> "Addon"。
    -   选择 "MySQL"，选择一个区域，并选择免费的 `nf-mysql-free-8.0` 计划。
    -   创建后，进入 Addon 详情页，在 "Connection" 标签页找到数据库的 `Host`, `Port`, `User`, `Password` 和 `Database name`。这些信息将用于下一步的环境变量配置。

4.  **创建服务 (Deployment Service)**
    -   回到项目，选择 "Add new" -> "Service"。
    -   选择 "Deployment service"。
    -   **仓库设置**:
        -   连接您的 GitHub/GitLab 账号，并选择 Wboard 项目的仓库。
    -   **构建选项**:
        -   选择 "Dockerfile"。Northflank 会自动检测到项目根目录下的 `Dockerfile`。
        -   "Build path" 留空即可。
    -   **端口配置**:
        -   Northflank 会自动检测 `Dockerfile` 中暴露的 `8000` 端口。为端口命名（例如 `http`）并确保 "Public" 开关是打开的，这样才能通过公网访问。
    -   **环境变量**:
        -   这是最关键的一步。在 "Environment variables" 部分，找到 "Runtime variables" 并点击 "Add variable"。
        -   **添加 `DATABASE_URL`**:
            -   **Key**: `DATABASE_URL`
            -   **Value**: 点击输入框右侧的图标（通常是一个锁或钥匙图标），选择 "Secret"。
            -   在弹出的菜单中，选择你之前创建的 MySQL Addon，然后选择 `MYSQL_URL`。Northflank 会自动为你填充正确的连接字符串。
        -   **添加其他变量**:
            -   重复 "Add variable" 步骤，添加以下变量：
            -   `SECRET_KEY`: **Key** 为 `SECRET_KEY`。在 **Value** 处，点击右侧图标，选择 "Generate" 生成一个安全的随机字符串。
            -   `ADMIN_USERNAME`: **Key** 为 `ADMIN_USERNAME`，**Value** 处填写你想要的初始管理员用户名。
            -   `ADMIN_PASSWORD`: **Key** 为 `ADMIN_PASSWORD`，**Value** 处填写一个安全的初始管理员密码。
            -   `XRAY_API_BASE_URL`: **Key** 为 `XRAY_API_BASE_URL`，**Value** 处填写你的 Xray API 地址。
    -   **资源计划**:
        -   选择免费的 `nf-compute-free` 计划。
    -   **磁盘 (Volumes)**:
        -   在 "Advanced" 选项中，可以挂载一个免费的 6GB 磁盘，但这对于 Wboard 不是必需的，因为我们使用数据库来持久化存储。

5.  **创建并部署**
    -   点击 "Create service"。Northflank 会开始从你的仓库拉取代码、构建 Docker 镜像并部署服务。
    -   等待部署成功后，你就可以通过 Northflank 提供的公开 URL 访问你的 Wboard 面板了。
