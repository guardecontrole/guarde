
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  responsible?: string;
  month: number;
  year: number;
  createdAt: any;
  isSimulated?: boolean;
  isReserveAdjustment?: boolean;
  isTransferFromReserve?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  plan?: string;
  createdAt?: any;
  tourCompleted?: boolean;
  initialDataSeeded?: boolean;
  participants: string[];
}

export interface SortConfig {
  key: string;
  direction: 'ascending' | 'descending';
}

export interface HistoryAction {
  type: 'ADD' | 'DELETE' | 'UPDATE';
  collection: 'incomes' | 'expenses';
  docId: string;
  data?: any;
  oldData?: any;
  newData?: any;
}

export interface StabilityHistoryEntry {
  monthKey: string;
  monthName: string;
  amountAdded: number;
  totalReserve: number;
  movingAverageUsed: number;
  hasAdjustment: boolean;
}
