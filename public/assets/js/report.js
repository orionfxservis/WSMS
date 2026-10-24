/**
 * WSMS Reports Module
 * Handles data fetching, chart rendering, and PDF export for all report sections
 */

// Global chart instances
const chartInstances = {};

// Initialize all report sections
async function initReports() {
    // Set default date ranges (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const defaultFrom = thirtyDaysAgo.toISOString().split('T')[0];
    const defaultTo = today.toISOString().split('T')[0];
    
    // Set default dates for all sections
    document.querySelectorAll('.date-from').forEach(input => {
        if (!input.value) input.value = defaultFrom;
    });
    document.querySelectorAll('.date-to').forEach(input => {
        if (!input.value) input.value = defaultTo;
    });
    
    // Load all reports
    await Promise.all([
        loadDeliveriesReport(),
        loadFillingReport(),
        loadExpensesReport(),
        loadInventoryReport(),
        loadCustomerSummaryReport(),
        loadFinancialSummaryReport(),
        loadStationFillingReport(),
        loadPeriodSummaryReport()
    ]);
}


// ==================== FALLBACK MOCK DATASET ====================
function getFallbackReportData(action, dateFrom, dateTo) {
    const dates = [];
    const now = new Date();
    const start = dateFrom ? new Date(dateFrom) : new Date(now.getTime() - 14 * 86400000);
    const end = dateTo ? new Date(dateTo) : new Date();
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(d.toISOString().split('T')[0]);
    }
    if (dates.length === 0) {
        dates.push(now.toISOString().split('T')[0]);
    }

    if (action === 'deliveries') {
        const customers = [
            'Al-Madina Hotel', 'Sunrise Apartments', 'City General Hospital',
            'Blue Lagoon Cafe', 'Green Valley Residency', 'Apex Corporate Hub',
            'Ocean Pearl Suites', 'Metro Fitness Club'
        ];
        const canSizes = ['19 Litres', '19 Litres', '10 Litres', '19 Litres'];
        const paymentModes = ['Cash', 'Credit', 'Online', 'Cash'];
        const sampleData = [];
        let totDelivered = 0, totReceived = 0, totRev = 0;

        dates.slice(-12).forEach((dStr, idx) => {
            const cust = customers[idx % customers.length];
            const size = canSizes[idx % canSizes.length];
            const del = 25 + ((idx * 8) % 40);
            const rec = del - ((idx % 3 === 0) ? 2 : 0);
            const rate = size.includes('19') ? 80 : 50;
            const amount = del * rate;
            const mode = paymentModes[idx % paymentModes.length];

            totDelivered += del;
            totReceived += rec;
            totRev += amount;

            sampleData.push({
                date: dStr,
                customer_name: cust,
                can_size: size,
                delivered: del,
                received: rec,
                total: amount,
                payment_mode: mode
            });
        });

        const customer_data = {};
        sampleData.forEach(item => {
            customer_data[item.customer_name] = (customer_data[item.customer_name] || 0) + item.total;
        });

        const daily_revenue = {};
        dates.slice(-12).forEach(dStr => {
            const daySum = sampleData.filter(x => x.date === dStr).reduce((s, x) => s + x.total, 0);
            daily_revenue[dStr] = daySum || Math.floor(3200 + ((dStr.charCodeAt(dStr.length - 1) * 350) % 4000));
        });

        return {
            success: true,
            totals: {
                total_revenue: totRev,
                total_delivered: totDelivered,
                total_received: totReceived,
                total_balance: totDelivered - totReceived,
                total_entries: sampleData.length
            },
            data: sampleData,
            charts: { customer_data, daily_revenue }
        };
    }

    if (action === 'filling') {
        const stations = ['Main Plant RO-01', 'North Station Hub #2', 'Eastern Filter Station', 'South Canal RO Plant'];
        const sampleData = [];
        let totCost = 0;

        dates.slice(-12).forEach((dStr, idx) => {
            const st = stations[idx % stations.length];
            const amount = 3200 + ((idx * 650) % 3800);
            totCost += amount;
            sampleData.push({
                date: dStr,
                station_id: st,
                amount: amount,
                payment_type: idx % 2 === 0 ? 'Cash' : 'Bank Transfer',
                note: `Bulk RO Recharge 6000L (Batch ${String.fromCharCode(65 + (idx % 4))})`
            });
        });

        const daily_cost = {};
        const station_cost = {};
        sampleData.forEach(item => {
            daily_cost[item.date] = (daily_cost[item.date] || 0) + item.amount;
            station_cost[item.station_id] = (station_cost[item.station_id] || 0) + item.amount;
        });

        return {
            success: true,
            totals: {
                total_cost: totCost,
                total_entries: sampleData.length,
                average_cost: sampleData.length ? Math.round(totCost / sampleData.length) : 0
            },
            data: sampleData,
            charts: { daily_cost, station_cost }
        };
    }

    if (action === 'expenses') {
        const types = ['Fuel / Diesel', 'Plant Maintenance', 'Filter Replacements', 'Staff Wages', 'Electricity', 'Office Supplies'];
        const sampleData = [];
        let totExpenses = 0;

        dates.slice(-12).forEach((dStr, idx) => {
            const type = types[idx % types.length];
            const amount = 1800 + ((idx * 720) % 4200);
            totExpenses += amount;
            sampleData.push({
                date: dStr,
                type: type,
                amount: amount,
                payment_type: idx % 2 === 0 ? 'Cash' : 'Online',
                note: `WSMS Operations - ${type}`
            });
        });

        const category_totals = {};
        const daily_expenses = {};
        sampleData.forEach(item => {
            category_totals[item.type] = (category_totals[item.type] || 0) + item.amount;
            daily_expenses[item.date] = (daily_expenses[item.date] || 0) + item.amount;
        });

        return {
            success: true,
            totals: {
                total_expenses: totExpenses,
                total_entries: sampleData.length
            },
            data: sampleData,
            charts: { category_totals, daily_expenses }
        };
    }

    if (action === 'inventory') {
        const items = ['19L Standard Bottle', '10L Slim Bottle', 'Bottle Caps (500 Pack)', 'Tamper Seals'];
        const sampleData = [];
        let pQty = 0, iQty = 0, rQty = 0, dQty = 0;

        dates.slice(-10).forEach((dStr, idx) => {
            const actions = ['in', 'out', 'in', 'out'];
            const action = actions[idx % actions.length];
            const type = action === 'in' ? (idx % 3 === 0 ? 'purchase' : 'delivery') : 'delivery';
            const item = items[idx % items.length];
            const qty = 35 + ((idx * 15) % 90);

            if (type === 'purchase') pQty += qty;
            else if (action === 'out') iQty += qty;
            else if (action === 'in') rQty += qty;

            if (idx === 3) dQty += 5;

            sampleData.push({
                date: dStr,
                type: type,
                action: action,
                item: item,
                qty: qty,
                unit_price: type === 'purchase' ? 190 : null,
                note: `${type.toUpperCase()} log - verified`
            });
        });

        const item_trends = {
            '19L Standard Bottle': {}
        };
        dates.slice(-10).forEach((dStr, idx) => {
            item_trends['19L Standard Bottle'][dStr] = {
                purchase: idx % 3 === 0 ? 50 : 0,
                issue: 30 + (idx * 6),
                return: 28 + (idx * 5),
                damaged: idx === 3 ? 2 : 0
            };
        });

        return {
            success: true,
            totals: {
                purchase_qty: pQty || 150,
                issue_qty: iQty || 420,
                return_qty: rQty || 390,
                damage_qty: dQty || 12,
                total_entries: sampleData.length
            },
            data: sampleData,
            charts: { item_trends }
        };
    }

    if (action === 'customer-summary') {
        const customers = [
            { customer_name: 'Al-Madina Hotel', revenue: 42500, pending_cans: 16, deliveries_count: 24 },
            { customer_name: 'City General Hospital', revenue: 32400, pending_cans: 20, deliveries_count: 21 },
            { customer_name: 'Sunrise Apartments', revenue: 26800, pending_cans: 14, deliveries_count: 18 },
            { customer_name: 'Blue Lagoon Cafe', revenue: 21200, pending_cans: 8, deliveries_count: 15 },
            { customer_name: 'Green Valley Residency', revenue: 18500, pending_cans: 9, deliveries_count: 13 },
            { customer_name: 'Apex Corporate Hub', revenue: 15800, pending_cans: 6, deliveries_count: 11 },
            { customer_name: 'Metro Fitness Club', revenue: 11400, pending_cans: 4, deliveries_count: 9 },
            { customer_name: 'Ocean Pearl Suites', revenue: 9600, pending_cans: 5, deliveries_count: 7 }
        ];

        const totRev = customers.reduce((s, c) => s + c.revenue, 0);
        const totPending = customers.reduce((s, c) => s + c.pending_cans, 0);

        return {
            success: true,
            totals: {
                total_revenue: totRev,
                total_pending_cans: totPending,
                total_customers: customers.length
            },
            data: customers
        };
    }

    if (action === 'financial-summary') {
        const daily_data = {};
        let totRev = 0, totExp = 0;
        dates.slice(-12).forEach((dStr, idx) => {
            const rev = 7800 + ((idx * 920) % 5200);
            const exp = 2800 + ((idx * 640) % 2600);
            const profit = rev - exp;
            totRev += rev;
            totExp += exp;
            daily_data[dStr] = { revenue: rev, expenses: exp, profit: profit };
        });

        const cash = Math.round(totRev * 0.74);
        const credit = totRev - cash;

        return {
            success: true,
            totals: {
                total_revenue: totRev,
                total_expenses: totExp,
                total_profit: totRev - totExp,
                cash_total: cash,
                credit_total: credit
            },
            charts: {
                daily_data,
                cash_credit: { Cash: cash, Credit: credit }
            }
        };
    }

    if (action === 'station-filling') {
        const station_cost = {
            'Main Plant RO-01': 36500,
            'North Station Hub #2': 28200,
            'Eastern Filter Station': 21400,
            'South Canal RO Plant': 16800
        };
        const station_fills = {
            'Main Plant RO-01': 26,
            'North Station Hub #2': 20,
            'Eastern Filter Station': 15,
            'South Canal RO Plant': 12
        };
        const totCost = Object.values(station_cost).reduce((a, b) => a + b, 0);
        const totFills = Object.values(station_fills).reduce((a, b) => a + b, 0);

        return {
            success: true,
            totals: {
                total_cost: totCost,
                total_fills: totFills
            },
            charts: { station_cost, station_fills }
        };
    }

    if (action === 'period-summary') {
        const daily_data = {};
        let totDel = 0, totRev = 0, totExp = 0;
        dates.slice(-12).forEach((dStr, idx) => {
            const del = 38 + ((idx * 7) % 32);
            const rev = del * 85;
            const exp = 1400 + ((idx * 450) % 2100);
            const profit = rev - exp;
            totDel += del;
            totRev += rev;
            totExp += exp;
            daily_data[dStr] = {
                deliveries: del,
                revenue: rev,
                expenses: exp,
                profit: profit
            };
        });

        return {
            success: true,
            totals: {
                total_deliveries: totDel,
                total_revenue: totRev,
                total_expenses: totExp,
                total_profit: totRev - totExp
            },
            charts: { daily_data }
        };
    }

    return { success: false, error: 'Unknown action' };
}

