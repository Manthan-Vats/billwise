export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "google";
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: Member[];
  expenses: Expense[];
  settlements: Settlement[];
  createdAt: string;
  createdBy: string;
  budget?: number;
  currency: string;
  groupCode: string; // Unique 6-digit code for joining
}

export interface Member {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  joinedAt: string;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: string; // member id
  splitType: "equal" | "custom" | "percentage";
  splits: Split[];
  category?: string;
  createdAt: string;
  date: string;
  receipt?: string; // URL to receipt image
}

export interface Split {
  memberId: string;
  amount: number;
  percentage?: number;
}

export interface Settlement {
  id: string;
  groupId: string;
  fromMemberId: string;
  toMemberId: string;
  amount: number;
  currency: string;
  description?: string;
  createdAt: string;
}

export interface Balance {
  [memberId: string]: number;
}

export interface SimplifiedDebt {
  fromMemberId: string;
  toMemberId: string;
  amount: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface GroupAnalytics {
  totalExpenses: number;
  totalMembers: number;
  categoryBreakdown: CategorySpending[];
  budgetUsage: number;
  isOverBudget: boolean;
  averageExpensePerMember: number;
  mostActiveCategory: string;
}
