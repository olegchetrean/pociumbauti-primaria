/**
 * Admin Panel JavaScript - Primăria Pociumbăuți
 */

document.addEventListener('DOMContentLoaded', function() {
    // ═══════════════════════════════════════════════════════════════════════════
    // Mobile Sidebar Toggle
    // ═══════════════════════════════════════════════════════════════════════════
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('adminSidebar');

    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024) {
                if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // User Menu Dropdown
    // ═══════════════════════════════════════════════════════════════════════════
    const userMenuToggle = document.getElementById('userMenuToggle');
    const userDropdown = document.getElementById('userDropdown');

    if (userMenuToggle && userDropdown) {
        userMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function(e) {
            if (!userDropdown.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // File Upload Preview
    // ═══════════════════════════════════════════════════════════════════════════
    document.querySelectorAll('.file-input').forEach(input => {
        input.addEventListener('change', function() {
            const wrapper = this.closest('.file-upload-wrapper');
            const nameSpan = wrapper.querySelector('.file-name');
            const label = wrapper.querySelector('.file-label span');

            if (this.files && this.files[0]) {
                const fileName = this.files[0].name;
                const fileSize = formatFileSize(this.files[0].size);

                nameSpan.textContent = `${fileName} (${fileSize})`;
                wrapper.classList.add('has-file');

                // Update label text
                if (label) {
                    label.textContent = 'Fișier selectat:';
                }
            } else {
                nameSpan.textContent = '';
                wrapper.classList.remove('has-file');
            }
        });
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // Form Validation
    // ═══════════════════════════════════════════════════════════════════════════
    document.querySelectorAll('.admin-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"]:focus, button[type="submit"]:active');

            if (submitBtn) {
                // Disable button and show loading
                submitBtn.disabled = true;
                const originalContent = submitBtn.innerHTML;
                submitBtn.innerHTML = `
                    <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <style>.spinner{animation:rotate 1s linear infinite}.spinner circle{animation:dash 1.5s ease-in-out infinite;stroke-linecap:round}@keyframes rotate{100%{transform:rotate(360deg)}}@keyframes dash{0%{stroke-dasharray:1,150;stroke-dashoffset:0}50%{stroke-dasharray:90,150;stroke-dashoffset:-35}100%{stroke-dasharray:90,150;stroke-dashoffset:-124}}</style>
                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="3"/>
                    </svg>
                    Se procesează...
                `;

                // Re-enable after timeout (in case of error)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalContent;
                }, 30000);
            }
        });
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // Auto-hide alerts
    // ═══════════════════════════════════════════════════════════════════════════
    document.querySelectorAll('.alert-success').forEach(alert => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.3s ease';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // Confirm Delete Actions
    // ═══════════════════════════════════════════════════════════════════════════
    document.querySelectorAll('[data-confirm]').forEach(element => {
        element.addEventListener('click', function(e) {
            const message = this.getAttribute('data-confirm') || 'Sigur doriți să efectuați această acțiune?';
            if (!confirm(message)) {
                e.preventDefault();
            }
        });
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // Session Timeout Warning
    // ═══════════════════════════════════════════════════════════════════════════
    let sessionTimeout;
    let warningTimeout;
    const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
    const WARNING_BEFORE = 5 * 60 * 1000; // 5 minutes before

    function resetSessionTimer() {
        clearTimeout(sessionTimeout);
        clearTimeout(warningTimeout);

        // Warning before session expires
        warningTimeout = setTimeout(() => {
            showSessionWarning();
        }, SESSION_DURATION - WARNING_BEFORE);

        // Actual timeout
        sessionTimeout = setTimeout(() => {
            window.location.href = 'logout.php?timeout=1';
        }, SESSION_DURATION);
    }

    function showSessionWarning() {
        const existing = document.getElementById('sessionWarning');
        if (existing) return;

        const warning = document.createElement('div');
        warning.id = 'sessionWarning';
        warning.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 12px;
                padding: 16px 20px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                z-index: 9999;
                max-width: 350px;
            ">
                <div style="display: flex; align-items: start; gap: 12px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <div>
                        <strong style="color: #92400e;">Sesiune aproape expirată</strong>
                        <p style="color: #a16207; margin: 4px 0 12px; font-size: 14px;">
                            Sesiunea va expira în curând din cauza inactivității.
                        </p>
                        <button onclick="this.closest('#sessionWarning').remove(); resetSessionTimer();" style="
                            background: #f59e0b;
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 500;
                        ">Prelungește sesiunea</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(warning);
    }

    // Reset timer on user activity
    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetSessionTimer, { passive: true });
    });

    resetSessionTimer();

    // ═══════════════════════════════════════════════════════════════════════════
    // Character Counter for Text Fields
    // ═══════════════════════════════════════════════════════════════════════════
    document.querySelectorAll('input[maxlength], textarea[maxlength]').forEach(input => {
        const maxLength = input.getAttribute('maxlength');
        if (!maxLength) return;

        // Create counter element
        const counter = document.createElement('span');
        counter.className = 'char-counter';
        counter.style.cssText = 'font-size: 12px; color: #6b7280; float: right; margin-top: 4px;';

        const updateCounter = () => {
            const remaining = maxLength - input.value.length;
            counter.textContent = `${input.value.length}/${maxLength}`;
            counter.style.color = remaining < 20 ? '#dc2626' : '#6b7280';
        };

        input.addEventListener('input', updateCounter);
        input.parentNode.appendChild(counter);
        updateCounter();
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format file size in human-readable format
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 14px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#0284c7'};
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add keyframes for toast animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
