import os
from dotenv import load_dotenv

# 加载 .env 文件中的环境变量
load_dotenv()

def parse_northflank_uri(uri: str) -> str:
    """
    解析 Northflank 的键值对格式连接字符串，并转换为 SQLAlchemy URI。
    示例输入: server=host:port;uid=user;password=pw;database=db
    示例输出: mysql+pymysql://user:pw@host:port/db
    """
    if not uri or "server=" not in uri:
        raise ValueError("无效或空的 MYSQL_CONNECTOR_URI，请检查 Northflank 环境变量配置。")

    parts = {k: v for k, v in (item.split('=', 1) for item in uri.split(';'))}
    
    host_port = parts.get("server")
    user = parts.get("uid")
    password = parts.get("password")
    db = parts.get("database")

    if not all([host_port, user, password, db]):
        raise ValueError("MYSQL_CONNECTOR_URI 格式不完整，缺少关键部分。")

    return f"mysql+pymysql://{user}:{password}@{host_port}/{db}"

class Settings:
    # 数据库配置
    raw_db_uri = os.getenv("MYSQL_CONNECTOR_URI")
    if not raw_db_uri:
        raise ValueError("环境变量 MYSQL_CONNECTOR_URI 未设置，请在 Northflank 中链接数据库。")
    DATABASE_URL: str = parse_northflank_uri(raw_db_uri)
    
    # JWT Token 配置
    SECRET_KEY: str = os.getenv("SECRET_KEY", "a_very_secret_key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days

    # 管理员初始账号密码
    ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "123456")

    # Xray API 配置
    XRAY_API_BASE_URL: str = os.getenv("XRAY_API_BASE_URL", "http://127.0.0.1:8080")

settings = Settings()
