@echo off
chcp 65001 >nul
echo ========================================
echo   Photo Monster 部署脚本 v2
echo ========================================
echo.

cd /d D:\PhotoMonster

echo [1/5] 检查网络连接...
ping -n 1 github.com >nul 2>&1
if errorlevel 1 (
    echo [错误] 无法连接到 GitHub，请检查网络
    pause
    exit /b 1
)
echo [1/5] 网络连接正常

echo.
echo [2/5] 检查变更...
git status --short
if "x%errorlevel%"=="x0" (
    git diff --cached --quiet >nul 2>&1
    if %errorlevel% == 0 (
        git diff --quiet >nul 2>&1
        if %errorlevel% == 0 (
            echo.
            echo [提示] 没有检测到文件变更
            pause
            exit /b 0
        )
    )
)

echo.
echo [3/5] 更新版本信息...
set /p CHANGE_DESC="请输入本次变更说明 (多个用逗号分隔，直接回车使用默认): "
if "%CHANGE_DESC%"=="" set CHANGE_DESC=代码更新
node deploy-prep.js "%CHANGE_DESC%"
if %errorlevel% neq 0 (
    echo [错误] 版本更新失败
    pause
    exit /b 1
)

echo.
echo [4/5] 提交并推送变更...
git add .
git commit -m "发布: %CHANGE_DESC%"
if %errorlevel% neq 0 (
    echo [提示] 没有需要提交的变更，或提交失败
)

git push origin main
if %errorlevel% neq 0 (
    echo [错误] 推送失败，请检查网络或权限
    pause
    exit /b 1
)

echo.
echo ========================================
echo   部署完成！
echo   访问线上管理页面确认发布:
echo   https://sx-fun.github.io/photo-monster/pages/admin-update.html
echo   等待 1-2 分钟后，点击"确认发布"按钮
echo ========================================
pause
