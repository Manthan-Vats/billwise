import { Group, Expense, GroupAnalytics, CategorySpending } from '../types';

export function calculateGroupAnalytics(
  group: Group,
  expenses: Expense[]
): GroupAnalytics {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalMembers = group.members.length;
  
  // Calculate category breakdown
  const categoryMap = new Map<string, number>();
  expenses.forEach(expense => {
    const category = expense.category || 'other';
    categoryMap.set(category, (categoryMap.get(category) || 0) + expense.amount);
  });

  const categoryBreakdown: CategorySpending[] = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      color: getCategoryColor(category),
    }))
    .sort((a, b) => b.amount - a.amount);

  const budgetUsage = group.budget ? (totalExpenses / group.budget) * 100 : 0;
  const isOverBudget = group.budget ? totalExpenses > group.budget : false;
  const averageExpensePerMember = totalMembers > 0 ? totalExpenses / totalMembers : 0;
  const mostActiveCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0].category : '';

  return {
    totalExpenses,
    totalMembers,
    categoryBreakdown,
    budgetUsage,
    isOverBudget,
    averageExpensePerMember,
    mostActiveCategory,
  };
}

function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    food: '#F59E0B',
    transport: '#3B82F6',
    entertainment: '#8B5CF6',
    utilities: '#10B981',
    shopping: '#EC4899',
    accommodation: '#F43F5E',
    travel: '#06B6D4',
    stay: '#84CC16',
    other: '#6B7280',
  };
  return colors[category] || colors.other;
}

export function generateGroupCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}