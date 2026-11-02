/**
 * Unified Modal Component for WSMS Admin Panel
 * Provides consistent modal dialogs across all admin pages
 */

class UnifiedModal {
    constructor(id, options = {}) {
        this.id = id;
        this.options = {
            maxWidth: options.maxWidth || '480px',
            showCloseBtn: options.showCloseBtn !== false,
            closeOnBackdrop: options.closeOnBackdrop !== false,
            closeOnEsc: options.closeOnEsc !== false,
            ...options
        };
        this.modal = null;
        this.onCloseCallback = null;
        this.onConfirmCallback = null;
        this.init();
    }

    init() {
        // Create modal if it doesn't exist
        let existing = document.getElementById(this.id);
        if (existing) {
            this.modal = existing;
        } else {
            this.modal = document.createElement('div');
            this.modal.id = this.id;
            this.modal.className = 'modal';
            document.body.appendChild(this.modal);
        }

        // Set up event listeners
        if (this.options.closeOnEsc) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen()) {
                    this.close();
                }
            });
        }

        if (this.options.closeOnBackdrop) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
        }
    }

    /**
     * Show modal with content
     * @param {Object} config - Modal configuration
     * @param {string} config.title - Modal title
     * @param {string} config.message - Modal message
     * @param {string} config.icon - Icon type: 'warning', 'info', 'success', or null
     * @param {Array} config.buttons - Array of button configs: [{text, class, onClick}]
     * @param {Function} config.onClose - Callback when modal closes
     */
    show(config) {
        if (!this.modal) this.init();

        const {
            title = '',
            message = '',
            icon = null,
            buttons = [],
            onClose = null,
            customContent = null
        } = config;

        this.onCloseCallback = onClose;

        // Build buttons HTML
        let buttonsHTML = '';
        if (buttons.length > 0) {
            buttonsHTML = buttons.map(btn => {
                const btnClass = btn.class || 'btn';
                const btnStyle = btn.style || '';
                return `
                    <button class="${btnClass}" onclick="window.unifiedModal_${this.id}_handleClick('${btn.id || ''}')" style="${btnStyle}">
                        ${btn.text}
                    </button>
                `;
            }).join('');
        }

        // Build modal HTML with improved layout
        const closeBtnHTML = this.options.showCloseBtn 
            ? `<span class="close-btn" onclick="window.unifiedModal_${this.id}_close()">&times;</span>`
            : '';

        // Title with icon aligned horizontally
        const titleHTML = icon 
            ? `<div class="modal-title-wrapper"><div class="modal-icon ${icon}">${this.getIconSVG(icon)}</div><h3>${title}</h3></div>`
            : `<h3>${title}</h3>`;

        // Message with proper spacing
        const messageHTML = message 
            ? (icon 
                ? `<div class="modal-icon-wrapper"><div class="modal-icon ${icon}">${this.getIconSVG(icon)}</div><p class="modal-message">${message}</p></div>`
                : `<p class="modal-message">${message}</p>`)
            : '';

        this.modal.innerHTML = `
            <div class="modal-content" style="max-width: ${this.options.maxWidth};">
                <div class="modal-header">
                    ${titleHTML}
                    ${closeBtnHTML}
                </div>
                <div class="modal-body">
                    ${customContent || messageHTML}
                </div>
                ${buttons.length > 0 ? `<div class="modal-footer">${buttonsHTML}</div>` : ''}
            </div>
        `;

        // Store button handlers
        this.buttonHandlers = {};
        buttons.forEach(btn => {
            if (btn.id && btn.onClick) {
                this.buttonHandlers[btn.id] = btn.onClick;
            }
        });

        // Set up global handlers
        window[`unifiedModal_${this.id}_close`] = () => this.close();
        window[`unifiedModal_${this.id}_handleClick`] = (btnId) => {
            if (this.buttonHandlers[btnId]) {
                this.buttonHandlers[btnId]();
            }
        };

        // Show modal
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close modal
     */
    close() {
        if (this.modal) {
            this.modal.classList.remove('show');
            document.body.style.overflow = '';
            if (this.onCloseCallback) {
                this.onCloseCallback();
            }
        }
    }

    /**
     * Check if modal is open
     */
    isOpen() {
        return this.modal && this.modal.classList.contains('show');
    }

    /**
     * Get icon SVG based on type
     */
    getIconSVG(type) {
        const icons = {
            warning: `<svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>`,
            info: `<svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>`,
            success: `<svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>`
        };
        return icons[type] || '';
    }
}

// Global modal instances
const modalInstances = {};

/**
 * Open a unified modal
 * @param {string} id - Modal ID
 * @param {Object} config - Modal configuration
 */
function openModal(id, config) {
    if (!modalInstances[id]) {
        modalInstances[id] = new UnifiedModal(id);
    }
    modalInstances[id].show(config);
}

/**
 * Close a unified modal
 * @param {string} id - Modal ID
 */
function closeModal(id) {
    if (modalInstances[id]) {
        modalInstances[id].close();
    }
}

/**
 * Show confirmation modal (returns Promise)
 */
function showConfirmModal(config) {
    return new Promise((resolve) => {
        const modalId = 'confirmModal_' + Date.now();
        openModal(modalId, {
            title: config.title || 'Confirm',
            message: config.message || 'Are you sure?',
            icon: config.icon || 'info',
            buttons: [
                {
                    id: 'confirm',
                    text: config.confirmText || 'Yes, Continue',
                    class: 'btn btn-primary',
                    onClick: () => {
                        closeModal(modalId);
                        resolve(true);
                    }
                },
                {
                    id: 'cancel',
                    text: config.cancelText || 'Cancel',
                    class: 'btn',
                    onClick: () => {
                        closeModal(modalId);
                        resolve(false);
                    }
                }
            ],
            onClose: () => resolve(false)
        });
    });
}

/**
 * Show warning modal (returns Promise)
 * Supports onContinue callback for direct action execution
 */
function showWarningModal(config) {
    return new Promise((resolve) => {
        const modalId = 'warningModal_' + Date.now();
        const onContinue = config.onContinue || null;
        
        openModal(modalId, {
            title: config.title || 'Warning',
            message: config.message || '',
            icon: 'warning',
            buttons: [
                {
                    id: 'confirm',
                    text: config.confirmText || 'Yes, Continue',
                    class: 'btn btn-primary',
                    onClick: () => {
                        closeModal(modalId);
                        if (onContinue) {
                            onContinue();
                        }
                        resolve(true);
                    }
                },
                {
                    id: 'cancel',
                    text: config.cancelText || 'Cancel',
                    class: 'btn',
                    onClick: () => {
                        closeModal(modalId);
                        resolve(false);
                    }
                }
            ],
            onClose: () => resolve(false)
        });
    });
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.UnifiedModal = UnifiedModal;
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.showConfirmModal = showConfirmModal;
    window.showWarningModal = showWarningModal;
}

