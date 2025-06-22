import React from 'react';
import { Receipt, Calendar, User, DollarSign } from 'lucide-react';
import { Expense, Group } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface ExpenseListProps {
  expenses: Expense[];
  group: Group;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, group }) => {
  const getMemberName = (memberId: string) => {
    return group.members.find(m => m.id === memberId)?.name || 'Unknown';
  };

  const getCategoryColor = (category?: string) => {
    const colors = {
      food: 'bg-orange-100 text-orange-800',
      transport: 'bg-blue-100 text-blue-800',
      entertainment: 'bg-purple-100 text-purple-800',
      utilities: 'bg-green-100 text-green-800',
      shopping: 'bg-pink-100 text-pink-800',
      default: 'bg-slate-100 text-slate-800'
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center">
        <Receipt className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-700 mb-2">No Expenses Yet</h3>
        <p className="text-slate-600">Add your first expense to get started!</p>
      </div>
    );
  }

  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedExpenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-slate-800">{expense.description}</h3>
                {expense.category && (
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(expense.category)}`}>
                    {expense.category}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(expense.date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Paid by {getMemberName(expense.paidBy)}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-800">
                {formatCurrency(expense.amount, expense.currency)}
              </div>
              <div className="text-sm text-slate-600">
                Split {expense.splitType}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Split Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {expense.splits.map((split) => (
                <div
                  key={split.memberId}
                  className="bg-white/50 rounded-lg p-3 flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-slate-700">
                    {getMemberName(split.memberId)}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-800">
                      {formatCurrency(split.amount, expense.currency)}
                    </div>
                    {expense.splitType === 'percentage' && split.percentage && (
                      <div className="text-xs text-slate-600">
                        {split.percentage.toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};