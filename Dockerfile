# 使用官方 Python 镜像作为基础
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 复制依赖文件并安装
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY ./app /app/app

# 暴露端口
EXPOSE 8000

# 启动应用的命令
# 使用 uvicorn 运行 FastAPI 应用
# --host 0.0.0.0 使其可以从容器外部访问
# --port 8000 监听 8000 端口
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
