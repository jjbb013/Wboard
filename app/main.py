from fastapi import FastAPI, Depends
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine, get_db
from .config import settings
from .routers import auth, pages

# 创建数据库表
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Wboard", description="一个轻量级的代理服务分享与管理工具")

app.include_router(auth.router)
app.include_router(pages.router)

@app.on_event("startup")
def startup_event():
    """
    应用启动时执行的事件：
    1. 检查并创建初始管理员账号。
    """
    db = SessionLocal()
    try:
        # 检查管理员是否存在
        admin = crud.get_user_by_username(db, username=settings.ADMIN_USERNAME)
        if not admin:
            # 创建管理员账号
            admin_in = schemas.UserCreate(
                username=settings.ADMIN_USERNAME,
                password=settings.ADMIN_PASSWORD,
                is_admin=True
            )
            crud.create_user(db=db, user=admin_in)
            print(f"管理员账号 '{settings.ADMIN_USERNAME}' 创建成功。")
    finally:
        db.close()


# 挂载静态文件目录
app.mount("/static", StaticFiles(directory="app/static"), name="static")


# 根路径已在 pages.py 中定义重定向，此处可移除或注释
# @app.get("/")
# async def root():
#     """
#     根路径，可以显示一个简单的欢迎页面或重定向到登录页面。
#     """
#     return {"message": "欢迎使用 Wboard"}

# 后续将在这里引入和注册其他模块的路由
