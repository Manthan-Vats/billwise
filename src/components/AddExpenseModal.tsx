import React, { useState } from 'react';
import { X, DollarSign, Calendar } from 'lucide-react';
import { Group, Split } from '../types';

interface AddExpenseModalProps {
  group: Group;
  onAddExpense: (expense: any) => void;
  onClose: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  group,
  onAddExpense,
  onClose,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(group.members[0]?.id || '');
  const [splitType, setSplitType] = useState<'equal' | 'custom' | 'percentage'>('equal');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [customSplits, setCustomSplits] = useState<{ [key: string]: string }>({});
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set(group.members.map(m => m.id))
  );

  const categories = ['food', 'transport', 'entertainment', 'utilities', 'shopping', 'accommodation', 'other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalAmount = parseFloat(amount);
    if (!totalAmount || !description.trim()) return;

    const participatingMembers = group.members.filter(m => selectedMembers.has(m.id));
    let splits: Split[] = [];

    if (splitType === 'equal') {
      const splitAmount = totalAmount / participatingMembers.length;
      splits = participatingMembers.map(member => ({
        memberId: member.id,
        amount: splitAmount,
      }));
    } else if (splitType === 'custom') {
      splits = participatingMembers.map(member => ({
        memberId: member.id,
        amount: parseFloat(customSplits[member.id] || '0'),
      }));
    } else if (splitType === 'percentage') {
      splits = participatingMembers.map(member => {
        const percentage = parseFloat(customSplits[member.id] || '0');
        return {
          memberId: member.id,
          amount: (totalAmount * percentage) / 100,
          percentage,
        };
      });
    }

    onAddExpense({
      groupId: group.id,
      description: description.trim(),
      amount: totalAmount,
      currency: 'USD',
      paidBy,
      splitType,
      splits,
      category: category || undefined,
      date,
    });

    onClose();
  };

  const toggleMemberSelection = (memberId: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
    } else {
      newSelected.add(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const getTotalCustomAmount = () => {
    return Object.values(customSplits).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  };

  const getTotalPercentage = () => {
    return Object.values(customSplits).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Add New Expense</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What was this expense for?"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Amount *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Paid by
              </label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                {group.members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="">Select category (optional)</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Member Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Who's involved?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {group.members.map(member => (
                <label
                  key={member.id}
                  className={`flex items-center space-x-2 p-3 rounded-xl cursor-pointer transition-all ${
                    selectedMembers.has(member.id)
                      ? 'bg-blue-100 border-2 border-blue-300'
                      : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.has(member.id)}
                    onChange={() => toggleMemberSelection(member.id)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">{member.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Split Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              How to split?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['equal', 'custom', 'percentage'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSplitType(type)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all ${
                    splitType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Split Inputs */}
          {splitType !== 'equal' && (
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3">
                {splitType === 'custom' ? 'Custom amounts' : 'Percentages'}
              </h4>
              <div className="space-y-2">
                {group.members
                  .filter(m => selectedMembers.has(m.id))
                  .map(member => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <span className="w-24 text-sm font-medium text-slate-700">
                        {member.name}
                      </span>
                      <div className="flex-1 relative">
                        {splitType === 'custom' && (
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        )}
                        <input
                          type="number"
                          step="0.01"
                          value={customSplits[member.id] || ''}
                          onChange={(e) => setCustomSplits(prev => ({
                            ...prev,
                            [member.id]: e.target.value
                          }))}
                          placeholder={splitType === 'custom' ? '0.00' : '0'}
                          className={`w-full ${splitType === 'custom' ? 'pl-10' : 'pl-4'} pr-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all`}
                        />
                        {splitType === 'percentage' && (
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">%</span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Validation */}
              {splitType === 'custom' && amount && (
                <div className={`text-sm mt-2 ${
                  Math.abs(getTotalCustomAmount() - parseFloat(amount)) < 0.01
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  Total: ${getTotalCustomAmount().toFixed(2)} / ${parseFloat(amount).toFixed(2)}
                </div>
              )}

              {splitType === 'percentage' && (
                <div className={`text-sm mt-2 ${
                  Math.abs(getTotalPercentage() - 100) < 0.1
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  Total: {getTotalPercentage().toFixed(1)}% / 100%
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={
                !description.trim() ||
                !amount ||
                selectedMembers.size === 0 ||
                (splitType === 'custom' && Math.abs(getTotalCustomAmount() - parseFloat(amount || '0')) > 0.01) ||
                (splitType === 'percentage' && Math.abs(getTotalPercentage() - 100) > 0.1)
              }
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};