// API Helper Functions for WSMS Backend
// This replaces localStorage operations with API calls

function getApiBase() {
    return '/wsms/api/';
}

const API_BASE = getApiBase();

// API Request function - builds URLs in format: /wsms/api/${endpoint}?action=${action}
async function apiRequest(endpoint, action, data = {}) {
    // Build URL: /wsms/api/${endpoint}?action=${action}
    const url = API_BASE + `${endpoint}?action=${action}`;
    
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include' // Include cookies for session - CRITICAL for PHP sessions
    };
    
    // If data is provided and not empty, use POST method
    if (data && Object.keys(data).length > 0) {
        options.method = 'POST';
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        
        // Get response text first to handle empty or invalid JSON
        const text = await response.text();
        
        // Check if response is empty
        if (!text || text.trim().length === 0) {
            console.error('Empty response received from:', url);
            throw new Error('Server returned an empty response. Please try again.');
        }
        
        // Check if response is actually JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('Non-JSON response received:', text.substring(0, 200));
            // Try to extract error message from HTML if possible
            const htmlMatch = text.match(/<title[^>]*>([^<]+)<\/title>/i) || text.match(/<h1[^>]*>([^<]+)<\/h1>/i);
            const errorMsg = htmlMatch ? htmlMatch[1] : 'Server returned HTML instead of JSON. This usually means a PHP error occurred.';
            throw new Error(errorMsg);
        }
        
        // Try to parse JSON
        let result;
        try {
            result = JSON.parse(text);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Response text:', text.substring(0, 500));
            throw new Error('Server returned invalid JSON. Please try again.');
        }
        
        // Ensure result has success field
        if (typeof result !== 'object' || result === null) {
            throw new Error('Invalid response format from server');
        }
        
        if (!response.ok) {
            // Handle 401 Unauthorized - session expired or invalid
            if (response.status === 401) {
                // Clear UI-related localStorage (not session data - PHP handles sessions via cookies)
                // Only clear user display data, not authentication data
                localStorage.removeItem('userName');
                localStorage.removeItem('userImage');
                localStorage.removeItem('userDP');
                // Legacy cleanup - remove old session storage keys
                localStorage.removeItem('crm_session');
                localStorage.removeItem('user_id');
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userRole');
                // Redirect to login
                const currentPath = window.location.pathname;
                console.log('[API] 401 Unauthorized, redirecting from:', currentPath);
                
                // Log the redirect
                try {
                  fetch('/wsms/api/log-frontend.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      type: 'API_401_REDIRECT',
                      message: 'Redirecting to login due to 401',
                      from: currentPath,
                      to: '/wsms/index.html',
                      endpoint: endpoint,
                      action: action
                    })
                  }).catch(() => {});
                } catch (e) {}
                
                // Always use absolute path for redirect
                const isDevEnv = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.port === '3000' || true;
                if (!isDevEnv) { window.location.replace('../index.html'); }
                throw new Error('Unauthorized. Please login again.');
            }
            const errorMsg = result.error || result.message || 'API request failed';
            throw new Error(errorMsg);
        }
        
        return result;
    } catch (error) {
        console.error('API Request Error:', error);
        // Re-throw with better error message if it's a network error
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error. Please check your connection and try again.');
        }
        throw error;
    }
}

