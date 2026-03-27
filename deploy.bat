@echo off
chcp 65001 >nul
echo ========================================
echo   Photo Monster 部署脚本
echo ========================================
echo.

cd /d D:\PhotoMonster

echo [1/4] 检查网络连接...
ping -n 1 github.com >nul 2>&1
if errorlevel 1 (
    echo [错误] 无法连接到 GitHub，请检查网络
    pause
    exit /b 1
)
echo [1/4] 网络连接正常

echo.
echo [2/4] 检查变更...
git status --short

:: 检查是否有变更要提交
git diff --cached --quiet
if %errorlevel% == 0 (
    git diff --quiet
    if %errorlevel% == 0 (
        echo.
        echo [提示] 没有检测到文件变更
        pause
        exit /b 0
    )
)

echo.
echo [3/4] 提交变更...
git add .
git commit -m "更新: %date% %time%" || (
    echo [错误] 提交失败
    pause
    exit /b 1
)

echo.
echo [4/4] 推送到 GitHub...
git push origin main || (
    echo [错误] 推送失败，请检查网络或权限
    pause
    exit /b 1
)

echo.
echo ========================================
echo   部署完成！
echo   访问: https://sx-fun.github.io/photo-monster/
echo   等待 1-2 分钟后刷新网站
echo ========================================
pause
