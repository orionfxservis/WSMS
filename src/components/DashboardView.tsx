import React, { useState, useEffect } from 'react';
import { NewsTicker } from './NewsTicker';
import { CanInventory, DeliveryRecord, StationData, TravelStop } from '../types';
import { initialTravelStops, initialNotifications } from '../data/mockData';
import {
  Truck,
  DollarSign,
  TrendingUp,
  Receipt,
  Users,
  Building2,
  Boxes,
  FileText,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  Settings,
  Bell,
  ChevronRight,
  Droplet,
  Phone,
  Filter,
  BarChart2,
  ArrowLeft,
  Activity,
  Fuel,
  Zap,
  ShieldCheck,
  RefreshCw,
  Plus,
  Trash2,
  Search,
  Download,
  AlertCircle,
  Check,
  ExternalLink,
} from 'lucide-react';

interface DashboardViewProps {
  inventory: CanInventory;
  deliveries: DeliveryRecord[];
  stations: StationData[];
  onNavigateToSupply: () => void;
  onNavigateToLanding: () => void;
}

export interface DailyExpenseItem {
  id: number;
  date: string;
  description: string;
  nos: string;
  amount: number;
  paid: number;
  balance: number;
}

const initialExpenses: DailyExpenseItem[] = [
  {
    id: 1,
    date: '2026-10-20',
    description: 'Diesel for Suzuki Ravi (Route 1 & 2) - 14.2L refuel at PSO',
    nos: '1 Van',
    amount: 3500,
    paid: 3500,
    balance: 0,
  },
  {
    id: 2,
    date: '2026-10-19',
    description: 'RO Membrane Replacement (3000 GPD) - Clifton plant high pressure',
    nos: '1 Unit',
    amount: 4500,
    paid: 4500,
    balance: 0,
  },
  {
    id: 3,
    date: '2026-10-18',
    description: 'K-Electric Commercial Pumping Bill - Off-peak pumping slot unit',
    nos: '1 Meter',
    amount: 2500,
    paid: 2500,
    balance: 0,
  },
  {
    id: 4,
    date: '2026-10-20',
    description: 'Driver Daily Wages (3 Vans) - Day settlement Tariq, Imran & Zahid',
    nos: '3 Staff',
    amount: 2000,
    paid: 2000,
    balance: 0,
  },
];

export interface CustomerAccount {
  id: number;
  name: string;
  phone: string;
  address: string;
  discount: number;
  pending_cans: number;
  pending_payment: number;
  deposit: number;
  latitude?: number;
  longitude?: number;
  can19LDiscount?: number;
  can12LDiscount?: number;
  can6LDiscount?: number;
}

export const initialCustomerAccounts: CustomerAccount[] = [
  {
    id: 101,
    name: 'Metro Cash & Carry (Staff Canteen)',
    phone: '0300-1234567',
    address: 'University Road, Gulshan, Karachi',
    discount: 20,
    pending_cans: 30,
    pending_payment: 0,
    deposit: 30000,
    can19LDiscount: 20,
    can12LDiscount: 10,
    can6LDiscount: 5,
  },
  {
    id: 102,
    name: 'Indus Hospital & Health Network',
    phone: '0321-9876543',
    address: 'Korangi Sector 31, Karachi',
    discount: 0,
    pending_cans: 25,
    pending_payment: 4500,
    deposit: 25000,
    can19LDiscount: 0,
    can12LDiscount: 0,
    can6LDiscount: 0,
  },
  {
    id: 103,
    name: 'Dolmen Mall Food Court',
    phone: '0333-2345678',
    address: 'Clifton Block 4, Karachi',
    discount: 15,
    pending_cans: 40,
    pending_payment: 0,
    deposit: 40000,
    can19LDiscount: 15,
    can12LDiscount: 10,
    can6LDiscount: 5,
  },
  {
    id: 104,
    name: 'Aga Khan Labs Executive Wing',
    phone: '0300-4567890',
    address: 'Stadium Road, Karachi',
    discount: 30,
    pending_cans: 15,
    pending_payment: 1800,
    deposit: 15000,
    can19LDiscount: 30,
    can12LDiscount: 20,
    can6LDiscount: 10,
  },
  {
    id: 105,
    name: 'Dr. Tariq Dental Clinic',
    phone: '0301-8765432',
    address: 'Nursery, Shahrah-e-Faisal, Karachi',
    discount: 10,
    pending_cans: 8,
    pending_payment: 0,
    deposit: 8000,
    can19LDiscount: 10,
    can12LDiscount: 5,
    can6LDiscount: 5,
  },
  {
    id: 106,
    name: 'Ayesha Manzil Bakery & Cafe',
    phone: '0345-6789012',
    address: 'Block 7, Federal B Area, Karachi',
    discount: 12,
    pending_cans: 14,
    pending_payment: 2160,
    deposit: 14000,
    can19LDiscount: 12,
    can12LDiscount: 10,
    can6LDiscount: 5,
  },
  {
    id: 107,
    name: 'Siddiqui Law Associates',
    phone: '0315-1122334',
    address: 'Court Road, Saddar, Karachi',
    discount: 15,
    pending_cans: 10,
    pending_payment: 0,
    deposit: 10000,
    can19LDiscount: 15,
    can12LDiscount: 10,
    can6LDiscount: 5,
  },
  {
    id: 108,
    name: 'Bahria Town Sector B Villa 12',
    phone: '0302-9988776',
    address: 'Precinct 1, Super Highway, Karachi',
    discount: 0,
    pending_cans: 16,
    pending_payment: 3200,
    deposit: 16000,
    can19LDiscount: 0,
    can12LDiscount: 0,
    can6LDiscount: 0,
  },
];

export interface StationProfile {
  id: number;
  name: string;
  area: string;
  address: string;
  claimed_status: 'active' | 'claimed' | 'pending';
}

export const initialStationProfiles: StationProfile[] = [
  { id: 1, name: "Clifton RO Plant Depot", area: "Clifton Block 2", address: "Plot 14/B, Marine Drive, Clifton, Karachi", claimed_status: "active" },
  { id: 2, name: "Gulshan Mineral Hub", area: "Gulshan-e-Iqbal Block 6", address: "Main University Road, Near Expo Center, Karachi", claimed_status: "active" },
  { id: 3, name: "Korangi Industrial RO Station", area: "Korangi Sector 23", address: "Plot 89, Sector 23, Korangi Industrial Area, Karachi", claimed_status: "active" },
  { id: 4, name: "Shahrah-e-Faisal Depot", area: "PECHS Nursery", address: "Block 6, PECHS, Shahrah-e-Faisal, Karachi", claimed_status: "active" },
  { id: 5, name: "North Nazimabad RO Facility", area: "North Nazimabad Block H", address: "Near Sakhi Hasan, North Nazimabad, Karachi", claimed_status: "claimed" },
  { id: 6, name: "Saddar Central Filling Depot", area: "Saddar Downtown", address: "Preedy Street, Saddar, Karachi", claimed_status: "active" },
  { id: 7, name: "Bahria Town Distribution Hub", area: "Bahria Precinct 1", address: "Commercial Area, Precinct 1, Bahria Town, Karachi", claimed_status: "pending" }
];

export interface InventorySummaryItem {
  itemName: string;
  category: 'reusable' | 'sellable';
  available: number;
  totalOut: number; // Issued for reusable, Sold for sellable
  returned?: number; // Only for reusable
  damaged: number;
}

export interface InventoryLedgerEntry {
  id: number;
  date: string;
  type: 'Purchase' | 'Damaged';
  action: 'In' | 'Out' | 'Damaged';
  item: string;
  qty: number;
  unitPrice?: number | null;
  sellPrice?: number | null;
  note?: string;
}

export const initialInventorySummary: InventorySummaryItem[] = [
  { itemName: "19 Liter Can", category: 'reusable', available: 420, totalOut: 180, returned: 150, damaged: 6 },
  { itemName: "12 Liter Can", category: 'reusable', available: 180, totalOut: 75, returned: 60, damaged: 2 },
  { itemName: "Carton of 12 500ml", category: 'sellable', available: 85, totalOut: 140, damaged: 1 },
  { itemName: "Carton of 24 500ml", category: 'sellable', available: 60, totalOut: 95, damaged: 0 },
  { itemName: "Carton of 6 1.5L", category: 'sellable', available: 110, totalOut: 160, damaged: 2 },
  { itemName: "6 Liter Bottle", category: 'sellable', available: 250, totalOut: 320, damaged: 5 }
];

