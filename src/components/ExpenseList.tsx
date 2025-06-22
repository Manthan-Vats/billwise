import React from "react";
import { IndianRupee, Calendar, User } from "lucide-react";
import { Expense, Group } from "../types";
import { formatCurrency, formatDate } from "../utils/formatters";

interface ExpenseListProps {
  expenses: Expense[];
  group: Group;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  group,
}) => {
  const getMemberName = (memberId: string) => {
    return group.members.find((m) => m.id === memberId)?.name || "Unknown";
  };

  const getCategoryColor = (category?: string) => {
    const colors = {
      food: "bg-accent/10 text-accent",
      transport: "bg-secondary/20 text-secondary",
      entertainment: "bg-primary/10 text-primary",
      utilities: "bg-brandHeader/20 text-brandHeader",
      shopping: "bg-secondary/30 text-secondary/90",
      accommodation: "bg-primary/20 text-primary/90",
      default: "bg-surface text-textdark",
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-surface/60 backdrop-blur-sm rounded-2xl p-8 text-center">
        <IndianRupee className="w-12 h-12 text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-textdark/90 mb-2">
          No Expenses Yet
        </h3>
        <p className="text-secondary">Add your first expense to get started!</p>
      </div>
    );
  }

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="space-y-4">
      {sortedExpenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-surface/60 backdrop-blur-sm rounded-2xl p-6 border border-surface/20 hover:bg-surface/80 transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-textdark">
                  {expense.description}
                </h3>
                {expense.category && (
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(expense.category)}`}
                  >
                    {expense.category}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-secondary">
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
              <div className="text-2xl font-bold text-textdark">
                {formatCurrency(expense.amount, group.currency)}
              </div>
              <div className="text-sm text-secondary">
                Split {expense.splitType}
              </div>
            </div>
          </div>

          <div className="border-t border-surface/40 pt-4">
            <h4 className="text-sm font-medium text-textdark/90 mb-3">
              Split Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {expense.splits.map((split) => (
                <div
                  key={split.memberId}
                  className="bg-surface/50 rounded-lg p-3 flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-textdark/90">
                    {getMemberName(split.memberId)}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-textdark">
                      {formatCurrency(split.amount, group.currency)}
                    </div>
                    {expense.splitType === "percentage" && split.percentage && (
                      <div className="text-xs text-secondary">
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
