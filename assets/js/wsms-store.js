/**
 * WSMS Shared Data Store
 * Provides unified, synchronized data between the React Web App and standalone /pages/ HTML views.
 */
(function() {
  const STORAGE_KEY = 'wsms_shared_store_v1';

  const DEFAULT_DATA = {
    summary: {
      total_deliveries: 20,
      total_revenue: 33500,
      total_expenses: 12500,
      profit: 21000,
      active_customers: 8,
      in_circulation: 1420
    },
    inventorySummary: [
      { item_name: '19 Liter Can', category: 'reusable', available: 420, total_out: 180, returned: 150, damaged: 6 },
      { item_name: '12 Liter Can', category: 'reusable', available: 180, total_out: 75, returned: 60, damaged: 2 },
      { item_name: 'Carton of 12 500ml', category: 'sellable', available: 85, total_out: 140, returned: 0, damaged: 1 },
      { item_name: 'Carton of 24 500ml', category: 'sellable', available: 60, total_out: 95, returned: 0, damaged: 0 },
      { item_name: 'Carton of 6 1.5L', category: 'sellable', available: 110, total_out: 160, returned: 0, damaged: 2 },
      { item_name: '6 Liter Bottle', category: 'sellable', available: 250, total_out: 320, returned: 0, damaged: 5 }
    ],
    inventory: {
      totalCirculation: 1420,
      filledDepot: 380,
      emptyDepot: 195,
      damagedAudit: 45
    },
    deliveries: [
      { id: 1, customer: 'Metro Cash & Carry', cans: 30, amount: 6000, status: 'Delivered', time: '10:15 AM', address: 'University Road, Gulshan' },
      { id: 2, customer: 'Indus Hospital & Health Network', cans: 25, amount: 5000, status: 'Delivered', time: '11:00 AM', address: 'Korangi Sector 31' },
      { id: 3, customer: 'Dolmen Mall Food Court', cans: 40, amount: 8000, status: 'Delivered', time: '11:45 AM', address: 'Clifton Block 4' },
      { id: 4, customer: 'Aga Khan Labs Executive Wing', cans: 15, amount: 3000, status: 'In Transit', time: '01:30 PM', address: 'Stadium Road' },
      { id: 5, customer: 'Dr. Tariq Dental Clinic', cans: 8, amount: 1600, status: 'Delivered', time: '02:15 PM', address: 'Nursery, Shahrah-e-Faisal' },
      { id: 6, customer: 'Ayesha Manzil Bakery & Cafe', cans: 14, amount: 2800, status: 'Delivered', time: '03:00 PM', address: 'Block 7, F.B Area' }
    ],
    fillings: [
      { id: 101, date: '2026-10-20', time: '14:15', stationId: 'st-01', stationName: 'Clifton RO Plant', amount: 3000, qty: 50, rate: 60, paymentType: 'Cash', note: 'Filling: 50 x 19 Liter Can at 14:15' },
      { id: 102, date: '2026-10-20', time: '11:30', stationId: 'st-02', stationName: 'Korangi Sector 31 Station', amount: 2200, qty: 40, rate: 55, paymentType: 'Online', note: 'Filling: 40 x 19 Liter Can at 11:30' },
      { id: 103, date: '2026-10-19', time: '16:45', stationId: 'st-03', stationName: 'Gulshan Pumping Depot', amount: 3600, qty: 60, rate: 60, paymentType: 'Cash', note: 'Filling: 60 x 19 Liter Can at 16:45' },
      { id: 104, date: '2026-10-19', time: '09:10', stationId: 'st-01', stationName: 'Clifton RO Plant', amount: 2400, qty: 40, rate: 60, paymentType: 'Cash', note: 'Filling: 40 x 19 Liter Can at 09:10' },
      { id: 105, date: '2026-10-18', time: '13:00', stationId: 'st-04', stationName: 'North Nazimabad Plant', amount: 4200, qty: 70, rate: 60, paymentType: 'Credit', note: 'Filling: 70 x 19 Liter Can at 13:00' }
    ],
    expenses: [
      { id: 1, title: 'Diesel for Suzuki Ravi (Route 1 & 2)', category: 'Fuel', amount: 3500, paid: 3500, balance: 0, date: '2026-10-20', paymentMethod: 'Cash', notes: '14.2 Liters diesel refuel at PSO' },
      { id: 2, title: 'RO Membrane Replacement (3000 GPD)', category: 'Maintenance', amount: 4500, paid: 4500, balance: 0, date: '2026-10-19', paymentMethod: 'Bank Transfer', notes: 'Clifton plant high-pressure membrane replacement' },
      { id: 3, title: 'K-Electric Commercial Pumping Bill', category: 'Electricity', amount: 2500, paid: 2500, balance: 0, date: '2026-10-18', paymentMethod: 'JazzCash', notes: 'Off-peak pumping slot unit settlement' },
      { id: 4, title: 'Driver Daily Wages (3 Vans)', category: 'Labor', amount: 2000, paid: 2000, balance: 0, date: '2026-10-20', paymentMethod: 'Cash', notes: 'Day settlement for Tariq, Imran & Zahid' }
    ],
    stations: [
      { id: 1, name: 'Clifton RO Plant Depot', area: 'Clifton Block 2', address: 'Plot 14/B, Marine Drive, Clifton, Karachi', claimed_status: 'active' },
      { id: 2, name: 'Gulshan Mineral Hub', area: 'Gulshan-e-Iqbal Block 6', address: 'Main University Road, Near Expo Center, Karachi', claimed_status: 'active' },
      { id: 3, name: 'Korangi Industrial RO Station', area: 'Korangi Sector 23', address: 'Plot 89, Sector 23, Korangi Industrial Area, Karachi', claimed_status: 'active' },
      { id: 4, name: 'Shahrah-e-Faisal Depot', area: 'PECHS Nursery', address: 'Block 6, PECHS, Shahrah-e-Faisal, Karachi', claimed_status: 'active' },
      { id: 5, name: 'North Nazimabad RO Facility', area: 'North Nazimabad Block H', address: 'Near Sakhi Hasan, North Nazimabad, Karachi', claimed_status: 'claimed' },
      { id: 6, name: 'Saddar Central Filling Depot', area: 'Saddar Downtown', address: 'Preedy Street, Saddar, Karachi', claimed_status: 'active' },
      { id: 7, name: 'Bahria Town Distribution Hub', area: 'Bahria Precinct 1', address: 'Commercial Area, Precinct 1, Bahria Town, Karachi', claimed_status: 'pending' }
    ],
    customers: [
      { id: 101, name: 'Metro Cash & Carry (Staff Canteen)', phone: '0300-1234567', address: 'University Road, Gulshan, Karachi', discount: 20, pending_cans: 30, pending_payment: 0, deposit: 30000 },
      { id: 102, name: 'Indus Hospital & Health Network', phone: '0321-9876543', address: 'Korangi Sector 31, Karachi', discount: 0, pending_cans: 25, pending_payment: 4500, deposit: 25000 },
      { id: 103, name: 'Dolmen Mall Food Court', phone: '0333-2345678', address: 'Clifton Block 4, Karachi', discount: 15, pending_cans: 40, pending_payment: 0, deposit: 40000 },
      { id: 104, name: 'Aga Khan Labs Executive Wing', phone: '0300-4567890', address: 'Stadium Road, Karachi', discount: 30, pending_cans: 15, pending_payment: 1800, deposit: 15000 },
      { id: 105, name: 'Dr. Tariq Dental Clinic', phone: '0301-8765432', address: 'Nursery, Shahrah-e-Faisal, Karachi', discount: 10, pending_cans: 8, pending_payment: 0, deposit: 8000 },
      { id: 106, name: 'Ayesha Manzil Bakery & Cafe', phone: '0345-6789012', address: 'Block 7, Federal B Area, Karachi', discount: 12, pending_cans: 14, pending_payment: 2160, deposit: 14000 },
      { id: 107, name: 'Siddiqui Law Associates', phone: '0315-1122334', address: 'Court Road, Saddar, Karachi', discount: 15, pending_cans: 10, pending_payment: 0, deposit: 10000 },
      { id: 108, name: 'Bahria Town Sector B Villa 12', phone: '0302-9988776', address: 'Precinct 1, Super Highway, Karachi', discount: 0, pending_cans: 16, pending_payment: 3200, deposit: 16000 }
    ]
  };

  function getStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
        return JSON.parse(JSON.stringify(DEFAULT_DATA));
      }
      return JSON.parse(raw);
    } catch(e) {
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  }

  function setStore(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('wsms-store-changed', { detail: data }));
    } catch(e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  window.WSMS_STORE = {
    get: getStore,
    set: setStore,
    getDefaults: () => JSON.parse(JSON.stringify(DEFAULT_DATA))
  };

  // Pre-seed storage if not already seeded or update with defaults
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
  }
})();