// Generic API call function
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include' // Include cookies for session - CRITICAL for PHP sessions
    };
    
    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }
    
    try {
        const url = method === 'GET' && data 
            ? API_BASE + endpoint + '?' + new URLSearchParams(data).toString()
            : API_BASE + endpoint;
            
        const response = await fetch(url, options);
        
        // Get response text first to handle empty or invalid JSON
        const text = await response.text();
        
        // Check if response is empty
        if (!text || text.trim().length === 0) {
            console.error('Empty response received from:', url);
            throw new Error('Server returned an empty response. Please try again.');
        }
        
        // Check if response is actually JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('Non-JSON response received:', text.substring(0, 200));
            // Try to extract error message from HTML if possible
            const htmlMatch = text.match(/<title[^>]*>([^<]+)<\/title>/i) || text.match(/<h1[^>]*>([^<]+)<\/h1>/i);
            const errorMsg = htmlMatch ? htmlMatch[1] : 'Server returned HTML instead of JSON. This usually means a PHP error occurred.';
            throw new Error(errorMsg);
        }
        
        // Try to parse JSON
        let result;
        try {
            result = JSON.parse(text);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Response text:', text.substring(0, 500));
            throw new Error('Server returned invalid JSON. Please try again.');
        }
        
        // Ensure result has success field
        if (typeof result !== 'object' || result === null) {
            throw new Error('Invalid response format from server');
        }
        
        if (!response.ok) {
            // Handle 401 Unauthorized - session expired or invalid
            if (response.status === 401) {
                // Clear UI-related localStorage (not session data - PHP handles sessions via cookies)
                // Only clear user display data, not authentication data
                localStorage.removeItem('userName');
                localStorage.removeItem('userImage');
                localStorage.removeItem('userDP');
                // Legacy cleanup - remove old session storage keys
                localStorage.removeItem('crm_session');
                localStorage.removeItem('user_id');
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userRole');
                // Redirect to login
                const currentPath = window.location.pathname;
                console.log('[API] 401 Unauthorized, redirecting from:', currentPath);
                
                // Log the redirect
                try {
                  fetch('/wsms/api/log-frontend.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      type: 'API_401_REDIRECT',
                      message: 'Redirecting to login due to 401',
                      from: currentPath,
                      to: '/wsms/index.html',
                      endpoint: endpoint,
                      action: action
                    })
                  }).catch(() => {});
                } catch (e) {}
                
                // Always use absolute path for redirect
                const isDevEnv = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.port === '3000' || true;
                if (!isDevEnv) { window.location.replace('../index.html'); }
                throw new Error('Unauthorized. Please login again.');
            }
            const errorMsg = result.error || result.message || 'API request failed';
            throw new Error(errorMsg);
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        // Re-throw with better error message if it's a network error
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error. Please check your connection and try again.');
        }
        throw error;
    }
}

// ==================== AUTHENTICATION ====================

async function apiLogin(username, password) {
    return apiCall('auth.php', 'POST', { action: 'login', username, password });
}

async function apiSignup(userData) {
    return apiCall('auth.php', 'POST', { action: 'signup', ...userData });
}

async function apiLogout() {
    return apiCall('auth.php', 'POST', { action: 'logout' });
}

async function apiCheckAuth() {
    return apiCall('auth.php?check=1', 'GET');
}

// ==================== CUSTOMERS ====================

async function apiGetCustomers() {
    return apiCall('customers.php?action=list', 'GET');
}

async function apiGetCustomer(id) {
    return apiCall(`customers.php?action=view&id=${id}`, 'GET');
}

async function apiGetCustomerProfile(id) {
    return apiCall(`customers.php?action=profile&id=${id}`, 'GET');
}

async function apiSaveCustomer(customer) {
    return apiCall('customers.php?action=create', 'POST', customer);
}

async function apiUpdateCustomer(id, customer) {
    return apiCall('customers.php?action=update', 'POST', { id, ...customer });
}

async function apiDeleteCustomer(id) {
    return apiCall(`customers.php?action=delete&id=${id}`, 'POST');
}

// ==================== DELIVERIES ====================

async function apiGetDeliveries(customerId = null) {
    const endpoint = customerId 
        ? `deliveries.php?action=list&customer_id=${customerId}`
        : 'deliveries.php?action=list';
    return apiCall(endpoint, 'GET');
}

async function apiGetDelivery(id) {
    return apiCall(`deliveries.php?action=view&id=${id}`, 'GET');
}

async function apiSaveDelivery(delivery) {
    return apiCall('deliveries.php?action=create', 'POST', delivery);
}

async function apiUpdateDelivery(id, delivery) {
    return apiCall('deliveries.php?action=update', 'POST', { id, ...delivery });
}

async function apiDeleteDelivery(id) {
    return apiCall(`deliveries.php?action=delete&id=${id}`, 'POST');
}

// ==================== EXPENSES ====================

async function apiGetExpenses(stationId = null) {
    const endpoint = stationId 
        ? `expenses.php?action=list&station_id=${stationId}`
        : 'expenses.php?action=list';
    return apiCall(endpoint, 'GET');
}

async function apiGetExpense(id) {
    return apiCall(`expenses.php?action=view&id=${id}`, 'GET');
}

async function apiSaveExpense(expense) {
    return apiCall('expenses.php?action=create', 'POST', expense);
}

async function apiUpdateExpense(id, expense) {
    return apiCall('expenses.php?action=update', 'POST', { id, ...expense });
}

async function apiDeleteExpense(id) {
    return apiCall(`expenses.php?action=delete&id=${id}`, 'POST');
}

