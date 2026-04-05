import { MemberNetBalance, SuggestedTransaction } from "../types/models";

const EPSILON = 0.0001;

const roundToCents = (value: number): number => Math.round(value * 100) / 100;

export function minimizeTransactions(balances: MemberNetBalance[]): SuggestedTransaction[] {
  const debtors = balances
    .filter((item) => item.netAmount < -EPSILON)
    .map((item) => ({ userId: item.userId, amount: Math.abs(item.netAmount) }));

  const creditors = balances
    .filter((item) => item.netAmount > EPSILON)
    .map((item) => ({ userId: item.userId, amount: item.netAmount }));

  const result: SuggestedTransaction[] = [];

  while (debtors.length > 0 && creditors.length > 0) {
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const debtor = debtors[0];
    const creditor = creditors[0];

    const settledAmount = roundToCents(Math.min(debtor.amount, creditor.amount));

    result.push({
      from: debtor.userId,
      to: creditor.userId,
      amount: settledAmount,
    });

    debtor.amount = roundToCents(debtor.amount - settledAmount);
    creditor.amount = roundToCents(creditor.amount - settledAmount);

    if (debtor.amount <= EPSILON) {
      debtors.shift();
    }

    if (creditor.amount <= EPSILON) {
      creditors.shift();
    }
  }

  return result;
}
