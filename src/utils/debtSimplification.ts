import { Group, Expense, Settlement, Balance, SimplifiedDebt } from "../types";

// Constants for floating point precision handling
const TOLERANCE = 0.01;
const roundToCents = (amount: number): number => Math.round(amount * 100) / 100;

export function calculateBalances(
  group: Group,
  expenses: Expense[],
  settlements: Settlement[],
): Balance {
  const balances: Balance = {};

  // Initialize balances for all members
  group.members.forEach((member) => {
    balances[member.id] = 0;
  });

  // Process expenses
  expenses.forEach((expense) => {
    // The person who paid gets credited the full amount
    balances[expense.paidBy] = roundToCents(
      balances[expense.paidBy] + expense.amount,
    );

    // Each person in the split gets debited their share
    expense.splits.forEach((split) => {
      balances[split.memberId] = roundToCents(
        balances[split.memberId] - split.amount,
      );
    });
  });

  // Process settlements (these are already accounted for in the balances)
  // No need to process them again as they're already reflected in the current balances
  // Apply settlements to adjust balances
  settlements.forEach((settlement) => {
    balances[settlement.fromMemberId] = roundToCents(
      balances[settlement.fromMemberId] + settlement.amount,
    );
    balances[settlement.toMemberId] = roundToCents(
      balances[settlement.toMemberId] - settlement.amount,
    );
  });

  // Zero-out floating residues
  Object.keys(balances).forEach((id) => {
    if (Math.abs(balances[id]) < TOLERANCE) {
      balances[id] = 0;
    }
  });

  return balances;
}

export function simplifyDebts(balances: Balance): SimplifiedDebt[] {
  const creditors: { memberId: string; amount: number }[] = [];
  const debtors: { memberId: string; amount: number }[] = [];

  // Separate creditors (positive balance) and debtors (negative balance)
  Object.entries(balances).forEach(([memberId, balance]) => {
    if (balance > TOLERANCE) {
      creditors.push({ memberId, amount: roundToCents(balance) });
    } else if (balance < -TOLERANCE) {
      debtors.push({ memberId, amount: roundToCents(Math.abs(balance)) });
    }
  });

  const simplifiedDebts: SimplifiedDebt[] = [];

  // Sort by amount to optimize (largest amounts first)
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    const settleAmount = Math.min(creditor.amount, debtor.amount);

    // Record the simplified debt
    simplifiedDebts.push({
      fromMemberId: debtor.memberId,
      toMemberId: creditor.memberId,
      amount: settleAmount,
    });

    // Update remaining amounts
    creditor.amount -= settleAmount;
    debtor.amount -= settleAmount;

    // Move to next creditor/debtor if current one is settled
    if (creditor.amount < TOLERANCE) {
      creditorIndex++;
    }
    if (debtor.amount < TOLERANCE) {
      debtorIndex++;
    }
  }

  return simplifiedDebts;
}

// Alternative implementation using graph-based approach for even better optimization
export function advancedSimplifyDebts(balances: Balance): SimplifiedDebt[] {
  const members = Object.keys(balances);
  const n = members.length;

  // Create adjacency matrix for debts
  const debtMatrix: number[][] = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));
  const memberIndexMap: { [key: string]: number } = {};

  members.forEach((memberId, index) => {
    memberIndexMap[memberId] = index;
  });

  // Fill initial debts based on balances
  const creditors: number[] = [];
  const debtors: number[] = [];

  members.forEach((memberId, index) => {
    const balance = balances[memberId];
    if (balance > 0.01) {
      creditors.push(index);
    } else if (balance < -0.01) {
      debtors.push(index);
    }
  });

  const simplifiedDebts: SimplifiedDebt[] = [];

  // Use a greedy approach to minimize transactions
  while (creditors.length > 0 && debtors.length > 0) {
    const creditorIndex = creditors[0];
    const debtorIndex = debtors[0];

    const creditorBalance = balances[members[creditorIndex]];
    const debtorBalance = Math.abs(balances[members[debtorIndex]]);

    const settleAmount = Math.min(creditorBalance, debtorBalance);

    simplifiedDebts.push({
      fromMemberId: members[debtorIndex],
      toMemberId: members[creditorIndex],
      amount: settleAmount,
    });

    // Update balances
    balances[members[creditorIndex]] -= settleAmount;
    balances[members[debtorIndex]] += settleAmount;

    // Remove settled members
    if (Math.abs(balances[members[creditorIndex]]) < 0.01) {
      creditors.shift();
    }
    if (Math.abs(balances[members[debtorIndex]]) < 0.01) {
      debtors.shift();
    }
  }

  return simplifiedDebts;
}
