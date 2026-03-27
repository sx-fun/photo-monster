/**
 * Photo Monster 交互式审核界面
 * 提供命令行交互界面供用户审核
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class InteractiveReview {
    constructor() {
        this.tempDir = path.join(__dirname, 'temp');
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    // 查找待审核文件
    findPendingReviews() {
        return fs.readdirSync(this.tempDir)
            .filter(f => f.startsWith('pending-review-') && f.endsWith('.json'))
            .map(f => ({
                name: f,
                path: path.join(this.tempDir, f),
                time: fs.statSync(path.join(this.tempDir, f)).mtime
            }))
            .sort((a, b) => b.time - a.time);
    }

    // 显示审核菜单
    async showMenu() {
        console.log('\n╔════════════════════════════════════════════════════════╗');
        console.log('║     📋 Photo Monster 人工审核系统                      ║');
        console.log('╚════════════════════════════════════════════════════════╝\n');

        const pendingFiles = this.findPendingReviews();
        
        if (pendingFiles.length === 0) {
            console.log('✅ 没有待审核的内容\n');
            this.rl.close();
            return;
        }

        console.log(`发现 ${pendingFiles.length} 个待审核文件:\n`);
        
        // 加载最新文件
        const latest = pendingFiles[0];
        const data = JSON.parse(fs.readFileSync(latest.path, 'utf-8'));
        
        // 显示摘要
        this.showSummary(data);
        
        // 显示详细内容
        await this.showDetails(data);
        
        // 交互式审核
        await this.interactiveApprove(latest, data);
    }

    showSummary(data) {
        console.log('📊 内容摘要:');
        console.log('─────────────────────────────────');
        console.log(`📷 新增相机: ${data.items?.cameras?.length || 0} 款`);
        console.log(`🔍 新增镜头: ${data.items?.lenses?.length || 0} 款`);
        console.log(`📰 相关新闻: ${data.news?.length || 0} 条`);
        console.log('─────────────────────────────────\n');
    }

    async showDetails(data) {
        // 显示相机详情
        if (data.items?.cameras?.length > 0) {
            console.log('📷 新增相机详情:\n');
            for (let i = 0; i < data.items.cameras.length; i++) {
                const c = data.items.cameras[i];
                console.log(`[${i + 1}] ${c.brand.toUpperCase()} ${c.model}`);
                console.log(`    类型: ${c.type || '未知'}`);
                console.log(`    画幅: ${c.sensor || '未知'}`);
                console.log(`    像素: ${c.mp || '?'}MP`);
                console.log(`    卡口: ${c.mount || '?'}`);
                console.log(`    来源: ${c.source}`);
                console.log('');
            }
        }

        // 显示新闻
        if (data.news?.length > 0) {
            console.log('📰 相关新闻:\n');
            data.news.slice(0, 3).forEach((n, i) => {
                console.log(`[${i + 1}] ${n.title}`);
                console.log(`    ${n.summary?.substring(0, 80)}...`);
                console.log('');
            });
        }
    }

    async interactiveApprove(file, data) {
        console.log('📝 审核选项:\n');
        console.log('  1. ✅ 全部批准 - 更新所有内容到数据库');
        console.log('  2. 📷 仅批准相机 - 只更新相机数据');
        console.log('  3. 🔍 仅批准镜头 - 只更新镜头数据');
        console.log('  4. ✏️  编辑后批准 - 先编辑JSON文件');
        console.log('  5. ❌ 拒绝 - 删除此审核文件');
        console.log('  6. ⏸️  跳过 - 暂不处理，保留待审核\n');

        const answer = await this.askQuestion('请选择操作 (1-6): ');

        switch (answer.trim()) {
            case '1':
                await this.approveAll(file);
                break;
            case '2':
                await this.approveCamerasOnly(file, data);
                break;
            case '3':
                await this.approveLensesOnly(file, data);
                break;
            case '4':
                await this.editAndApprove(file);
                break;
            case '5':
                await this.reject(file);
                break;
            case '6':
                console.log('\n⏸️  已跳过，文件保留在待审核列表\n');
                break;
            default:
                console.log('\n❌ 无效选择\n');
        }

        this.rl.close();
    }

    askQuestion(question) {
        return new Promise(resolve => {
            this.rl.question(question, resolve);
        });
    }

    async approveAll(file) {
        const newName = file.name.replace('pending-review-', 'approved-');
        const newPath = path.join(this.tempDir, newName);
        fs.renameSync(file.path, newPath);
        console.log(`\n✅ 已批准全部内容`);
        console.log(`📁 文件已重命名为: ${newName}`);
        console.log(`\n💡 现在可以运行: node update-db-secure.js`);
    }

    async approveCamerasOnly(file, data) {
        // 创建仅包含相机的新文件
        const cameraOnlyData = {
            ...data,
            items: {
                cameras: data.items?.cameras || [],
                lenses: []
            }
        };
        
        const newName = file.name.replace('pending-review-', 'approved-cameras-');
        const newPath = path.join(this.tempDir, newName);
        fs.writeFileSync(newPath, JSON.stringify(cameraOnlyData, null, 2), 'utf-8');
        fs.unlinkSync(file.path);
        
        console.log(`\n✅ 已批准相机数据 (${cameraOnlyData.items.cameras.length} 款)`);
        console.log(`📁 文件已保存为: ${newName}`);
    }

    async approveLensesOnly(file, data) {
        const lensOnlyData = {
            ...data,
            items: {
                cameras: [],
                lenses: data.items?.lenses || []
            }
        };
        
        const newName = file.name.replace('pending-review-', 'approved-lenses-');
        const newPath = path.join(this.tempDir, newName);
        fs.writeFileSync(newPath, JSON.stringify(lensOnlyData, null, 2), 'utf-8');
        fs.unlinkSync(file.path);
        
        console.log(`\n✅ 已批准镜头数据 (${lensOnlyData.items.lenses.length} 款)`);
        console.log(`📁 文件已保存为: ${newName}`);
    }

    async editAndApprove(file) {
        console.log(`\n✏️  请编辑文件: ${file.path}`);
        console.log('编辑完成后，按回车键继续...');
        await this.askQuestion('');
        
        // 重新加载并确认
        try {
            const data = JSON.parse(fs.readFileSync(file.path, 'utf-8'));
            console.log('\n📋 编辑后的内容:');
            this.showSummary(data);
            
            const confirm = await this.askQuestion('确认批准此内容? (y/n): ');
            if (confirm.toLowerCase() === 'y') {
                await this.approveAll(file);
            } else {
                console.log('\n⏸️  已取消，文件保留\n');
            }
        } catch (e) {
            console.error('\n❌ 文件解析失败，请检查JSON格式\n');
        }
    }

    async reject(file) {
        const confirm = await this.askQuestion('确定要删除此审核文件? (y/n): ');
        if (confirm.toLowerCase() === 'y') {
            fs.unlinkSync(file.path);
            console.log('\n🗑️  已删除审核文件\n');
        } else {
            console.log('\n⏸️  已取消删除\n');
        }
    }
}

// 主函数
async function main() {
    const review = new InteractiveReview();
    await review.showMenu();
}

module.exports = { InteractiveReview, main };

if (require.main === module) {
    main();
}
