import { Group, Settlement, Balance } from '../types';

// Constants for floating point precision handling
const TOLERANCE = 0.01;

/**
 * Validates if a settlement is valid given the current balances
 * @param group - The group the settlement belongs to
 * @param balances - Current balances of all group members
 * @param settlement - The settlement to validate
 * @returns {boolean} - Whether the settlement is valid
 */
export function isValidSettlement(
  group: Group,
  balances: Balance,
  settlement: Omit<Settlement, 'id' | 'createdAt' | 'currency' | 'description'>
): boolean {
  // Check if both members are part of the group
  const fromMember = group.members.find(m => m.id === settlement.fromMemberId);
  const toMember = group.members.find(m => m.id === settlement.toMemberId);
  
  if (!fromMember || !toMember) {
    return false; // One or both members not in group
  }

  // Check if amount is positive
  if (settlement.amount <= 0) {
    return false;
  }

  // Check if the amount is within the tolerance of the actual debt
  const fromBalance = balances[settlement.fromMemberId] || 0;
  const toBalance = balances[settlement.toMemberId] || 0;
  
  // The fromMember should have a negative balance (owes money)
  // The toMember should have a positive balance (is owed money)
  if (fromBalance > -TOLERANCE || toBalance < TOLERANCE) {
    return false;
  }

  // The settlement amount should not exceed what's owed
  if (Math.abs(settlement.amount) > Math.abs(fromBalance) + TOLERANCE) {
    return false;
  }

  return true;
}

/**
 * Validates if a settlement would be valid given the current state
 * This is a more permissive version that can be used before balances are updated
 */
export function wouldBeValidSettlement(
  group: Group,
  _currentSettlements: Settlement[], // Parameter kept for backward compatibility but not used
  newSettlement: Omit<Settlement, 'id' | 'createdAt' | 'currency' | 'description'>
): boolean {
  // Basic validation first
  if (newSettlement.amount <= 0) {
    return false;
  }

  // Check if both members are part of the group
  const fromMember = group.members.find(m => m.id === newSettlement.fromMemberId);
  const toMember = group.members.find(m => m.id === newSettlement.toMemberId);
  
  if (!fromMember || !toMember) {
    return false; // One or both members not in group
  }

  // Check for self-settlement
  if (newSettlement.fromMemberId === newSettlement.toMemberId) {
    return false;
  }

  // Additional business logic can be added here
  // For example, check if the settlement makes sense given the group's history
  
  return true;
}

/**
 * Calculates the maximum allowed settlement amount between two members
 * based on their current balances
 */
export function getMaxSettlementAmount(
  balances: Balance,
  fromMemberId: string,
  toMemberId: string
): number {
  const fromBalance = balances[fromMemberId] || 0;
  const toBalance = balances[toMemberId] || 0;

  // If the payer does not owe money or the receiver is not owed money, no settlement possible
  if (fromBalance >= -TOLERANCE || toBalance <= TOLERANCE) {
    return 0;
  }

  // The maximum amount that can be settled is the minimum of:
  // 1. What the fromMember owes (absolute value of their negative balance)
  // 2. What the toMember is owed (their positive balance)
  return Math.min(Math.abs(fromBalance), toBalance);
}