// API Types
export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  cache?: string;
  mode?: string;
  credentials?: string;
  signal?: AbortSignal;
  [key: string]: unknown;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
}

// User & Auth
export interface User {
  id: number;
  name: string;
  email: string;
  token?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
  data?: User;
}

// Note: LoginPayload and RegisterPayload kept for future API client generation
// Currently unused but useful for external API documentation
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const getErrorMessage = (err: unknown): string => {
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;
  if (err && typeof err === 'object' && 'message' in err) return String(err.message);
  return 'Unknown error';
};

// Transactions
export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  is_paid?: boolean;
  category_id?: number;
  category?: Category;
  account_id: number;
  account?: Account;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export interface RegularTransactionPayload {
  description?: string | null;
  amount: number;
  type: 'income' | 'expense';
  category_id: number;
  account_id: number;
  is_paid?: boolean;
  date: string;
}

export interface TransferPayload {
  origin_account_id: number;
  destination_account_id: number;
  origin_category_id: number;
  destination_category_id: number;
  amount: number;
  description?: string | null;
  date: string;
}

export type TransactionPayload = RegularTransactionPayload | TransferPayload;

export interface TransactionParams {
  [key: string]: string | number;
}

// Accounts
export interface Account {
  id: number;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'credit';
  balance: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AccountPayload {
  name: string;
  type: string;
  balance: number;
}

// Categories
export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryPayload {
  name: string;
  type: 'income' | 'expense';
}
