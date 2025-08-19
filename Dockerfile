# 使用官方 Node.js 18 LTS 镜像作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json (如果存在)
COPY package*.json ./

# 安装项目依赖
RUN npm install --production

# 复制所有项目文件到工作目录
COPY . .

# 暴露应用端口
EXPOSE 8000

# 启动应用
CMD ["node", "src/app.js"]
