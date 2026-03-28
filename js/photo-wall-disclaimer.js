/**
 * Photo Wall Disclaimer Component
 * 照片墙免责声明组件
 * 
 * 阶段二：照片墙功能配套
 * 在照片墙页面上方显示免责声明横幅
 */

class PhotoWallDisclaimer {
    constructor(options = {}) {
        this.options = {
            container: options.container || document.body,
            position: options.position || 'top', // 'top' | 'before-upload'
            onAgree: options.onAgree || null,
            ...options
        };
        
        this.isAgreed = false;
        this.init();
    }

    init() {
        this.render();
        this.attachEvents();
    }

    render() {
        const banner = document.createElement('div');
        banner.className = 'photo-wall-disclaimer';
        banner.innerHTML = `
            <div class="disclaimer-content">
                <div class="disclaimer-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="disclaimer-text">
                    <h4>上传须知</h4>
                    <ul>
                        <li>请确保您拥有照片的著作权或已获得合法授权</li>
                        <li>禁止上传他人作品、敏感内容或违法信息</li>
                        <li>上传即表示您同意《<a href="privacy.html" target="_blank">隐私政策</a>》和《<a href="terms.html" target="_blank">使用条款</a>》中的UGC条款</li>
                        <li>违规内容将被删除，严重者将封禁上传权限</li>
                    </ul>
                </div>
                <div class="disclaimer-actions">
                    <button class="btn btn-primary btn-agree">
                        <i class="fas fa-check"></i> 我已了解
                    </button>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .photo-wall-disclaimer {
                background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
                border: 1px solid #ffc107;
                border-radius: 8px;
                padding: 16px 20px;
                margin: 20px 0;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .photo-wall-disclaimer .disclaimer-content {
                display: flex;
                align-items: flex-start;
                gap: 16px;
            }
            .photo-wall-disclaimer .disclaimer-icon {
                font-size: 24px;
                color: #f39c12;
                flex-shrink: 0;
                margin-top: 2px;
            }
            .photo-wall-disclaimer .disclaimer-text {
                flex: 1;
            }
            .photo-wall-disclaimer .disclaimer-text h4 {
                margin: 0 0 8px 0;
                color: #856404;
                font-size: 16px;
            }
            .photo-wall-disclaimer .disclaimer-text ul {
                margin: 0;
                padding-left: 18px;
                color: #856404;
                font-size: 14px;
                line-height: 1.6;
            }
            .photo-wall-disclaimer .disclaimer-text li {
                margin: 4px 0;
            }
            .photo-wall-disclaimer .disclaimer-text a {
                color: #0066cc;
                text-decoration: underline;
            }
            .photo-wall-disclaimer .disclaimer-actions {
                flex-shrink: 0;
            }
            .photo-wall-disclaimer .btn-agree {
                background: #f39c12;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.2s;
            }
            .photo-wall-disclaimer .btn-agree:hover {
                background: #e67e22;
            }
            .photo-wall-disclaimer.agreed {
                background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
                border-color: #28a745;
            }
            .photo-wall-disclaimer.agreed .disclaimer-icon {
                color: #28a745;
            }
            .photo-wall-disclaimer.agreed .disclaimer-text h4,
            .photo-wall-disclaimer.agreed .disclaimer-text ul {
                color: #155724;
            }
            @media (max-width: 768px) {
                .photo-wall-disclaimer .disclaimer-content {
                    flex-direction: column;
                }
                .photo-wall-disclaimer .disclaimer-actions {
                    width: 100%;
                    margin-top: 12px;
                }
                .photo-wall-disclaimer .btn-agree {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);

        this.element = banner;
        
        if (this.options.position === 'top') {
            this.options.container.insertBefore(banner, this.options.container.firstChild);
        } else {
            this.options.container.appendChild(banner);
        }
    }

    attachEvents() {
        const agreeBtn = this.element.querySelector('.btn-agree');
        agreeBtn.addEventListener('click', () => {
            this.isAgreed = true;
            this.element.classList.add('agreed');
            agreeBtn.innerHTML = '<i class="fas fa-check-circle"></i> 已确认';
            agreeBtn.disabled = true;
            
            if (this.options.onAgree) {
                this.options.onAgree();
            }
        });
    }

    // 检查用户是否已同意
    static checkAgreement() {
        return localStorage.getItem('photoWallDisclaimerAgreed') === 'true';
    }

    // 保存同意状态
    static saveAgreement() {
        localStorage.setItem('photoWallDisclaimerAgreed', 'true');
    }

    // 显示上传确认对话框
    static showUploadConfirm(onConfirm, onCancel) {
        const modal = document.createElement('div');
        modal.className = 'upload-confirm-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-upload"></i> 确认上传</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>上传前请确认以下事项：</p>
                    <div class="confirm-checkboxes">
                        <label class="checkbox-item">
                            <input type="checkbox" id="confirm-original">
                            <span>我是这张照片的著作权人或已获得授权</span>
                        </label>
                        <label class="checkbox-item">
                            <input type="checkbox" id="confirm-no-infringement">
                            <span>照片内容不侵犯任何第三方权益</span>
                        </label>
                        <label class="checkbox-item">
                            <input type="checkbox" id="confirm-legal">
                            <span>照片内容不违反法律法规</span>
                        </label>
                        <label class="checkbox-item">
                            <input type="checkbox" id="confirm-public">
                            <span>我同意照片在照片墙公开展示</span>
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary btn-cancel">取消</button>
                    <button class="btn btn-primary btn-confirm" disabled>确认上传</button>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .upload-confirm-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .upload-confirm-modal .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
            }
            .upload-confirm-modal .modal-content {
                position: relative;
                background: white;
                border-radius: 12px;
                width: 90%;
                max-width: 480px;
                max-height: 90vh;
                overflow: auto;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            .upload-confirm-modal .modal-header {
                padding: 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .upload-confirm-modal .modal-header h3 {
                margin: 0;
                color: var(--text-primary);
            }
            .upload-confirm-modal .modal-header h3 i {
                color: var(--primary-color);
                margin-right: 8px;
            }
            .upload-confirm-modal .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
            }
            .upload-confirm-modal .modal-body {
                padding: 20px;
            }
            .upload-confirm-modal .modal-body p {
                margin-bottom: 16px;
                color: var(--text-secondary);
            }
            .upload-confirm-modal .confirm-checkboxes {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .upload-confirm-modal .checkbox-item {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                cursor: pointer;
                padding: 8px;
                border-radius: 6px;
                transition: background 0.2s;
            }
            .upload-confirm-modal .checkbox-item:hover {
                background: #f8f9fa;
            }
            .upload-confirm-modal .checkbox-item input {
                margin-top: 3px;
                width: 18px;
                height: 18px;
                cursor: pointer;
            }
            .upload-confirm-modal .checkbox-item span {
                font-size: 14px;
                color: var(--text-primary);
                line-height: 1.5;
            }
            .upload-confirm-modal .modal-footer {
                padding: 16px 20px;
                border-top: 1px solid #eee;
                display: flex;
                justify-content: flex-end;
                gap: 12px;
            }
            .upload-confirm-modal .btn {
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s;
            }
            .upload-confirm-modal .btn-secondary {
                background: #f8f9fa;
                border: 1px solid #ddd;
                color: var(--text-primary);
            }
            .upload-confirm-modal .btn-primary {
                background: var(--primary-color);
                border: none;
                color: white;
            }
            .upload-confirm-modal .btn-primary:disabled {
                background: #ccc;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(modal);

        // 事件处理
        const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
        const confirmBtn = modal.querySelector('.btn-confirm');
        const cancelBtn = modal.querySelector('.btn-cancel');
        const closeBtn = modal.querySelector('.modal-close');

        const checkAllChecked = () => {
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            confirmBtn.disabled = !allChecked;
        };

        checkboxes.forEach(cb => cb.addEventListener('change', checkAllChecked));

        confirmBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
            if (onConfirm) onConfirm();
        });

        const cancel = () => {
            document.body.removeChild(modal);
            if (onCancel) onCancel();
        };

        cancelBtn.addEventListener('click', cancel);
        closeBtn.addEventListener('click', cancel);
        modal.querySelector('.modal-overlay').addEventListener('click', cancel);
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhotoWallDisclaimer;
} else {
    window.PhotoWallDisclaimer = PhotoWallDisclaimer;
}