// ==================== STATIONS ====================

async function apiGetStations() {
    return apiCall('stations.php?action=list', 'GET');
}

async function apiGetStation(id) {
    return apiCall(`stations.php?action=view&id=${id}`, 'GET');
}

async function apiSaveStation(station) {
    return apiCall('stations.php?action=create', 'POST', station);
}

async function apiUpdateStation(id, station) {
    return apiCall('stations.php?action=update', 'POST', { id, ...station });
}

async function apiDeleteStation(id) {
    return apiCall(`stations.php?action=delete&id=${id}`, 'POST');
}

// ==================== STATION PROFILES ====================

async function apiGetStationProfiles() {
    return apiCall('stations.php?action=list_station_profiles', 'GET');
}

// ==================== STATION REQUESTS ====================

async function apiCreateStationRequest(name, area) {
    return apiCall('station-requests.php?action=create_request', 'POST', { name, area });
}

async function apiListStationRequests(status = '') {
    const endpoint = status 
        ? `station-requests.php?action=list_requests&status=${status}`
        : 'station-requests.php?action=list_requests';
    return apiCall(endpoint, 'GET');
}

async function apiApproveStationRequest(requestId) {
    return apiCall('station-requests.php?action=approve_request', 'POST', { request_id: requestId });
}

async function apiRejectStationRequest(requestId) {
    return apiCall('station-requests.php?action=reject_request', 'POST', { request_id: requestId });
}

// ==================== INVENTORY ====================

async function apiGetInventory() {
    return apiRequest('inventory-ledger.php', 'list', {});
}

async function apiGetInventoryEntry(id) {
    return apiCall(`inventory-ledger.php?action=view&id=${id}`, 'GET');
}

async function apiSaveInventoryEntry(entry) {
    return apiCall('inventory-ledger.php?action=create', 'POST', entry);
}

async function apiUpdateInventoryEntry(id, entry) {
    return apiCall('inventory-ledger.php?action=update', 'POST', { id, ...entry });
}

async function apiDeleteInventoryEntry(id) {
    return apiCall(`inventory-ledger.php?action=delete&id=${id}`, 'POST');
}

function apiResetInventoryItem(item) {
    return apiCall('inventory.php?action=resetItem', 'POST', { item });
}

// ==================== PAYMENTS ====================

async function apiGetPayments(customerId = null) {
    const endpoint = customerId 
        ? `payments.php?action=list&customer_id=${customerId}`
        : 'payments.php?action=list';
    return apiCall(endpoint, 'GET');
}

async function apiGetPayment(id) {
    return apiCall(`payments.php?action=view&id=${id}`, 'GET');
}

async function apiSavePayment(payment) {
    return apiCall('payments.php?action=create', 'POST', payment);
}

async function apiUpdatePayment(id, payment) {
    return apiCall('payments.php?action=update', 'POST', { id, ...payment });
}

async function apiDeletePayment(id) {
    return apiCall(`payments.php?action=delete&id=${id}`, 'POST');
}

// ==================== DASHBOARD ====================

async function apiGetDashboardData(range = 'weekly') {
    const url = range ? `dashboard.php?range=${range}` : 'dashboard.php';
    return apiCall(url, 'GET');
}

// ==================== UTILITY FUNCTIONS ====================

// Helper to check if we should use API or localStorage
function useAPI() {
    // Check if API is available
    return typeof fetch !== 'undefined' && window.location.protocol !== 'file:';
}

// Fallback to localStorage if API fails
async function safeApiCall(endpoint, method, data, fallbackKey) {
    if (!useAPI()) {
        // Use localStorage fallback
        if (method === 'GET') {
            return JSON.parse(localStorage.getItem(fallbackKey) || '[]');
        } else {
            const existing = JSON.parse(localStorage.getItem(fallbackKey) || '[]');
            if (method === 'POST') {
                existing.push(data);
            } else if (method === 'DELETE') {
                const index = existing.findIndex(item => item.id === data.id);
                if (index >= 0) existing.splice(index, 1);
            }
            localStorage.setItem(fallbackKey, JSON.stringify(existing));
            return { success: true };
        }
    }
    
    try {
        return await apiCall(endpoint, method, data);
    } catch (error) {
        console.warn('API call failed, using localStorage fallback:', error);
        // Fallback to localStorage
        if (method === 'GET') {
            return JSON.parse(localStorage.getItem(fallbackKey) || '[]');
        }
        throw error;
    }
}

