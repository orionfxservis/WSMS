export type UserRole = 'supplier' | 'filling_station' | 'labour' | 'customer';

export type AppViewMode = 'landing' | 'dashboard' | 'field-hub';

export interface CanInventory {
  totalCirculation: number;
  filledDepot: number;
  inTransit: number;
  emptyDepot: number;
  withCustomers: number;
  damagedOrScrapped: number;
  capsSealStock: number;
  waterVolumeLitres: number;
  tankCapacityLitres: number;
  waterQualityTDS: number;
  waterQualityPH: number;
}

export interface DeliveryRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  zone: string;
  cansDelivered: number;
  emptyCollected: number;
  netDepositBalance: number;
  paymentMethod: 'Cash' | 'Credit' | 'Digital Pay';
  amount: number;
  status: 'Pending' | 'In-Transit' | 'Delivered' | 'Returned';
  driverName: string;
  driverPhone: string;
  timestamp: string;
  notes?: string;
}

export interface StationData {
  id: string;
  name: string;
  code: string;
  location: string;
  operator: string;
  tankLevelPercent: number;
  currentLitres: number;
  dailyDispatchedCans: number;
  status: 'Operational' | 'Refilling' | 'Maintenance';
  tdsLevel: number;
  phLevel: number;
}

export interface DashboardNotification {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  tag: string;
  type: 'supply' | 'finance' | 'inventory' | 'alert';
}

export interface TravelStop {
  id: string;
  customerName: string;
  address: string;
  cansToDeliver: number;
  expectedEmpty: number;
  timeSlot: string;
  phone: string;
  status: 'Delivered' | 'In-Transit' | 'Scheduled';
  zone: string;
}