export const initialInventoryLedger: InventoryLedgerEntry[] = [
  { id: 101, date: "2026-10-22", type: "Purchase", action: "In", item: "19 Liter Can", qty: 100, unitPrice: 350, note: "Restock from supplier" },
  { id: 102, date: "2026-10-21", type: "Damaged", action: "Damaged", item: "19 Liter Can", qty: 4, unitPrice: null, note: "Valve leak during transit" },
  { id: 103, date: "2026-10-21", type: "Purchase", action: "In", item: "Carton of 24 500ml", qty: 50, unitPrice: 600, note: "Bulk carton restock" },
  { id: 104, date: "2026-10-20", type: "Purchase", action: "In", item: "6 Liter Bottle", qty: 80, unitPrice: 90, note: "Weekly retail batch" },
  { id: 105, date: "2026-10-19", type: "Damaged", action: "Damaged", item: "12 Liter Can", qty: 2, unitPrice: null, note: "Handle crack reported" }
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  inventory,
  deliveries,
  stations,
  onNavigateToSupply,
  onNavigateToLanding,
}) => {
  const [range, setRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [travelStops, setTravelStops] = useState<TravelStop[]>(initialTravelStops);
  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'filling' | 'supply' | 'expense'>('home');
  const [activeModal, setActiveModal] = useState<'customers' | 'stations' | 'inventory' | 'reports' | null>(null);
  const [stationList, setStationList] = useState<StationData[]>(stations);

  // Daily Expenses Ledger state
  const [expenses, setExpenses] = useState<DailyExpenseItem[]>(initialExpenses);
  const [expenseNotice, setExpenseNotice] = useState<string | null>(null);

  // New Expense Entry Form state
  const [newExpDate, setNewExpDate] = useState('2026-10-22');
  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpNos, setNewExpNos] = useState('');
  const [newExpAmount, setNewExpAmount] = useState<number | ''>('');
  const [newExpPaid, setNewExpPaid] = useState<number | ''>('');
  const [expenseSearch, setExpenseSearch] = useState('');
  const [expenseDateFilter, setExpenseDateFilter] = useState('');

  // Customer Management state (matching /pages/customers.html)
  const [customersList, setCustomersList] = useState<CustomerAccount[]>(initialCustomerAccounts);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerSortCol, setCustomerSortCol] = useState<'id' | 'name' | 'discount' | 'pending_cans' | 'pending_payment'>('id');
  const [customerSortDir, setCustomerSortDir] = useState<'asc' | 'desc'>('desc');
  const [customerNotice, setCustomerNotice] = useState<string | null>(null);

  // Customer Form state
  const [custEditingId, setCustEditingId] = useState<number | null>(null);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custDeposit, setCustDeposit] = useState<number | ''>('');
  const [custDiscount, setCustDiscount] = useState<number | ''>('');
  const [custCan19Discount, setCustCan19Discount] = useState<number | ''>('');
  const [custCan12Discount, setCustCan12Discount] = useState<number | ''>('');
  const [custCan6Discount, setCustCan6Discount] = useState<number | ''>('');
  const [showCustMap, setShowCustMap] = useState(false);
  const [custLat, setCustLat] = useState<number | ''>(24.8607);
  const [custLng, setCustLng] = useState<number | ''>(67.0011);

  // Station Profiles state (matching /pages/stations.html)
  const [stationProfiles, setStationProfiles] = useState<StationProfile[]>(initialStationProfiles);
  const [selectedStationProfileId, setSelectedStationProfileId] = useState<number | ''>('');
  const [stationSearch, setStationSearch] = useState('');
  const [isStationRequestOpen, setIsStationRequestOpen] = useState(false);
  const [requestStationName, setRequestStationName] = useState('');
  const [requestStationArea, setRequestStationArea] = useState('');
  const [stationNotice, setStationNotice] = useState<string | null>(null);
  const [stationsViewTab, setStationsViewTab] = useState<'profiles' | 'telemetry'>('profiles');

  // Inventory state (matching /pages/inventory.html)
  const [invSummary, setInvSummary] = useState<InventorySummaryItem[]>(initialInventorySummary);
  const [invLedger, setInvLedger] = useState<InventoryLedgerEntry[]>(initialInventoryLedger);
  const [invCategory, setInvCategory] = useState<'reusable' | 'sellable' | ''>('');
  const [invItem, setInvItem] = useState('');
  const [invAction, setInvAction] = useState<'Purchase' | 'Damage' | ''>('');
  const [invQty, setInvQty] = useState<number | ''>('');
  const [invUnitPrice, setInvUnitPrice] = useState<number | ''>('');
  const [invSellPrice, setInvSellPrice] = useState<number | ''>('');
  const [invNote, setInvNote] = useState('');
  const [inventoryNotice, setInventoryNotice] = useState<string | null>(null);

  // Edit / Delete dialogs
  const [editingInvEntry, setEditingInvEntry] = useState<InventoryLedgerEntry | null>(null);
  const [editInvQty, setEditInvQty] = useState<number | ''>('');
  const [editInvPrice, setEditInvPrice] = useState<number | ''>('');
  const [editInvNote, setEditInvNote] = useState('');
  const [deletingInvId, setDeletingInvId] = useState<number | null>(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');

  // Deliveries List & Supply State (matching /pages/supply.html)
  const [deliveriesList, setDeliveriesList] = useState<DeliveryRecord[]>(deliveries);
  const [supplyCustomer, setSupplyCustomer] = useState('101');
  const [supplyDate, setSupplyDate] = useState('2026-10-20');
  const [supplyItem, setSupplyItem] = useState('19 Liter Can');
  const [supplyRate, setSupplyRate] = useState(60);
  const [supplyDiscount, setSupplyDiscount] = useState(20);
  const [supplyDelivered, setSupplyDelivered] = useState<number | ''>(30);
  const [supplyReceived, setSupplyReceived] = useState<number | ''>(25);
  const [supplyPaymentType, setSupplyPaymentType] = useState<'Cash' | 'Credit'>('Cash');
  const [supplyNotice, setSupplyNotice] = useState<string | null>(null);
  const [supplySearch, setSupplySearch] = useState('');

  // Computed Summary Values
  const deliveredList = deliveriesList.filter((d) => d.status === 'Delivered');
  const sumDeliveriesCount = deliveredList.length + 18; // Includes fulfilled morning cycle
  const sumRevenue = deliveredList.reduce((acc, d) => acc + d.amount, 0) + 21500;
  const sumExpense = expenses.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const sumExpensePaid = expenses.reduce((acc, item) => acc + (Number(item.paid) || 0), 0);
  const sumExpenseBalance = expenses.reduce((acc, item) => acc + (Number(item.balance) || 0), 0);
  const sumProfit = Math.max(0, sumRevenue - sumExpense);

  // Filling Records matching filling.html
  const [fillings, setFillings] = useState([
    {
      id: 101,
      date: '2026-10-20',
      time: '14:15',
      stationId: 'st-01',
      stationName: 'Clifton RO Plant',
      amount: 3000,
      paymentType: 'Cash',
      note: 'Filling: 50 x 19 Liter Can at 14:15',
    },
    {
      id: 102,
      date: '2026-10-20',
      time: '11:30',
      stationId: 'st-02',
      stationName: 'Korangi Sector 31 Station',
      amount: 2200,
      paymentType: 'Online',
      note: 'Filling: 40 x 19 Liter Can at 11:30',
    },
    {
      id: 103,
      date: '2026-10-19',
      time: '16:45',
      stationId: 'st-03',
      stationName: 'Gulshan Pumping Depot',
      amount: 3600,
      paymentType: 'Cash',
      note: 'Filling: 60 x 19 Liter Can at 16:45',
    },
    {
      id: 104,
      date: '2026-10-19',
      time: '09:10',
      stationId: 'st-01',
      stationName: 'Clifton RO Plant',
      amount: 2400,
      paymentType: 'Cash',
      note: 'Filling: 40 x 19 Liter Can at 09:10',
    },
    {
      id: 105,
      date: '2026-10-18',
      time: '13:00',
      stationId: 'st-04',
      stationName: 'North Nazimabad Plant',
      amount: 4200,
      paymentType: 'Credit',
      note: 'Filling: 70 x 19 Liter Can at 13:00',
    },
  ]);

  const [formDate, setFormDate] = useState('2026-10-20');
  const [formTime, setFormTime] = useState('14:45');
  const [formStationId, setFormStationId] = useState('st-01');
  const [formItem, setFormItem] = useState('19 Liter Can');
  const [formRate, setFormRate] = useState(60);
  const [formQty, setFormQty] = useState<number | ''>(50);
  const [fillingNotice, setFillingNotice] = useState<string | null>(null);

  const handleStationChange = (id: string) => {
    setFormStationId(id);
    // Set appropriate rate based on station
    if (id === 'st-02') {
      setFormRate(formItem.includes('19') ? 55 : formItem.includes('12') ? 35 : 20);
    } else {
      setFormRate(formItem.includes('19') ? 60 : formItem.includes('12') ? 40 : 25);
    }
  };

  const handleItemChange = (item: string) => {
    setFormItem(item);
    if (formStationId === 'st-02') {
      setFormRate(item.includes('19') ? 55 : item.includes('12') ? 35 : 20);
    } else {
      setFormRate(item.includes('19') ? 60 : item.includes('12') ? 40 : 25);
    }
  };

  const handleAddFillingEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = typeof formQty === 'number' ? formQty : parseInt(String(formQty), 10) || 0;
    if (qty <= 0) return;

    const matchedStation = stationList.find((s) => s.id === formStationId) || stationList[0];
    const total = qty * formRate;
    const note = `Filling: ${qty} x ${formItem} at ${formTime}`;

    const newRecord = {
      id: Date.now(),
      date: formDate,
      time: formTime,
      stationId: formStationId,
      stationName: matchedStation ? matchedStation.name : 'Central Station',
      amount: total,
      paymentType: 'Cash',
      note: note,
    };

    setFillings((prev) => [newRecord, ...prev]);
    setFillingNotice(`✓ Added: ${qty} cans filled at ${matchedStation?.name || 'station'} for Rs ${total.toLocaleString()}`);
    setTimeout(() => setFillingNotice(null), 4000);
  };

  const totalFillingCost = fillings.reduce((acc, f) => acc + f.amount, 0);
  const totalFillingEntries = fillings.length;
  const avgFillingCost = totalFillingEntries > 0 ? Math.round(totalFillingCost / totalFillingEntries) : 0;

  // Supply Record calculations & handlers
  const supplyFinalRate = Math.max(0, supplyRate - (Number(supplyDiscount) || 0));
  const supplyTotalAmount = (Number(supplyDelivered) || 0) * supplyFinalRate;
  const supplyBalance = (Number(supplyDelivered) || 0) - (Number(supplyReceived) || 0);

  const handleSupplyCustomerChange = (customerId: string) => {
    setSupplyCustomer(customerId);
    const cust = customersList.find((c) => String(c.id) === customerId);
    if (cust) {
      setSupplyDiscount(cust.discount || 0);
    }
  };

  const handleSupplyItemChange = (item: string) => {
    setSupplyItem(item);
    if (item.includes('19')) setSupplyRate(60);
    else if (item.includes('12')) setSupplyRate(40);
    else if (item.includes('6')) setSupplyRate(25);
    else if (item.includes('24 500ml')) setSupplyRate(600);
    else if (item.includes('12 500ml')) setSupplyRate(350);
    else setSupplyRate(450);
  };

  const handleAddSupplyRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const deliveredQty = typeof supplyDelivered === 'number' ? supplyDelivered : parseInt(String(supplyDelivered), 10) || 0;
    const receivedQty = typeof supplyReceived === 'number' ? supplyReceived : parseInt(String(supplyReceived), 10) || 0;
    if (deliveredQty <= 0) return;

    const matchedCust = customersList.find((c) => String(c.id) === supplyCustomer);
    const custName = matchedCust ? matchedCust.name : 'Customer';

    const newDelivery: DeliveryRecord = {
      id: `del-${Date.now()}`,
      orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: custName,
      customerPhone: matchedCust?.phone || '+92 300 1234567',
      address: matchedCust?.address || 'Karachi',
      zone: 'Zone Central',
      cansDelivered: deliveredQty,
      emptyCollected: receivedQty,
      netDepositBalance: 0,
      paymentMethod: supplyPaymentType,
      amount: supplyTotalAmount,
      status: 'Delivered',
      driverName: 'Zahid Iqbal',
      driverPhone: '+92 313 4455667',
      timestamp: supplyDate ? `${supplyDate}` : new Date().toISOString().split('T')[0],
      notes: `${deliveredQty} x ${supplyItem} @ Rs ${supplyFinalRate}`,
    };

    setDeliveriesList((prev) => [newDelivery, ...prev]);
    setSupplyNotice(`✓ Added Supply Record: ${deliveredQty} cans delivered to ${custName} (Rs ${supplyTotalAmount.toLocaleString()})`);
    setTimeout(() => setSupplyNotice(null), 4000);

    setSupplyDelivered('');
    setSupplyReceived('');
  };

  const handleDeleteDelivery = (id: string) => {
    setDeliveriesList((prev) => prev.filter((d) => d.id !== id));
    setSupplyNotice('✓ Delivery record deleted');
    setTimeout(() => setSupplyNotice(null), 3000);
  };

  const exportSupplyCSV = () => {
    const headers = ['Order #', 'Customer Name', 'Phone', 'Address', 'Cans Delivered', 'Cans Returned', 'Net Balance', 'Total Amount', 'Payment Mode', 'Status'];
    const rows = deliveriesList.map((d) => [
      d.orderNumber,
      `"${d.customerName}"`,
      d.customerPhone,
      `"${d.address}"`,
      d.cansDelivered,
      d.emptyCollected,
      d.cansDelivered - d.emptyCollected,
      d.amount,
      d.paymentMethod,
      d.status,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wsms_supply_deliveries_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Synchronize state with shared store for cross-page consistency
  useEffect(() => {
    try {
      const store = {
        summary: {
          total_deliveries: sumDeliveriesCount,
          total_revenue: sumRevenue,
          total_expenses: sumExpense,
          profit: sumProfit,
          active_customers: customersList.length,
          in_circulation: inventory.totalCirculation,
        },
        inventory,
        deliveries: deliveriesList,
        fillings,
        expenses,
        stations: stationList,
        customers: customersList,
      };
      localStorage.setItem('wsms_shared_store_v1', JSON.stringify(store));
    } catch (e) {
      // safe fallback
    }
  }, [sumDeliveriesCount, sumRevenue, sumExpense, sumProfit, fillings, expenses, inventory, deliveriesList, customersList, stationList]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = typeof newExpAmount === 'number' ? newExpAmount : parseFloat(String(newExpAmount)) || 0;
    const paidVal = typeof newExpPaid === 'number' ? newExpPaid : (newExpPaid === '' ? amountVal : parseFloat(String(newExpPaid)) || 0);
    if (!newExpDesc.trim()) return;
    if (amountVal <= 0) return;

    const balanceVal = Math.max(0, amountVal - paidVal);

    const newRecord: DailyExpenseItem = {
      id: Date.now(),
      date: newExpDate || new Date().toISOString().split('T')[0],
      description: newExpDesc.trim(),
      nos: newExpNos.trim() || '1',
      amount: amountVal,
      paid: paidVal,
      balance: balanceVal,
    };

    setExpenses((prev) => [newRecord, ...prev]);
    setExpenseNotice(`✓ Added: ${newRecord.description} (Rs ${amountVal.toLocaleString()})`);
    setTimeout(() => setExpenseNotice(null), 4000);

    // Reset inputs
    setNewExpDesc('');
    setNewExpNos('');
    setNewExpAmount('');
    setNewExpPaid('');
  };

  const handleSettleExpenseBalance = (id: number) => {
    setExpenses((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, paid: item.amount, balance: 0 } : item
      )
    );
    setExpenseNotice(`✓ Settled: Expense record marked as fully paid.`);
    setTimeout(() => setExpenseNotice(null), 4000);
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const handleExportExpensesCSV = () => {
    const headers = ['Date', 'Description', 'Nos', 'Amount (PKR)', 'Paid (PKR)', 'Balance (PKR)'];
    const rows = expenses.map((e) => [
      `"${e.date}"`,
      `"${e.description.replace(/"/g, '""')}"`,
      `"${e.nos}"`,
      e.amount,
      e.paid,
      e.balance,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WSMS_Daily_Expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Customer Management Handlers (matching /pages/customers.html)
  const handleCustomerPhoneChange = (val: string) => {
    let digits = val.replace(/\D/g, '');
    if (digits.length > 11) digits = digits.slice(0, 11);
    if (digits.length > 4) {
      setCustPhone(`${digits.slice(0, 4)}-${digits.slice(4)}`);
    } else {
      setCustPhone(digits);
    }
  };

  const handleSelectCustomerForEdit = (cust: CustomerAccount) => {
    setCustEditingId(cust.id);
    setCustName(cust.name);
    setCustPhone(cust.phone);
    setCustAddress(cust.address);
    setCustDeposit(cust.deposit);
    setCustDiscount(cust.discount);
    setCustCan19Discount(cust.can19LDiscount ?? cust.discount ?? 15);
    setCustCan12Discount(cust.can12LDiscount ?? 10);
    setCustCan6Discount(cust.can6LDiscount ?? 5);
    setCustLat(cust.latitude ?? 24.8607);
    setCustLng(cust.longitude ?? 67.0011);
    setCustomerNotice(`Selected customer #${cust.id}: ${cust.name} for editing.`);
    setTimeout(() => setCustomerNotice(null), 3000);
  };

  const handleClearCustomerForm = () => {
    setCustEditingId(null);
    setCustName('');
    setCustPhone('');
    setCustAddress('');
    setCustDeposit('');
    setCustDiscount('');
    setCustCan19Discount('');
    setCustCan12Discount('');
    setCustCan6Discount('');
    setShowCustMap(false);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) {
      setCustomerNotice('⚠️ Customer Name is required.');
      return;
    }

    const depositVal = typeof custDeposit === 'number' ? custDeposit : parseFloat(String(custDeposit)) || 0;
    const discountVal = typeof custDiscount === 'number' ? custDiscount : parseFloat(String(custDiscount)) || 0;
    const can19Val = typeof custCan19Discount === 'number' ? custCan19Discount : (custCan19Discount === '' ? discountVal : parseFloat(String(custCan19Discount)) || 0);
    const can12Val = typeof custCan12Discount === 'number' ? custCan12Discount : (custCan12Discount === '' ? 10 : parseFloat(String(custCan12Discount)) || 0);
    const can6Val = typeof custCan6Discount === 'number' ? custCan6Discount : (custCan6Discount === '' ? 5 : parseFloat(String(custCan6Discount)) || 0);

    if (custEditingId !== null) {
      setCustomersList((prev) =>
        prev.map((c) =>
          c.id === custEditingId
            ? {
                ...c,
                name: custName.trim(),
                phone: custPhone.trim() || '0300-0000000',
                address: custAddress.trim() || 'Karachi, Sindh',
                deposit: depositVal,
                discount: discountVal,
                latitude: typeof custLat === 'number' ? custLat : 24.8607,
                longitude: typeof custLng === 'number' ? custLng : 67.0011,
                can19LDiscount: can19Val,
                can12LDiscount: can12Val,
                can6LDiscount: can6Val,
              }
            : c
        )
      );
      setCustomerNotice(`✓ Customer #${custEditingId} (${custName}) updated successfully!`);
    } else {
      const nextId = (customersList.reduce((max, c) => Math.max(max, c.id), 100) || 100) + 1;
      const newCust: CustomerAccount = {
        id: nextId,
        name: custName.trim(),
        phone: custPhone.trim() || '0300-0000000',
        address: custAddress.trim() || 'Karachi, Sindh',
        discount: discountVal,
        deposit: depositVal,
        pending_cans: 0,
        pending_payment: 0,
        latitude: typeof custLat === 'number' ? custLat : 24.8607,
        longitude: typeof custLng === 'number' ? custLng : 67.0011,
        can19LDiscount: can19Val,
        can12LDiscount: can12Val,
        can6LDiscount: can6Val,
      };
      setCustomersList((prev) => [newCust, ...prev]);
      setCustomerNotice(`✓ Customer #${nextId} (${newCust.name}) added successfully!`);
    }

    handleClearCustomerForm();
    setTimeout(() => setCustomerNotice(null), 4000);
  };

  const handleDeleteCustomer = (id: number) => {
    const target = customersList.find((c) => c.id === id);
    if (!target) return;
    setCustomersList((prev) => prev.filter((c) => c.id !== id));
    if (custEditingId === id) handleClearCustomerForm();
    setCustomerNotice(`✓ Customer #${id} (${target.name}) removed.`);
    setTimeout(() => setCustomerNotice(null), 4000);
  };

  const handleSortCustomer = (col: typeof customerSortCol) => {
    if (customerSortCol === col) {
      setCustomerSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setCustomerSortCol(col);
      setCustomerSortDir('asc');
    }
  };

  const handleExportCustomersCSV = () => {
    const headers = ['ID', 'Customer Name', 'Phone', 'Address', 'Deposit (Rs)', 'Special Discount (Rs)', 'Pending Cans', 'Pending Payment (Rs)'];
    const rows = customersList.map((c) => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.address.replace(/"/g, '""')}"`,
      c.deposit,
      c.discount,
      c.pending_cans,
      c.pending_payment,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wsms_customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCustomers = customersList
    .filter((c) => {
      const q = customerSearch.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let valA: any = a[customerSortCol];
      let valB: any = b[customerSortCol];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return customerSortDir === 'asc' ? -1 : 1;
      if (valA > valB) return customerSortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const toggleStopStatus = (id: string) => {
    setTravelStops((prev) =>
      prev.map((stop) =>
        stop.id === id
          ? {
              ...stop,
              status: stop.status === 'Delivered' ? 'Scheduled' : 'Delivered',
            }
          : stop
      )
    );
  };

  const toggleStationPump = (id: string) => {
    setStationList((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: s.status === 'Operational' ? 'Maintenance' : 'Operational',
            }
          : s
      )
    );
  };

  // Station Profiles Handlers (matching /pages/stations.html)
  const handleSelectStationProfile = (id: number | '') => {
    setSelectedStationProfileId(id);
    if (id !== '') {
      const s = stationProfiles.find((x) => x.id === id);
      if (s) {
        setStationNotice(`Selected Profile: ${s.name} (${s.area || s.address})`);
        setTimeout(() => setStationNotice(null), 3500);
      }
    }
  };

  const handleSubmitStationRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestStationName.trim()) {
      setStationNotice('⚠️ Please enter station name.');
      return;
    }
    const newId = (stationProfiles.reduce((max, s) => Math.max(max, s.id), 0) || 0) + 1;
    const newStation: StationProfile = {
      id: newId,
      name: requestStationName.trim(),
      area: requestStationArea.trim() || 'Karachi',
      address: `${requestStationArea.trim() || 'Karachi'}, Sindh`,
      claimed_status: 'pending',
    };
    setStationProfiles((prev) => [newStation, ...prev]);
    setSelectedStationProfileId(newId);
    setIsStationRequestOpen(false);
    setRequestStationName('');
    setRequestStationArea('');
    setStationNotice(`✓ Station request "${newStation.name}" submitted successfully! Admin will review it.`);
    setTimeout(() => setStationNotice(null), 4500);
  };

  const filteredStationProfiles = stationProfiles.filter((s) => {
    const q = stationSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      (s.area && s.area.toLowerCase().includes(q)) ||
      (s.address && s.address.toLowerCase().includes(q))
    );
  });

  // Inventory Handlers (matching /pages/inventory.html)
  const handleAddInventoryEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invCategory || !invItem || !invAction || !invQty) {
      setInventoryNotice('⚠️ Please fill all required fields.');
      return;
    }
    const qtyVal = typeof invQty === 'number' ? invQty : parseInt(String(invQty), 10) || 0;
    if (qtyVal <= 0) return;

    const unitPriceVal = typeof invUnitPrice === 'number' ? invUnitPrice : (invUnitPrice === '' ? null : parseFloat(String(invUnitPrice)));
    const sellPriceVal = typeof invSellPrice === 'number' ? invSellPrice : (invSellPrice === '' ? null : parseFloat(String(invSellPrice)));

    const newEntry: InventoryLedgerEntry = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      type: invAction === 'Purchase' ? 'Purchase' : 'Damaged',
      action: invAction === 'Purchase' ? 'In' : 'Damaged',
      item: invItem,
      qty: qtyVal,
      unitPrice: unitPriceVal,
      sellPrice: sellPriceVal,
      note: invNote.trim() || undefined,
    };

    setInvLedger((prev) => [newEntry, ...prev]);

    // Update summary table
    setInvSummary((prev) => {
      const existing = prev.find((s) => s.itemName === invItem);
      if (existing) {
        return prev.map((s) => {
          if (s.itemName !== invItem) return s;
          if (invAction === 'Purchase') {
            return { ...s, available: s.available + qtyVal };
          } else {
            return {
              ...s,
              damaged: s.damaged + qtyVal,
              available: Math.max(0, s.available - qtyVal),
            };
          }
        });
      } else {
        return [
          ...prev,
          {
            itemName: invItem,
            category: invCategory as 'reusable' | 'sellable',
            available: invAction === 'Purchase' ? qtyVal : 0,
            totalOut: 0,
            returned: invCategory === 'reusable' ? 0 : undefined,
            damaged: invAction === 'Damage' ? qtyVal : 0,
          },
        ];
      }
    });

    setInventoryNotice(`✓ Recorded ${invAction}: ${qtyVal} x ${invItem}`);
    setTimeout(() => setInventoryNotice(null), 4000);

    // Reset form
    setInvQty('');
    setInvUnitPrice('');
    setInvSellPrice('');
    setInvNote('');
  };

  const handleOpenEditEntry = (entry: InventoryLedgerEntry) => {
    setEditingInvEntry(entry);
    setEditInvQty(entry.qty);
    setEditInvPrice(entry.unitPrice ?? '');
    setEditInvNote(entry.note || '');
  };

  const handleSaveEditEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvEntry) return;
    const qtyVal = typeof editInvQty === 'number' ? editInvQty : parseInt(String(editInvQty), 10) || 0;
    if (qtyVal <= 0) return;
    const priceVal = typeof editInvPrice === 'number' ? editInvPrice : (editInvPrice === '' ? null : parseFloat(String(editInvPrice)));

    setInvLedger((prev) =>
      prev.map((e) =>
        e.id === editingInvEntry.id
          ? {
              ...e,
              qty: qtyVal,
              unitPrice: priceVal,
              note: editInvNote.trim() || undefined,
            }
          : e
      )
    );

    setInventoryNotice(`✓ Entry for ${editingInvEntry.item} updated successfully.`);
    setTimeout(() => setInventoryNotice(null), 3000);
    setEditingInvEntry(null);
  };

  const handleDeleteEntry = () => {
    if (!deletingInvId) return;
    if (deleteConfirmInput.trim() !== 'DELETE') {
      setInventoryNotice('⚠️ Type DELETE to confirm deletion.');
      return;
    }
    const target = invLedger.find((e) => e.id === deletingInvId);
    setInvLedger((prev) => prev.filter((e) => e.id !== deletingInvId));
    setInventoryNotice(`✓ Inventory entry #${deletingInvId} (${target?.item || ''}) deleted.`);
    setTimeout(() => setInventoryNotice(null), 4000);
    setDeletingInvId(null);
    setDeleteConfirmInput('');
  };

  const handleResetItem = (itemName: string) => {
    if (!window.confirm(`Are you sure you want to reset all records for "${itemName}"?`)) return;
    setInvLedger((prev) => prev.filter((e) => e.item.toLowerCase() !== itemName.toLowerCase()));
    setInvSummary((prev) =>
      prev.map((s) =>
        s.itemName.toLowerCase() === itemName.toLowerCase()
          ? { ...s, available: 0, totalOut: 0, returned: s.returned !== undefined ? 0 : undefined, damaged: 0 }
          : s
      )
    );
    setInventoryNotice(`✓ Records for ${itemName} have been reset.`);
    setTimeout(() => setInventoryNotice(null), 4000);
  };

  // Activity Chart Data based on range (matching dashboard.html)
  const chartData = {
    daily: [
      { label: '08:00 AM', deliveries: 12, revenue: 5200 },
      { label: '11:00 AM', deliveries: 22, revenue: 9400 },
      { label: '02:00 PM', deliveries: 28, revenue: 11500 },
      { label: '05:00 PM', deliveries: 18, revenue: 7400 },
    ],
    weekly: [
      { label: 'Mon', deliveries: 28, revenue: 28400 },
      { label: 'Tue', deliveries: 31, revenue: 31200 },
      { label: 'Wed', deliveries: 30, revenue: 29800 },
      { label: 'Thu', deliveries: 35, revenue: 34500 },
      { label: 'Fri', deliveries: 36, revenue: 36000 },
      { label: 'Sat', deliveries: 32, revenue: 32100 },
      { label: 'Sun', deliveries: 34, revenue: 33500 },
    ],
    monthly: [
      { label: 'Jun', deliveries: 720, revenue: 720000 },
      { label: 'Jul', deliveries: 840, revenue: 840000 },
      { label: 'Aug', deliveries: 910, revenue: 910000 },
      { label: 'Sep', deliveries: 980, revenue: 980000 },
      { label: 'Oct', deliveries: 1045, revenue: 1045000 },
    ],
  };

  const currentPoints = chartData[range];
  const maxDeliveryVal = Math.max(...currentPoints.map((p) => p.deliveries));

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#222222] pb-28 font-sans">
      {/* Sub-header User Bar matching WSMS header.css */}
      <div className="bg-[#007bdb] text-white px-4 py-2.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigateToLanding();
              }}
              className="flex items-center gap-2.5 group no-underline text-white"
              title="Return to Main Overview"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1 shadow-xs overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src="./assets/img/logo/logo.png"
                  alt="WSMS Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).src = './assets/img/logo.png'; }}
                />
              </div>
              <div className="flex flex-col leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-white">WSMS</span>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-blue-100 bg-white/20 px-1.5 py-0.5 rounded">
                    Portal
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#70e0a1] animate-pulse ml-0.5" />
                </div>
                <span className="text-[11px] text-blue-100 font-medium hidden sm:inline">
                  Water Supply Management System
                </span>
              </div>
            </a>

            {/* Dynamic Page Badge matching 900.JPG */}
            <a
              href={
                activeBottomNav === 'home'
                  ? './pages/dashboard.html'
                  : activeBottomNav === 'filling'
                  ? './pages/filling.html'
                  : activeBottomNav === 'supply'
                  ? './pages/supply.html'
                  : './pages/expense.html'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/20 hover:bg-white/30 text-white text-xs font-mono font-medium border border-white/25 transition-colors shadow-2xs no-underline"
              title="Open section page"
            >
              <span>
                {activeBottomNav === 'home' && '/pages/dashboard.html'}
                {activeBottomNav === 'filling' && '/pages/filling.html'}
                {activeBottomNav === 'supply' && '/pages/supply.html'}
                {activeBottomNav === 'expense' && '/pages/expense.html'}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-white/90" />
            </a>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="hidden md:inline-block text-blue-100">
              {new Date().toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            {activeBottomNav !== 'home' ? (
              <button
                type="button"
                onClick={() => {
                  setActiveBottomNav('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-white hover:text-blue-100 underline cursor-pointer"
              >
                ← Back to Home
              </button>
            ) : (
              <button
                type="button"
                onClick={onNavigateToLanding}
                className="text-white hover:text-blue-100 underline cursor-pointer"
              >
                ← Back to Overview
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Dashboard Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4">
        {/* LIVE KARACHI NEWS TICKER matching user screenshot (895_580dd5a0.JPG) */}
        <NewsTicker />

        {/* =========================================================================
            TAB 1: HOME OVERVIEW (Default Dashboard View matching dashboard.html)
            ========================================================================= */}
        {activeBottomNav === 'home' && (
          <>
            {/* 4 SIGNATURE SUMMARY CARDS matching dashboard.html (height reduced by 15%) */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3.5" aria-label="Operational Summary Cards">
              {/* Deliveries Card (--g-blue) */}
              <div
                className="rounded-[12px] text-white py-2.5 sm:py-3 px-3.5 sm:px-4 flex justify-between items-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-transform hover:-translate-y-0.5 cursor-pointer"
                style={{ background: 'var(--g-blue)' }}
                onClick={() => setActiveBottomNav('supply')}
                title="Click to view delivery dispatch log"
              >
                <div>
                  <h4 className="m-0 mb-0.5 text-[13px] font-semibold opacity-90 leading-tight">Deliveries</h4>
                  <p className="m-0 text-xl sm:text-[22px] font-bold leading-tight">{sumDeliveriesCount}</p>
                  <span className="text-[10px] opacity-80 leading-tight block mt-0.5">Today's Total Dispatch</span>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-7 h-7 sm:w-8 sm:h-8 opacity-90 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M3 7h13v13H3zM16 10h5l-1.5-3H16zM6 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm11 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                </svg>
              </div>

              {/* Revenue Card (--g-green) */}
              <div
                className="rounded-[12px] text-white py-2.5 sm:py-3 px-3.5 sm:px-4 flex justify-between items-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-transform hover:-translate-y-0.5 cursor-pointer"
                style={{ background: 'var(--g-green)' }}
                onClick={() => setActiveBottomNav('expense')}
                title="Click to view revenue report"
              >
                <div>
                  <h4 className="m-0 mb-0.5 text-[13px] font-semibold opacity-90 leading-tight">Revenue</h4>
                  <p className="m-0 text-xl sm:text-[22px] font-bold leading-tight">Rs {sumRevenue.toLocaleString()}</p>
                  <span className="text-[10px] opacity-80 leading-tight block mt-0.5">Settled & Collected</span>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-7 h-7 sm:w-8 sm:h-8 opacity-90 shrink-0"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
              </div>

              {/* Expenses Card (--g-orange) */}
              <div
                className="rounded-[12px] text-white py-2.5 sm:py-3 px-3.5 sm:px-4 flex justify-between items-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-transform hover:-translate-y-0.5 cursor-pointer"
                style={{ background: 'var(--g-orange)' }}
                onClick={() => setActiveBottomNav('expense')}
                title="Click to view expenses breakdown"
              >
                <div>
                  <h4 className="m-0 mb-0.5 text-[13px] font-semibold opacity-90 leading-tight">Expenses</h4>
                  <p className="m-0 text-xl sm:text-[22px] font-bold leading-tight">Rs {sumExpense.toLocaleString()}</p>
                  <span className="text-[10px] opacity-80 leading-tight block mt-0.5">Fleet, Diesel & Bills</span>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-7 h-7 sm:w-8 sm:h-8 opacity-90 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M3 7h18v10H3zM3 7l9 6 9-6" />
                </svg>
              </div>

              {/* Profit Card (--g-violet) */}
              <div
                className="rounded-[12px] text-white py-2.5 sm:py-3 px-3.5 sm:px-4 flex justify-between items-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-transform hover:-translate-y-0.5 cursor-pointer"
                style={{ background: 'var(--g-violet)' }}
                onClick={() => setActiveBottomNav('expense')}
                title="Click to view profit ledger"
              >
                <div>
                  <h4 className="m-0 mb-0.5 text-[13px] font-semibold opacity-90 leading-tight">Profit</h4>
                  <p className="m-0 text-xl sm:text-[22px] font-bold leading-tight">Rs {sumProfit.toLocaleString()}</p>
                  <span className="text-[10px] opacity-80 leading-tight block mt-0.5">Net Realized Today</span>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-7 h-7 sm:w-8 sm:h-8 opacity-90 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M3 17l6-6 4 4 8-8" />
                </svg>
              </div>
            </section>

            {/* QUICK LINKS matching dashboard.html */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5" aria-label="Quick Navigation">
              <div className="rounded-[10px] p-2.5 sm:p-3 text-center border-2 border-[#0077cc] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.04)] flex flex-col items-center justify-between gap-1.5 hover:bg-blue-50/50 transition-colors">
                <button
                  type="button"
                  onClick={() => setActiveModal('customers')}
                  className="font-bold text-[#0077cc] text-sm hover:underline cursor-pointer"
                >
                  Customers
                </button>
                <a
                  href="./pages/customers.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#0077cc] bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition-colors no-underline"
                  title="Open /pages/customers.html"
                >
                  <span>/pages/customers.html</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                </a>
              </div>

              <div className="rounded-[10px] p-2.5 sm:p-3 text-center border-2 border-[#0077cc] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.04)] flex flex-col items-center justify-between gap-1.5 hover:bg-blue-50/50 transition-colors">
                <button
                  type="button"
                  onClick={() => setActiveModal('stations')}
                  className="font-bold text-[#0077cc] text-sm hover:underline cursor-pointer"
                >
                  Filling Stations
                </button>
                <a
                  href="./pages/stations.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#0077cc] bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition-colors no-underline"
                  title="Open /pages/stations.html"
                >
                  <span>/pages/stations.html</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                </a>
              </div>

              <div className="rounded-[10px] p-2.5 sm:p-3 text-center border-2 border-[#0077cc] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.04)] flex flex-col items-center justify-between gap-1.5 hover:bg-blue-50/50 transition-colors">
                <button
                  type="button"
                  onClick={() => setActiveModal('inventory')}
                  className="font-bold text-[#0077cc] text-sm hover:underline cursor-pointer"
                >
                  Inventory
                </button>
                <a
                  href="./pages/inventory.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#0077cc] bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition-colors no-underline"
                  title="Open /pages/inventory.html"
                >
                  <span>/pages/inventory.html</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                </a>
              </div>

              <div className="rounded-[10px] p-2.5 sm:p-3 text-center border-2 border-[#0077cc] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.04)] flex flex-col items-center justify-between gap-1.5 hover:bg-blue-50/50 transition-colors">
                <button
                  type="button"
                  onClick={() => setActiveModal('reports')}
                  className="font-bold text-[#0077cc] text-sm hover:underline cursor-pointer"
                >
                  Reports
                </button>
                <a
                  href="./pages/report.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#0077cc] bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition-colors no-underline"
                  title="Open /pages/report.html"
                >
                  <span>/pages/report.html</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                </a>
              </div>
            </section>

            {/* TRAVEL PLAN (TOMORROW) BLOCK matching image_6737b148.png and dashboard.html */}
            <section className="bg-white rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] p-3.5 sm:p-4 mb-3.5">
              <h3 className="m-0 text-[#0077cc] text-[15px] font-bold mb-3">
                Travel Plan (Tomorrow)
              </h3>

              <div id="travelPlan">
                {/* Total Distance Banner matching screenshot image_6737b148.png */}
                <div className="mb-3 p-2.5 sm:p-3 bg-[#f0f7ff] rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-1 border border-blue-100">
                  <div>
                    <strong className="text-sm text-[#222]">Total Distance:</strong>
                    <div className="text-xs text-[#666] mt-0.5">
                      5 customers scheduled • Starting from: Korangi Central Depot
                    </div>
                  </div>
                  <span className="text-lg font-bold text-[#0077cc]">28.4 km</span>
                </div>

                {/* Numbered Stops List matching image_6737b148.png */}
                <div className="max-h-[340px] overflow-y-auto">
                  <ol className="m-0 pl-5 space-y-2.5 list-decimal text-sm font-semibold text-[#333]">
                    {/* Stop 1 */}
                    <li className="p-2 sm:p-2.5 bg-white border-l-[3px] border-[#0077cc] rounded shadow-2xs">
                      <div className="text-[13px] text-[#333] font-normal flex flex-wrap gap-2 items-center">
                        <span className="font-semibold text-[#222]">Indus Hospital & Health Network</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-[#666]">Korangi Sector 31</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-[#28a745] font-semibold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#28a745]" />
                          09:30 AM
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-[#0077cc] font-medium">4.8 km</span>
                      </div>
                    </li>

                    {/* Stop 2 */}
                    <li className="p-2 sm:p-2.5 bg-white border-l-[3px] border-[#0077cc] rounded shadow-2xs">
                      <div className="text-[13px] text-[#333] font-normal flex flex-wrap gap-2 items-center">
                        <span className="font-semibold text-[#222]">Habib University Campus</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-[#666]">Block 18, Gulistan-e-Johar</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-[#28a745] font-semibold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#28a745]" />
                          11:15 AM
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-[#0077cc] font-medium">9.2 km</span>
                      </div>
                    </li>

                    {/* Stop 3 */}
                    <li className="p-2 sm:p-2.5 bg-white border-l-[3px] border-[#0077cc] rounded shadow-2xs">
                      <div className="text-[13px] text-[#333] font-normal flex flex-wrap gap-2 items-center">
                        <span className="font-semibold text-[#222]">Clifton Medical Complex</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-[#666]">Block 4, Clifton</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-[#28a745] font-semibold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#28a745]" />
                          01:45 PM
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-[#0077cc] font-medium">7.1 km</span>
                      </div>
                    </li>

                    {/* Stop 4: Return to Central Depot */}
                    <li className="mt-2.5 p-2.5 bg-[#e8f5e9] border-l-[3px] border-[#28a745] rounded shadow-2xs list-none -ml-5 sm:-ml-5">
                      <div className="flex items-start gap-2">
                        <span className="text-base leading-none">🏢</span>
                        <div className="min-w-0">
                          <div className="font-semibold text-[#333] text-[13px]">Return to Central Depot</div>
                          <div className="text-xs text-[#666] mt-0.5">Plot 42, Korangi Industrial Area, Karachi</div>
                          <div className="text-[11px] text-[#28a745] font-medium mt-1">Distance: 7.3 km</div>
                        </div>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </section>

            {/* NOTIFICATIONS BLOCK matching dashboard.html */}
            <section className="bg-white rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] p-3.5 sm:p-4 mb-3.5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="m-0 text-[#0077cc] text-[15px] font-bold flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#0077cc]" />
                  Notifications
                </h3>
                <span className="text-xs font-semibold text-[#0a6ec2] bg-[#eef6ff] px-2 py-0.5 rounded-full border border-[#bcdfff]">
                  3 New
                </span>
              </div>

              <div id="notifList" className="space-y-2">
                {initialNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-center justify-between p-2.5 border border-[#eef2f7] rounded-[8px] bg-[#fbfdff] text-[13px] gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-[#33c47a] shrink-0" />
                      <div className="min-w-0">
                        <span className="font-semibold text-[#222222] mr-2">{notif.title}</span>
                        <span className="text-xs text-[#666666] hidden sm:inline">{notif.subtitle}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-[#888888]">{notif.time}</span>
                      <span className="bg-[#eef6ff] text-[#0a6ec2] border border-[#bcdfff] rounded-full px-2 py-0.5 text-[12px] font-medium">
                        {notif.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal('reports')}
                  className="text-[#0077cc] font-semibold text-[13px] hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <span>View All</span>
                  <span>→</span>
                </button>
              </div>
            </section>

            {/* ACTIVITY CHART BLOCK matching dashboard.html */}
            <section className="bg-white rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] p-3.5 sm:p-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <h3 className="m-0 text-[#0077cc] text-[15px] font-bold flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#0077cc]" />
                  Activity
                </h3>

                {/* Range Toggle Buttons matching .range button.active in dashboard.html */}
                <div className="inline-flex border border-[#0077cc] rounded-[8px] overflow-hidden self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setRange('daily')}
                    className={`border-0 px-2.5 py-1.5 font-semibold text-xs cursor-pointer transition-colors ${
                      range === 'daily' ? 'bg-[#0077cc] text-white' : 'bg-white text-[#0077cc] hover:bg-blue-50'
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    type="button"
                    onClick={() => setRange('weekly')}
                    className={`border-0 px-2.5 py-1.5 font-semibold text-xs cursor-pointer transition-colors ${
                      range === 'weekly' ? 'bg-[#0077cc] text-white' : 'bg-white text-[#0077cc] hover:bg-blue-50'
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    type="button"
                    onClick={() => setRange('monthly')}
                    className={`border-0 px-2.5 py-1.5 font-semibold text-xs cursor-pointer transition-colors ${
                      range === 'monthly' ? 'bg-[#0077cc] text-white' : 'bg-white text-[#0077cc] hover:bg-blue-50'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Chart Display */}
              <div className="mt-2 bg-[#fbfdff] border border-[#eef2f7] rounded-lg p-4">
                <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
                  {currentPoints.map((pt, i) => {
                    const heightPercent = Math.max(12, Math.round((pt.deliveries / maxDeliveryVal) * 100));
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        {/* Tooltip on Hover */}
                        <div className="text-[10px] font-bold text-[#0077cc] opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1.5 py-0.5 rounded shadow-xs border border-blue-100">
                          Rs {pt.revenue.toLocaleString()}
                        </div>

                        {/* Bar */}
                        <div
                          className="w-full max-w-[48px] rounded-t-md transition-all duration-300 hover:brightness-110 relative"
                          style={{
                            height: `${heightPercent}%`,
                            background: 'var(--g-blue)',
                          }}
                        >
                          <span className="sr-only">
                            {pt.label}: {pt.deliveries} deliveries, Rs {pt.revenue}
                          </span>
                        </div>

                        {/* Label */}
                        <span className="text-[11px] font-medium text-[#666666] truncate">{pt.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </>
        )}

        {/* =========================================================================
            TAB 2: FILLING STATIONS & ENTRIES matching /pages/filling.html
            ========================================================================= */}
        {activeBottomNav === 'filling' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Header */}
            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#eef2f7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-[#0077cc] flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#0077cc]" />
                    Daily Water Canes Filling Management
                  </h2>
                  <a
                    href="./pages/filling.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#007bdb]/10 hover:bg-[#007bdb]/20 text-[#0077cc] text-xs font-mono font-semibold border border-[#007bdb]/20 transition-colors no-underline"
                    title="Open /pages/filling.html"
                  >
                    <span>/pages/filling.html</span>
                    <ExternalLink className="w-3 h-3 text-[#0077cc]" />
                  </a>
                </div>
                <p className="text-xs text-[#666666] mt-0.5 max-w-2xl leading-relaxed">
                  Record daily water canes filling quantities, maintain supplier-side production logs, track daily filling expenses & monitor distribution trends. WSMS helps mineral water suppliers not only in Karachi, all over Pakistan to manage daily filling records, monitor operational costs & maintain accurate business activity reports.
                </p>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveModal('stations')}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#0077cc] border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
                >
                  <Building2 className="w-4 h-4 text-[#0077cc]" />
                  <span>Station Profiles Directory ({stationProfiles.length})</span>
                </button>
              </div>
            </div>

            {/* Notification Banner */}
            {fillingNotice && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-between">
                <span>{fillingNotice}</span>
                <button
                  type="button"
                  onClick={() => setFillingNotice(null)}
                  className="text-emerald-700 hover:text-emerald-900 cursor-pointer font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            )}

            {/* CARD 1: Add Filling Entry Form matching filling.html */}
            <section className="bg-white rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] p-4 sm:p-5">
              <h3 className="m-0 text-[#0077cc] text-base font-bold flex items-center gap-2 mb-3.5">
                <Boxes className="w-4 h-4 text-[#0077cc]" />
                Add Filling Entry
              </h3>

              <form onSubmit={handleAddFillingEntry} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#555] mb-1">Date</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:border-[#0077cc] focus:ring-2 focus:ring-blue-100 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#555] mb-1">Time</label>
                    <input
                      type="time"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:border-[#0077cc] focus:ring-2 focus:ring-blue-100 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#555] mb-1">Filling Station</label>
                    <select
                      value={formStationId}
                      onChange={(e) => handleStationChange(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:border-[#0077cc] focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                      required
                    >
                      {stationList.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name} - {st.location.split(',')[0]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#555] mb-1">Product / Can Size</label>
                    <select
                      value={formItem}
                      onChange={(e) => handleItemChange(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:border-[#0077cc] focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                    >
                      <option value="19 Liter Can">19 Liter Can (Rs 60)</option>
                      <option value="12 Liter Can">12 Liter Can (Rs 40)</option>
                      <option value="6 Liter Bottle">6 Liter Bottle (Rs 25)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#555] mb-1">Unit Rate (Rs)</label>
                    <input
                      type="text"
                      readOnly
                      value={`Rs ${formRate}`}
                      className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 text-[#0077cc] font-bold rounded-md cursor-not-allowed outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#555] mb-1">Quantity (Cans/Bottles)</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={formQty}
                      onChange={(e) => setFormQty(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                      placeholder="e.g. 50"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:border-[#0077cc] focus:ring-2 focus:ring-blue-100 outline-none"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#555] mb-1">Total Calculated Amount (Rs)</label>
                    <input
                      type="text"
                      readOnly
                      value={`Rs ${(((typeof formQty === 'number' ? formQty : 0) * formRate) || 0).toLocaleString()}`}
                      className="w-full px-3 py-2 text-sm border border-slate-200 bg-emerald-50 text-emerald-700 font-bold text-base rounded-md cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#0077cc] hover:bg-[#005fa3] text-white font-bold rounded-lg shadow-sm transition-all text-sm cursor-pointer"
                >
                  + Add Filling Entry
                </button>
              </form>
            </section>

            {/* CARD 2: Filling Summary (4 Gradient Cards matching filling.html) */}
            <section className="bg-white rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] p-4 sm:p-5">
              <h3 className="m-0 text-[#0077cc] text-base font-bold flex items-center gap-2 mb-3">
                <BarChart2 className="w-4 h-4 text-[#0077cc]" />
                Filling Summary
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="rounded-[10px] p-3.5 text-center text-white shadow-xs bg-gradient-to-br from-[#0077cc] to-[#005fa3]">
                  <h4 className="m-0 text-xs font-semibold opacity-90 mb-1">Total Filling Cost</h4>
                  <p className="m-0 text-lg sm:text-xl font-bold">Rs {totalFillingCost.toLocaleString()}</p>
                </div>
                <div className="rounded-[10px] p-3.5 text-center text-white shadow-xs bg-gradient-to-br from-[#0077cc] to-[#005fa3]">
                  <h4 className="m-0 text-xs font-semibold opacity-90 mb-1">Total Entries</h4>
                  <p className="m-0 text-lg sm:text-xl font-bold">{totalFillingEntries}</p>
                </div>
                <div className="rounded-[10px] p-3.5 text-center text-white shadow-xs bg-gradient-to-br from-[#0077cc] to-[#005fa3]">
                  <h4 className="m-0 text-xs font-semibold opacity-90 mb-1">Average Cost Per Fill</h4>
                  <p className="m-0 text-lg sm:text-xl font-bold">Rs {avgFillingCost.toLocaleString()}</p>
                </div>
                <div className="rounded-[10px] p-3.5 text-center text-white shadow-xs bg-gradient-to-br from-[#0077cc] to-[#005fa3]">
                  <h4 className="m-0 text-xs font-semibold opacity-90 mb-1">Monthly Cost</h4>
                  <p className="m-0 text-lg sm:text-xl font-bold">Rs {totalFillingCost.toLocaleString()}</p>
                </div>
              </div>
            </section>

            {/* CARD 3 & 4: Filling Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Daily Trend */}
              <section className="bg-white rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] p-4">
                <h3 className="m-0 text-[#0077cc] text-base font-bold flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-[#0077cc]" />
                  Filling Trend (Daily)
                </h3>
                <div className="h-52 bg-[#fbfdff] border border-[#eef2f7] rounded-lg p-3 flex items-end justify-between gap-2 pt-6">
                  {[
                    { day: 'Oct 14', cost: 4800 },
                    { day: 'Oct 15', cost: 6200 },
                    { day: 'Oct 16', cost: 5400 },
                    { day: 'Oct 17', cost: 7100 },
                    { day: 'Oct 18', cost: 8400 },
                    { day: 'Oct 19', cost: 6000 },
                    { day: 'Oct 20', cost: 5200 },
                  ].map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[10px] font-bold text-[#0077cc] opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 rounded shadow-xs border border-blue-100">
                        Rs {d.cost}
                      </span>
                      <div
                        className="w-full max-w-[36px] rounded-t-md bg-gradient-to-t from-[#005fa3] to-[#0077cc] hover:brightness-110 transition-all"
                        style={{ height: `${Math.round((d.cost / 8400) * 100)}%` }}
                      />
                      <span className="text-[10px] font-semibold text-slate-500">{d.day}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Station Distribution */}
              <section className="bg-white rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] p-4">
                <h3 className="m-0 text-[#0077cc] text-base font-bold flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-[#0077cc]" />
                  Filling by Station
                </h3>
                <div className="h-52 bg-[#fbfdff] border border-[#eef2f7] rounded-lg p-3 flex flex-col justify-around">
                  {[
                    { name: 'Clifton RO Plant', cost: 16800, max: 20000, color: 'bg-[#0077cc]' },
                    { name: 'Korangi Sector 31', cost: 12400, max: 20000, color: 'bg-[#3583e5]' },
                    { name: 'Gulshan Pumping', cost: 11200, max: 20000, color: 'bg-[#5fa8f7]' },
                    { name: 'North Nazimabad', cost: 7800, max: 20000, color: 'bg-[#82b7f5]' },
                  ].map((s, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{s.name}</span>
                        <span className="text-[#0077cc]">Rs {s.cost.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${s.color}`}
                          style={{ width: `${Math.round((s.cost / s.max) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* CARD 5: All Filling Entries Table matching filling.html */}
            <section className="bg-white rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="m-0 text-[#0077cc] text-base font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0077cc]" />
                  All Filling Entries
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  Showing {fillings.length} records
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b-2 border-slate-200 text-xs font-bold text-slate-600">
                      <th className="p-2.5 sm:p-3">Date</th>
                      <th className="p-2.5 sm:p-3">Station</th>
                      <th className="p-2.5 sm:p-3">Amount</th>
                      <th className="p-2.5 sm:p-3">Payment</th>
                      <th className="p-2.5 sm:p-3">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fillings.map((f) => (
                      <tr key={f.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="p-2.5 sm:p-3 whitespace-nowrap text-slate-700 font-medium">{f.date}</td>
                        <td className="p-2.5 sm:p-3 font-semibold text-slate-900">{f.stationName}</td>
                        <td className="p-2.5 sm:p-3 font-bold text-[#0077cc]">Rs {f.amount.toLocaleString()}</td>
                        <td className="p-2.5 sm:p-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0077cc] border border-blue-200">
                            {f.paymentType}
                          </span>
                        </td>
                        <td className="p-2.5 sm:p-3 text-slate-600 text-xs">{f.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* CARD 6: RO Plants & Reservoirs (Depot Telemetry) */}
            <div className="pt-2">
              <h3 className="text-[#0077cc] text-base font-bold flex items-center gap-2 mb-3">
                <Droplet className="w-4 h-4 text-[#0077cc]" />
                RO Plants & Water Telemetry
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stationList.map((st) => (
                  <div
                    key={st.id}
                    className="bg-white rounded-xl p-4 border border-[#eef2f7] shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#eef2f7] mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-[#222222]">{st.name}</h3>
                          <span className="text-[10px] bg-blue-50 text-[#0077cc] font-bold px-2 py-0.5 rounded border border-blue-200">
                            {st.code}
                          </span>
                        </div>
                        <span className="text-xs text-[#666666] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {st.location}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleStationPump(st.id)}
                        className={`text-xs font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                          st.status === 'Operational'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {st.status === 'Operational' ? '● Pump Active' : '▲ Standby / Maint'}
                      </button>
                    </div>

                    {/* Water Reservoir Bar */}
                    <div className="space-y-1.5 mb-3">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[#666666] flex items-center gap-1">
                          <Droplet className="w-3.5 h-3.5 text-[#0077cc]" />
                          Depot Reservoir Level
                        </span>
                        <span className="text-[#0077cc] font-bold">{st.tankLevelPercent}% Full</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${st.tankLevelPercent}%`,
                            background: 'var(--g-blue)',
                          }}
                        />
                      </div>
                    </div>

                    {/* Telemetry Metrics */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                      <div className="bg-[#fbfdff] border border-[#eef2f7] p-2 rounded-lg">
                        <span className="text-[11px] text-[#666666] block">TDS Purity</span>
                        <strong className="text-emerald-700 font-bold text-sm">{st.tdsLevel} ppm</strong>
                        <span className="text-[10px] text-emerald-600 block">✓ Certified WHO</span>
                      </div>

                      <div className="bg-[#fbfdff] border border-[#eef2f7] p-2 rounded-lg">
                        <span className="text-[11px] text-[#666666] block">pH Level</span>
                        <strong className="text-[#0077cc] font-bold text-sm">{st.phLevel}</strong>
                        <span className="text-[10px] text-blue-600 block">Neutral Balanced</span>
                      </div>

                      <div className="bg-[#fbfdff] border border-[#eef2f7] p-2 rounded-lg">
                        <span className="text-[11px] text-[#666666] block">Flow Rate</span>
                        <strong className="text-slate-800 font-bold text-sm">450 L/hr</strong>
                        <span className="text-[10px] text-slate-500 block">Continuous RO</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#eef2f7] flex items-center justify-between text-[11px] text-[#666666]">
                      <span>Duty Operator: <strong>{st.operator}</strong></span>
                      <span className="text-emerald-700 font-semibold">Filters Sanitized Today</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: SUPPLY & DISPATCH (Can Circulation, Deliveries, Logistics)
            ========================================================================= */}
        {activeBottomNav === 'supply' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-xs border border-[#eef2f7]">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-[#0077cc] flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#0077cc]" />
                    Supply & Delivery Operations
                  </h2>
                  <a
                    href="./pages/supply.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#007bdb]/10 hover:bg-[#007bdb]/20 text-[#0077cc] text-xs font-mono font-semibold border border-[#007bdb]/20 transition-colors no-underline"
                    title="Open /pages/supply.html"
                  >
                    <span>/pages/supply.html</span>
                    <ExternalLink className="w-3 h-3 text-[#0077cc]" />
                  </a>
                </div>
                <p className="text-xs text-[#666666] mt-0.5">
                  19-Liter polycarbonate bottle inventory, active delivery fleet routes & empty return balances.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onNavigateToSupply}
                  className="text-xs font-bold text-white bg-[#0077cc] hover:bg-[#005fa3] px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Open Field Hub
                </button>
              </div>
            </div>

            {/* Inventory Quick Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-[#eef2f7] shadow-xs">
                <span className="text-xs text-[#666666] block">In Circulation</span>
                <span className="text-xl font-bold text-[#0077cc]">{inventory.totalCirculation.toLocaleString()} Cans</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-[#eef2f7] shadow-xs">
                <span className="text-xs text-[#666666] block">Filled in Depot</span>
                <span className="text-xl font-bold text-emerald-700">{inventory.filledDepot.toLocaleString()} Cans</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-[#eef2f7] shadow-xs">
                <span className="text-xs text-[#666666] block">In Transit on Fleets</span>
                <span className="text-xl font-bold text-amber-600">{inventory.inTransit.toLocaleString()} Cans</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-[#eef2f7] shadow-xs">
                <span className="text-xs text-[#666666] block">Empty for Refill</span>
                <span className="text-xl font-bold text-[#222222]">{inventory.emptyDepot.toLocaleString()} Cans</span>
              </div>
            </div>

            {/* Notification Banner */}
            {supplyNotice && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-between shadow-xs">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  {supplyNotice}
                </span>
                <button
                  type="button"
                  onClick={() => setSupplyNotice(null)}
                  className="text-emerald-700 hover:text-emerald-900 text-xs cursor-pointer font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            )}

            {/* FORM CARD: Add Supply Record */}
            <div className="bg-white rounded-xl border border-[#eef2f7] p-4 sm:p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <h3 className="text-sm font-bold text-[#222222] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#0077cc]" />
                  Add Supply Record
                </h3>
                <span className="text-xs text-[#666666]">
                  Auto-calculates Final Rate (Rate − Discount) and Total Billing Amount
                </span>
              </div>

              <form onSubmit={handleAddSupplyRecord} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {/* Customer Select */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-slate-700 block">Customer *</label>
                    <select
                      value={supplyCustomer}
                      onChange={(e) => handleSupplyCustomerChange(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077cc]/20 focus:border-[#0077cc] text-xs bg-white font-medium"
                    >
                      <option value="">Select Customer</option>
                      {customersList.map((c) => (
                        <option key={c.id} value={String(c.id)}>
                          {c.name} {c.phone ? `(${c.phone})` : ''} - Disc: Rs {c.discount || 0}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Date *</label>
                    <input
                      type="date"
                      value={supplyDate}
                      onChange={(e) => setSupplyDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077cc]/20 focus:border-[#0077cc] text-xs bg-white"
                    />
                  </div>

                  {/* Item / Size */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Item / Size *</label>
                    <select
                      value={supplyItem}
                      onChange={(e) => handleSupplyItemChange(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077cc]/20 focus:border-[#0077cc] text-xs bg-white font-medium"
                    >
                      <option value="19 Liter Can">19 Liter Can (Base: Rs 60)</option>
                      <option value="12 Liter Can">12 Liter Can (Base: Rs 40)</option>
                      <option value="6 Liter Bottle">6 Liter Bottle (Base: Rs 25)</option>
                      <option value="Carton of 24 500ml">Carton 24 x 500ml (Base: Rs 600)</option>
                      <option value="Carton of 12 500ml">Carton 12 x 500ml (Base: Rs 350)</option>
                      <option value="Carton of 6 1.5L">Carton 6 x 1.5L (Base: Rs 450)</option>
                    </select>
                  </div>

                  {/* Rate */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Rate (Rs) *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={supplyRate}
                      onChange={(e) => setSupplyRate(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077cc]/20 focus:border-[#0077cc] text-xs bg-white font-medium"
                    />
                  </div>

                  {/* Discount */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Discount (Rs)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={supplyDiscount}
                      onChange={(e) => setSupplyDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077cc]/20 focus:border-[#0077cc] text-xs bg-white font-medium"
                    />
                  </div>

                  {/* Final Rate */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Final Rate (Rs)</label>
                    <input
                      type="number"
                      value={supplyFinalRate}
                      readOnly
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-100 font-semibold text-slate-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Payment Mode */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Payment Mode *</label>
                    <select
                      value={supplyPaymentType}
                      onChange={(e) => setSupplyPaymentType(e.target.value as 'Cash' | 'Credit')}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077cc]/20 focus:border-[#0077cc] text-xs bg-white font-semibold"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Credit">Credit</option>
                    </select>
                  </div>

                  {/* Cans Delivered */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Cans Delivered *</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 25"
                      value={supplyDelivered}
                      onChange={(e) => setSupplyDelivered(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077cc]/20 focus:border-[#0077cc] text-xs bg-white font-medium"
                    />
                  </div>

                  {/* Cans Returned */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Cans Returned</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 20"
                      value={supplyReceived}
                      onChange={(e) => setSupplyReceived(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077cc]/20 focus:border-[#0077cc] text-xs bg-white font-medium"
                    />
                  </div>

                  {/* Cans Balance */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Cans Balance</label>
                    <input
                      type="number"
                      value={supplyBalance}
                      readOnly
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-100 font-semibold text-slate-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Total Amount & Submit */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Total Amount (Rs)</label>
                    <input
                      type="text"
                      value={`Rs ${supplyTotalAmount.toLocaleString()}`}
                      readOnly
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-100 font-bold text-[#0077cc] cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-[#0077cc] hover:bg-[#005fa3] text-white font-bold py-2.5 px-6 rounded-lg text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add Supply Record
                  </button>
                </div>
              </form>
            </div>

            {/* TABLE CARD: Recent Deliveries */}
            <div className="bg-white rounded-xl border border-[#eef2f7] p-4 sm:p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#0077cc]" />
                  <h3 className="font-bold text-sm text-[#222222]">Recent Deliveries</h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0077cc] border border-blue-100">
                    {deliveriesList.length} Records
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Search filter */}
                  <div className="relative min-w-[200px]">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search deliveries..."
                      value={supplySearch}
                      onChange={(e) => setSupplySearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0077cc]/20 focus:border-[#0077cc] bg-white"
                    />
                  </div>

                  {/* Export CSV */}
                  <button
                    type="button"
                    onClick={exportSupplyCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-[#eef2f7]">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-[#0077cc] text-white">
                      <th className="py-2.5 px-3 font-semibold text-center w-12">#</th>
                      <th className="py-2.5 px-3 font-semibold">Date</th>
                      <th className="py-2.5 px-3 font-semibold">Customer Name & Location</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Cans (Del / Ret / Bal)</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Amount</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Payment</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                      <th className="py-2.5 px-3 font-semibold text-center w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eef2f7]">
                    {deliveriesList
                      .filter((d) => {
                        const q = supplySearch.toLowerCase().trim();
                        if (!q) return true;
                        return (
                          d.customerName.toLowerCase().includes(q) ||
                          d.orderNumber.toLowerCase().includes(q) ||
                          d.address.toLowerCase().includes(q) ||
                          d.paymentMethod.toLowerCase().includes(q) ||
                          (d.timestamp && d.timestamp.toLowerCase().includes(q))
                        );
                      })
                      .map((del, idx) => {
                        const netBal = del.cansDelivered - del.emptyCollected;
                        return (
                          <tr key={del.id} className="hover:bg-[#fbfdff] transition-colors">
                            <td className="py-2.5 px-3 text-slate-400 font-mono text-center">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-medium text-slate-700 whitespace-nowrap">
                              {del.timestamp || '2026-10-20'}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-[#222222]">{del.customerName}</div>
                              <div className="text-[11px] text-[#666666] flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                {del.address}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-center whitespace-nowrap">
                              <span className="font-bold text-emerald-700">+{del.cansDelivered}</span>
                              <span className="text-slate-400 mx-1">/</span>
                              <span className="font-medium text-slate-600">-{del.emptyCollected}</span>
                              <span className="text-slate-400 mx-1">=</span>
                              <span className={`font-bold ${netBal > 0 ? 'text-amber-600' : 'text-slate-700'}`}>
                                {netBal}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-bold text-[#0077cc] text-right whitespace-nowrap">
                              Rs {del.amount.toLocaleString()}
                            </td>
                            <td className="py-2.5 px-3 text-center whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                                  del.paymentMethod === 'Cash'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}
                              >
                                {del.paymentMethod}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center whitespace-nowrap">
                              <span
                                className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                                  del.status === 'Delivered'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-blue-50 text-[#0077cc] border-blue-200'
                                }`}
                              >
                                {del.status === 'Delivered' ? '✓ Delivered' : del.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteDelivery(del.id)}
                                title="Delete delivery record"
                                className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: EXPENSES & REVENUE (Financial reports, ledger, fuel costs)
            ========================================================================= */}
        {activeBottomNav === 'expense' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Header */}
            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#eef2f7]">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-[#0077cc] flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-[#0077cc]" />
                    Daily Expenses & Financial Management for Water Suppliers
                  </h2>
                  <a
                    href="./pages/expense.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#007bdb]/10 hover:bg-[#007bdb]/20 text-[#0077cc] text-xs font-mono font-semibold border border-[#007bdb]/20 transition-colors no-underline"
                    title="Open /pages/expense.html"
                  >
                    <span>/pages/expense.html</span>
                    <ExternalLink className="w-3 h-3 text-[#0077cc]" />
                  </a>
                </div>
                <p className="text-xs text-[#666666] mt-0.5 max-w-4xl leading-relaxed">
                  Track daily business expenses, including Vehicle Fuel, Electricity bills, Employee Wages & Operational Costs. WSMS helps mineral water suppliers maintain Accurate Financial Records, Reconcile daily transactions, Calculate Operating Profit Margins & monitor business profitability with better financial control.
                </p>
              </div>
            </div>

            {/* Notification Banner */}
            {expenseNotice && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-between shadow-xs">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  {expenseNotice}
                </span>
                <button
                  type="button"
                  onClick={() => setExpenseNotice(null)}
                  className="text-emerald-700 hover:text-emerald-900 text-xs cursor-pointer font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Financial Overview 4-Card Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-xs">
                <span className="text-xs text-[#666666] block">Gross Daily Invoiced</span>
                <span className="text-2xl font-bold text-[#0077cc]">Rs {sumRevenue.toLocaleString()}</span>
                <span className="text-[11px] text-emerald-600 block mt-1">+14.2% vs Yesterday</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-xs">
                <span className="text-xs text-[#666666] block">Total Daily Expenses</span>
                <span className="text-2xl font-bold text-red-600">Rs {sumExpense.toLocaleString()}</span>
                <span className="text-[11px] text-[#666666] block mt-1">Total recorded business costs</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs">
                <span className="text-xs text-[#666666] block">Paid / Outstanding Balance</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-emerald-600">Rs {sumExpensePaid.toLocaleString()}</span>
                  <span className="text-xs font-semibold text-amber-600">
                    / Bal: Rs {sumExpenseBalance.toLocaleString()}
                  </span>
                </div>
                <span className="text-[11px] text-[#666666] block mt-1">
                  {sumExpenseBalance === 0 ? '✓ All vendor balances cleared' : `${expenses.filter((e) => e.balance > 0).length} partial/unpaid bills`}
                </span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
                <span className="text-xs text-[#666666] block">Net Operating Profit</span>
                <span className="text-2xl font-bold text-emerald-700">Rs {sumProfit.toLocaleString()}</span>
                <span className="text-[11px] text-emerald-700 font-bold block mt-1">
                  {sumRevenue > 0 ? `${((sumProfit / sumRevenue) * 100).toFixed(1)}% Profit Margin` : '63.8% Profit Margin'}
                </span>
              </div>
            </div>

            {/* FORM CARD: Enter Daily Basis Expenses Details */}
            <div className="bg-white rounded-xl border border-[#eef2f7] p-4 sm:p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <h3 className="text-sm font-bold text-[#222222] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#0077cc]" />
                  Enter Daily Basis Expense Details
                </h3>
                <span className="text-xs text-[#666666]">
                  Automatic live balance calculation: (Amount − Paid = Balance)
                </span>
              </div>

              {/* Quick Preset Expense Chips */}
              <div className="mb-4">
                <span className="text-xs text-[#666666] font-semibold block mb-1.5">Quick Expense Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Fleet Diesel (Shell / PSO)', nos: '3 Vans', amount: 5600 },
                    { label: 'K-Electric RO Plant Power', nos: '1 Meter', amount: 3800 },
                    { label: 'Driver & Delivery Labour Wages', nos: '4 Staff', amount: 2200 },
                    { label: '19L Polycarbonate Caps & Seals', nos: '500 Pcs', amount: 2500 },
                    { label: 'RO Anti-Scalant & Chlorine Chemical', nos: '2 Packs', amount: 800 },
                    { label: 'Delivery Van Maintenance & Tyre Service', nos: '1 Van', amount: 1400 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setNewExpDesc(preset.label);
                        setNewExpNos(preset.nos);
                        setNewExpAmount(preset.amount);
                        setNewExpPaid(preset.amount);
                      }}
                      className="text-[11px] bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#0077cc] px-2.5 py-1 rounded-md border border-slate-200 transition-colors cursor-pointer"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
                  {/* Field 1: Date */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Date *</label>
                    <input
                      type="date"
                      value={newExpDate}
                      onChange={(e) => setNewExpDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077cc]/20 focus:border-[#0077cc] text-xs bg-white"
                    />
                  </div>

                  {/* Field 2: Description */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-slate-700 block">Description *</label>
                    <input
                      type="text"
                      placeholder="e.g. Vehicle Fuel, Electricity bills, Labour Wages"
                      value={newExpDesc}
                      onChange={(e) => setNewExpDesc(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077cc]/20 focus:border-[#0077cc] text-xs bg-white"
                    />
                  </div>

                  {/* Field 3: Nos */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Nos (Qty/Ref) *</label>
                    <input
                      type="text"
                      placeholder="e.g. 1, 3 Vans, 500 Pcs"
                      value={newExpNos}
                      onChange={(e) => setNewExpNos(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077cc]/20 focus:border-[#0077cc] text-xs bg-white"
                    />
                  </div>

                  {/* Field 4: Amount */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Amount (Rs) *</label>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      placeholder="Total Amount"
                      value={newExpAmount}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                        setNewExpAmount(val);
                        // If paid was empty or matched previous amount, auto-fill paid
                        if (newExpPaid === '' || (typeof val === 'number' && typeof newExpPaid === 'number' && newExpPaid > val)) {
                          setNewExpPaid(val);
                        }
                      }}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077cc]/20 focus:border-[#0077cc] text-xs bg-white font-semibold text-slate-900"
                    />
                  </div>

                  {/* Field 5: Paid */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-slate-700 block">Paid (Rs) *</label>
                      {newExpAmount !== '' && newExpPaid !== newExpAmount && (
                        <button
                          type="button"
                          onClick={() => setNewExpPaid(newExpAmount)}
                          className="text-[10px] text-[#0077cc] hover:underline font-bold"
                        >
                          Full Paid
                        </button>
                      )}
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="Amount Paid"
                      value={newExpPaid}
                      onChange={(e) => setNewExpPaid(e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077cc]/20 focus:border-[#0077cc] text-xs bg-white font-semibold text-emerald-700"
                    />
                  </div>
                </div>

                {/* Live Balance Summary & Submit Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-[#666666]">Computed Balance:</span>
                    <span className="font-bold text-sm px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
                      Rs {(Math.max(
                        0,
                        (typeof newExpAmount === 'number' ? newExpAmount : 0) -
                        (typeof newExpPaid === 'number' ? newExpPaid : (newExpPaid === '' ? (typeof newExpAmount === 'number' ? newExpAmount : 0) : 0))
                      )).toLocaleString()}
                    </span>
                    {(typeof newExpAmount === 'number' && typeof newExpPaid === 'number' && newExpPaid < newExpAmount) ? (
                      <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Partial Payment (Outstanding Due)
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Fully Settled
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0077cc] hover:bg-[#005fa3] text-white font-bold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Expense Entry</span>
                  </button>
                </div>
              </form>
            </div>

            {/* TABLE CARD: Daily Basis Expenses Details Table */}
            <div className="bg-white rounded-xl border border-[#eef2f7] p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-[#222222] flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#0077cc]" />
                    Daily Expenses Details Table
                  </h3>
                  <p className="text-xs text-[#666666] mt-0.5">
                    Itemized daily water supply operating expense logs ({expenses.length} entries recorded)
                  </p>
                </div>

                {/* Filter and Export Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search description / nos..."
                      value={expenseSearch}
                      onChange={(e) => setExpenseSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#0077cc] bg-white w-44 sm:w-56"
                    />
                  </div>

                  <input
                    type="date"
                    value={expenseDateFilter}
                    onChange={(e) => setExpenseDateFilter(e.target.value)}
                    title="Filter by Date"
                    className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#0077cc] bg-white text-slate-700"
                  />

                  {expenseDateFilter && (
                    <button
                      type="button"
                      onClick={() => setExpenseDateFilter('')}
                      className="text-xs text-[#0077cc] hover:underline font-semibold cursor-pointer"
                    >
                      Clear Date
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleExportExpensesCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-slate-200"
                    title="Export expense ledger to CSV spreadsheet"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              {/* Responsive Expense Table */}
              <div className="overflow-x-auto rounded-lg border border-[#eef2f7]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#f7f9fb] border-b border-[#eef2f7] text-[#555555]">
                      <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px]">Date</th>
                      <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px]">Description</th>
                      <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px]">Nos</th>
                      <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px] text-right">Amount</th>
                      <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px] text-right">Paid</th>
                      <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px] text-right">Balance</th>
                      <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px] text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eef2f7] bg-white">
                    {expenses
                      .filter((item) => {
                        const matchSearch =
                          !expenseSearch ||
                          item.description.toLowerCase().includes(expenseSearch.toLowerCase()) ||
                          String(item.nos).toLowerCase().includes(expenseSearch.toLowerCase());
                        const matchDate = !expenseDateFilter || item.date === expenseDateFilter;
                        return matchSearch && matchDate;
                      })
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                          {/* 1. Date */}
                          <td className="py-3 px-3.5 text-slate-700 whitespace-nowrap font-medium">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              {item.date}
                            </span>
                          </td>

                          {/* 2. Description */}
                          <td className="py-3 px-3.5 text-[#222222] font-semibold">
                            {item.description}
                          </td>

                          {/* 3. Nos */}
                          <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap">
                            <span className="inline-block bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium text-[11px] border border-slate-200">
                              {item.nos}
                            </span>
                          </td>

                          {/* 4. Amount */}
                          <td className="py-3 px-3.5 text-right font-bold text-slate-900 whitespace-nowrap">
                            Rs {item.amount.toLocaleString()}
                          </td>

                          {/* 5. Paid */}
                          <td className="py-3 px-3.5 text-right font-bold text-emerald-700 whitespace-nowrap">
                            Rs {item.paid.toLocaleString()}
                          </td>

                          {/* 6. Balance */}
                          <td className="py-3 px-3.5 text-right whitespace-nowrap">
                            {item.balance === 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Check className="w-3 h-3" />
                                Rs 0
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                <AlertCircle className="w-3 h-3 text-amber-600" />
                                Rs {item.balance.toLocaleString()}
                              </span>
                            )}
                          </td>

                          {/* 7. Action */}
                          <td className="py-3 px-3.5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {item.balance > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleSettleExpenseBalance(item.id)}
                                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded transition-colors cursor-pointer"
                                  title="Mark remaining balance as fully paid"
                                >
                                  Clear Due
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteExpense(item.id)}
                                className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer rounded hover:bg-red-50"
                                title="Delete entry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                    {expenses.filter((item) => {
                      const matchSearch =
                        !expenseSearch ||
                        item.description.toLowerCase().includes(expenseSearch.toLowerCase()) ||
                        String(item.nos).toLowerCase().includes(expenseSearch.toLowerCase());
                      const matchDate = !expenseDateFilter || item.date === expenseDateFilter;
                      return matchSearch && matchDate;
                    }).length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          No matching expense records found for current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>

                  {/* Summary Totals Footer Row */}
                  <tfoot className="bg-[#f7f9fb] border-t-2 border-slate-300 font-bold text-xs">
                    <tr>
                      <td colSpan={3} className="py-3 px-3.5 text-slate-900 uppercase tracking-wide">
                        Total ({expenses.length} Records):
                      </td>
                      <td className="py-3 px-3.5 text-right text-red-600 text-sm">
                        Rs {sumExpense.toLocaleString()}
                      </td>
                      <td className="py-3 px-3.5 text-right text-emerald-700 text-sm">
                        Rs {sumExpensePaid.toLocaleString()}
                      </td>
                      <td className="py-3 px-3.5 text-right text-amber-700 text-sm">
                        Rs {sumExpenseBalance.toLocaleString()}
                      </td>
                      <td className="py-3 px-3.5 text-center text-[11px] text-slate-500 font-normal">
                        {sumExpenseBalance === 0 ? '✓ Balanced' : 'Outstanding Balances'}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Bottom Compliance & Print Bar */}
              <div className="pt-3 border-t border-[#eef2f7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#666666]">
                <span>
                  All daily business expenses recorded conform to Sindh Business Tax, fuel vouchers & labour wage logs.
                </span>
                <button
                  type="button"
                  onClick={handleExportExpensesCSV}
                  className="w-full sm:w-auto px-4 py-2 bg-[#0077cc] hover:bg-[#005fa3] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Download Expense CSV / Statement
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          FIXED BOTTOM NAVIGATION BAR (Faithful replication of image_4bb31170.png)
          - Shown on all screen sizes across the bottom of the viewport
          - Clean white background, top border #dddddd, shadow
          - "Home", "Filling", "Supply", "Expense"
          - Active state has brand blue text (#0077cc) and 3px solid blue underline bar
          ========================================================================= */}
      <nav
        className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-[#dddddd] shadow-[0_-2px_10px_rgba(0,0,0,0.08)] z-50 py-3"
        aria-label="Dashboard Bottom Navigation"
      >
        <div className="max-w-3xl mx-auto flex justify-around items-center px-4">
          <button
            type="button"
            onClick={() => {
              setActiveBottomNav('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`text-sm sm:text-base font-bold transition-all cursor-pointer px-4 py-1 text-center ${
              activeBottomNav === 'home'
                ? 'text-[#0077cc] border-b-[3px] border-[#0077cc] pb-1'
                : 'text-[#444444] hover:text-[#0077cc] pb-1 border-b-[3px] border-transparent'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveBottomNav('filling');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`text-sm sm:text-base font-bold transition-all cursor-pointer px-4 py-1 text-center ${
              activeBottomNav === 'filling'
                ? 'text-[#0077cc] border-b-[3px] border-[#0077cc] pb-1'
                : 'text-[#444444] hover:text-[#0077cc] pb-1 border-b-[3px] border-transparent'
            }`}
          >
            Filling
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveBottomNav('supply');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`text-sm sm:text-base font-bold transition-all cursor-pointer px-4 py-1 text-center ${
              activeBottomNav === 'supply'
                ? 'text-[#0077cc] border-b-[3px] border-[#0077cc] pb-1'
                : 'text-[#444444] hover:text-[#0077cc] pb-1 border-b-[3px] border-transparent'
            }`}
          >
            Supply
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveBottomNav('expense');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`text-sm sm:text-base font-bold transition-all cursor-pointer px-4 py-1 text-center ${
              activeBottomNav === 'expense'
                ? 'text-[#0077cc] border-b-[3px] border-[#0077cc] pb-1'
                : 'text-[#444444] hover:text-[#0077cc] pb-1 border-b-[3px] border-transparent'
            }`}
          >
            Expense
          </button>
        </div>
      </nav>

      {/* INTERACTIVE MODALS FOR QUICK LINKS */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className={`bg-white rounded-xl shadow-2xl w-full p-4 sm:p-6 max-h-[92vh] overflow-y-auto border border-[#eef2f7] ${(activeModal === 'customers' || activeModal === 'stations' || activeModal === 'inventory' || activeModal === 'reports') ? 'max-w-4xl' : 'max-w-xl'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#eef2f7] mb-4">
              <div className="flex items-center gap-2">
                {activeModal === 'customers' && <Users className="w-5 h-5 text-[#0077cc]" />}
                {activeModal === 'stations' && <Building2 className="w-5 h-5 text-[#0077cc]" />}
                {activeModal === 'inventory' && <Boxes className="w-5 h-5 text-[#0077cc]" />}
                {activeModal === 'reports' && <FileText className="w-5 h-5 text-[#0077cc]" />}
                <h3 className="text-base sm:text-lg font-bold text-[#0077cc] m-0">
                  {activeModal === 'customers'
                    ? 'Customer Accounts Management'
                    : activeModal === 'stations'
                    ? 'Filling Stations - Profiles & Directory'
                    : activeModal === 'inventory'
                    ? 'Inventory Management - Cans & Products'
                    : 'Operational & Financial Reports'}
                </h3>
                {activeModal === 'customers' && (
                  <span className="text-xs bg-[#e8f4fd] text-[#0077cc] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                    {customersList.length} Accounts
                  </span>
                )}
                {activeModal === 'stations' && (
                  <span className="text-xs bg-[#e8f4fd] text-[#0077cc] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                    {stationProfiles.length} Profiles
                  </span>
                )}
                {activeModal === 'inventory' && (
                  <span className="text-xs bg-[#e8f4fd] text-[#0077cc] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                    {invLedger.length} Records
                  </span>
                )}
                {activeModal === 'reports' && (
                  <span className="text-xs bg-[#e8f4fd] text-[#0077cc] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                    Daily Analytics
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeModal === 'customers' && (
                  <a
                    href="./pages/customers.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#0077cc] bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
                    title="Open standalone customers.html in new tab"
                  >
                    <span>/pages/customers.html</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {activeModal === 'stations' && (
                  <a
                    href="./pages/stations.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#0077cc] bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
                    title="Open standalone stations.html in new tab"
                  >
                    <span>/pages/stations.html</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {activeModal === 'inventory' && (
                  <a
                    href="./pages/inventory.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#0077cc] bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
                    title="Open standalone inventory.html in new tab"
                  >
                    <span>/pages/inventory.html</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {activeModal === 'reports' && (
                  <a
                    href="./pages/report.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#0077cc] bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
                    title="Open standalone report.html in new tab"
                  >
                    <span>/pages/report.html</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-md text-lg leading-none cursor-pointer"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            {activeModal === 'customers' && (
              <div className="space-y-5">
                {/* Feedback Notification */}
                {customerNotice && (
                  <div className="p-3 rounded-lg text-xs font-semibold bg-[#e6f9ed] text-[#1e7e34] border border-emerald-200 flex items-center justify-between animate-in fade-in">
                    <span>{customerNotice}</span>
                    <button
                      type="button"
                      onClick={() => setCustomerNotice(null)}
                      className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* CARD 1: CUSTOMER MANAGEMENT FORM (matching customers.html) */}
                <section className="bg-[#fbfdff] border border-[#dbe6f5] rounded-xl p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                    <div>
                      <h4 className="text-sm font-bold text-[#0077cc] m-0">
                        {custEditingId !== null ? `Edit Customer #${custEditingId}` : 'Add New Customer'}
                      </h4>
                      <p className="text-[11px] text-[#666666] m-0">Water Distribution Account & Rate Matrix</p>
                    </div>
                    {custEditingId !== null && (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-semibold">
                        Editing Active Record
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleSaveCustomer} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#444444] mb-1">
                          Customer Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={custName}
                          onChange={(e) => setCustName(e.target.value)}
                          placeholder="e.g., Al-Madina General Hospital"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0077cc] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#444444] mb-1">
                          WhatsApp / Phone Number
                        </label>
                        <input
                          type="tel"
                          value={custPhone}
                          onChange={(e) => handleCustomerPhoneChange(e.target.value)}
                          placeholder="03xx-xxxxxxx"
                          maxLength={12}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0077cc] bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#444444] mb-1">
                        Delivery Address (Karachi Area & Street)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={custAddress}
                          onChange={(e) => setCustAddress(e.target.value)}
                          placeholder="e.g., PECHS Block 2, Karachi"
                          className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0077cc] bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCustMap(!showCustMap)}
                          className="px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{showCustMap ? 'Hide Map' : '📍 Map'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Coordinates & Karachi Locality Selector */}
                    {showCustMap && (
                      <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-2 text-xs animate-in fade-in">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-semibold text-emerald-900 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                            GPS Coordinates (Karachi Dispatch)
                          </span>
                          <span className="text-[11px] text-emerald-700">Quick presets:</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { name: 'DHA Clifton', lat: 24.8012, lng: 67.0378 },
                            { name: 'PECHS', lat: 24.8688, lng: 67.0543 },
                            { name: 'Gulshan-e-Iqbal', lat: 24.9180, lng: 67.0971 },
                            { name: 'Korangi Ind.', lat: 24.8329, lng: 67.1351 },
                            { name: 'Saddar', lat: 24.8569, lng: 67.0210 },
                            { name: 'Bahria Town', lat: 24.9950, lng: 67.3100 },
                          ].map((loc) => (
                            <button
                              key={loc.name}
                              type="button"
                              onClick={() => {
                                setCustLat(loc.lat);
                                setCustLng(loc.lng);
                                if (!custAddress) setCustAddress(`${loc.name}, Karachi`);
                              }}
                              className="px-2 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 rounded text-[11px] font-medium text-emerald-800 transition-colors"
                            >
                              {loc.name}
                            </button>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div>
                            <span className="text-[10px] text-slate-500 font-semibold">Latitude</span>
                            <input
                              type="number"
                              step="0.0001"
                              value={custLat}
                              onChange={(e) => setCustLat(parseFloat(e.target.value) || '')}
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 font-semibold">Longitude</span>
                            <input
                              type="number"
                              step="0.0001"
                              value={custLng}
                              onChange={(e) => setCustLng(parseFloat(e.target.value) || '')}
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#444444] mb-1">
                          Bottle Security Deposit (Rs)
                        </label>
                        <input
                          type="number"
                          value={custDeposit}
                          onChange={(e) => setCustDeposit(e.target.value === '' ? '' : parseFloat(e.target.value))}
                          placeholder="e.g., 18000"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0077cc] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#444444] mb-1">
                          Special Rate Discount (Rs)
                        </label>
                        <input
                          type="number"
                          value={custDiscount}
                          onChange={(e) => setCustDiscount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                          placeholder="e.g., 15"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0077cc] bg-white"
                        />
                      </div>
                    </div>

                    {/* CUSTOMER ITEM RATES TABLE (matching customers.html) */}
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <h5 className="text-xs font-bold text-[#0077cc] mb-2 flex items-center justify-between">
                        <span>Customer Item Rates</span>
                        <span className="text-[11px] font-normal text-slate-500">Auto-calculated Net Invoicing</span>
                      </h5>

                      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-[#f1f5f9] text-[#475569] text-[11px] font-bold">
                            <tr>
                              <th className="p-2 sm:px-3">Item Specification</th>
                              <th className="p-2 sm:px-3">Base Rate (Rs)</th>
                              <th className="p-2 sm:px-3">Discount (Rs)</th>
                              <th className="p-2 sm:px-3">Final Net (Rs)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {/* 19L Can */}
                            {(() => {
                              const base = 200;
                              const disc = custCan19Discount !== '' ? Number(custCan19Discount) : (custDiscount !== '' ? Number(custDiscount) : 15);
                              const net = Math.max(0, base - disc);
                              return (
                                <tr>
                                  <td className="p-2 sm:px-3 font-semibold text-slate-800">19-Liter Water Can</td>
                                  <td className="p-2 sm:px-3 text-slate-600">Rs {base}</td>
                                  <td className="p-2 sm:px-3">
                                    <input
                                      type="number"
                                      value={custCan19Discount !== '' ? custCan19Discount : (custDiscount !== '' ? custDiscount : '')}
                                      onChange={(e) => setCustCan19Discount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                      placeholder="15"
                                      className="w-20 px-2 py-1 text-xs border border-slate-300 rounded"
                                    />
                                  </td>
                                  <td className="p-2 sm:px-3 font-bold text-[#0077cc]">Rs {net}</td>
                                </tr>
                              );
                            })()}

                            {/* 12L Can */}
                            {(() => {
                              const base = 150;
                              const disc = custCan12Discount !== '' ? Number(custCan12Discount) : 10;
                              const net = Math.max(0, base - disc);
                              return (
                                <tr>
                                  <td className="p-2 sm:px-3 font-semibold text-slate-800">12-Liter Water Can</td>
                                  <td className="p-2 sm:px-3 text-slate-600">Rs {base}</td>
                                  <td className="p-2 sm:px-3">
                                    <input
                                      type="number"
                                      value={custCan12Discount}
                                      onChange={(e) => setCustCan12Discount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                      placeholder="10"
                                      className="w-20 px-2 py-1 text-xs border border-slate-300 rounded"
                                    />
                                  </td>
                                  <td className="p-2 sm:px-3 font-bold text-[#0077cc]">Rs {net}</td>
                                </tr>
                              );
                            })()}

                            {/* 6L Bottle */}
                            {(() => {
                              const base = 90;
                              const disc = custCan6Discount !== '' ? Number(custCan6Discount) : 5;
                              const net = Math.max(0, base - disc);
                              return (
                                <tr>
                                  <td className="p-2 sm:px-3 font-semibold text-slate-800">6-Liter Water Bottle</td>
                                  <td className="p-2 sm:px-3 text-slate-600">Rs {base}</td>
                                  <td className="p-2 sm:px-3">
                                    <input
                                      type="number"
                                      value={custCan6Discount}
                                      onChange={(e) => setCustCan6Discount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                      placeholder="5"
                                      className="w-20 px-2 py-1 text-xs border border-slate-300 rounded"
                                    />
                                  </td>
                                  <td className="p-2 sm:px-3 font-bold text-[#0077cc]">Rs {net}</td>
                                </tr>
                              );
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-wrap gap-2">
                      <button
                        type="submit"
                        className="flex-1 min-w-[140px] px-4 py-2.5 bg-[#0077cc] hover:bg-[#005fa3] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        {custEditingId !== null ? 'Update Customer Account' : 'Save Customer Account'}
                      </button>

                      {custEditingId !== null && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomer(custEditingId)}
                          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          Delete Customer
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleClearCustomerForm}
                        className="px-4 py-2.5 bg-slate-500 hover:bg-slate-600 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Clear Form
                      </button>
                    </div>
                  </form>
                </section>

                {/* CARD 2: ALL CUSTOMERS TABLE (matching customers.html) */}
                <section className="bg-white border border-[#e2e8f0] rounded-xl p-4 sm:p-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-[#0077cc] m-0 flex items-center gap-2">
                        <span>All Customers</span>
                        <span className="text-xs font-semibold bg-blue-100 text-[#0077cc] px-2 py-0.5 rounded-full">
                          {filteredCustomers.length}
                        </span>
                      </h4>
                      <p className="text-[11px] text-[#666666] m-0">Click any row to load into form for editing</p>
                    </div>

                    {/* Search Input */}
                    <div className="relative min-w-[240px]">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        placeholder="Search by name, phone or address..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0077cc] bg-[#fbfdff]"
                      />
                    </div>
                  </div>

                  {/* Table with Sticky Headers and Sorting */}
                  <div className="overflow-x-auto max-h-[360px] overflow-y-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-[#0077cc] text-white sticky top-0 z-10 text-[11px] font-semibold">
                        <tr>
                          <th
                            className="p-2 sm:px-3 cursor-pointer hover:bg-[#005fa3] transition-colors"
                            onClick={() => handleSortCustomer('id')}
                          >
                            ID {customerSortCol === 'id' ? (customerSortDir === 'asc' ? '▲' : '▼') : '↕'}
                          </th>
                          <th
                            className="p-2 sm:px-3 cursor-pointer hover:bg-[#005fa3] transition-colors"
                            onClick={() => handleSortCustomer('name')}
                          >
                            Customer Name {customerSortCol === 'name' ? (customerSortDir === 'asc' ? '▲' : '▼') : '↕'}
                          </th>
                          <th className="p-2 sm:px-3">Phone</th>
                          <th className="p-2 sm:px-3">Address</th>
                          <th
                            className="p-2 sm:px-3 cursor-pointer hover:bg-[#005fa3] transition-colors"
                            onClick={() => handleSortCustomer('discount')}
                          >
                            Discount {customerSortCol === 'discount' ? (customerSortDir === 'asc' ? '▲' : '▼') : '↕'}
                          </th>
                          <th
                            className="p-2 sm:px-3 cursor-pointer hover:bg-[#005fa3] transition-colors"
                            onClick={() => handleSortCustomer('pending_cans')}
                          >
                            Pending Cans {customerSortCol === 'pending_cans' ? (customerSortDir === 'asc' ? '▲' : '▼') : '↕'}
                          </th>
                          <th
                            className="p-2 sm:px-3 cursor-pointer hover:bg-[#005fa3] transition-colors"
                            onClick={() => handleSortCustomer('pending_payment')}
                          >
                            Pending Payment {customerSortCol === 'pending_payment' ? (customerSortDir === 'asc' ? '▲' : '▼') : '↕'}
                          </th>
                          <th className="p-2 sm:px-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredCustomers.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="p-6 text-center text-slate-500">
                              No customer accounts match &quot;{customerSearch}&quot;
                            </td>
                          </tr>
                        ) : (
                          filteredCustomers.map((c) => {
                            const isEditing = custEditingId === c.id;
                            return (
                              <tr
                                key={c.id}
                                onClick={() => handleSelectCustomerForEdit(c)}
                                className={`transition-colors cursor-pointer hover:bg-blue-50/70 ${
                                  isEditing ? 'bg-blue-100/60 font-semibold' : ''
                                }`}
                              >
                                <td className="p-2 sm:px-3 font-mono text-[11px] text-slate-600">
                                  #{c.id}
                                </td>
                                <td className="p-2 sm:px-3 font-bold text-slate-900">
                                  {c.name}
                                </td>
                                <td className="p-2 sm:px-3 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                                  {c.phone}
                                </td>
                                <td className="p-2 sm:px-3 text-slate-600 max-w-[180px] truncate" title={c.address}>
                                  {c.address}
                                </td>
                                <td className="p-2 sm:px-3 font-semibold text-[#0077cc]">
                                  Rs {c.discount}
                                </td>
                                <td className="p-2 sm:px-3">
                                  <span className="inline-block bg-[#e8f4fd] text-[#0077cc] px-2 py-0.5 rounded-full text-[11px] font-bold">
                                    {c.pending_cans} Cans
                                  </span>
                                </td>
                                <td className="p-2 sm:px-3">
                                  {c.pending_payment === 0 ? (
                                    <span className="inline-block bg-[#e6f9ed] text-[#1e7e34] px-2 py-0.5 rounded-full text-[11px] font-bold">
                                      Rs 0 Paid
                                    </span>
                                  ) : (
                                    <span className="inline-block bg-[#fff3cd] text-[#856404] px-2 py-0.5 rounded-full text-[11px] font-bold">
                                      Rs {c.pending_payment.toLocaleString()} Due
                                    </span>
                                  )}
                                </td>
                                <td className="p-2 sm:px-3 text-center" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={() => handleSelectCustomerForEdit(c)}
                                    className="p-1 text-[#0077cc] hover:bg-blue-100 rounded mr-1"
                                    title="Edit customer"
                                  >
                                    ✎
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCustomer(c.id)}
                                    className="p-1 text-red-500 hover:bg-red-100 rounded"
                                    title="Delete customer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 inline" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Actions Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 text-[11px]">
                      Showing {filteredCustomers.length} of {customersList.length} accounts
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleExportCustomersCSV}
                        className="px-3 py-1.5 bg-[#28a745] hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Customers CSV</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomerSearch('');
                          setCustomersList(initialCustomerAccounts);
                          setCustomerNotice('✓ Customer records reset to latest synchronized directory.');
                          setTimeout(() => setCustomerNotice(null), 3000);
                        }}
                        className="px-3 py-1.5 bg-slate-500 hover:bg-slate-600 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        🔄 Refresh List
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeModal === 'stations' && (
              <div className="space-y-4">
                {/* Station Notice Banner */}
                {stationNotice && (
                  <div className="p-3 rounded-lg text-xs font-semibold bg-[#e6f9ed] text-[#1e7e34] border border-emerald-200 flex items-center justify-between animate-in fade-in">
                    <span>{stationNotice}</span>
                    <button
                      type="button"
                      onClick={() => setStationNotice(null)}
                      className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Subnav Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <button
                    type="button"
                    onClick={() => setStationsViewTab('profiles')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      stationsViewTab === 'profiles'
                        ? 'bg-[#0077cc] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Station Profiles ({stationProfiles.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStationsViewTab('telemetry')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      stationsViewTab === 'telemetry'
                        ? 'bg-[#0077cc] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Telemetry & RO Water Quality
                  </button>
                </div>

                {stationsViewTab === 'profiles' ? (
                  <div className="space-y-4">
                    {/* CARD 1: Select Station Profile (matching stations.html) */}
                    <section className="bg-[#fbfdff] border border-[#dbe6f5] rounded-xl p-4 sm:p-5 shadow-xs">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                        <h4 className="text-sm font-bold text-[#0077cc] m-0">
                          Select Station Profile
                        </h4>
                        <span className="text-[11px] text-slate-500">Water Filling Depots</span>
                      </div>

                      <div className="space-y-3">
                        <select
                          value={selectedStationProfileId}
                          onChange={(e) => handleSelectStationProfile(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0077cc] bg-white font-medium"
                        >
                          <option value="">Select Station Profile</option>
                          {stationProfiles.map((sp) => (
                            <option key={sp.id} value={sp.id}>
                              #{sp.id} - {sp.name} {sp.area ? `(${sp.area})` : ''}
                            </option>
                          ))}
                        </select>

                        {/* Selected Profile Highlight Card */}
                        {selectedStationProfileId !== '' && (() => {
                          const activeStation = stationProfiles.find((s) => s.id === selectedStationProfileId);
                          if (!activeStation) return null;
                          return (
                            <div className="p-3 bg-white rounded-lg border border-blue-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-in fade-in">
                              <div>
                                <span className="font-bold text-xs text-[#0077cc] block">
                                  #{activeStation.id} - {activeStation.name}
                                </span>
                                <span className="text-[11px] text-[#666666] flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  {activeStation.address || activeStation.area}
                                </span>
                              </div>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize self-start sm:self-auto ${
                                  activeStation.claimed_status === 'active'
                                    ? 'bg-[#e6f9ed] text-[#1e7e34]'
                                    : activeStation.claimed_status === 'claimed'
                                    ? 'bg-[#e8f4fd] text-[#0077cc]'
                                    : 'bg-[#fff3cd] text-[#856404]'
                                }`}
                              >
                                {activeStation.claimed_status}
                              </span>
                            </div>
                          );
                        })()}

                        <button
                          type="button"
                          onClick={() => setIsStationRequestOpen(true)}
                          className="w-full py-2.5 bg-[#28a745] hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Station Request</span>
                        </button>
                      </div>
                    </section>

                    {/* Request Station Modal / Drawer (matching stations.html #requestModalOverlay) */}
                    {isStationRequestOpen && (
                      <div className="p-4 bg-emerald-50/80 border-2 border-emerald-300 rounded-xl space-y-3 animate-in fade-in">
                        <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                          <h4 className="text-sm font-bold text-emerald-900 m-0 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-emerald-700" />
                            Request New Station
                          </h4>
                          <button
                            type="button"
                            onClick={() => setIsStationRequestOpen(false)}
                            className="text-emerald-700 hover:text-emerald-900 font-bold text-xs"
                          >
                            ✕
                          </button>
                        </div>

                        <form onSubmit={handleSubmitStationRequest} className="space-y-2.5">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Station Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={requestStationName}
                              onChange={(e) => setRequestStationName(e.target.value)}
                              placeholder="e.g. Malir Cantt RO Station"
                              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0077cc]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Area / Location
                            </label>
                            <input
                              type="text"
                              value={requestStationArea}
                              onChange={(e) => setRequestStationArea(e.target.value)}
                              placeholder="e.g. Malir Cantt Check Post 5, Karachi"
                              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0077cc]"
                            />
                          </div>

                          <p className="text-[11px] text-slate-500 m-0">
                            Your station request will be reviewed and approved by the system administrator.
                          </p>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="submit"
                              className="flex-1 py-2 bg-[#0077cc] hover:bg-[#005fa3] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                            >
                              Submit Request
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsStationRequestOpen(false)}
                              className="flex-1 py-2 bg-slate-500 hover:bg-slate-600 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* CARD 2: Available Station Profiles Table (matching stations.html) */}
                    <section className="bg-white border border-[#e2e8f0] rounded-xl p-4 sm:p-5 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div>
                          <h4 className="text-sm font-bold text-[#0077cc] m-0 flex items-center gap-2">
                            <span>Available Station Profiles</span>
                            <span className="text-xs font-semibold bg-blue-100 text-[#0077cc] px-2 py-0.5 rounded-full">
                              {filteredStationProfiles.length}
                            </span>
                          </h4>
                          <p className="text-[11px] text-[#666666] m-0">Karachi Reverse Osmosis & Mineral Hub Network</p>
                        </div>

                        {/* Search Input */}
                        <div className="relative min-w-[220px]">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={stationSearch}
                            onChange={(e) => setStationSearch(e.target.value)}
                            placeholder="Search station by name, area or address..."
                            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0077cc] bg-[#fbfdff]"
                          />
                        </div>
                      </div>

                      {/* Table */}
                      <div className="overflow-x-auto max-h-[340px] overflow-y-auto border border-slate-200 rounded-lg">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead className="bg-[#0077cc] text-white sticky top-0 z-10 text-[11px] font-semibold">
                            <tr>
                              <th className="p-2 sm:px-3 w-16">ID</th>
                              <th className="p-2 sm:px-3">Station Name</th>
                              <th className="p-2 sm:px-3">Area</th>
                              <th className="p-2 sm:px-3">Address</th>
                              <th className="p-2 sm:px-3 text-center w-24">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredStationProfiles.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="p-6 text-center text-slate-500">
                                  No station profiles match &quot;{stationSearch}&quot;
                                </td>
                              </tr>
                            ) : (
                              filteredStationProfiles.map((s) => {
                                const isSelected = selectedStationProfileId === s.id;
                                return (
                                  <tr
                                    key={s.id}
                                    onClick={() => handleSelectStationProfile(s.id)}
                                    className={`transition-colors cursor-pointer hover:bg-blue-50/70 ${
                                      isSelected ? 'bg-blue-100/70 font-semibold' : ''
                                    }`}
                                  >
                                    <td className="p-2 sm:px-3 font-mono text-[11px] text-slate-600">
                                      #{s.id}
                                    </td>
                                    <td className="p-2 sm:px-3 font-bold text-[#0077cc]">
                                      {s.name}
                                    </td>
                                    <td className="p-2 sm:px-3 text-slate-700 whitespace-nowrap">
                                      {s.area || '-'}
                                    </td>
                                    <td className="p-2 sm:px-3 text-slate-600 max-w-[200px] truncate" title={s.address}>
                                      {s.address || '-'}
                                    </td>
                                    <td className="p-2 sm:px-3 text-center">
                                      <span
                                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                                          s.claimed_status === 'active'
                                            ? 'bg-[#e6f9ed] text-[#1e7e34]'
                                            : s.claimed_status === 'claimed'
                                            ? 'bg-[#e8f4fd] text-[#0077cc]'
                                            : 'bg-[#fff3cd] text-[#856404]'
                                        }`}
                                      >
                                        {s.claimed_status || 'unclaimed'}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </div>
                ) : (
                  /* Telemetry & Water Quality View */
                  <div className="space-y-3">
                    <p className="text-xs text-[#666666]">
                      Live telemetry and water quality telemetry across Karachi reverse osmosis depots.
                    </p>
                    <div className="space-y-2.5">
                      {stations.map((s) => (
                        <div key={s.id} className="p-3 bg-[#fbfdff] border border-[#eef2f7] rounded-lg text-xs">
                          <div className="flex justify-between font-bold text-[#222222]">
                            <span>{s.name} ({s.code})</span>
                            <span className="text-emerald-700">{s.status}</span>
                          </div>
                          <div className="text-[#666666] mt-1">{s.location} · Operator: {s.operator}</div>
                          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[11px] pt-1.5 border-t border-slate-100">
                            <div className="bg-white p-1 rounded border">Tank: {s.tankLevelPercent}%</div>
                            <div className="bg-white p-1 rounded border">TDS: {s.tdsLevel} ppm</div>
                            <div className="bg-white p-1 rounded border">pH: {s.phLevel}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeModal === 'inventory' && (
              <div className="space-y-5">
                {/* Inventory Notice Banner */}
                {inventoryNotice && (
                  <div className="p-3 rounded-lg text-xs font-semibold bg-[#e6f9ed] text-[#1e7e34] border border-emerald-200 flex items-center justify-between animate-in fade-in">
                    <span>{inventoryNotice}</span>
                    <button
                      type="button"
                      onClick={() => setInventoryNotice(null)}
                      className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Edit Entry Modal */}
                {editingInvEntry && (
                  <div className="p-4 bg-blue-50/80 border-2 border-[#0077cc] rounded-xl space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                      <h4 className="text-sm font-bold text-[#0077cc] m-0">
                        Edit Inventory Entry: {editingInvEntry.item} (#{editingInvEntry.id})
                      </h4>
                      <button
                        type="button"
                        onClick={() => setEditingInvEntry(null)}
                        className="text-slate-500 hover:text-slate-800 font-bold text-xs"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleSaveEditEntry} className="space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Quantity <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            min="1"
                            required
                            value={editInvQty}
                            onChange={(e) => setEditInvQty(parseInt(e.target.value) || '')}
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Unit Price (Rs)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editInvPrice}
                            onChange={(e) => setEditInvPrice(parseFloat(e.target.value) || '')}
                            placeholder="Optional price"
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Note
                        </label>
                        <input
                          type="text"
                          value={editInvNote}
                          onChange={(e) => setEditInvNote(e.target.value)}
                          placeholder="Optional note"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-[#0077cc] hover:bg-[#005fa3] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          Update Entry
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingInvEntry(null)}
                          className="flex-1 py-2 bg-slate-500 hover:bg-slate-600 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Delete Confirmation Modal */}
                {deletingInvId && (
                  <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl space-y-3 animate-in fade-in">
                    <h4 className="text-sm font-bold text-red-700 m-0">Delete Inventory Entry #{deletingInvId}</h4>
                    <p className="text-xs text-slate-700 m-0">
                      Are you sure you want to delete this inventory entry? This action cannot be undone.
                    </p>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Type <strong>DELETE</strong> to confirm:
                      </label>
                      <input
                        type="text"
                        placeholder="DELETE"
                        value={deleteConfirmInput}
                        onChange={(e) => setDeleteConfirmInput(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-red-300 rounded-lg bg-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleDeleteEntry}
                        className="flex-1 py-2 bg-[#e74c3c] hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeletingInvId(null);
                          setDeleteConfirmInput('');
                        }}
                        className="flex-1 py-2 bg-slate-500 hover:bg-slate-600 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* SECTION 1: Add Inventory Entry Form (matching inventory.html) */}
                <section className="bg-[#fbfdff] border border-[#dbe6f5] rounded-xl p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                    <h4 className="text-sm font-bold text-[#0077cc] m-0">
                      Add Inventory Entry
                    </h4>
                    <span className="text-[11px] text-slate-500">Stock In / Purchase / Damage Logs</span>
                  </div>

                  <form onSubmit={handleAddInventoryEntry} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={invCategory}
                          onChange={(e) => {
                            const cat = e.target.value as 'reusable' | 'sellable' | '';
                            setInvCategory(cat);
                            setInvItem('');
                            setInvAction('');
                          }}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0077cc]"
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="reusable">Reusable Items</option>
                          <option value="sellable">Sellable Items</option>
                        </select>
                      </div>

                      {invCategory && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Item <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={invItem}
                            onChange={(e) => setInvItem(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0077cc]"
                            required
                          >
                            <option value="">Select Item</option>
                            {invCategory === 'reusable' ? (
                              <>
                                <option value="12 Liter Can">12 Liter Can</option>
                                <option value="19 Liter Can">19 Liter Can</option>
                              </>
                            ) : (
                              <>
                                <option value="Carton of 12 500ml">Carton of 12 500ml</option>
                                <option value="Carton of 24 500ml">Carton of 24 500ml</option>
                                <option value="Carton of 6 1.5L">Carton of 6 1.5L</option>
                                <option value="6 Liter Bottle">6 Liter Bottle</option>
                              </>
                            )}
                          </select>
                        </div>
                      )}

                      {invItem && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Action <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={invAction}
                            onChange={(e) => setInvAction(e.target.value as 'Purchase' | 'Damage' | '')}
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0077cc]"
                            required
                          >
                            <option value="">Select Action</option>
                            <option value="Purchase">Purchase (Stock In)</option>
                            <option value="Damage">Damage (Stock Deduction)</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {invAction && (
                      <div className="space-y-3 pt-1 animate-in fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Quantity <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={invQty}
                              onChange={(e) => setInvQty(parseInt(e.target.value) || '')}
                              placeholder="e.g. 50"
                              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0077cc]"
                              required
                            />
                          </div>

                          {invAction === 'Purchase' && (
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Purchase Price (Rs)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={invUnitPrice}
                                onChange={(e) => setInvUnitPrice(parseFloat(e.target.value) || '')}
                                placeholder="Cost per unit"
                                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0077cc]"
                              />
                            </div>
                          )}

                          {invAction === 'Purchase' && invCategory === 'sellable' && (
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Sell Price (Rs)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={invSellPrice}
                                onChange={(e) => setInvSellPrice(parseFloat(e.target.value) || '')}
                                placeholder="Selling price per unit"
                                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0077cc]"
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Note (Optional)
                          </label>
                          <textarea
                            value={invNote}
                            onChange={(e) => setInvNote(e.target.value)}
                            placeholder="Optional note e.g., Restock invoice #442 or defective valve replacement"
                            rows={2}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0077cc]"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={!invCategory || !invItem || !invAction || !invQty}
                          className="w-full py-2.5 bg-[#0077cc] hover:bg-[#005fa3] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                          Add Inventory Entry
                        </button>
                      </div>
                    )}
                  </form>
                </section>

                {/* SECTION 2: Reusable Cans (matching inventory.html) */}
                <section className="bg-white border border-[#e2e8f0] rounded-xl p-4 sm:p-5 shadow-xs">
                  <h4 className="text-sm font-bold text-[#0077cc] m-0 mb-3 flex items-center justify-between">
                    <span>Reusable Cans</span>
                    <span className="text-[11px] font-normal text-slate-500">19L & 12L Can Ledger</span>
                  </h4>

                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-[#0077cc] text-white text-[11px] font-semibold">
                        <tr>
                          <th className="p-2 sm:px-3">Item</th>
                          <th className="p-2 sm:px-3">Available</th>
                          <th className="p-2 sm:px-3">Issued</th>
                          <th className="p-2 sm:px-3">Returned</th>
                          <th className="p-2 sm:px-3">Damaged</th>
                          <th className="p-2 sm:px-3">Total</th>
                          <th className="p-2 sm:px-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {invSummary
                          .filter((item) => item.category === 'reusable')
                          .map((item) => {
                            const latestLedger = invLedger.find((l) => l.item.toLowerCase() === item.itemName.toLowerCase());
                            return (
                              <tr key={item.itemName} className="hover:bg-blue-50/50 transition-colors">
                                <td className="p-2 sm:px-3 font-bold text-[#0077cc]">{item.itemName}</td>
                                <td className="p-2 sm:px-3 font-semibold text-slate-900">{item.available}</td>
                                <td className="p-2 sm:px-3 text-slate-600">{item.totalOut}</td>
                                <td className="p-2 sm:px-3 text-emerald-700">{item.returned ?? 0}</td>
                                <td className="p-2 sm:px-3 text-red-600 font-semibold">{item.damaged}</td>
                                <td className="p-2 sm:px-3 font-bold text-slate-900">{item.available}</td>
                                <td className="p-2 sm:px-3 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    {latestLedger ? (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => handleOpenEditEntry(latestLedger)}
                                          className="px-2 py-1 text-[11px] font-semibold bg-[#00b894] hover:bg-[#009e7d] text-white rounded transition-colors cursor-pointer"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setDeletingInvId(latestLedger.id)}
                                          className="px-2 py-1 text-[11px] font-semibold bg-[#e74c3c] hover:bg-[#c0392b] text-white rounded transition-colors cursor-pointer"
                                        >
                                          Delete
                                        </button>
                                      </>
                                    ) : (
                                      <span className="text-[11px] text-slate-400">No entry</span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleResetItem(item.itemName)}
                                      className="px-2 py-1 text-[11px] font-semibold bg-[#444] hover:bg-black text-white rounded transition-colors cursor-pointer"
                                    >
                                      Reset
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* SECTION 3: Sellable Items (matching inventory.html) */}
                <section className="bg-white border border-[#e2e8f0] rounded-xl p-4 sm:p-5 shadow-xs">
                  <h4 className="text-sm font-bold text-[#0077cc] m-0 mb-3 flex items-center justify-between">
                    <span>Sellable Items</span>
                    <span className="text-[11px] font-normal text-slate-500">Retail Packaged Cartons & Bottles</span>
                  </h4>

                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-[#0077cc] text-white text-[11px] font-semibold">
                        <tr>
                          <th className="p-2 sm:px-3">Item</th>
                          <th className="p-2 sm:px-3">Available</th>
                          <th className="p-2 sm:px-3">Sold</th>
                          <th className="p-2 sm:px-3">Damaged</th>
                          <th className="p-2 sm:px-3">Total</th>
                          <th className="p-2 sm:px-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {invSummary
                          .filter((item) => item.category === 'sellable')
                          .map((item) => {
                            const latestLedger = invLedger.find((l) => l.item.toLowerCase() === item.itemName.toLowerCase());
                            return (
                              <tr key={item.itemName} className="hover:bg-blue-50/50 transition-colors">
                                <td className="p-2 sm:px-3 font-bold text-[#0077cc]">{item.itemName}</td>
                                <td className="p-2 sm:px-3 font-semibold text-slate-900">{item.available}</td>
                                <td className="p-2 sm:px-3 text-slate-600">{item.totalOut}</td>
                                <td className="p-2 sm:px-3 text-red-600 font-semibold">{item.damaged}</td>
                                <td className="p-2 sm:px-3 font-bold text-slate-900">{item.available}</td>
                                <td className="p-2 sm:px-3 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    {latestLedger ? (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => handleOpenEditEntry(latestLedger)}
                                          className="px-2 py-1 text-[11px] font-semibold bg-[#00b894] hover:bg-[#009e7d] text-white rounded transition-colors cursor-pointer"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setDeletingInvId(latestLedger.id)}
                                          className="px-2 py-1 text-[11px] font-semibold bg-[#e74c3c] hover:bg-[#c0392b] text-white rounded transition-colors cursor-pointer"
                                        >
                                          Delete
                                        </button>
                                      </>
                                    ) : (
                                      <span className="text-[11px] text-slate-400">-</span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleResetItem(item.itemName)}
                                      className="px-2 py-1 text-[11px] font-semibold bg-[#444] hover:bg-black text-white rounded transition-colors cursor-pointer"
                                    >
                                      Reset
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* SECTION 4: Inventory History (matching inventory.html) */}
                <section className="bg-white border border-[#e2e8f0] rounded-xl p-4 sm:p-5 shadow-xs">
                  <h4 className="text-sm font-bold text-[#0077cc] m-0 mb-3 flex items-center justify-between">
                    <span>Inventory History</span>
                    <span className="text-[11px] font-normal text-slate-500">{invLedger.length} Transaction Records</span>
                  </h4>

                  <div className="overflow-x-auto max-h-[300px] overflow-y-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-[#0077cc] text-white sticky top-0 z-10 text-[11px] font-semibold">
                        <tr>
                          <th className="p-2 sm:px-3">Date</th>
                          <th className="p-2 sm:px-3">Type</th>
                          <th className="p-2 sm:px-3">Action</th>
                          <th className="p-2 sm:px-3">Item</th>
                          <th className="p-2 sm:px-3">Qty</th>
                          <th className="p-2 sm:px-3">Price</th>
                          <th className="p-2 sm:px-3">Note</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {invLedger.map((entry) => (
                          <tr key={entry.id} className="hover:bg-blue-50/50 transition-colors">
                            <td className="p-2 sm:px-3 font-mono text-slate-600">{entry.date}</td>
                            <td className="p-2 sm:px-3 font-medium text-slate-800">{entry.type}</td>
                            <td className="p-2 sm:px-3 font-bold text-slate-900">{entry.action}</td>
                            <td className="p-2 sm:px-3 font-semibold text-[#0077cc]">{entry.item}</td>
                            <td className="p-2 sm:px-3 font-bold">{entry.qty}</td>
                            <td className="p-2 sm:px-3 font-mono">
                              {entry.unitPrice !== null && entry.unitPrice !== undefined
                                ? `Rs ${entry.unitPrice.toLocaleString()}`
                                : '-'}
                            </td>
                            <td className="p-2 sm:px-3 text-slate-600 max-w-[200px] truncate" title={entry.note}>
                              {entry.note || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {activeModal === 'reports' && (
              <div className="space-y-4 text-xs">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg">
                    <span className="text-[11px] text-slate-500 font-medium block">Total Revenue (Today)</span>
                    <strong className="text-base text-[#0077cc] font-bold block mt-0.5">Rs {sumRevenue.toLocaleString()}</strong>
                    <span className="text-[10px] text-slate-400">Settled & Invoiced</span>
                  </div>
                  <div className="p-3 bg-red-50/60 border border-red-200 rounded-lg">
                    <span className="text-[11px] text-slate-500 font-medium block">Operational Expenses</span>
                    <strong className="text-base text-red-600 font-bold block mt-0.5">Rs {sumExpense.toLocaleString()}</strong>
                    <span className="text-[10px] text-slate-400">Fuel, Power & Labor</span>
                  </div>
                  <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg">
                    <span className="text-[11px] text-slate-500 font-medium block">Net Operating Profit</span>
                    <strong className="text-base text-emerald-700 font-bold block mt-0.5">Rs {sumProfit.toLocaleString()}</strong>
                    <span className="text-[10px] text-emerald-600 font-semibold">+63.8% Net Margin</span>
                  </div>
                  <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-lg">
                    <span className="text-[11px] text-slate-500 font-medium block">Total Deliveries</span>
                    <strong className="text-base text-purple-700 font-bold block mt-0.5">{deliveries.length} Dispatches</strong>
                    <span className="text-[10px] text-purple-600 font-semibold">100% On Schedule</span>
                  </div>
                </div>

                {/* Section 1: Daily Revenue Breakdown */}
                <div className="p-3.5 bg-white border border-[#eef2f7] rounded-xl shadow-xs space-y-2.5">
                  <h4 className="text-sm font-bold text-[#0077cc] m-0 flex items-center justify-between">
                    <span>Revenue & Payment Reconciliation</span>
                    <span className="text-[11px] text-slate-400 font-normal">Live Daily Feed</span>
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-[#0077cc] text-white text-[11px] font-semibold">
                        <tr>
                          <th className="p-2">Customer</th>
                          <th className="p-2">Bottles</th>
                          <th className="p-2">Amount</th>
                          <th className="p-2">Method</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {deliveries.map((del) => (
                          <tr key={del.id} className="hover:bg-slate-50">
                            <td className="p-2 font-medium text-slate-800">{del.customerName}</td>
                            <td className="p-2 text-slate-600">{del.cansDelivered} Cans</td>
                            <td className="p-2 font-bold text-slate-800">Rs {del.amount.toLocaleString()}</td>
                            <td className="p-2 capitalize text-slate-600">{del.paymentMethod}</td>
                            <td className="p-2">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                del.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {del.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 2: Expense Distribution */}
                <div className="p-3.5 bg-white border border-[#eef2f7] rounded-xl shadow-xs space-y-2.5">
                  <h4 className="text-sm font-bold text-[#0077cc] m-0">Expense Ledger Breakdown</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">Fleet Diesel & Fuel</span>
                      <strong className="text-sm text-slate-800 font-bold block mt-0.5">Rs 8,200</strong>
                      <span className="text-[10px] text-slate-400">3 Vehicles refueled</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">Driver & Loader Staging</span>
                      <strong className="text-sm text-slate-800 font-bold block mt-0.5">Rs 5,500</strong>
                      <span className="text-[10px] text-slate-400">Daily labor allowance</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">RO Power & Water Filter</span>
                      <strong className="text-sm text-slate-800 font-bold block mt-0.5">Rs 2,600</strong>
                      <span className="text-[10px] text-slate-400">Sediment membrane check</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <a
                    href="./pages/report.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 text-center bg-[#0077cc] hover:bg-[#005fa3] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer no-underline shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Open Full Standalone Report Page (/pages/report.html)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write('<html><head><title>WSMS Daily Reconciliation Report</title><style>body{font-family:sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#0077cc;color:#fff}</style></head><body><h2>WSMS Daily Operations & Reconciliation Report</h2><p>Date: ' + new Date().toLocaleDateString() + '</p><p>Total Revenue: Rs ' + sumRevenue.toLocaleString() + ' | Total Expense: Rs ' + sumExpense.toLocaleString() + ' | Net Margin: Rs ' + sumProfit.toLocaleString() + '</p></body></html>');
                        printWindow.document.close();
                        printWindow.print();
                      }
                    }}
                    className="py-2.5 px-4 bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Print PDF Summary</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
