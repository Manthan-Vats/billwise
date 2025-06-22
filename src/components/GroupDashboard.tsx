import React from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  AlertTriangle,
  Trophy,
  Calendar,
} from "lucide-react";
import { Group, GroupAnalytics } from "../types";
import { formatCurrency } from "../utils/formatters";

interface GroupDashboardProps {
  group: Group;
  analytics: GroupAnalytics;
}

export const GroupDashboard: React.FC<GroupDashboardProps> = ({
  group,
  analytics,
}) => {
  const rawPercentage = group.budget
    ? (analytics.totalExpenses / group.budget) * 100
    : 0;
  const budgetPercentage = Math.min(rawPercentage, 100);
  const isOverBudget = analytics.isOverBudget;

  const categoryColors = [
    "#2a9d8f", // primary / persian-green
    "#264653", // charcoal
    "#f4a261", // secondary / sandy-brown
    "#e76f51", // accent / burnt-sienna
    "#e9c46a", // saffron
    "#10B981", // green accent
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#84CC16", // lime
    "#3B82F6", // blue
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brandHeader rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{group.name} Dashboard</h2>
            <p className="text-white/80">
              {analytics.totalMembers} members •{" "}
              {analytics.categoryBreakdown.length} categories
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {formatCurrency(analytics.totalExpenses, group.currency)}
            </div>
            <div className="text-white/80">Total Expenses</div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface/70 backdrop-blur-sm rounded-xl p-4 border border-surface/30"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-secondary/20 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <div className="text-sm text-textdark/70">Avg per Member</div>
              <div className="text-lg font-semibold text-textdark">
                {formatCurrency(
                  analytics.averageExpensePerMember,
                  group.currency,
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface/70 backdrop-blur-sm rounded-xl p-4 border border-surface/30"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-secondary/20 p-2 rounded-lg">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <div className="text-sm text-textdark/70">Active Members</div>
              <div className="text-lg font-semibold text-textdark">
                {analytics.totalMembers}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface/70 backdrop-blur-sm rounded-xl p-4 border border-surface/30"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-secondary/20 p-2 rounded-lg">
              <Trophy className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <div className="text-sm text-textdark/70">Top Category</div>
              <div className="text-lg font-semibold text-textdark capitalize">
                {analytics.mostActiveCategory || "None"}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface/70 backdrop-blur-sm rounded-xl p-4 border border-surface/30"
        >
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg ${isOverBudget ? "bg-primary/20" : "bg-secondary/20"}`}
            >
              {isOverBudget ? (
                <AlertTriangle className={`w-5 h-5 text-accent`} />
              ) : (
                <Target className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <div className="text-sm text-textdark/70">Budget Status</div>
              <div
                className={`text-lg font-semibold ${isOverBudget ? "text-accent" : "text-secondary"}`}
              >
                {group.budget ? `${budgetPercentage.toFixed(1)}%` : "No Budget"}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Budget Progress */}
      {group.budget && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-surface/70 backdrop-blur-sm rounded-xl p-6 border border-surface/30"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-textdark">
              Budget Overview
            </h3>
            <div className="text-sm text-textdark/70">
              {formatCurrency(analytics.totalExpenses, group.currency)} /{" "}
              {formatCurrency(group.budget, group.currency)}
            </div>
          </div>

          <div className="relative">
            <div className="w-full border-surface/40 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`h-3 rounded-full ${
                  isOverBudget
                    ? "bg-gradient-to-r from-primary to-accent"
                    : "bg-secondary"
                }`}
              />
            </div>
            {isOverBudget && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${budgetPercentage - 100}%` }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute top-0 left-full h-3 bg-gradient-to-r from-red-600 to-red-700 rounded-r-full"
                style={{ maxWidth: "100%" }}
              />
            )}
          </div>

          {isOverBudget && (
            <div className="mt-3 flex items-center space-x-2 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Over budget by{" "}
                {formatCurrency(
                  analytics.totalExpenses - group.budget,
                  group.currency,
                )}
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-surface/70 backdrop-blur-sm rounded-xl p-6 border border-surface/30"
        >
          <h3 className="text-lg font-semibold text-textdark mb-4">
            Spending by Category
          </h3>
          {analytics.categoryBreakdown.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    label={({ category, percentage }) =>
                      `${category} (${percentage.toFixed(1)}%)`
                    }
                  >
                    {analytics.categoryBreakdown.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={categoryColors[index % categoryColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(value as number, group.currency)
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-secondary">
              <div className="text-center">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-secondary" />
                <p>No expenses yet</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Category Breakdown Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-surface/70 backdrop-blur-sm rounded-xl p-6 border border-surface/30"
        >
          <h3 className="text-lg font-semibold text-textdark mb-4">
            Category Amounts
          </h3>
          {analytics.categoryBreakdown.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.categoryBreakdown}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(value as number, group.currency)
                    }
                  />
                  <Bar dataKey="amount" fill="#2a9d8f" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-secondary">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 text-secondary" />
                <p>No data to display</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Category Details */}
      {analytics.categoryBreakdown.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-surface/70 backdrop-blur-sm rounded-xl p-6 border border-surface/30"
        >
          <h3 className="text-lg font-semibold text-textdark mb-4">
            Category Breakdown
          </h3>
          <div className="space-y-3">
            {analytics.categoryBreakdown.map((category, index) => (
              <div
                key={category.category}
                className="flex items-center justify-between p-3 bg-surface/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor:
                        categoryColors[index % categoryColors.length],
                    }}
                  />
                  <span className="font-medium text-textdark capitalize">
                    {category.category}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-textdark">
                    {formatCurrency(category.amount, group.currency)}
                  </div>
                  <div className="text-sm text-textdark/70">
                    {category.percentage.toFixed(1)}% of total
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