// ==================== DELIVERIES REPORT ====================
async function loadDeliveriesReport() {
    const dateFrom = document.getElementById('deliveries-from').value;
    const dateTo = document.getElementById('deliveries-to').value;
    
    try {
        const response = await apiCall(`report.php?action=deliveries&date_from=${dateFrom}&date_to=${dateTo}`, 'GET');
        
        if (response.success) {
            renderDeliveriesTotals(response.totals);
            renderDeliveriesTable(response.data);
            renderDeliveriesCharts(response.charts);
        } else {
            showError('deliveries-section', response.error || 'Failed to load deliveries report');
        }
    } catch (error) {
        console.error('Deliveries report error:', error);
        showError('deliveries-section', 'Failed to load deliveries report');
    }
}

function renderDeliveriesTotals(totals) {
    document.getElementById('deliveries-total-revenue').textContent = `Rs ${(totals.total_revenue || 0).toLocaleString()}`;
    document.getElementById('deliveries-total-delivered').textContent = totals.total_delivered || 0;
    document.getElementById('deliveries-total-received').textContent = totals.total_received || 0;
    document.getElementById('deliveries-total-balance').textContent = totals.total_balance || 0;
    document.getElementById('deliveries-total-entries').textContent = totals.total_entries || 0;
}

function renderDeliveriesTable(data) {
    const tbody = document.getElementById('deliveries-table-body');
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No data found</td></tr>';
        return;
    }
    
    let totalRevenue = 0;
    let totalDelivered = 0;
    let totalReceived = 0;
    
    data.forEach(d => {
        const revenue = parseFloat(d.total || 0);
        const delivered = parseInt(d.delivered || 0);
        const received = parseInt(d.received || 0);
        
        totalRevenue += revenue;
        totalDelivered += delivered;
        totalReceived += received;
        
        const date = new Date(d.date);
        const row = `
            <tr>
                <td>${date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                <td>${d.customer_name || d.customer_name || 'N/A'}</td>
                <td>${d.can_size || 'N/A'}</td>
                <td>${delivered}</td>
                <td>${received}</td>
                <td>Rs ${revenue.toLocaleString()}</td>
                <td>${d.payment_mode || 'Cash'}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    
    // Add totals row
    tbody.innerHTML += `
        <tr style="background:#f8f9fa;font-weight:bold;">
            <td colspan="3">TOTAL</td>
            <td>${totalDelivered}</td>
            <td>${totalReceived}</td>
            <td>Rs ${totalRevenue.toLocaleString()}</td>
            <td></td>
        </tr>
    `;
}

function renderDeliveriesCharts(charts) {
    // Customer bar chart
    const customerCtx = document.getElementById('deliveries-customer-chart').getContext('2d');
    if (chartInstances['deliveries-customer']) {
        chartInstances['deliveries-customer'].destroy();
    }
    
    const customerLabels = Object.keys(charts.customer_data || {});
    const customerValues = Object.values(charts.customer_data || {});
    
    chartInstances['deliveries-customer'] = new Chart(customerCtx, {
        type: 'bar',
        data: {
            labels: customerLabels,
            datasets: [{
                label: 'Revenue (Rs)',
                data: customerValues,
                backgroundColor: '#0077cc',
                borderColor: '#005fa3',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rs ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
    
    // Daily revenue line chart
    const dailyCtx = document.getElementById('deliveries-daily-chart').getContext('2d');
    if (chartInstances['deliveries-daily']) {
        chartInstances['deliveries-daily'].destroy();
    }
    
    const dailyLabels = Object.keys(charts.daily_revenue || {}).map(d => {
        const date = new Date(d);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    const dailyValues = Object.values(charts.daily_revenue || {});
    
    chartInstances['deliveries-daily'] = new Chart(dailyCtx, {
        type: 'line',
        data: {
            labels: dailyLabels,
            datasets: [{
                label: 'Daily Revenue (Rs)',
                data: dailyValues,
                borderColor: '#0077cc',
                backgroundColor: 'rgba(0, 119, 204, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rs ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// ==================== FILLING REPORT ====================
async function loadFillingReport() {
    const dateFrom = document.getElementById('filling-from').value;
    const dateTo = document.getElementById('filling-to').value;
    
    try {
        const response = await apiCall(`report.php?action=filling&date_from=${dateFrom}&date_to=${dateTo}`, 'GET');
        
        if (response.success) {
            renderFillingTotals(response.totals);
            renderFillingTable(response.data);
            renderFillingCharts(response.charts);
        } else {
            showError('filling-section', response.error || 'Failed to load filling report');
        }
    } catch (error) {
        console.error('Filling report error:', error);
        showError('filling-section', 'Failed to load filling report');
    }
}

function renderFillingTotals(totals) {
    document.getElementById('filling-total-cost').textContent = `Rs ${(totals.total_cost || 0).toLocaleString()}`;
    document.getElementById('filling-total-entries').textContent = totals.total_entries || 0;
    document.getElementById('filling-avg-cost').textContent = `Rs ${(totals.average_cost || 0).toFixed(2)}`;
}

function renderFillingTable(data) {
    const tbody = document.getElementById('filling-table-body');
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No data found</td></tr>';
        return;
    }
    
    let totalCost = 0;
    
    data.forEach(f => {
        const cost = parseFloat(f.amount || 0);
        totalCost += cost;
        
        const date = new Date(f.date);
        const row = `
            <tr>
                <td>${date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                <td>${f.station_id || 'N/A'}</td>
                <td>Rs ${cost.toLocaleString()}</td>
                <td>${f.payment_type || 'N/A'}</td>
                <td>${f.note || '-'}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    
    tbody.innerHTML += `
        <tr style="background:#f8f9fa;font-weight:bold;">
            <td colspan="2">TOTAL</td>
            <td>Rs ${totalCost.toLocaleString()}</td>
            <td colspan="2"></td>
        </tr>
    `;
}

function renderFillingCharts(charts) {
    // Daily cost line chart
    const dailyCtx = document.getElementById('filling-daily-chart').getContext('2d');
    if (chartInstances['filling-daily']) {
        chartInstances['filling-daily'].destroy();
    }
    
    const dailyLabels = Object.keys(charts.daily_cost || {}).map(d => {
        const date = new Date(d);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    const dailyValues = Object.values(charts.daily_cost || {});
    
    chartInstances['filling-daily'] = new Chart(dailyCtx, {
        type: 'line',
        data: {
            labels: dailyLabels,
            datasets: [{
                label: 'Filling Cost (Rs)',
                data: dailyValues,
                borderColor: '#0077cc',
                backgroundColor: 'rgba(0, 119, 204, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rs ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
    
    // Station pie chart
    const stationCtx = document.getElementById('filling-station-chart').getContext('2d');
    if (chartInstances['filling-station']) {
        chartInstances['filling-station'].destroy();
    }
    
    const stationLabels = Object.keys(charts.station_cost || {});
    const stationValues = Object.values(charts.station_cost || {});
    
    chartInstances['filling-station'] = new Chart(stationCtx, {
        type: 'pie',
        data: {
            labels: stationLabels,
            datasets: [{
                data: stationValues,
                backgroundColor: [
                    '#0077cc', '#005fa3', '#004080', '#002d5c', '#001a38',
                    '#00b894', '#00a085', '#008876', '#007067', '#005858'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'right' }
            }
        }
    });
}

// ==================== EXPENSES REPORT ====================
async function loadExpensesReport() {
    const dateFrom = document.getElementById('expenses-from').value;
    const dateTo = document.getElementById('expenses-to').value;
    
    try {
        const response = await apiCall(`report.php?action=expenses&date_from=${dateFrom}&date_to=${dateTo}`, 'GET');
        
        if (response.success) {
            renderExpensesTotals(response.totals);
            renderExpensesTable(response.data);
            renderExpensesCharts(response.charts);
        } else {
            showError('expenses-section', response.error || 'Failed to load expenses report');
        }
    } catch (error) {
        console.error('Expenses report error:', error);
        showError('expenses-section', 'Failed to load expenses report');
    }
}

function renderExpensesTotals(totals) {
    document.getElementById('expenses-total').textContent = `Rs ${(totals.total_expenses || 0).toLocaleString()}`;
    document.getElementById('expenses-total-entries').textContent = totals.total_entries || 0;
}

function renderExpensesTable(data) {
    const tbody = document.getElementById('expenses-table-body');
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No data found</td></tr>';
        return;
    }
    
    let totalAmount = 0;
    
    data.forEach(e => {
        const amount = parseFloat(e.amount || 0);
        totalAmount += amount;
        
        const date = new Date(e.date);
        const row = `
            <tr>
                <td>${date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                <td>${e.type || 'N/A'}</td>
                <td>Rs ${amount.toLocaleString()}</td>
                <td>${e.payment_type || 'N/A'}</td>
                <td>${e.note || '-'}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    
    tbody.innerHTML += `
        <tr style="background:#f8f9fa;font-weight:bold;">
            <td colspan="2">TOTAL</td>
            <td>Rs ${totalAmount.toLocaleString()}</td>
            <td colspan="2"></td>
        </tr>
    `;
}

function renderExpensesCharts(charts) {
    // Category pie chart
    const categoryCtx = document.getElementById('expenses-category-chart').getContext('2d');
    if (chartInstances['expenses-category']) {
        chartInstances['expenses-category'].destroy();
    }
    
    const categoryLabels = Object.keys(charts.category_totals || {});
    const categoryValues = Object.values(charts.category_totals || {});
    
    chartInstances['expenses-category'] = new Chart(categoryCtx, {
        type: 'pie',
        data: {
            labels: categoryLabels,
            datasets: [{
                data: categoryValues,
                backgroundColor: [
                    '#0077cc', '#005fa3', '#004080', '#002d5c', '#001a38',
                    '#00b894', '#00a085', '#008876', '#007067', '#005858'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'right' }
            }
        }
    });
    
    // Daily expense line chart
    const dailyCtx = document.getElementById('expenses-daily-chart').getContext('2d');
    if (chartInstances['expenses-daily']) {
        chartInstances['expenses-daily'].destroy();
    }
    
    const dailyLabels = Object.keys(charts.daily_expenses || {}).map(d => {
        const date = new Date(d);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    const dailyValues = Object.values(charts.daily_expenses || {});
    
    chartInstances['expenses-daily'] = new Chart(dailyCtx, {
        type: 'line',
        data: {
            labels: dailyLabels,
            datasets: [{
                label: 'Daily Expenses (Rs)',
                data: dailyValues,
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rs ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// ==================== INVENTORY MOVEMENT REPORT ====================
async function loadInventoryReport() {
    const dateFrom = document.getElementById('inventory-from').value;
    const dateTo = document.getElementById('inventory-to').value;
    
    try {
        const response = await apiCall(`report.php?action=inventory&date_from=${dateFrom}&date_to=${dateTo}`, 'GET');
        
        if (response.success) {
            renderInventoryTotals(response.totals);
            renderInventoryTable(response.data);
            renderInventoryCharts(response.charts);
        } else {
            showError('inventory-section', response.error || 'Failed to load inventory report');
        }
    } catch (error) {
        console.error('Inventory report error:', error);
        showError('inventory-section', 'Failed to load inventory report');
    }
}

function renderInventoryTotals(totals) {
    document.getElementById('inventory-purchase').textContent = totals.purchase_qty || 0;
    document.getElementById('inventory-issue').textContent = totals.issue_qty || 0;
    document.getElementById('inventory-return').textContent = totals.return_qty || 0;
    document.getElementById('inventory-damage').textContent = totals.damage_qty || 0;
    document.getElementById('inventory-total-entries').textContent = totals.total_entries || 0;
}

function renderInventoryTable(data) {
    const tbody = document.getElementById('inventory-table-body');
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No data found</td></tr>';
        return;
    }
    
    data.forEach(m => {
        const date = new Date(m.date);
        const actionDisplay = m.action === 'in' ? 'In' : (m.action === 'out' ? 'Out' : 'Damaged');
        const typeDisplay = m.type === 'purchase' ? 'Purchase' : (m.type === 'delivery' ? 'Delivery' : 'Adjustment');
        
        const row = `
            <tr>
                <td>${date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                <td>${typeDisplay}</td>
                <td>${actionDisplay}</td>
                <td>${m.item || 'N/A'}</td>
                <td>${m.qty || 0}</td>
                <td>${m.unit_price ? 'Rs ' + parseFloat(m.unit_price).toLocaleString() : '-'}</td>
                <td>${m.note || '-'}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function renderInventoryCharts(charts) {
    // Get first item for trend chart (or allow selection)
    const itemTrends = charts.item_trends || {};
    const firstItem = Object.keys(itemTrends)[0] || 'No Data';
    
    if (firstItem !== 'No Data') {
        const trendData = itemTrends[firstItem];
        const sortedDates = Object.keys(trendData).sort();
        const trendLabels = sortedDates.map(d => {
            const date = new Date(d);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        
        const purchaseData = sortedDates.map(d => trendData[d].purchase || 0);
        const issueData = sortedDates.map(d => trendData[d].issue || 0);
        const returnData = sortedDates.map(d => trendData[d].return || 0);
        const damageData = sortedDates.map(d => trendData[d].damaged || 0);
        
        // Stacked bar chart
        const stackedCtx = document.getElementById('inventory-stacked-chart').getContext('2d');
        if (chartInstances['inventory-stacked']) {
            chartInstances['inventory-stacked'].destroy();
        }
        
        chartInstances['inventory-stacked'] = new Chart(stackedCtx, {
            type: 'bar',
            data: {
                labels: trendLabels,
                datasets: [
                    {
                        label: 'Purchase',
                        data: purchaseData,
                        backgroundColor: '#00b894'
                    },
                    {
                        label: 'Issue',
                        data: issueData,
                        backgroundColor: '#e74c3c'
                    },
                    {
                        label: 'Return',
                        data: returnData,
                        backgroundColor: '#3498db'
                    },
                    {
                        label: 'Damage',
                        data: damageData,
                        backgroundColor: '#95a5a6'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top' }
                },
                scales: {
                    x: { stacked: true },
                    y: { stacked: true, beginAtZero: true }
                }
            }
        });
    } else {
        // Show empty chart
        const stackedCtx = document.getElementById('inventory-stacked-chart').getContext('2d');
        if (chartInstances['inventory-stacked']) {
            chartInstances['inventory-stacked'].destroy();
        }
        chartInstances['inventory-stacked'] = new Chart(stackedCtx, {
            type: 'bar',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

// ==================== CUSTOMER SUMMARY REPORT ====================
async function loadCustomerSummaryReport() {
    const dateFrom = document.getElementById('customer-from').value;
    const dateTo = document.getElementById('customer-to').value;
    
    try {
        const response = await apiCall(`report.php?action=customer-summary&date_from=${dateFrom}&date_to=${dateTo}`, 'GET');
        
        if (response.success) {
            renderCustomerSummaryTotals(response.totals);
            renderCustomerSummaryTable(response.data);
            renderCustomerSummaryCharts(response.data);
        } else {
            showError('customer-section', response.error || 'Failed to load customer summary');
        }
    } catch (error) {
        console.error('Customer summary error:', error);
        showError('customer-section', 'Failed to load customer summary');
    }
}

function renderCustomerSummaryTotals(totals) {
    document.getElementById('customer-total-revenue').textContent = `Rs ${(totals.total_revenue || 0).toLocaleString()}`;
    document.getElementById('customer-total-pending').textContent = totals.total_pending_cans || 0;
    document.getElementById('customer-total-customers').textContent = totals.total_customers || 0;
}

function renderCustomerSummaryTable(data) {
    const tbody = document.getElementById('customer-table-body');
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No data found</td></tr>';
        return;
    }
    
    data.forEach(c => {
        const row = `
            <tr>
                <td>${c.customer_name || 'N/A'}</td>
                <td>Rs ${c.revenue.toLocaleString()}</td>
                <td>${c.pending_cans || 0}</td>
                <td>${c.deliveries_count || 0}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function renderCustomerSummaryCharts(data) {
    // Revenue per customer bar chart
    const revenueCtx = document.getElementById('customer-revenue-chart').getContext('2d');
    if (chartInstances['customer-revenue']) {
        chartInstances['customer-revenue'].destroy();
    }
    
    const customerNames = data.map(c => c.customer_name || 'Unknown').slice(0, 10); // Top 10
    const revenues = data.map(c => c.revenue || 0).slice(0, 10);
    
    chartInstances['customer-revenue'] = new Chart(revenueCtx, {
        type: 'bar',
        data: {
            labels: customerNames,
            datasets: [{
                label: 'Revenue (Rs)',
                data: revenues,
                backgroundColor: '#0077cc',
                borderColor: '#005fa3',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rs ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
    
    // Pending cans bar chart
    const pendingCtx = document.getElementById('customer-pending-chart').getContext('2d');
    if (chartInstances['customer-pending']) {
        chartInstances['customer-pending'].destroy();
    }
    
    const pendingCans = data.map(c => c.pending_cans || 0).slice(0, 10);
    
    chartInstances['customer-pending'] = new Chart(pendingCtx, {
        type: 'bar',
        data: {
            labels: customerNames,
            datasets: [{
                label: 'Pending Cans',
                data: pendingCans,
                backgroundColor: '#e74c3c',
                borderColor: '#c0392b',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// ==================== FINANCIAL SUMMARY REPORT ====================
async function loadFinancialSummaryReport() {
    const dateFrom = document.getElementById('financial-from').value;
    const dateTo = document.getElementById('financial-to').value;
    
    try {
        const response = await apiCall(`report.php?action=financial-summary&date_from=${dateFrom}&date_to=${dateTo}`, 'GET');
        
        if (response.success) {
            renderFinancialSummaryTotals(response.totals);
            renderFinancialSummaryCharts(response.charts);
        } else {
            showError('financial-section', response.error || 'Failed to load financial summary');
        }
    } catch (error) {
        console.error('Financial summary error:', error);
        showError('financial-section', 'Failed to load financial summary');
    }
}

function renderFinancialSummaryTotals(totals) {
    document.getElementById('financial-revenue').textContent = `Rs ${(totals.total_revenue || 0).toLocaleString()}`;
    document.getElementById('financial-expenses').textContent = `Rs ${(totals.total_expenses || 0).toLocaleString()}`;
    document.getElementById('financial-profit').textContent = `Rs ${(totals.total_profit || 0).toLocaleString()}`;
    document.getElementById('financial-cash').textContent = `Rs ${(totals.cash_total || 0).toLocaleString()}`;
    document.getElementById('financial-credit').textContent = `Rs ${(totals.credit_total || 0).toLocaleString()}`;
}

function renderFinancialSummaryCharts(charts) {
    // Revenue vs Expenses vs Profit line chart
    const financialCtx = document.getElementById('financial-trend-chart').getContext('2d');
    if (chartInstances['financial-trend']) {
        chartInstances['financial-trend'].destroy();
    }
    
    const dailyData = charts.daily_data || {};
    const labels = Object.keys(dailyData).sort().map(d => {
        const date = new Date(d);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const revenues = Object.keys(dailyData).sort().map(d => dailyData[d].revenue || 0);
    const expenses = Object.keys(dailyData).sort().map(d => dailyData[d].expenses || 0);
    const profits = Object.keys(dailyData).sort().map(d => dailyData[d].profit || 0);
    
    chartInstances['financial-trend'] = new Chart(financialCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Revenue (Rs)',
                    data: revenues,
                    borderColor: '#00b894',
                    backgroundColor: 'rgba(0, 184, 148, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Expenses (Rs)',
                    data: expenses,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Profit (Rs)',
                    data: profits,
                    borderColor: '#0077cc',
                    backgroundColor: 'rgba(0, 119, 204, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rs ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
    
    // Cash vs Credit bar chart
    const cashCreditCtx = document.getElementById('financial-cash-credit-chart').getContext('2d');
    if (chartInstances['financial-cash-credit']) {
        chartInstances['financial-cash-credit'].destroy();
    }
    
    const cashCreditData = charts.cash_credit || {};
    
    chartInstances['financial-cash-credit'] = new Chart(cashCreditCtx, {
        type: 'bar',
        data: {
            labels: ['Cash', 'Credit'],
            datasets: [{
                label: 'Amount (Rs)',
                data: [cashCreditData.Cash || 0, cashCreditData.Credit || 0],
                backgroundColor: ['#00b894', '#0077cc'],
                borderColor: ['#00a085', '#005fa3'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rs ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// ==================== STATION FILLING SUMMARY ====================
async function loadStationFillingReport() {
    const dateFrom = document.getElementById('station-from').value;
    const dateTo = document.getElementById('station-to').value;
    
    try {
        const response = await apiCall(`report.php?action=station-filling&date_from=${dateFrom}&date_to=${dateTo}`, 'GET');
        
        if (response.success) {
            renderStationFillingTotals(response.totals);
            renderStationFillingCharts(response.charts);
        } else {
            showError('station-section', response.error || 'Failed to load station filling summary');
        }
    } catch (error) {
        console.error('Station filling error:', error);
        showError('station-section', 'Failed to load station filling summary');
    }
}

function renderStationFillingTotals(totals) {
    document.getElementById('station-total-cost').textContent = `Rs ${(totals.total_cost || 0).toLocaleString()}`;
    document.getElementById('station-total-fills').textContent = totals.total_fills || 0;
}

function renderStationFillingCharts(charts) {
    // Cost per station bar chart
    const costCtx = document.getElementById('station-cost-chart').getContext('2d');
    if (chartInstances['station-cost']) {
        chartInstances['station-cost'].destroy();
    }
    
    const stationNames = Object.keys(charts.station_cost || {});
    const stationCosts = Object.values(charts.station_cost || {});
    
    chartInstances['station-cost'] = new Chart(costCtx, {
        type: 'bar',
        data: {
            labels: stationNames,
            datasets: [{
                label: 'Cost (Rs)',
                data: stationCosts,
                backgroundColor: '#0077cc',
                borderColor: '#005fa3',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rs ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
    
    // Fills share pie chart
    const fillsCtx = document.getElementById('station-fills-chart').getContext('2d');
    if (chartInstances['station-fills']) {
        chartInstances['station-fills'].destroy();
    }
    
    const stationFills = Object.values(charts.station_fills || {});
    
    chartInstances['station-fills'] = new Chart(fillsCtx, {
        type: 'pie',
        data: {
            labels: stationNames,
            datasets: [{
                data: stationFills,
                backgroundColor: [
                    '#0077cc', '#005fa3', '#004080', '#002d5c', '#001a38',
                    '#00b894', '#00a085', '#008876', '#007067', '#005858'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'right' }
            }
        }
    });
}

// ==================== PERIOD SUMMARY ====================
async function loadPeriodSummaryReport() {
    const dateFrom = document.getElementById('period-from').value;
    const dateTo = document.getElementById('period-to').value;
    
    try {
        const response = await apiCall(`report.php?action=period-summary&date_from=${dateFrom}&date_to=${dateTo}`, 'GET');
        
        if (response.success) {
            renderPeriodSummaryTotals(response.totals);
            renderPeriodSummaryCharts(response.charts);
        } else {
            showError('period-section', response.error || 'Failed to load period summary');
        }
    } catch (error) {
        console.error('Period summary error:', error);
        showError('period-section', 'Failed to load period summary');
    }
}

function renderPeriodSummaryTotals(totals) {
    document.getElementById('period-deliveries').textContent = totals.total_deliveries || 0;
    document.getElementById('period-revenue').textContent = `Rs ${(totals.total_revenue || 0).toLocaleString()}`;
    document.getElementById('period-expenses').textContent = `Rs ${(totals.total_expenses || 0).toLocaleString()}`;
    document.getElementById('period-profit').textContent = `Rs ${(totals.total_profit || 0).toLocaleString()}`;
}

function renderPeriodSummaryCharts(charts) {
    const dailyData = charts.daily_data || {};
    const labels = Object.keys(dailyData).sort().map(d => {
        const date = new Date(d);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    // Deliveries chart
    const deliveriesCtx = document.getElementById('period-deliveries-chart').getContext('2d');
    if (chartInstances['period-deliveries']) {
        chartInstances['period-deliveries'].destroy();
    }
    
    const deliveriesData = Object.keys(dailyData).sort().map(d => dailyData[d].deliveries || 0);
    
    chartInstances['period-deliveries'] = new Chart(deliveriesCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Deliveries',
                data: deliveriesData,
                borderColor: '#0077cc',
                backgroundColor: 'rgba(0, 119, 204, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
    
    // Revenue chart
    const revenueCtx = document.getElementById('period-revenue-chart').getContext('2d');
    if (chartInstances['period-revenue']) {
        chartInstances['period-revenue'].destroy();
    }
    
    const revenueData = Object.keys(dailyData).sort().map(d => dailyData[d].revenue || 0);
    
    chartInstances['period-revenue'] = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue (Rs)',
                data: revenueData,
                borderColor: '#00b894',
                backgroundColor: 'rgba(0, 184, 148, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rs ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
    
    // Expenses chart
    const expensesCtx = document.getElementById('period-expenses-chart').getContext('2d');
    if (chartInstances['period-expenses']) {
        chartInstances['period-expenses'].destroy();
    }
    
    const expensesData = Object.keys(dailyData).sort().map(d => dailyData[d].expenses || 0);
    
    chartInstances['period-expenses'] = new Chart(expensesCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses (Rs)',
                data: expensesData,
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rs ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
    
    // Profit chart
    const profitCtx = document.getElementById('period-profit-chart').getContext('2d');
    if (chartInstances['period-profit']) {
        chartInstances['period-profit'].destroy();
    }
    
    const profitData = Object.keys(dailyData).sort().map(d => dailyData[d].profit || 0);
    
    chartInstances['period-profit'] = new Chart(profitCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Profit (Rs)',
                data: profitData,
                borderColor: '#0077cc',
                backgroundColor: 'rgba(0, 119, 204, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rs ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// ==================== PDF EXPORT FUNCTIONS ====================
async function exportPDF(sectionId, reportTitle) {
    const section = document.getElementById(sectionId);
    if (!section) {
        alert('Section not found');
        return;
    }
    
    // Show loading
    const loadingMsg = document.createElement('div');
    loadingMsg.id = 'pdf-loading';
    loadingMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:20px;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.3);z-index:10000;';
    loadingMsg.innerHTML = '<p>Generating PDF...</p>';
    document.body.appendChild(loadingMsg);
    
    try {
        // Get date range
        const dateFrom = section.querySelector('.date-from')?.value || '';
        const dateTo = section.querySelector('.date-to')?.value || '';
        
        // Create PDF content wrapper
        const pdfWrapper = document.createElement('div');
        pdfWrapper.style.cssText = 'font-family:Arial,sans-serif;padding:20px;background:#fff;';
        
        // Add header
        const header = document.createElement('div');
        header.innerHTML = `
            <h1 style="color:#0077cc;margin-bottom:10px;font-size:24px;">${reportTitle}</h1>
            <p style="color:#666;margin-bottom:20px;font-size:14px;">Date Range: ${dateFrom} to ${dateTo}</p>
        `;
        pdfWrapper.appendChild(header);
        
        // Clone section content
        const sectionContent = section.querySelector('.section-content');
        const clone = sectionContent.cloneNode(true);
        
        // Remove buttons and inputs
        clone.querySelectorAll('button, input, .reload-btn, .export-btn, .section-controls').forEach(el => el.remove());
        
        // Convert charts to images before cloning
        const charts = clone.querySelectorAll('canvas');
        const chartIdMap = {
            'deliveries-customer-chart': 'deliveries-customer',
            'deliveries-daily-chart': 'deliveries-daily',
            'filling-daily-chart': 'filling-daily',
            'filling-station-chart': 'filling-station',
            'expenses-category-chart': 'expenses-category',
            'expenses-daily-chart': 'expenses-daily',
            'inventory-stacked-chart': 'inventory-stacked',
            'customer-revenue-chart': 'customer-revenue',
            'customer-pending-chart': 'customer-pending',
            'financial-trend-chart': 'financial-trend',
            'financial-cash-credit-chart': 'financial-cash-credit',
            'station-cost-chart': 'station-cost',
            'station-fills-chart': 'station-fills',
            'period-deliveries-chart': 'period-deliveries',
            'period-revenue-chart': 'period-revenue',
            'period-expenses-chart': 'period-expenses',
            'period-profit-chart': 'period-profit'
        };
        
        for (let canvas of charts) {
            const chartId = canvas.id;
            const instanceKey = chartIdMap[chartId];
            if (instanceKey && chartInstances[instanceKey]) {
                try {
                    const imageData = chartInstances[instanceKey].toBase64Image();
                    const img = document.createElement('img');
                    img.src = imageData;
                    img.style.width = '100%';
                    img.style.maxWidth = '800px';
                    img.style.display = 'block';
                    img.style.margin = '10px 0';
                    canvas.parentNode.replaceChild(img, canvas);
                } catch (e) {
                    console.error('Chart conversion error:', e);
                }
            }
        }
        
        pdfWrapper.appendChild(clone);
        
        // Use html2pdf library
        if (typeof html2pdf !== 'undefined') {
            const opt = {
                margin: [10, 10, 10, 10],
                filename: `${reportTitle.toLowerCase().replace(/\s+/g, '-')}-report.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            
            await html2pdf().set(opt).from(pdfWrapper).save();
        } else {
            // Fallback: open print dialog
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head><title>${reportTitle}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { padding: 8px; border: 1px solid #ddd; }
                        th { background: #0077cc; color: #fff; }
                    </style>
                    </head>
                    <body>${pdfWrapper.innerHTML}</body>
                </html>
            `);
            printWindow.document.close();
            setTimeout(() => printWindow.print(), 500);
        }
    } catch (error) {
        console.error('PDF export error:', error);
        alert('Failed to generate PDF. Please try again.');
    } finally {
        // Remove loading message
        const loading = document.getElementById('pdf-loading');
        if (loading) loading.remove();
    }
}

// ==================== HELPER FUNCTIONS ====================
function clearError(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const errorDiv = section.querySelector('.error-message');
        if (errorDiv) errorDiv.remove();
    }
}
function showError(sectionId, message) {
    const section = document.getElementById(sectionId);
    if (section) {
        const errorDiv = section.querySelector('.error-message') || document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = 'background:#fee;color:#c33;padding:10px;border-radius:6px;margin:10px 0;';
        errorDiv.textContent = message;
        if (!section.querySelector('.error-message')) {
            section.insertBefore(errorDiv, section.firstChild);
        }
    }
}

// Toggle section collapse
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const content = section.querySelector('.section-content');
    const icon = section.querySelector('.collapse-icon');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.textContent = '▼';
    } else {
        content.style.display = 'none';
        icon.textContent = '▶';
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReports);
} else {
    initReports();
}

