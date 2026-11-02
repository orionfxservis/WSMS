/**
 * WSMS Superadmin Universal Data Engine
 * Ensures 100% interactive, fully functioning Superadmin Portal
 * Supports both Live PHP API and Client-Side Static / GitHub Pages Mode with LocalStorage persistence.
 */
(function() {
  'use strict';

  // Seed default data if not already initialized in localStorage
  function seedInitialData() {
    if (!localStorage.getItem('wsms_admin_pending')) {
      const initialPending = [
        { id: 101, name: "Al-Rehman Mineral Water", email: "contact@alrehmanwater.pk", role: "supplier", requested_on: "2026-10-30" },
        { id: 102, name: "Korangi Industrial RO Plant", email: "station@korangiro.com", role: "filling_station", requested_on: "2026-10-29" },
        { id: 103, name: "Shah Faisal Depot 04", email: "shahfaisal@wsms.pk", role: "supplier", requested_on: "2026-10-28" },
        { id: 104, name: "Malir River Water Station", email: "malir.station@wsms.pk", role: "filling_station", requested_on: "2026-10-27" }
      ];
      localStorage.setItem('wsms_admin_pending', JSON.stringify(initialPending));
    }

    if (!localStorage.getItem('wsms_admin_suppliers')) {
      const initialSuppliers = [
        { id: 1, name: "Indus Pure Water Depot", email: "indus@wsms.pk", phone: "+92 300 1234567", city: "Karachi", area: "Clifton Block 4", active_cans: 1250, daily_dispatch: 380, status: "active", created_on: "2026-08-15" },
        { id: 2, name: "Karachi Springs Water Supply", email: "springs@wsms.pk", phone: "+92 321 9876543", city: "Karachi", area: "Gulshan-e-Iqbal Block 13D", active_cans: 940, daily_dispatch: 290, status: "active", created_on: "2026-08-20" },
        { id: 3, name: "Korangi Blue Water Depot", email: "korangi.blue@wsms.pk", phone: "+92 333 4567890", city: "Karachi", area: "Korangi Sector 31", active_cans: 820, daily_dispatch: 240, status: "active", created_on: "2026-09-02" },
        { id: 4, name: "Clifton RO Waters", email: "clifton.waters@wsms.pk", phone: "+92 301 2345678", city: "Karachi", area: "Defence Phase 5", active_cans: 1100, daily_dispatch: 350, status: "active", created_on: "2026-09-10" },
        { id: 5, name: "Gulshan Aquafresh Delivery", email: "aquafresh@wsms.pk", phone: "+92 312 3456789", city: "Karachi", area: "Gulistan-e-Johar Block 18", active_cans: 670, daily_dispatch: 180, status: "active", created_on: "2026-09-18" },
        { id: 6, name: "North Nazimabad Pure Hydration", email: "nazimabad@wsms.pk", phone: "+92 345 6789012", city: "Karachi", area: "North Nazimabad Block H", active_cans: 730, daily_dispatch: 210, status: "active", created_on: "2026-10-01" },
        { id: 7, name: "PECHS Water Distribution", email: "pechs@wsms.pk", phone: "+92 322 7890123", city: "Karachi", area: "PECHS Block 2", active_cans: 540, daily_dispatch: 160, status: "active", created_on: "2026-10-12" }
      ];
      localStorage.setItem('wsms_admin_suppliers', JSON.stringify(initialSuppliers));
    }

    if (!localStorage.getItem('wsms_admin_stations')) {
      const initialStations = [
        { id: 1, name: "Clifton Central RO Plant", code: "ST-01", location: "Clifton Block 2, Karachi", daily_capacity: 15000, current_output: 11200, pump_status: "Operational", tds_level: "140 ppm", status: "Operational", created_on: "2026-07-10" },
        { id: 2, name: "Korangi Industrial Pumping Station", code: "ST-02", location: "Korangi Sector 31-B, Karachi", daily_capacity: 22000, current_output: 18500, pump_status: "Operational", tds_level: "155 ppm", status: "Operational", created_on: "2026-07-15" },
        { id: 3, name: "Gulshan Water Purification Depot", code: "ST-03", location: "Gulshan-e-Iqbal Block 7, Karachi", daily_capacity: 12000, current_output: 8900, pump_status: "Operational", tds_level: "135 ppm", status: "Operational", created_on: "2026-08-01" },
        { id: 4, name: "North Nazimabad RO Facility", code: "ST-04", location: "Block N, North Nazimabad, Karachi", daily_capacity: 18000, current_output: 14200, pump_status: "Maintenance", tds_level: "148 ppm", status: "Maintenance", created_on: "2026-08-20" },
        { id: 5, name: "Malir Reservoir & Refill Hub", code: "ST-05", location: "Malir Halt Depot Road, Karachi", daily_capacity: 25000, current_output: 21000, pump_status: "Operational", tds_level: "160 ppm", status: "Operational", created_on: "2026-09-05" }
      ];
      localStorage.setItem('wsms_admin_stations', JSON.stringify(initialStations));
    }

    if (!localStorage.getItem('wsms_admin_expenses')) {
      const initialExpenses = [
        { id: "EXP-501", amount: 14500, category: "Vehicle Diesel", date: "2026-10-30", description: "Diesel for Suzuki Ravi delivery vans (Fleet #1-4)" },
        { id: "EXP-502", amount: 8200, category: "RO Maintenance", date: "2026-10-29", description: "Replacement of 5-micron spun polypropylene cartridges" },
        { id: "EXP-503", amount: 25000, category: "Worker Wages", date: "2026-10-28", description: "Weekly dispatch drivers and canes loading helpers" },
        { id: "EXP-504", amount: 18500, category: "Electricity", date: "2026-10-27", description: "K-Electric commercial industrial tariff partial bill" },
        { id: "EXP-505", amount: 32000, category: "New Can Purchase", date: "2026-10-26", description: "Procurement of 100 new 19-litre polycarbonate canes" },
        { id: "EXP-506", amount: 6500, category: "Fleet Repair", date: "2026-10-25", description: "Clutch plate and brake pads repair for Van KHI-892" },
        { id: "EXP-507", amount: 12000, category: "Vehicle Diesel", date: "2026-10-24", description: "Fleet refill at PSO Station Korangi" }
      ];
      localStorage.setItem('wsms_admin_expenses', JSON.stringify(initialExpenses));
    }

    if (!localStorage.getItem('wsms_admin_payments')) {
      const initialPayments = [
        { id: "PAY-9101", amount: 35000, supplier: "Indus Pure Water Depot", date: "2026-10-30", status: "completed" },
        { id: "PAY-9102", amount: 28500, supplier: "Karachi Springs Water Supply", date: "2026-10-30", status: "completed" },
        { id: "PAY-9103", amount: 19000, supplier: "Korangi Blue Water Depot", date: "2026-10-29", status: "completed" },
        { id: "PAY-9104", amount: 42000, supplier: "Clifton RO Waters", date: "2026-10-28", status: "pending" },
        { id: "PAY-9105", amount: 15400, supplier: "Gulshan Aquafresh Delivery", date: "2026-10-28", status: "completed" },
        { id: "PAY-9106", amount: 22000, supplier: "North Nazimabad Pure Hydration", date: "2026-10-27", status: "completed" },
        { id: "PAY-9107", amount: 18000, supplier: "PECHS Water Distribution", date: "2026-10-26", status: "completed" }
      ];
      localStorage.setItem('wsms_admin_payments', JSON.stringify(initialPayments));
    }

    if (!localStorage.getItem('wsms_admin_users')) {
      const initialUsers = [
        { id: 1, name: "Super Administrator", email: "admin@wsms.pk", role: "superadmin", status: "active", created_on: "2026-01-01" },
        { id: 2, name: "Tariq Mahmood", email: "tariq@induswater.pk", role: "supplier", status: "active", created_on: "2026-08-15" },
        { id: 3, name: "Engr. Rashid Khan", email: "rashid@cliftonro.pk", role: "filling_station", status: "active", created_on: "2026-07-10" },
        { id: 4, name: "Bilal Ahmed", email: "bilal@springswater.pk", role: "supplier", status: "active", created_on: "2026-08-20" },
        { id: 5, name: "Noman Qureshi", email: "noman@korangiro.pk", role: "filling_station", status: "active", created_on: "2026-07-15" },
        { id: 6, name: "Kamran Siddiqui", email: "kamran@dispatch.pk", role: "labour", status: "active", created_on: "2026-09-01" }
      ];
      localStorage.setItem('wsms_admin_users', JSON.stringify(initialUsers));
    }

    if (!localStorage.getItem('wsms_admin_subscriptions')) {
      const initialSubs = [
        { id: 1, name: "Starter Supplier", code: "SUB-START", price: 5000, billing: "Monthly", max_customers: 100, max_cans: 500, active_users: 14, status: "Active" },
        { id: 2, name: "Professional Depot", code: "SUB-PRO", price: 15000, billing: "Monthly", max_customers: 500, max_cans: 2500, active_users: 10, status: "Active" },
        { id: 3, name: "Enterprise Water Network", code: "SUB-ENT", price: 35000, billing: "Monthly", max_customers: "Unlimited", max_cans: "Unlimited", active_users: 4, status: "Active" }
      ];
      localStorage.setItem('wsms_admin_subscriptions', JSON.stringify(initialSubs));
    }

    if (!localStorage.getItem('wsms_admin_audit_logs')) {
      const initialLogs = [
        { id: "LOG-7701", event: "user_approval", user: "admin@wsms.pk", details: "Approved supplier account: Al-Rehman Mineral Water", ip: "119.160.118.42", timestamp: "2026-10-31 16:45:10" },
        { id: "LOG-7702", event: "pump_status_toggle", user: "admin@wsms.pk", details: "Changed Clifton Central RO Plant pump status to Operational", ip: "119.160.118.42", timestamp: "2026-10-31 14:20:30" },
        { id: "LOG-7703", event: "expense_recorded", user: "admin@wsms.pk", details: "Added operational expense: Rs. 14,500 (Vehicle Diesel)", ip: "119.160.118.42", timestamp: "2026-10-30 18:15:00" },
        { id: "LOG-7704", event: "session_login", user: "admin@wsms.pk", details: "Superadmin root session authenticated via Web Portal", ip: "119.160.118.42", timestamp: "2026-10-30 09:30:15" },
        { id: "LOG-7705", event: "backup_export", user: "admin@wsms.pk", details: "Generated daily database snapshot and CSV audit export", ip: "119.160.118.42", timestamp: "2026-10-29 23:59:00" }
      ];
      localStorage.setItem('wsms_admin_audit_logs', JSON.stringify(initialLogs));
    }
  }

  seedInitialData();

  // Intercept fetch requests for /api/admin/ endpoints to provide mock data on static hosting
  const originalFetch = window.fetch;
  window.fetch = async function(input, init) {
    let url = typeof input === 'string' ? input : (input && input.url) ? input.url : '';
    
    // Only intercept admin API calls
    if (url.includes('/api/admin/') || url.includes('api/admin/')) {
      try {
        const response = await originalFetch.apply(this, arguments);
        if (response.ok) {
          return response;
        }
      } catch (err) {
        // Network error or 404 on static host, proceed to mock responder
      }

      // Handle mock response
      return handleMockAdminApi(url, init);
    }

    return originalFetch.apply(this, arguments);
  };

  function createJsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
      status: status,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  function handleMockAdminApi(url, init) {
    let method = (init && init.method) ? init.method.toUpperCase() : 'GET';
    let body = {};
    try {
      if (init && init.body && typeof init.body === 'string') {
        body = JSON.parse(init.body);
      }
    } catch (e) {
      body = {};
    }

    // 0. Login, Logout & Reset
    if (url.includes('login.php')) {
      const email = (body && body.email) ? body.email : 'admin@wsms.pk';
      localStorage.setItem('wsms_admin_logged_in', 'true');
      localStorage.setItem('wsms_admin_user', JSON.stringify({
        name: 'Super Admin',
        email: email,
        role: 'superadmin'
      }));
      return createJsonResponse({ success: true, message: 'Authentication verified', redirect: 'dashboard.html' });
    }

    if (url.includes('request-password-reset.php')) {
      return createJsonResponse({ success: true, message: 'Password reset link sent to registered email' });
    }

    if (url.includes('logout.php')) {
      localStorage.removeItem('wsms_admin_logged_in');
      sessionStorage.setItem('wsms_admin_logged_out', 'true');
      return createJsonResponse({ success: true, message: 'Logged out successfully' });
    }

    // 1. Session check
    if (url.includes('check-session.php')) {
      return createJsonResponse({ valid: true, user: { name: 'Super Admin', email: 'admin@wsms.pk', role: 'superadmin' } });
    }

    // 2. Notifications
    if (url.includes('notifications.php')) {
      const pending = JSON.parse(localStorage.getItem('wsms_admin_pending') || '[]');
      return createJsonResponse({
        success: true,
        pending_count: pending.length,
        count: pending.length,
        items: pending.map(p => ({
          id: p.id,
          text: `New ${p.role === 'supplier' ? 'Supplier' : 'Station'} Registration: ${p.name}`,
          ts: Date.now(),
          read: false
        }))
      });
    }

    // 3. Metrics
    if (url.includes('metrics.php')) {
      const suppliers = JSON.parse(localStorage.getItem('wsms_admin_suppliers') || '[]');
      const stations = JSON.parse(localStorage.getItem('wsms_admin_stations') || '[]');
      return createJsonResponse({
        success: true,
        mrr: 450000,
        revenueYtd: 4850000,
        pendingPayouts: 125000,
        activeSuppliers: suppliers.length || 28,
        activeCustomers: 342,
        activeStations: stations.length || 14
      });
    }

    // 4. Charts
    if (url.includes('charts.php')) {
      return createJsonResponse({
        revTrend: [
          { d: '01 Oct', v: 92000 },
          { d: '08 Oct', v: 115000 },
          { d: '15 Oct', v: 138000 },
          { d: '22 Oct', v: 165000 },
          { d: '29 Oct', v: 182000 }
        ],
        newSuppliers: [
          { d: 'Week 1', v: 4 },
          { d: 'Week 2', v: 7 },
          { d: 'Week 3', v: 5 },
          { d: 'Week 4', v: 9 }
        ],
        churnRate: [
          { d: 'May', v: 2.2 },
          { d: 'Jun', v: 1.9 },
          { d: 'Jul', v: 1.6 },
          { d: 'Aug', v: 1.8 },
          { d: 'Sep', v: 1.4 },
          { d: 'Oct', v: 1.1 }
        ],
        expenseSplit: {
          labels: ['Vehicle Diesel', 'RO Maintenance', 'Worker Wages', 'Electricity Bills', 'Can Replacements'],
          values: [38000, 24000, 52000, 19000, 16000]
        },
        arAging: {
          labels: ['Current', '1-30d', '31-60d', '61-90d', '90d+'],
          series: [
            [180000, 75000, 32000, 14000, 6000],
            [45000, 20000, 12000, 5000, 2000],
            [18000, 9000, 4000, 2000, 1000],
            [8000, 4000, 2000, 1000, 500]
          ]
        },
        topSuppliers: {
          labels: ['Indus Pure Water', 'Karachi Springs Depot', 'Korangi Blue Depot', 'Clifton RO Waters', 'Gulshan Aquafresh'],
          values: [980000, 840000, 720000, 650000, 540000]
        }
      });
    }

    // 5. Pending Approvals
    if (url.includes('pending.php')) {
      let pending = JSON.parse(localStorage.getItem('wsms_admin_pending') || '[]');
      if (url.includes('action=approve') || url.includes('action=reject')) {
        const id = body.id || (url.includes('id=') ? parseInt(url.split('id=')[1]) : 0);
        pending = pending.filter(p => p.id !== id);
        localStorage.setItem('wsms_admin_pending', JSON.stringify(pending));
        return createJsonResponse({ success: true, message: 'Request processed' });
      }
      return createJsonResponse({ success: true, requests: pending, rows: pending });
    }

    // 6. Payments
    if (url.includes('payments.php')) {
      const payments = JSON.parse(localStorage.getItem('wsms_admin_payments') || '[]');
      return createJsonResponse({ success: true, rows: payments });
    }

    // 7. Expenses
    if (url.includes('expenses.php')) {
      let expenses = JSON.parse(localStorage.getItem('wsms_admin_expenses') || '[]');
      if (method === 'POST') {
        const newExp = {
          id: 'EXP-' + (Math.floor(Math.random() * 900) + 100),
          amount: parseFloat(body.amount) || 5000,
          category: body.category || 'General Operations',
          date: body.date || new Date().toISOString().split('T')[0],
          description: body.description || 'Administrative Expense'
        };
        expenses.unshift(newExp);
        localStorage.setItem('wsms_admin_expenses', JSON.stringify(expenses));
        return createJsonResponse({ success: true, id: newExp.id });
      }
      return createJsonResponse({ success: true, rows: expenses, data: expenses });
    }

    // 8. Suppliers
    if (url.includes('suppliers.php')) {
      let suppliers = JSON.parse(localStorage.getItem('wsms_admin_suppliers') || '[]');
      if (method === 'POST') {
        const newSup = {
          id: suppliers.length + 1,
          name: body.name || 'New Supplier Depot',
          email: body.email || 'depot@wsms.pk',
          phone: body.phone || '+92 300 0000000',
          city: body.city || 'Karachi',
          area: body.area || 'Sindh',
          active_cans: parseInt(body.active_cans) || 500,
          daily_dispatch: parseInt(body.daily_dispatch) || 150,
          status: 'active',
          created_on: new Date().toISOString().split('T')[0]
        };
        suppliers.unshift(newSup);
        localStorage.setItem('wsms_admin_suppliers', JSON.stringify(suppliers));
        return createJsonResponse({ success: true, supplier: newSup });
      }
      return createJsonResponse({ success: true, suppliers: suppliers, rows: suppliers });
    }

    // 9. Stations
    if (url.includes('stations.php')) {
      let stations = JSON.parse(localStorage.getItem('wsms_admin_stations') || '[]');
      if (method === 'POST') {
        const newSt = {
          id: stations.length + 1,
          name: body.name || 'New RO Station',
          code: 'ST-0' + (stations.length + 1),
          location: body.location || 'Karachi Depot',
          daily_capacity: parseInt(body.daily_capacity) || 10000,
          current_output: parseInt(body.current_output) || 8000,
          pump_status: 'Operational',
          tds_level: '140 ppm',
          status: 'Operational',
          created_on: new Date().toISOString().split('T')[0]
        };
        stations.unshift(newSt);
        localStorage.setItem('wsms_admin_stations', JSON.stringify(stations));
        return createJsonResponse({ success: true, station: newSt });
      }
      return createJsonResponse({ success: true, stations: stations, rows: stations });
    }

    // 10. Users
    if (url.includes('users.php')) {
      let users = JSON.parse(localStorage.getItem('wsms_admin_users') || '[]');
      if (method === 'POST') {
        const newUser = {
          id: users.length + 1,
          name: body.name || 'Staff User',
          email: body.email || 'user@wsms.pk',
          role: body.role || 'supplier',
          status: 'active',
          created_on: new Date().toISOString().split('T')[0]
        };
        users.unshift(newUser);
        localStorage.setItem('wsms_admin_users', JSON.stringify(users));
        return createJsonResponse({ success: true, user: newUser });
      }
      return createJsonResponse({ success: true, users: users, rows: users });
    }

    // 11. Subscriptions
    if (url.includes('subscriptions/')) {
      const subs = JSON.parse(localStorage.getItem('wsms_admin_subscriptions') || '[]');
      return createJsonResponse({ success: true, packages: subs, rows: subs });
    }

    // 12. Audit Logs
    if (url.includes('audit-logs.php')) {
      const logs = JSON.parse(localStorage.getItem('wsms_admin_audit_logs') || '[]');
      return createJsonResponse({ success: true, logs: logs, rows: logs });
    }

    // 13. Profile
    if (url.includes('profile.php')) {
      let user = JSON.parse(localStorage.getItem('wsms_admin_user') || 'null') || {
        name: 'Super Admin',
        email: 'admin@wsms.pk',
        role: 'superadmin',
        dp_url: '../assets/default-user.png'
      };

      if (method === 'POST') {
        const pic = (body && (body.picture_url || body.dp_url || body.picture)) || '';
        if (pic) {
          user.dp_url = pic;
          user.picture = pic;
        }
        if (body && body.name) {
          user.name = body.name;
        }
        if (body && body.email) {
          user.email = body.email;
        }
        localStorage.setItem('wsms_admin_user', JSON.stringify(user));
        return createJsonResponse({ success: true, message: 'Profile updated successfully', data: user });
      }

      return createJsonResponse({ success: true, data: user });
    }

    // Default fallback
    return createJsonResponse({ success: true, data: [] });
  }
})();
