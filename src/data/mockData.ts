import { BillGroup, MemberBalance, Recommendation, Transaction, User } from "../types/models";

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
