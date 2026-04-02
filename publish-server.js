// Photo Monster - 本地发布服务器
// 监听 8891 端口，执行 deploy-publish.js 脚本
// 用法: node publish-server.js

const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 8891;
const PHOTO_MONSTER_PATH = path.join(__dirname);

// 简单密码验证（防止误触）
const SECRET_KEY = 'photo-monster-publish-2026';

const server = http.createServer((req, res) => {
    // CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/publish') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);

                // 验证密钥
                if (data.key !== SECRET_KEY) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: '未授权' }));
                    return;
                }

                console.log('[Publish Server] 收到发布请求，版本:', data.version);

                // 执行发布脚本
                const cmd = `node "${path.join(PHOTO_MONSTER_PATH, 'deploy-publish.js')}" "${data.version}" "${data.swVersion}" '${data.changes}'`;
                console.log('[Publish Server] 执行:', cmd);

                const output = execSync(cmd, {
                    cwd: PHOTO_MONSTER_PATH,
                    encoding: 'utf-8',
                    timeout: 60000
                });

                console.log('[Publish Server] 发布成功:', output);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    output: output
                }));

            } catch (error) {
                console.error('[Publish Server] 发布失败:', error.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    error: error.message,
                    stderr: error.stderr?.toString() || ''
                }));
            }
        });
        return;
    }

    // 取消发布
    if (req.method === 'POST' && req.url === '/cancel') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);

                if (data.key !== SECRET_KEY) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: '未授权' }));
                    return;
                }

                console.log('[Publish Server] 收到取消发布请求');

                const cmd = `node "${path.join(PHOTO_MONSTER_PATH, 'deploy-publish.js')}" --cancel`;
                const output = execSync(cmd, {
                    cwd: PHOTO_MONSTER_PATH,
                    encoding: 'utf-8',
                    timeout: 30000
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    output: output
                }));

            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
        return;
    }

    // 健康检查
    if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', path: PHOTO_MONSTER_PATH }));
        return;
    }

    res.writeHead(404);
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║     Photo Monster 本地发布服务器                            ║
║     本地发布服务器已启动                                    ║
║     监听端口: ${PORT}                                          ║
║     路径: ${PHOTO_MONSTER_PATH}    ║
╚════════════════════════════════════════════════════════════╝
    `);
    console.log('提示: 保持此窗口运行，关闭后需重新启动');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`端口 ${PORT} 已被占用，发布服务器可能已在运行`);
    } else {
        console.error('服务器错误:', err);
    }
});
