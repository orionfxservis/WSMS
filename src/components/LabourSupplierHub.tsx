import React, { useState } from 'react';
import {
  Smartphone,
  Truck,
  Droplet,
  Boxes,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Send,
  Phone,
  MapPin,
  RefreshCw,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Activity,
  Users,
  FileText,
  Building2,
} from 'lucide-react';
import { CanInventory, DeliveryRecord, StationData } from '../types';

interface LabourSupplierHubProps {
  inventory: CanInventory;
  setInventory: React.Dispatch<React.SetStateAction<CanInventory>>;
  deliveries: DeliveryRecord[];
  setDeliveries: React.Dispatch<React.SetStateAction<DeliveryRecord[]>>;
  stations: StationData[];
}

export const LabourSupplierHub: React.FC<LabourSupplierHubProps> = ({
  inventory,
  setInventory,
  deliveries,
  setDeliveries,
  stations,
}) => {
  const [hubRole, setHubRole] = useState<'supplier' | 'labour'>('supplier');
  const [isMobileFrameView, setIsMobileFrameView] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Labour Delivery Entry Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(deliveries[2]?.id || '');
  const [cansDeliveredInput, setCansDeliveredInput] = useState<number>(20);
  const [emptyReturnedInput, setEmptyReturnedInput] = useState<number>(18);
  const [paymentChoice, setPaymentChoice] = useState<'Cash' | 'Credit' | 'Digital Pay'>('Cash');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');

  // Supplier Batch Bottling Form State
  const [batchCansFilled, setBatchCansFilled] = useState<number>(100);

  const notifyUser = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => {
      setStatusNotification(null);
    }, 4000);
  };

  // Labour logs a delivery
  const handleLogDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (cansDeliveredInput <= 0) {
      notifyUser('Please enter at least 1 delivered can.');
      return;
    }

    const updatedDeliveries = deliveries.map((del) => {
      if (del.id === selectedCustomerId) {
        return {
          ...del,
          cansDelivered: cansDeliveredInput,
          emptyCollected: emptyReturnedInput,
          netDepositBalance: cansDeliveredInput - emptyReturnedInput,
          status: 'Delivered' as const,
          paymentMethod: paymentChoice,
          notes: deliveryNotes || del.notes,
          timestamp: 'Just now',
        };
      }
      return del;
    });

    setDeliveries(updatedDeliveries);

    setInventory((prev) => ({
      ...prev,
      inTransit: Math.max(0, prev.inTransit - cansDeliveredInput),
      withCustomers: prev.withCustomers + (cansDeliveredInput - emptyReturnedInput),
      emptyDepot: prev.emptyDepot + emptyReturnedInput,
    }));

    notifyUser(
      `Logged: ${cansDeliveredInput} cans delivered, ${emptyReturnedInput} empty returned for ${
        deliveries.find((d) => d.id === selectedCustomerId)?.customerName || 'customer'
      }. Inventory updated!`
    );

    setDeliveryNotes('');
  };

  // Supplier logs fresh batch filling
  const handleLogFillingBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (batchCansFilled <= 0) return;

    const waterUsedLitres = batchCansFilled * 19;

    setInventory((prev) => ({
      ...prev,
      emptyDepot: Math.max(0, prev.emptyDepot - batchCansFilled),
      filledDepot: prev.filledDepot + batchCansFilled,
      capsSealStock: Math.max(0, prev.capsSealStock - batchCansFilled),
      waterVolumeLitres: Math.max(0, prev.waterVolumeLitres - waterUsedLitres),
    }));

    notifyUser(
      `Batch Bottled: Added ${batchCansFilled} cans (19L). Purified water consumed: ${waterUsedLitres.toLocaleString()}L.`
    );
  };

  // Supplier initiates tanker refill
  const handleRequestTankerRefill = () => {
    const refillLitres = 5000;
    setInventory((prev) => ({
      ...prev,
      waterVolumeLitres: Math.min(prev.tankCapacityLitres, prev.waterVolumeLitres + refillLitres),
    }));
    notifyUser(`Tanker Refill Dispatched: Added +${refillLitres}L to central storage reservoir.`);
  };

  const totalDeliveredCount = deliveries.filter((d) => d.status === 'Delivered').length;
  const totalRevenue = deliveries
    .filter((d) => d.status === 'Delivered')
    .reduce((acc, d) => acc + d.amount, 0);

  return (
    <section
      id="field-hub"
      className="py-12 sm:py-16 bg-[#f7f9fb] text-[#222222] relative"
      aria-labelledby="hub-heading"
    >
      {/* Screen Reader Live Status Region */}
      <div aria-live="polite" className="sr-only">
        {statusNotification}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hub Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#eef2f7]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0077cc] text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-[#33c47a] animate-ping" />
              <span>WSMS Operations Dashboard & Mobile Hub</span>
            </div>
            <h2
              id="hub-heading"
              className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight"
            >
              Labour & Supplier Real-Time Management
            </h2>
            <p className="text-sm text-[#666666] mt-1 max-w-xl">
              Track 19L can ledger, monitor filling plant volume, register field deliveries, and audit supplies in real time.
            </p>
          </div>

          {/* Controls: Role Switcher & Mobile Mockup Frame Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileFrameView(!isMobileFrameView)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border-2 border-[#0077cc] text-[#0077cc] bg-white hover:bg-blue-50 transition-all cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0077cc]"
              aria-label={
                isMobileFrameView
                  ? 'Switch to full responsive layout'
                  : 'Switch to simulated mobile device frame'
              }
            >
              <Smartphone className="w-4 h-4 text-[#0077cc]" aria-hidden="true" />
              <span>{isMobileFrameView ? 'Full Layout' : 'Simulate Mobile Handset'}</span>
            </button>

            {/* Role Tabs */}
            <div
              className="inline-flex p-1 bg-white border border-[#eef2f7] rounded-xl shadow-xs"
              role="tablist"
              aria-label="Field Operational Role"
            >
              <button
                type="button"
                role="tab"
                id="hub-tab-supplier"
                aria-selected={hubRole === 'supplier'}
                aria-controls="hub-panel-supplier"
                onClick={() => setHubRole('supplier')}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0077cc] ${
                  hubRole === 'supplier'
                    ? 'bg-[#0077cc] text-white shadow-sm'
                    : 'text-[#666666] hover:text-[#222222]'
                }`}
              >
                <Boxes className="w-4 h-4" aria-hidden="true" />
                <span>Supplier / Depot</span>
              </button>

              <button
                type="button"
                role="tab"
                id="hub-tab-labour"
                aria-selected={hubRole === 'labour'}
                aria-controls="hub-panel-labour"
                onClick={() => setHubRole('labour')}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0077cc] ${
                  hubRole === 'labour'
                    ? 'bg-gradient-to-r from-[#70e0a1] to-[#33c47a] text-slate-900 font-bold shadow-sm'
                    : 'text-[#666666] hover:text-[#222222]'
                }`}
              >
                <Truck className="w-4 h-4" aria-hidden="true" />
                <span>Labour / Driver</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Notification Toast */}
        {statusNotification && (
          <div
            role="status"
            className="mb-6 p-4 rounded-xl bg-white border-l-4 border-[#33c47a] text-[#222222] flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.06)] animate-in fade-in duration-200"
          >
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-[#33c47a] shrink-0" aria-hidden="true" />
              <span className="font-semibold">{statusNotification}</span>
            </div>
            <span className="text-[11px] font-bold text-[#0077cc] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Synced
            </span>
          </div>
        )}

        {/* Container: Render either inside simulated phone frame OR full responsive grid */}
        <div className={isMobileFrameView ? 'flex justify-center' : ''}>
          <div
            className={
              isMobileFrameView
                ? 'w-full max-w-md bg-white border-[10px] border-slate-800 rounded-[44px] shadow-2xl p-4 sm:p-5 relative overflow-hidden ring-1 ring-slate-300'
                : 'w-full'
            }
          >
            {/* Simulated Phone Top Notch */}
            {isMobileFrameView && (
              <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-200 text-[11px] text-slate-500 px-3">
                <span className="font-semibold text-slate-800">9:41 AM</span>
                <div className="w-20 h-4 bg-slate-800 rounded-full" />
                <div className="flex items-center gap-1.5">
                  <span className="text-[#33c47a] font-bold">● 5G</span>
                  <span>100%</span>
                </div>
              </div>
            )}

            {/* ======================= SUPPLIER VIEW ======================= */}
            {hubRole === 'supplier' && (
              <div id="hub-panel-supplier" role="tabpanel" aria-labelledby="hub-tab-supplier" className="space-y-6">
                {/* 4 Signature Summary Cards matching dashboard.html */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-[#0077cc] uppercase tracking-wider flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#0077cc]" />
                      Real-Time Operational Summary
                    </h3>
                    <span className="text-xs text-[#33c47a] font-bold flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin text-[#33c47a]" />
                      Live Feed
                    </span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {/* Card 1: Deliveries (--g-blue) */}
                    <div
                      className="rounded-xl text-white p-4 flex justify-between items-center shadow-md transition-transform hover:-translate-y-0.5"
                      style={{ background: 'var(--g-blue)' }}
                    >
                      <div>
                        <h4 className="text-xs font-semibold opacity-90 m-0 mb-1">Deliveries Ready</h4>
                        <p className="text-2xl font-black m-0">{inventory.filledDepot}</p>
                        <span className="text-[10px] opacity-80">19L Cans at Depot</span>
                      </div>
                      <Truck className="w-8 h-8 opacity-90 shrink-0" />
                    </div>

                    {/* Card 2: Revenue (--g-green) */}
                    <div
                      className="rounded-xl text-white p-4 flex justify-between items-center shadow-md transition-transform hover:-translate-y-0.5"
                      style={{ background: 'var(--g-green)' }}
                    >
                      <div>
                        <h4 className="text-xs font-semibold opacity-90 m-0 mb-1">Today's Revenue</h4>
                        <p className="text-2xl font-black m-0">Rs {totalRevenue.toLocaleString()}</p>
                        <span className="text-[10px] opacity-80">{totalDeliveredCount} Orders Settled</span>
                      </div>
                      <DollarSign className="w-8 h-8 opacity-90 shrink-0" />
                    </div>

                    {/* Card 3: In Transit (--g-orange) */}
                    <div
                      className="rounded-xl text-white p-4 flex justify-between items-center shadow-md transition-transform hover:-translate-y-0.5"
                      style={{ background: 'var(--g-orange)' }}
                    >
                      <div>
                        <h4 className="text-xs font-semibold opacity-90 m-0 mb-1">In-Transit Cans</h4>
                        <p className="text-2xl font-black m-0">{inventory.inTransit}</p>
                        <span className="text-[10px] opacity-80">With Fleet Drivers</span>
                      </div>
                      <Boxes className="w-8 h-8 opacity-90 shrink-0" />
                    </div>

                    {/* Card 4: Customers / Deposit Held (--g-violet) */}
                    <div
                      className="rounded-xl text-white p-4 flex justify-between items-center shadow-md transition-transform hover:-translate-y-0.5"
                      style={{ background: 'var(--g-violet)' }}
                    >
                      <div>
                        <h4 className="text-xs font-semibold opacity-90 m-0 mb-1">With Customers</h4>
                        <p className="text-2xl font-black m-0">{inventory.withCustomers}</p>
                        <span className="text-[10px] opacity-80">Security Deposit Active</span>
                      </div>
                      <Users className="w-8 h-8 opacity-90 shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Quick Links Section matching dashboard.html */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <a
                    href="./pages/customers.html"
                    className="p-3 text-center rounded-[10px] font-semibold text-[#0077cc] border-2 border-[#0077cc] bg-white shadow-xs text-xs sm:text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer no-underline"
                  >
                    <Users className="w-4 h-4" />
                    <span>Customers</span>
                  </a>
                  <a
                    href="./pages/stations.html"
                    className="p-3 text-center rounded-[10px] font-semibold text-[#0077cc] border-2 border-[#0077cc] bg-white shadow-xs text-xs sm:text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer no-underline"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Filling Stations</span>
                  </a>
                  <a
                    href="./pages/inventory.html"
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        window.location.href = '/pages/inventory.html';
                      }
                    }}
                    className="p-3 text-center rounded-[10px] font-semibold text-[#0077cc] border-2 border-[#0077cc] bg-white shadow-xs text-xs sm:text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer no-underline"
                  >
                    <Boxes className="w-4 h-4" />
                    <span>Inventory</span>
                  </a>
                  <a
                    href="./pages/report.html"
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        window.location.href = '/pages/report.html';
                      }
                    }}
                    className="p-3 text-center rounded-[10px] font-semibold text-[#0077cc] border-2 border-[#0077cc] bg-white shadow-xs text-xs sm:text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer no-underline"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Reports</span>
                  </a>
                </div>

                {/* Storage Reservoir Tank Level & Telemetry */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Storage Tank Visual & Telemetry */}
                  <div className="lg:col-span-7 bg-white border border-[#eef2f7] rounded-[10px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)] space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[#0077cc] text-base flex items-center gap-2">
                        <Droplet className="w-5 h-5 text-[#007bdb]" />
                        Central RO Reservoir Telemetry
                      </h4>
                      <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">
                        SFA Water Certified
                      </span>
                    </div>

                    {/* Tank Level Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[#222]">
                          Current Storage: <strong>{inventory.waterVolumeLitres.toLocaleString()} L</strong>
                        </span>
                        <span className="text-[#007bdb] font-bold">
                          {Math.round((inventory.waterVolumeLitres / inventory.tankCapacityLitres) * 100)}% Capacity
                        </span>
                      </div>
                      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                        <div
                          className="h-full bg-gradient-to-r from-[#5fa8f7] via-[#007bdb] to-[#33c47a] rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round((inventory.waterVolumeLitres / inventory.tankCapacityLitres) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-[#666]">
                        <span>Safety Reserve: 5,000L</span>
                        <span>Tank Capacity: {inventory.tankCapacityLitres.toLocaleString()}L</span>
                      </div>
                    </div>

                    {/* Sensor Metrics: TDS, pH, Pressure */}
                    <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-center">
                      <div className="p-3 bg-[#f7f9fb] rounded-lg border border-[#eef2f7]">
                        <span className="block text-[11px] text-[#666] font-medium">TDS Mineral</span>
                        <span className="text-lg font-bold text-[#222]">{inventory.waterQualityTDS} ppm</span>
                        <span className="block text-[10px] text-emerald-600 font-semibold">Ideal Pure</span>
                      </div>
                      <div className="p-3 bg-[#f7f9fb] rounded-lg border border-[#eef2f7]">
                        <span className="block text-[11px] text-[#666] font-medium">pH Balance</span>
                        <span className="text-lg font-bold text-[#222]">{inventory.waterQualityPH} pH</span>
                        <span className="block text-[10px] text-emerald-600 font-semibold">Neutral Drink</span>
                      </div>
                      <div className="p-3 bg-[#f7f9fb] rounded-lg border border-[#eef2f7]">
                        <span className="block text-[11px] text-[#666] font-medium">RO Flow Rate</span>
                        <span className="text-lg font-bold text-[#222]">45 L/m</span>
                        <span className="block text-[10px] text-[#0077cc] font-semibold">Pumping Normal</span>
                      </div>
                    </div>

                    {/* Supplier Quick Refill Action */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleRequestTankerRefill}
                        className="w-full py-2.5 px-4 bg-[#0077cc] hover:bg-[#005fa3] text-white font-semibold rounded-[8px] text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Droplet className="w-4 h-4" />
                        <span>Order Bulk Tanker Refill (+5,000L)</span>
                      </button>
                    </div>
                  </div>

                  {/* Right: Quick Batch Bottling Form */}
                  <div className="lg:col-span-5 bg-white border border-[#eef2f7] rounded-[10px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)] space-y-4">
                    <h4 className="font-bold text-[#0077cc] text-base flex items-center gap-2">
                      <Plus className="w-5 h-5 text-[#33c47a]" />
                      Log Bottled & Sealed Batch
                    </h4>
                    <p className="text-xs text-[#666]">
                      Record sanitized bottles filled from the depot line into active stock.
                    </p>

                    <form onSubmit={handleLogFillingBatch} className="space-y-4">
                      <div>
                        <label
                          htmlFor="batch-cans-count"
                          className="block text-xs font-semibold text-[#555] uppercase tracking-wider mb-1"
                        >
                          Number of 19L Cans Bottled
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setBatchCansFilled(Math.max(10, batchCansFilled - 25))}
                            className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#222] font-bold cursor-pointer"
                            aria-label="Decrease batch count by 25"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            id="batch-cans-count"
                            type="number"
                            min="1"
                            max="2000"
                            value={batchCansFilled}
                            onChange={(e) => setBatchCansFilled(parseInt(e.target.value) || 0)}
                            className="w-full text-center text-lg font-bold bg-[#f7f9fb] border border-slate-300 rounded-lg py-2 text-[#222] outline-none focus:border-[#0077cc]"
                          />
                          <button
                            type="button"
                            onClick={() => setBatchCansFilled(batchCansFilled + 25)}
                            className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#222] font-bold cursor-pointer"
                            aria-label="Increase batch count by 25"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-3 bg-[#f7f9fb] rounded-lg space-y-1 text-xs text-[#555]">
                        <div className="flex justify-between">
                          <span>Empty bottles converted:</span>
                          <span className="font-semibold text-slate-800">-{batchCansFilled}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cap seals consumed:</span>
                          <span className="font-semibold text-slate-800">-{batchCansFilled}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Purified water needed:</span>
                          <span className="font-semibold text-[#0077cc]">
                            {(batchCansFilled * 19).toLocaleString()} L
                          </span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-[#70e0a1] to-[#33c47a] text-slate-900 font-bold rounded-[8px] text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs hover:shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm & Add to Filled Stock</span>
                      </button>
                    </form>
                  </div>
                </div>

                {/* Regional Stations Status Table */}
                <div className="bg-white border border-[#eef2f7] rounded-[10px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
                  <h4 className="font-bold text-[#0077cc] text-base mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#0077cc]" />
                    Sindh Regional Filling Stations Telemetry
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm text-[#333]">
                      <thead className="text-[11px] text-[#666] uppercase bg-[#f7f9fb] border-b border-[#eef2f7]">
                        <tr>
                          <th className="py-2.5 px-3">Station & Code</th>
                          <th className="py-2.5 px-3">Location</th>
                          <th className="py-2.5 px-3">Storage Level</th>
                          <th className="py-2.5 px-3">TDS / pH</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eef2f7]">
                        {stations.map((st) => (
                          <tr key={st.id} className="hover:bg-slate-50">
                            <td className="py-3 px-3 font-semibold text-[#222]">
                              {st.name} <span className="text-[11px] text-[#0077cc] font-normal">({st.code})</span>
                            </td>
                            <td className="py-3 px-3 text-[#666]">{st.location}</td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      st.tankLevelPercent > 50 ? 'bg-[#33c47a]' : 'bg-[#f57c3c]'
                                    }`}
                                    style={{ width: `${st.tankLevelPercent}%` }}
                                  />
                                </div>
                                <span className="font-semibold text-[#222]">{st.tankLevelPercent}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono text-[#444]">
                              {st.tdsLevel} ppm / {st.phLevel}
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                  st.status === 'Operational'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {st.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ======================= LABOUR / DRIVER VIEW ======================= */}
            {hubRole === 'labour' && (
              <div id="hub-panel-labour" role="tabpanel" aria-labelledby="hub-tab-labour" className="space-y-6">
                {/* Driver Active Shift Header */}
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-[10px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white border border-emerald-300 flex items-center justify-center text-emerald-700 shadow-xs">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider">
                        Active Vehicle: Suzuki Carry #KHI-482
                      </span>
                      <h3 className="text-base font-bold text-slate-900">Driver: Muhammad Aslam</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="block text-slate-500">Truck Cans</span>
                      <span className="text-base font-black text-slate-900">45 Filled / 35 Empty</span>
                    </div>
                    <div className="border-l border-emerald-200 pl-4">
                      <span className="block text-slate-500">Completed Deliveries</span>
                      <span className="text-base font-black text-emerald-700">
                        {totalDeliveredCount} / {deliveries.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Quick Tap Delivery Logger */}
                  <div className="lg:col-span-6 bg-white border border-[#eef2f7] rounded-[10px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)] space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h4 className="font-bold text-[#0077cc] text-base flex items-center gap-2">
                        <Send className="w-5 h-5 text-[#33c47a]" />
                        Log Can Delivery & Collection
                      </h4>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Fast Tap
                      </span>
                    </div>

                    <form onSubmit={handleLogDelivery} className="space-y-4">
                      {/* Select Customer */}
                      <div>
                        <label
                          htmlFor="select-customer-order"
                          className="block text-xs font-semibold text-[#555] uppercase tracking-wider mb-1"
                        >
                          Select Destination Order
                        </label>
                        <select
                          id="select-customer-order"
                          value={selectedCustomerId}
                          onChange={(e) => {
                            setSelectedCustomerId(e.target.value);
                            const found = deliveries.find((d) => d.id === e.target.value);
                            if (found) {
                              setCansDeliveredInput(found.cansDelivered);
                              setEmptyReturnedInput(found.emptyCollected);
                            }
                          }}
                          className="w-full px-3.5 py-2.5 bg-[#f7f9fb] border border-slate-300 rounded-lg text-[#222] text-sm focus:border-[#0077cc] outline-none cursor-pointer"
                        >
                          {deliveries.map((del) => (
                            <option key={del.id} value={del.id}>
                              {del.orderNumber} - {del.customerName} ({del.status})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Can Counters (+ / -) */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Cans Delivered Counter */}
                        <div className="p-3 bg-[#f7f9fb] border border-[#eef2f7] rounded-lg">
                          <label
                            htmlFor="cans-delivered-val"
                            className="block text-[11px] font-bold text-[#0077cc] uppercase mb-2 text-center"
                          >
                            Cans Delivered (Filled)
                          </label>
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => setCansDeliveredInput(Math.max(1, cansDeliveredInput - 1))}
                              className="w-9 h-9 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-lg cursor-pointer"
                              aria-label="Decrease delivered cans"
                            >
                              -
                            </button>
                            <input
                              id="cans-delivered-val"
                              type="number"
                              min="1"
                              value={cansDeliveredInput}
                              onChange={(e) => setCansDeliveredInput(parseInt(e.target.value) || 0)}
                              className="w-16 text-center text-xl font-black text-slate-900 bg-transparent outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setCansDeliveredInput(cansDeliveredInput + 1)}
                              className="w-9 h-9 rounded-lg bg-[#0077cc] hover:bg-[#005fa3] text-white flex items-center justify-center font-bold text-lg cursor-pointer"
                              aria-label="Increase delivered cans"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Empty Cans Returned Counter */}
                        <div className="p-3 bg-[#f7f9fb] border border-[#eef2f7] rounded-lg">
                          <label
                            htmlFor="cans-empty-val"
                            className="block text-[11px] font-bold text-[#f57c3c] uppercase mb-2 text-center"
                          >
                            Empty Cans Received
                          </label>
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => setEmptyReturnedInput(Math.max(0, emptyReturnedInput - 1))}
                              className="w-9 h-9 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-lg cursor-pointer"
                              aria-label="Decrease returned empty cans"
                            >
                              -
                            </button>
                            <input
                              id="cans-empty-val"
                              type="number"
                              min="0"
                              value={emptyReturnedInput}
                              onChange={(e) => setEmptyReturnedInput(parseInt(e.target.value) || 0)}
                              className="w-16 text-center text-xl font-black text-slate-900 bg-transparent outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setEmptyReturnedInput(emptyReturnedInput + 1)}
                              className="w-9 h-9 rounded-lg bg-[#f57c3c] hover:bg-[#e06b2e] text-white flex items-center justify-center font-bold text-lg cursor-pointer"
                              aria-label="Increase returned empty cans"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Net Can Balance Indicator */}
                      <div className="p-3 bg-[#f7f9fb] border border-[#eef2f7] rounded-lg flex items-center justify-between text-xs">
                        <span className="text-slate-600">Net Bottle Balance:</span>
                        <span
                          className={`font-bold ${
                            cansDeliveredInput - emptyReturnedInput > 0
                              ? 'text-[#f57c3c]'
                              : cansDeliveredInput - emptyReturnedInput === 0
                              ? 'text-[#33c47a]'
                              : 'text-[#0077cc]'
                          }`}
                        >
                          {cansDeliveredInput - emptyReturnedInput > 0
                            ? `+${cansDeliveredInput - emptyReturnedInput} Cans With Customer`
                            : cansDeliveredInput - emptyReturnedInput === 0
                            ? 'Balanced (0 Discrepancy)'
                            : `${cansDeliveredInput - emptyReturnedInput} Cans Returned To Depot`}
                        </span>
                      </div>

                      {/* Payment Settlement */}
                      <div>
                        <span className="block text-xs font-semibold text-[#555] uppercase tracking-wider mb-1.5">
                          Payment Settlement
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {(['Cash', 'Credit', 'Digital Pay'] as const).map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setPaymentChoice(method)}
                              className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                                paymentChoice === method
                                  ? 'bg-blue-50 text-[#0077cc] border-[#0077cc] shadow-xs'
                                  : 'bg-white text-slate-600 border-slate-200'
                              }`}
                            >
                              {method}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Notes / Drop Location */}
                      <div>
                        <label
                          htmlFor="delivery-notes"
                          className="block text-xs font-semibold text-[#555] uppercase tracking-wider mb-1"
                        >
                          Delivery Notes / Gate Pass
                        </label>
                        <input
                          id="delivery-notes"
                          type="text"
                          placeholder="e.g. Left cans at reception store"
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          className="w-full px-3.5 py-2 bg-[#f7f9fb] border border-slate-300 rounded-lg text-slate-900 text-xs outline-none focus:border-[#0077cc]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-[#70e0a1] to-[#33c47a] text-slate-900 font-bold rounded-[8px] text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs hover:shadow-md"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Confirm Delivery & Update Real-Time Stock</span>
                      </button>
                    </form>
                  </div>

                  {/* Right: Driver's Route & Order Queue */}
                  <div className="lg:col-span-6 bg-white border border-[#eef2f7] rounded-[10px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)] space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h4 className="font-bold text-[#0077cc] text-base flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#0077cc]" />
                        Today's Route Schedule
                      </h4>
                      <span className="text-xs text-slate-500 font-medium">{deliveries.length} Stops</span>
                    </div>

                    <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1" role="feed" aria-label="Today's Delivery Stops">
                      {deliveries.map((del) => {
                        const isSelected = del.id === selectedCustomerId;

                        return (
                          <div
                            key={del.id}
                            tabIndex={0}
                            role="article"
                            aria-label={`Order ${del.orderNumber} for ${del.customerName}, Status ${del.status}`}
                            onClick={() => {
                              setSelectedCustomerId(del.id);
                              setCansDeliveredInput(del.cansDelivered);
                              setEmptyReturnedInput(del.emptyCollected);
                            }}
                            className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50/70 border-[#0077cc] shadow-xs'
                                : 'bg-[#f7f9fb] border-[#eef2f7] hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div>
                                <span className="text-[10px] font-mono text-[#0077cc] font-bold">{del.orderNumber}</span>
                                <h5 className="font-bold text-sm text-slate-900">{del.customerName}</h5>
                              </div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  del.status === 'Delivered'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : del.status === 'In-Transit'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {del.status}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-2">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{del.address}</span>
                            </p>

                            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 text-slate-600">
                              <div className="flex items-center gap-3">
                                <span>
                                  Delivered: <strong className="text-slate-900">{del.cansDelivered}</strong>
                                </span>
                                <span>
                                  Empty: <strong className="text-slate-900">{del.emptyCollected}</strong>
                                </span>
                              </div>
                              <span className="font-mono text-[#0077cc] font-bold">
                                PKR {del.amount.toLocaleString()} ({del.paymentMethod})
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
