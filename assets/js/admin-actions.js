/**
 * Unified Admin Actions Module
 * Provides consistent action buttons and modals for Suppliers and Stations
 */

// Status badge mapping
const STATUS_BADGES = {
    'active': { class: 'active', label: 'ACTIVE' },
    'suspended': { class: 'suspended', label: 'SUSPENDED' },
    'pending': { class: 'pending', label: 'PENDING' },
    'denied': { class: 'denied', label: 'DENIED' }
};

/**
 * Format status badge HTML
 * Uses unified admin-badge classes while maintaining backward compatibility
 */
function formatStatusBadge(status) {
    const badge = STATUS_BADGES[status] || { class: 'pending', label: status || 'UNKNOWN' };
    // Use new unified classes, but keep old class for backward compatibility
    return `<span class="admin-badge admin-badge-status-${badge.class} status-badge ${badge.class}">${badge.label}</span>`;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    if (!dateString || dateString === 'N/A') return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
}

/**
 * Show edit warning modal for user-created accounts
 * Returns Promise that resolves to true if user confirms, false if cancelled
 * Supports onContinue callback for direct action execution
 */
function showEditWarningModal(onContinue) {
    return showWarningModal({
        title: 'Warning: Editing External Account',
        message: 'This account was created by the user. Editing details may override user-provided information. Do you want to proceed?',
        confirmText: 'Yes, Continue',
        cancelText: 'Cancel',
        onContinue: onContinue || null
    });
}

/**
 * Open edit modal for external account (suppliers/stations)
 * This is the main entry point called from Edit buttons
 */
async function openEditExternalAccountModal(entityType, entityId) {
    // Get entity info to check created_by
    try {
        const endpoint = entityType === 'supplier' 
            ? `/wsms/api/admin/suppliers.php`
            : `/wsms/api/admin/stations.php?action=list`;
        
        const res = await fetch(endpoint, {
            credentials: 'include'
        });
        const data = await res.json();
        
        let entity = null;
        if (entityType === 'supplier') {
            entity = data.suppliers?.find(s => s.id == entityId);
        } else {
            entity = data.stations?.find(s => s.id == entityId);
        }
        
        const createdBy = entity?.created_by || 'superadmin';
        
        // Show warning if user-created, then redirect to edit page
        await editEntity(entityType, entityId, createdBy, () => {
            // This callback is called after warning is confirmed (or if no warning needed)
            // Redirect to edit page
            if (entityType === 'supplier') {
                window.location.href = `supplier-edit.html?id=${entityId}`;
            } else {
                window.location.href = `station-edit.html?id=${entityId}`;
            }
        });
    } catch (e) {
        console.error('Failed to load entity info:', e);
        alert('Failed to load account information');
    }
}

/**
 * Log admin action to audit_logs
 */
async function logAdminAction(actionType, entityType, entityId, oldValue, newValue) {
    try {
        await fetch('/wsms/api/admin/log-action.php', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action_type: actionType,
                entity_type: entityType,
                entity_id: entityId,
                old_value: oldValue,
                new_value: newValue
            })
        }).catch(() => {}); // Ignore errors - logging is non-critical
    } catch (e) {
        console.error('Failed to log action:', e);
    }
}

/**
 * View action - always allowed
 */
function viewEntity(entityType, entityId) {
    // Log view action
    logAdminAction('view', entityType, entityId, null, null);
    
    if (entityType === 'supplier') {
        window.location.href = `supplier-view.html?id=${entityId}`;
    } else if (entityType === 'station') {
        window.location.href = `station-view.html?id=${entityId}`;
    }
}

/**
 * Edit action - with warning for user-created accounts
 */
async function editEntity(entityType, entityId, createdBy, onConfirm) {
    // Log view (edit page view)
    logAdminAction('view_edit', entityType, entityId, null, null);
    
    // If created by user, show warning with onContinue callback
    if (createdBy === 'user') {
        const confirmed = await showEditWarningModal(() => {
            // This callback executes when user clicks "Yes, Continue"
            // Log override confirmation
            logAdminAction('override_edit_warning', entityType, entityId, null, 'confirmed');
            // Execute the redirect callback
            if (onConfirm) {
                onConfirm();
            }
        });
        // If user cancelled, don't proceed
        if (!confirmed) {
            return;
        }
    } else {
        // No warning needed, proceed directly
        if (onConfirm) {
            onConfirm();
        }
    }
}

/**
 * Show edit external account modal (shared for suppliers and stations)
 */
function showEditExternalAccountModal(config) {
    return showWarningModal({
        title: config.title || 'Warning: Editing External Account',
        message: config.message || 'This account was created by the user. Editing details may override user-provided information. Do you want to proceed?',
        confirmText: config.confirmText || 'Yes, Continue',
        cancelText: config.cancelText || 'Cancel'
    });
}

/**
 * Toggle status (Suspend/Activate)
 */
async function toggleStatus(entityType, entityId, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const action = newStatus === 'suspended' ? 'suspend' : 'activate';
    const confirmMsg = newStatus === 'suspended' 
        ? 'Are you sure you want to suspend this account? They will only be able to view data.'
        : 'Are you sure you want to activate this account? They will have full access.';
    
    if (!confirm(confirmMsg)) {
        return;
    }
    
    try {
        const endpoint = entityType === 'supplier' 
            ? '/wsms/api/admin/admin_toggle_supplier_status.php'
            : '/wsms/api/admin/admin_toggle_station_status.php';
        
        const res = await fetch(endpoint, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: entityId, status: newStatus })
        });
        
        const data = await res.json();
        if (data.success) {
            // Log action
            await logAdminAction(action, entityType, entityId, currentStatus, newStatus);
            
            // Reload page data
            if (typeof reloadData === 'function') {
                reloadData();
            } else {
                window.location.reload();
            }
        } else {
            alert(data.error || `Failed to ${action} account`);
        }
    } catch (e) {
        console.error(`${action} failed:`, e);
        alert(`Failed to ${action} account`);
    }
}

/**
 * Generate action buttons HTML
 * Uses unified admin-btn classes while maintaining backward compatibility
 */
function generateActionButtons(entityType, entityId, createdBy, currentStatus) {
    // Use new unified classes, but keep old classes for backward compatibility
    const viewBtn = `<button class="admin-btn admin-btn-view btn btn-small btn-view" onclick="viewEntity('${entityType}', ${entityId})" title="View">View</button>`;
    
    const editBtn = `<button class="admin-btn admin-btn-edit btn btn-small btn-edit" onclick="openEditExternalAccountModal('${entityType}', ${entityId})" title="Edit">Edit</button>`;
    
    const statusBtn = currentStatus === 'active'
        ? `<button class="admin-btn admin-btn-suspend btn btn-small btn-suspend" onclick="toggleStatus('${entityType}', ${entityId}, '${currentStatus}')" title="Suspend">Suspend</button>`
        : `<button class="admin-btn admin-btn-activate btn btn-small btn-activate" onclick="toggleStatus('${entityType}', ${entityId}, '${currentStatus}')" title="Activate">Activate</button>`;
    
    return `
        <div style="display: flex; gap: 5px; flex-wrap: wrap;">
            ${viewBtn}
            ${editBtn}
            ${statusBtn}
        </div>
    `;
}

// Note: Modal closing is handled by unified-modal.js

