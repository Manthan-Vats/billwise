import React, { useState, useEffect } from "react";
import { X, CreditCard, ArrowRight, CheckCircle } from "lucide-react";
import { Group, SimplifiedDebt } from "../types";
import { formatCurrency } from "../utils/formatters";

interface SettleUpModalProps {
  group: Group;
  simplifiedDebts: SimplifiedDebt[];
  onAddSettlement: (settlement: any) => void;
  onClose: () => void;
}

export const SettleUpModal: React.FC<SettleUpModalProps> = ({
  group,
  simplifiedDebts,
  onAddSettlement,
  onClose,
}) => {
  const [selectedDebt, setSelectedDebt] = useState<SimplifiedDebt | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [maxSettlementAmount, setMaxSettlementAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");

  // Update max settlement amount when selected debt changes
  useEffect(() => {
    if (selectedDebt) {
      // simplifiedDebts already ensures the debt amount is the max possible
      setMaxSettlementAmount(selectedDebt.amount);

      // Reset custom amount when debt changes
      setCustomAmount("");
      setValidationError(null);
    }
  }, [selectedDebt]);

  const getMemberName = (memberId: string) => {
    return group.members.find((m) => m.id === memberId)?.name || "Unknown";
  };

  const handleSettle = () => {
    if (!selectedDebt) return;

    const amount = customAmount
      ? parseFloat(customAmount)
      : selectedDebt.amount;

    // Validate the settlement
    // Quick validation: ensure amount within allowed range
    if (amount <= 0 || amount - maxSettlementAmount > 0.01) {
      setValidationError("Amount exceeds remaining debt");
      return;
    }

    // If we get here, the settlement is valid
    onAddSettlement({
      groupId: group.id,
      fromMemberId: selectedDebt.fromMemberId,
      toMemberId: selectedDebt.toMemberId,
      amount,
      currency: "USD",
      description:
        notes.trim() ||
        `Settlement: ${getMemberName(selectedDebt.fromMemberId)} → ${getMemberName(selectedDebt.toMemberId)}`,
    });

    onClose();
  };

  const getSettlementAmount = () => {
    return customAmount ? parseFloat(customAmount) : selectedDebt?.amount || 0;
  };

  const isSettlementValid = () => {
    if (!selectedDebt) return false;

    const amount = getSettlementAmount();
    if (amount <= 0 || amount > maxSettlementAmount) return false;

    return true;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-textdark flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Settle Up</span>
          </h2>
          <button
            onClick={onClose}
            className="text-secondary hover:text-textdark/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {simplifiedDebts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-textdark mb-2">
              All Settled!
            </h3>
            <p className="text-textdark/70">No outstanding debts to settle.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Select Debt to Settle */}
            <div>
              <h3 className="text-sm font-medium text-textdark/90 mb-3">
                Select payment to record:
              </h3>
              {maxSettlementAmount > 0 && (
                <p className="text-xs text-secondary mb-3">
                  Maximum settlement amount:{" "}
                  {formatCurrency(maxSettlementAmount, "USD")}
                </p>
              )}
              <div className="space-y-2">
                {simplifiedDebts.map((debt, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedDebt === debt
                        ? "bg-blue-100 border-2 border-blue-300"
                        : "bg-surface/50 border border-surface/40 hover:bg-surface/70"
                    }`}
                    onClick={() => setSelectedDebt(debt)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {getMemberName(debt.fromMemberId)
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-medium text-textdark">
                              {formatCurrency(debt.amount, "USD")}
                            </span>
                            {debt.amount > maxSettlementAmount && (
                              <span className="text-xs text-amber-600">
                                Max:{" "}
                                {formatCurrency(maxSettlementAmount, "USD")}
                              </span>
                            )}
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-textdark/70" />

                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {getMemberName(debt.toMemberId)
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <span className="font-medium text-textdark">
                            {getMemberName(debt.toMemberId)}
                          </span>
                        </div>
                      </div>

                      <div className="text-lg font-bold text-orange-600">
                        {formatCurrency(debt.amount, "USD")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedDebt && (
              <>
                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-textdark/90 mb-3">
                    Payment method:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["cash", "bank-transfer", "digital-wallet"].map(
                      (method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`p-3 rounded-xl text-sm font-medium transition-all ${
                            paymentMethod === method
                              ? "bg-blue-600 text-white"
                              : "bg-surface/70 text-textdark/90 hover:bg-surface"
                          }`}
                        >
                          {method
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ")}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Custom Amount */}
                <div>
                  <h3 className="text-sm font-medium text-textdark/90 mb-2">
                    Settlement Amount:
                  </h3>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-secondary">$</span>
                    </div>
                    <input
                      type="text"
                      className="w-full pl-6 pr-4 py-3 border border-surface/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={
                        selectedDebt
                          ? formatCurrency(selectedDebt.amount, "USD")
                          : "0.00"
                      }
                      value={customAmount}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only numbers and decimal point
                        if (value === "" || /^\d*\.?\d*$/.test(value)) {
                          setCustomAmount(value);

                          // Clear any previous validation error when user starts typing
                          if (validationError) {
                            setValidationError(null);
                          }
                        }
                      }}
                      disabled={!selectedDebt}
                    />
                  </div>
                  {validationError && (
                    <div className="mt-2 text-sm text-accent flex items-center">
                      <span className="mr-1">⚠️</span>
                      {validationError}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-textdark/90 mb-2">
                    Notes (optional):
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional notes about this payment..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface/60 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                  />
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t border-surface/40">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-2.5 border border-surface/60 text-textdark/90 rounded-xl hover:bg-surface/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSettle}
                disabled={!selectedDebt || !isSettlementValid()}
                className={`w-full py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition-colors ${
                  !selectedDebt || !isSettlementValid()
                    ? "bg-surface/70 text-secondary cursor-not-allowed"
                    : "bg-primary hover:bg-accent text-white"
                }`}
                title={
                  !selectedDebt
                    ? "Select a debt to settle"
                    : !isSettlementValid()
                      ? "Enter a valid amount"
                      : ""
                }
              >
                <span>
                  Record Payment of{" "}
                  {formatCurrency(getSettlementAmount(), "USD")}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
