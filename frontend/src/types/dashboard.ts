import { Transaction } from './transaction';

export interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  customerId: number;
}

export interface DashboardData {
  accountNumber: string;
  balance: number;
  transactions: Transaction[];
  accounts?: Account[];
  customerInfo?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}