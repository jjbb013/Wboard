from fastapi import APIRouter, Request, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from ..main import templates

router = APIRouter(
    tags=["Pages"],
    include_in_schema=False # 在API文档中隐藏这些页面路由
)

@router.get("/login", response_class=HTMLResponse)
async def login(request: Request):
    """
    显示登录页面。
    """
    return templates.TemplateResponse("login.html", {"request": request})

@router.get("/admin/dashboard", response_class=HTMLResponse)
async def admin_dashboard(request: Request):
    """
    显示管理员仪表盘页面 (占位)。
    """
    # 这里未来需要加入登录验证逻辑
    return HTMLResponse("<h1>管理员后台</h1><p>功能开发中...</p>")

@router.get("/", response_class=RedirectResponse)
async def redirect_to_login():
    """
    根路径重定向到登录页。
    """
    return RedirectResponse(url="/login")
