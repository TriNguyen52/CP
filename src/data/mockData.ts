import { BillGroup, MemberBalance, Recommendation, Transaction, User } from "../types/models";

type AppNotification = {
  id: string;
  kind: "expense" | "payment" | "settlement";
  text: string;
  timestamp: string;
  createdAt: string;
  unread: boolean;
};

export const users: User[] = [
  {
    id: "1",
    name: "Alex Kim",
    avatar: "AK",
    verified: true,
  },
  {
    id: "2",
    name: "Riley Chen",
    avatar: "RC",
    verified: true,
  },
  {
    id: "3",
    name: "Jordan Lee",
    avatar: "JL",
    verified: false,
  },
  {
    id: "4",
    name: "Sam Patel",
    avatar: "SP",
    verified: true,
  },
];

export const billGroups: BillGroup[] = [
  {
    id: "g1",
    name: "Apartment Crew",
    description: "Utilities, groceries, and weekend supplies",
    members: [users[0], users[1], users[2]],
    yourTurn: true,
    totalAmount: 1240,
  },
  {
    id: "g2",
    name: "Road Trip",
    description: "Fuel, stay, and food split",
    members: [users[0], users[3]],
    yourTurn: false,
    totalAmount: 680,
  },
  {
    id: "g3",
    name: "Team Lunch",
    description: "Weekly office lunch contribution",
    members: [users[1], users[2], users[3]],
    yourTurn: false,
    totalAmount: 310,
  },
];

export const transactions: Transaction[] = [
  {
    id: "t1",
    category: "Other",
    amount: 420,
    date: new Date(),
    percentageChange: 12,
  },
  {
    id: "t2",
    category: "Utilities",
    amount: 960,
    date: new Date(),
    percentageChange: -5,
  },
  {
    id: "t3",
    category: "Groceries",
    amount: 1220,
    date: new Date(),
    percentageChange: 6,
  },
  {
    id: "t4",
    category: "Entertainment",
    amount: 740,
    date: new Date(),
    percentageChange: 9,
  },
];

export const memberBalances: MemberBalance[] = [
  {
    user: users[0],
    amount: 240,
    owesTo: ["Riley Chen"],
  },
  {
    user: users[1],
    amount: -110,
    owesTo: ["Alex Kim"],
  },
  {
    user: users[2],
    amount: -80,
    owesTo: ["Alex Kim"],
  },
  {
    user: users[3],
    amount: -50,
    owesTo: ["Alex Kim"],
  },
];

export const recommendations: Recommendation[] = [
  {
    title: "Savings Potential",
    amount: 500,
    percentage: 65,
    icon: "trending-up",
  },
  {
    title: "Debt Management",
    amount: 300,
    percentage: 54,
    icon: "swap-horizontal",
  },
  {
    title: "Investment Opportunities",
    amount: 1000,
    percentage: 80,
    icon: "bar-chart",
  },
];

export const appNotifications: AppNotification[] = [
  {
    id: "n-1",
    kind: "expense",
    text: "John added $45.20 to Weekend Trip",
    timestamp: "2m ago",
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    unread: true,
  },
  {
    id: "n-2",
    kind: "payment",
    text: "Sarah paid you $30.00",
    timestamp: "1h ago",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    unread: true,
  },
  {
    id: "n-3",
    kind: "settlement",
    text: "Settlement due in Apartment Crew",
    timestamp: "3h ago",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    unread: true,
  },
  {
    id: "n-4",
    kind: "expense",
    text: "Riley added $18.75 to Team Lunch",
    timestamp: "Yesterday",
    createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    unread: false,
  },
];
