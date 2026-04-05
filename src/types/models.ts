export interface User {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
}

export type SplitType = "equal" | "unequal" | "percentage" | "shares";
export type SettlementMethod = "Cash" | "Bank Transfer" | "Venmo" | "Other";
export type SettlementStatus = "confirmed" | "requested";

export interface BillGroup {
  id: string;
  name: string;
  description: string;
  members: User[];
  yourTurn: boolean;
  totalAmount: number;
}

export interface ExpenseSplit {
  userId: string;
  amount: number;
  value?: number;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  date: string;
  paidByUserId: string;
  splitType: SplitType;
  category?: string;
  merchantName?: string;
  lineItems?: string[];
  splits: ExpenseSplit[];
}

export interface SettlementRecord {
  id: string;
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  method: SettlementMethod;
  status: SettlementStatus;
  createdAt: string;
}

export interface Group extends BillGroup {
  imageUri?: string;
  createdAt: string;
  expenses: Expense[];
  settlements: SettlementRecord[];
}

export interface MemberNetBalance {
  userId: string;
  netAmount: number;
}

export interface SuggestedTransaction {
  from: string;
  to: string;
  amount: number;
}

export interface Transaction {
  id: string;
  category: string;
  amount: number;
  date: Date;
  percentageChange: number;
}

export interface MemberBalance {
  user: User;
  amount: number;
  owesTo?: string[];
}

export interface PaymentMethod {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  holderName: string;
}

export interface Recommendation {
  title: string;
  amount: number;
  percentage: number;
  icon: string;
}
