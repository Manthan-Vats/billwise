import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight, Users } from 'lucide-react';
import { Balance, SimplifiedDebt, Group } from '../types';
import { formatCurrency } from '../utils/formatters';

interface BalancesViewProps {
  balances: Balance;
  simplifiedDebts: SimplifiedDebt[];
  group: Group;
}

export const BalancesView: React.FC<BalancesViewProps> = ({
  balances,
  simplifiedDebts,
  group,
}) => {
  const getMemberName = (memberId: string) => {
    return group.members.find(m => m.id === memberId)?.name || 'Unknown';
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-green-600';
    if (balance < 0) return 'text-red-600';
    return 'text-slate-600';
  };

  const getBalanceIcon = (balance: number) => {
    if (balance > 0) return <TrendingUp className="w-4 h-4" />;
    if (balance < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  const totalOwed = Object.values(balances).reduce((sum, balance) => 
    balance < 0 ? sum + Math.abs(balance) : sum, 0
  );

  const totalOwing = Object.values(balances).reduce((sum, balance) => 
    balance > 0 ? sum + balance : sum, 0
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Total Owed to You</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totalOwing, group.currency || 'USD')}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border border-red-200">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Total You Owe</h3>
          </div>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(totalOwed, group.currency || 'USD')}
          </p>
        </div>
      </div>

      {/* Individual Balances */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Individual Balances</span>
        </h3>

        <div className="space-y-3">
          {Object.entries(balances).map(([memberId, balance]) => (
            <div
              key={memberId}
              className="bg-white/50 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {getMemberName(memberId).charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-slate-800">
                  {getMemberName(memberId)}
                </span>
              </div>

              <div className={`flex items-center space-x-2 font-semibold ${getBalanceColor(balance)}`}>
                {getBalanceIcon(balance)}
                <span className="text-lg">
                  {Math.abs(balance) < 0.01 ? 'Settled' : formatCurrency(Math.abs(balance), group.currency)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simplified Settlements */}
      {simplifiedDebts.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Suggested Settlements ({simplifiedDebts.length} payment{simplifiedDebts.length !== 1 ? 's' : ''})
          </h3>
          
          <div className="space-y-3">
            {simplifiedDebts.map((debt, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {getMemberName(debt.fromMemberId).charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-800">
                        {getMemberName(debt.fromMemberId)}
                      </span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-600" />

                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {getMemberName(debt.toMemberId).charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-800">
                        {getMemberName(debt.toMemberId)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-600">
                      {formatCurrency(debt.amount, group.currency || 'USD')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800">
              💡 <strong>Smart Optimization:</strong> These {simplifiedDebts.length} payment{simplifiedDebts.length !== 1 ? 's' : ''} will settle all debts efficiently, 
              minimizing the total number of transactions needed.
            </p>
          </div>
        </div>
      )}

      {simplifiedDebts.length === 0 && Object.values(balances).every(b => b === 0) && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center border border-green-200">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">All Settled!</h3>
          <p className="text-green-700">Everyone's balances are cleared. Great job! 🎉</p>
        </div>
      )}
    </div>
  );
};