import os
from dotenv import load_dotenv

# 加载 .env 文件中的环境变量
load_dotenv()

class Settings:
    # 数据库配置
    DATABASE_URL: str = os.getenv("MYSQL_CONNECTOR_URI", "mysql+pymysql://user:password@host/db")
    
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
