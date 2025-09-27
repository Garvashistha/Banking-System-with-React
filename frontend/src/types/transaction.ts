export interface Transaction {
  id: number;
  type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';
  amount: number;
  accountNumber: string;
  timestamp: string;
  fromAccount?: string;
  toAccount?: string;
  description?: string;
}

export interface TransactionFormData {
  accountNumber?: string;
  amount: number;
  fromAccount?: string;
  toAccount?: string;
}

export interface DepositFormData {
  accountNumber: string;
  amount: number;
}

export interface WithdrawFormData {
  accountNumber: string;
  amount: number;
}

export interface TransferFormData {
  fromAccount: string;
  toAccount: string;
  amount: number;
}