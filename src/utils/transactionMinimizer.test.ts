/// <reference types="jest" />

import { minimizeTransactions } from "./transactionMinimizer";

describe("minimizeTransactions", () => {
  it("handles a simple 2-person settlement", () => {
    const transactions = minimizeTransactions([
      { userId: "alice", netAmount: -50 },
      { userId: "bob", netAmount: 50 },
    ]);

    expect(transactions).toEqual([
      {
        from: "alice",
        to: "bob",
        amount: 50,
      },
    ]);
  });

  it("handles a 3-person triangle scenario", () => {
    const transactions = minimizeTransactions([
      { userId: "a", netAmount: -30 },
      { userId: "b", netAmount: 10 },
      { userId: "c", netAmount: 20 },
    ]);

    expect(transactions).toHaveLength(2);
    expect(transactions[0]).toEqual({ from: "a", to: "c", amount: 20 });
    expect(transactions[1]).toEqual({ from: "a", to: "b", amount: 10 });
  });

  it("handles complex multi-person settlements with minimal matching", () => {
    const balances = [
      { userId: "u1", netAmount: -70 },
      { userId: "u2", netAmount: -30 },
      { userId: "u3", netAmount: 20 },
      { userId: "u4", netAmount: 30 },
      { userId: "u5", netAmount: 50 },
    ];

    const transactions = minimizeTransactions(balances);

    // Two debtors and three creditors can be settled in as few as three transfers.
    expect(transactions).toHaveLength(3);

    const totalPaid = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    expect(totalPaid).toBe(100);

    const reconciled = new Map(balances.map((item) => [item.userId, item.netAmount]));
    transactions.forEach((tx) => {
      reconciled.set(tx.from, (reconciled.get(tx.from) ?? 0) + tx.amount);
      reconciled.set(tx.to, (reconciled.get(tx.to) ?? 0) - tx.amount);
    });

    expect(Array.from(reconciled.values()).every((value) => Math.abs(value) < 0.001)).toBe(true);
  });
});
