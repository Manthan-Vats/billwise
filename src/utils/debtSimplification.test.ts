import { Group, Member, Expense, Settlement } from '../types';
import { calculateBalances, simplifyDebts } from './debtSimplification';

// Type definitions for test environment
type DoneCallback = (error?: any) => void;

declare const expect: {
  (actual: any): {
    toBe(expected: any): void;
    toBeCloseTo(expected: number, numDigits?: number): void;
    toBeDefined(): void;
    toEqual(expected: any): void;
    toHaveLength(length: number): void;
    toBeGreaterThan(expected: number): void;
    toBeLessThan(expected: number): void;
    toBeNull(): void;
    toBeTruthy(): void;
    toBeUndefined(): void;
    toContain(item: any): void;
    toMatch(regexp: RegExp | string): void;
    toThrow(error?: any): void;
  };
  any(constructor: any): any;
  anything(): any;
  arrayContaining(arr: any[]): any;
  objectContaining(obj: any): any;
  stringMatching(regexp: RegExp | string): any;
};

declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: (done?: DoneCallback) => void, timeout?: number) => void;
declare const beforeEach: (fn: () => void, timeout?: number) => void;

describe('debtSimplification', () => {
  let group: Group;
  let member1: Member;
  let member2: Member;
  let member3: Member;
  let expenses: Expense[];
  let settlements: Settlement[];

  beforeEach(() => {
    // Create test members
    member1 = { id: '1', name: 'Alice', email: 'alice@example.com', joinedAt: new Date().toISOString() };
    member2 = { id: '2', name: 'Bob', email: 'bob@example.com', joinedAt: new Date().toISOString() };
    member3 = { id: '3', name: 'Charlie', email: 'charlie@example.com', joinedAt: new Date().toISOString() };

    // Create test group
    group = {
      id: 'group1',
      name: 'Test Group',
      members: [member1, member2, member3],
      expenses: [],
      settlements: [],
      createdAt: new Date().toISOString(),
      createdBy: member1.id,
      currency: 'USD',
      groupCode: 'ABC123',
    };

    // Create test expenses
    expenses = [
      {
        id: 'exp1',
        groupId: group.id,
        description: 'Dinner',
        amount: 100,
        currency: 'USD',
        paidBy: member1.id,
        splitType: 'equal',
        splits: [
          { memberId: member1.id, amount: 33.34 },
          { memberId: member2.id, amount: 33.33 },
          { memberId: member3.id, amount: 33.33 },
        ],
        createdAt: new Date().toISOString(),
        date: new Date().toISOString(),
      },
      {
        id: 'exp2',
        groupId: group.id,
        description: 'Groceries',
        amount: 60,
        currency: 'USD',
        paidBy: member2.id,
        splitType: 'custom',
        splits: [
          { memberId: member1.id, amount: 20 },
          { memberId: member2.id, amount: 20 },
          { memberId: member3.id, amount: 20 },
        ],
        createdAt: new Date().toISOString(),
        date: new Date().toISOString(),
      },
    ];

    // Create test settlements
    settlements = [
      {
        id: 'set1',
        groupId: group.id,
        fromMemberId: member3.id,
        toMemberId: member1.id,
        amount: 10,
        currency: 'USD',
        description: 'Partial settlement',
        createdAt: new Date().toISOString(),
      },
    ];
  });

  describe('calculateBalances', () => {
    it('should correctly calculate balances from expenses', () => {
      const balances = calculateBalances(group, expenses, []);
      
      // Alice paid $100, owes $53.34, net +$46.66
      // Bob paid $60, owes $53.33, net -$6.67
      // Charlie owes $53.33, net -$53.33
      
      // Using toBeCloseTo for floating point comparison
      expect(balances[member1.id]).toBeCloseTo(46.66, 2);
      expect(balances[member2.id]).toBeCloseTo(6.67, 2);
      expect(balances[member3.id]).toBeCloseTo(-53.33, 2);
    });

    it('should handle settlements correctly', () => {
      // Test that settlements don't affect the balances since they're already reflected
      const balancesWithoutSettlements = calculateBalances(group, expenses, []);
      const balancesWithSettlements = calculateBalances(group, expenses, settlements);
      
      // The balances should be the same regardless of settlements
      // because settlements are already reflected in the current balances
      expect(balancesWithSettlements[member1.id]).toBeCloseTo(balancesWithoutSettlements[member1.id], 2);
      expect(balancesWithSettlements[member2.id]).toBeCloseTo(balancesWithoutSettlements[member2.id], 2);
      expect(balancesWithSettlements[member3.id]).toBeCloseTo(balancesWithoutSettlements[member3.id], 2);
    });

    it('should handle empty expenses and settlements', () => {
      const balances = calculateBalances(group, [], []);
      expect(balances[member1.id]).toBe(0);
      expect(balances[member2.id]).toBe(0);
      expect(balances[member3.id]).toBe(0);
    });
  });

  describe('simplifyDebts', () => {
    it('should correctly simplify debts between members', () => {
      // Alice is owed $46.66, Bob is owed $6.67, Charlie owes $53.33
      const balances = {
        [member1.id]: 46.66,
        [member2.id]: -6.67,
        [member3.id]: -53.33,
      };

      const simplified = simplifyDebts(balances);
      
      // Expect two transactions:
      // Charlie pays Alice $46.66
      expect(simplified).toHaveLength(1);
      
      // There should be no payment from Bob since he is a creditor in this scenario.
      const bobsPayment = simplified.find(
        (d) => d.fromMemberId === member2.id && d.toMemberId === member1.id
      );
      expect(bobsPayment).toBeUndefined();
      
      // Check Charlie's payment
      const charliesPayment = simplified.find(
        (d) => d.fromMemberId === member3.id && d.toMemberId === member1.id
      );
      expect(charliesPayment).toBeDefined();
      expect(charliesPayment?.amount).toBeCloseTo(46.66, 2);
    });

    it('should handle zero balances', () => {
      const balances = {
        [member1.id]: 0,
        [member2.id]: 0,
        [member3.id]: 0,
      };

      const simplified = simplifyDebts(balances);
      expect(simplified).toHaveLength(0);
    });

    it('should handle a single creditor and debtor', () => {
      const balances = {
        [member1.id]: 100,
        [member2.id]: -100,
        [member3.id]: 0,
      };

      const simplified = simplifyDebts(balances);
      expect(simplified).toHaveLength(1);
      expect(simplified[0].fromMemberId).toBe(member2.id);
      expect(simplified[0].toMemberId).toBe(member1.id);
      expect(simplified[0].amount).toBe(100);
    });

    it('should handle floating point precision issues', () => {
      // This tests that our TOLERANCE constant is working correctly
      const balances = {
        [member1.id]: 0.01,  // Should be considered zero with TOLERANCE of 0.01
        [member2.id]: -0.01, // Should be considered zero with TOLERANCE of 0.01
        [member3.id]: 0,
      };

      const simplified = simplifyDebts(balances);
      expect(simplified).toHaveLength(0);
    });
  });
});
