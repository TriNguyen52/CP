export interface User {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
}

export interface BillGroup {
  id: string;
  name: string;
  description: string;
  members: User[];
  yourTurn: boolean;
  totalAmount: number;
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
