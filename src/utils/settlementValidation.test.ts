import { Group, Member, Settlement } from "../types";
import {
  isValidSettlement,
  getMaxSettlementAmount,
} from "./settlementValidation";

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
declare const it: (
  name: string,
  fn: (done?: DoneCallback) => void,
  timeout?: number,
) => void;
declare const beforeEach: (fn: () => void, timeout?: number) => void;

describe("Settlement Validation", () => {
  let group: Group;
  let member1: Member;
  let member2: Member;
  let member3: Member;
  let balances: Record<string, number>;

  beforeEach(() => {
    member1 = {
      id: "1",
      name: "Alice",
      email: "alice@example.com",
      joinedAt: new Date().toISOString(),
    };
    member2 = {
      id: "2",
      name: "Bob",
      email: "bob@example.com",
      joinedAt: new Date().toISOString(),
    };
    member3 = {
      id: "3",
      name: "Charlie",
      email: "charlie@example.com",
      joinedAt: new Date().toISOString(),
    };

    group = {
      id: "group1",
      name: "Test Group",
      members: [member1, member2, member3],
      expenses: [],
      settlements: [],
      createdAt: new Date().toISOString(),
      createdBy: member1.id,
      currency: "USD",
      groupCode: "ABC123",
    };

    // Alice is owed $50, Bob owes $30, Charlie owes $20
    balances = {
      [member1.id]: 50,
      [member2.id]: -30,
      [member3.id]: -20,
    };
  });

  describe("isValidSettlement", () => {
    it("should validate a valid settlement", () => {
      const settlement: Omit<
        Settlement,
        "id" | "createdAt" | "currency" | "description"
      > = {
        groupId: group.id,
        fromMemberId: member2.id, // Bob owes
        toMemberId: member1.id, // Alice is owed
        amount: 30,
      };

      const result = isValidSettlement(group, balances, settlement);
      expect(result).toBe(true);
    });

    it("should reject settlement with zero amount", () => {
      const settlement: Omit<
        Settlement,
        "id" | "createdAt" | "currency" | "description"
      > = {
        groupId: group.id,
        fromMemberId: member2.id,
        toMemberId: member1.id,
        amount: 0,
      };

      const result = isValidSettlement(group, balances, settlement);
      expect(result).toBe(false);
    });

    it("should reject settlement with negative amount", () => {
      const settlement: Omit<
        Settlement,
        "id" | "createdAt" | "currency" | "description"
      > = {
        groupId: group.id,
        fromMemberId: member2.id,
        toMemberId: member1.id,
        amount: -10,
      };

      const result = isValidSettlement(group, balances, settlement);
      expect(result).toBe(false);
    });

    it("should reject settlement where fromMember is not in group", () => {
      const settlement: Omit<
        Settlement,
        "id" | "createdAt" | "currency" | "description"
      > = {
        groupId: group.id,
        fromMemberId: "nonexistent",
        toMemberId: member1.id,
        amount: 10,
      };

      const result = isValidSettlement(group, balances, settlement);
      expect(result).toBe(false);
    });

    it("should reject settlement where toMember is not in group", () => {
      const settlement: Omit<
        Settlement,
        "id" | "createdAt" | "currency" | "description"
      > = {
        groupId: group.id,
        fromMemberId: member2.id,
        toMemberId: "nonexistent",
        amount: 10,
      };

      const result = isValidSettlement(group, balances, settlement);
      expect(result).toBe(false);
    });

    it("should reject settlement where fromMember does not owe money", () => {
      // Alice is owed money, not owing
      const settlement: Omit<
        Settlement,
        "id" | "createdAt" | "currency" | "description"
      > = {
        groupId: group.id,
        fromMemberId: member1.id,
        toMemberId: member2.id,
        amount: 10,
      };

      const result = isValidSettlement(group, balances, settlement);
      expect(result).toBe(false);
    });

    it("should reject settlement where toMember is not owed money", () => {
      // Bob owes money, not being owed
      const settlement: Omit<
        Settlement,
        "id" | "createdAt" | "currency" | "description"
      > = {
        groupId: group.id,
        fromMemberId: member3.id,
        toMemberId: member2.id,
        amount: 10,
      };

      const result = isValidSettlement(group, balances, settlement);
      expect(result).toBe(false);
    });

    it("should reject settlement that exceeds what is owed", () => {
      // Bob only owes $30
      const settlement: Omit<
        Settlement,
        "id" | "createdAt" | "currency" | "description"
      > = {
        groupId: group.id,
        fromMemberId: member2.id,
        toMemberId: member1.id,
        amount: 40, // More than Bob owes
      };

      const result = isValidSettlement(group, balances, settlement);
      expect(result).toBe(false);
    });
  });

  describe("getMaxSettlementAmount", () => {
    it("should return the correct maximum settlement amount", () => {
      // Bob owes $30, Alice is owed $50
      const maxAmount = getMaxSettlementAmount(
        balances,
        member2.id,
        member1.id,
      );
      expect(maxAmount).toBe(30); // Limited by what Bob owes
    });

    it("should return 0 if fromMember does not owe money", () => {
      // Alice is owed money, not owing
      const maxAmount = getMaxSettlementAmount(
        balances,
        member1.id,
        member2.id,
      );
      expect(maxAmount).toBe(0);
    });

    it("should return 0 if toMember is not owed money", () => {
      // Bob owes money, not being owed
      const maxAmount = getMaxSettlementAmount(
        balances,
        member3.id,
        member2.id,
      );
      expect(maxAmount).toBe(0);
    });
  });
});
