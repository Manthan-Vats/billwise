import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import { Header } from "./components/Header";
import { AuthPage } from "./components/AuthPage";
import { GroupSelector } from "./components/GroupSelector";
import { ExpenseList } from "./components/ExpenseList";
import { BalancesView } from "./components/BalancesView";
import { GroupDashboard } from "./components/GroupDashboard";
import { AddExpenseModal } from "./components/AddExpenseModal";
import { AddGroupModal } from "./components/AddGroupModal";
import { JoinGroupModal } from "./components/JoinGroupModal";
import { ManageMembersModal } from "./components/ManageMembersModal";
import { SettleUpModal } from "./components/SettleUpModal";
import { Footer } from "./components/Footer";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Group, Expense, Settlement } from "./types";
import { calculateBalances, simplifyDebts } from "./utils/debtSimplification";
import { calculateGroupAnalytics } from "./utils/analytics";

function AppContent() {
  const { user, isLoading } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showJoinGroup, setShowJoinGroup] = useState(false);
  const [showManageMembers, setShowManageMembers] = useState(false);
  const [showSettleUp, setShowSettleUp] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "expenses" | "balances" | "dashboard"
  >("expenses");

  // Load data from localStorage on mount
  useEffect(() => {
    if (!user) return;

    const savedGroups = localStorage.getItem("expense-groups");
    const savedExpenses = localStorage.getItem("expense-expenses");
    const savedSettlements = localStorage.getItem("expense-settlements");

    if (savedGroups) {
      const parsedGroups = JSON.parse(savedGroups);
      setGroups(parsedGroups);
      if (parsedGroups.length > 0 && !selectedGroupId) {
        setSelectedGroupId(parsedGroups[0].id);
      }
    }
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedSettlements) setSettlements(JSON.parse(savedSettlements));
  }, [user]);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (!user) return;
    localStorage.setItem("expense-groups", JSON.stringify(groups));
  }, [groups, user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem("expense-expenses", JSON.stringify(expenses));
  }, [expenses, user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem("expense-settlements", JSON.stringify(settlements));
  }, [settlements, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);
  const groupExpenses = expenses.filter((e) => e.groupId === selectedGroupId);
  const groupSettlements = settlements.filter(
    (s) => s.groupId === selectedGroupId,
  );

  const balances = selectedGroup
    ? calculateBalances(selectedGroup, groupExpenses, groupSettlements)
    : {};
  const simplifiedDebts = selectedGroup ? simplifyDebts(balances) : [];
  const analytics = selectedGroup
    ? calculateGroupAnalytics(selectedGroup, groupExpenses)
    : null;

  const addGroup = (
    group: Omit<
      Group,
      "id" | "createdAt" | "createdBy" | "expenses" | "settlements"
    >,
  ) => {
    if (!user) return;
    const newGroup: Group = {
      ...group,
      id: `group_${Date.now()}`,
      expenses: [],
      settlements: [],
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      members: [
        ...group.members,
        {
          id: user.id,
          name: (user as any).user_metadata?.full_name || user.email || "Admin",
          joinedAt: new Date().toISOString(),
        },
      ],
    };
    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    setSelectedGroupId(newGroup.id);
    localStorage.setItem("expense-groups", JSON.stringify(updatedGroups));
  };

  const joinGroup = (groupCode: string) => {
    // In a real app, this would make an API call to find the group by code
    // For demo purposes, we'll create a mock group
    if (!user) return;
    const mockGroup: Group = {
      id: Date.now().toString(),
      name: `Group ${groupCode}`,
      description: "Joined group",
      members: [
        {
          id: user.id,
          name: (user as any).user_metadata?.full_name || user.email || "Admin",
          email: user.email,
          joinedAt: new Date().toISOString(),
        },
      ],
      expenses: [],
      settlements: [],
      createdAt: new Date().toISOString(),
      createdBy: "other-user",
      currency: "USD",
      groupCode,
    };
    setGroups((prev) => [...prev, mockGroup]);
    setSelectedGroupId(mockGroup.id);
  };

  const updateGroup = (groupId: string, updates: Partial<Group>) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, ...updates } : g)),
    );
  };

  const deleteGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    setExpenses((prev) => prev.filter((e) => e.groupId !== groupId));
    setSettlements((prev) => prev.filter((s) => s.groupId !== groupId));
    if (selectedGroupId === groupId) {
      const remainingGroups = groups.filter((g) => g.id !== groupId);
      setSelectedGroupId(
        remainingGroups.length > 0 ? remainingGroups[0].id : null,
      );
    }
  };

  const addExpense = (expense: Omit<Expense, "id" | "createdAt">) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [...prev, newExpense]);
  };

  const addSettlement = (settlement: Omit<Settlement, "id" | "createdAt">) => {
    const newSettlement: Settlement = {
      ...settlement,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setSettlements((prev) => [...prev, newSettlement]);
  };

  return (
    <div className="min-h-screen bg-surface font-sans">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <GroupSelector
            groups={groups}
            selectedGroupId={selectedGroupId}
            onSelectGroup={setSelectedGroupId}
            onAddGroup={() => setShowAddGroup(true)}
            onJoinGroup={() => setShowJoinGroup(true)}
            onDeleteGroup={deleteGroup}
            onViewDashboard={() => setActiveTab("dashboard")}
            activeView={activeTab}
          />
        </motion.div>

        {selectedGroup ? (
          <div className="space-y-6">
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddExpense(true)}
                className="bg-primary hover:bg-accent text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                Add Expense
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowManageMembers(true)}
                className="bg-secondary hover:bg-secondary/80 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                Manage Members
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSettleUp(true)}
                className="bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-accent/20 disabled:text-accent/80 disabled:border-accent/60 disabled:cursor-not-allowed disabled:opacity-100 border"
                disabled={simplifiedDebts.length === 0}
              >
                Settle Up
              </motion.button>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface/60 backdrop-blur-sm rounded-2xl p-1.5 flex justify-center"
            >
              <div className="flex justify-center mt-6 gap-4 flex-wrap">
                <button
                  onClick={() => setActiveTab("expenses")}
                  className={`min-w-[120px] px-6 py-3 rounded-xl font-medium transition-colors duration-200 border ${activeTab === 'expenses' ? 'bg-primary text-white shadow-lg' : 'text-primary border-primary/40 hover:bg-primary/10 focus:ring-2 focus:ring-primary/30'}`}
                >
                  Expenses
                </button>
                <button
                  onClick={() => setActiveTab("balances")}
                  className={`min-w-[120px] px-6 py-3 rounded-xl font-medium transition-colors duration-200 border ${activeTab === 'balances' ? 'bg-primary text-white shadow-lg' : 'text-primary border-primary/40 hover:bg-primary/10 focus:ring-2 focus:ring-primary/30'}`}
                >
                  Balances
                </button>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`min-w-[120px] px-6 py-3 rounded-xl font-medium transition-colors duration-200 border ${activeTab === 'dashboard' ? 'bg-primary text-white shadow-lg' : 'text-primary border-primary/40 hover:bg-primary/10 focus:ring-2 focus:ring-primary/30'}`}
                >
                  Dashboard
                </button>
              </div>
            </motion.div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "expenses" && (
                  <ExpenseList expenses={groupExpenses} group={selectedGroup} />
                )}
                {activeTab === "balances" && (
                  <BalancesView
                    balances={balances}
                    simplifiedDebts={simplifiedDebts}
                    group={selectedGroup}
                  />
                )}
                {activeTab === "dashboard" && analytics && (
                  <GroupDashboard group={selectedGroup} analytics={analytics} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center p-10 bg-surface/60 backdrop-blur-sm rounded-2xl border border-surface/20"
          >
            <Users className="w-16 h-16 mx-auto text-secondary mb-4" />
            <h2 className="text-2xl font-bold text-textdark mb-2">
              No Group Selected
            </h2>
            <p className="text-textdark/80 mb-6">
              Create a new group or join an existing one to start tracking
              expenses.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowAddGroup(true)}
                className="flex-1 bg-primary hover:bg-accent text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                Create Group
              </button>
              <button
                onClick={() => setShowJoinGroup(true)}
                className="flex-1 bg-secondary hover:bg-brandHeader text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                Join Group
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showAddExpense && selectedGroup && (
          <AddExpenseModal
            group={selectedGroup}
            onAddExpense={addExpense}
            onClose={() => setShowAddExpense(false)}
          />
        )}

        {showAddGroup && (
          <AddGroupModal
            onAddGroup={addGroup}
            onClose={() => setShowAddGroup(false)}
          />
        )}

        {showJoinGroup && (
          <JoinGroupModal
            onJoinGroup={joinGroup}
            onClose={() => setShowJoinGroup(false)}
          />
        )}

        {showManageMembers && selectedGroup && (
          <ManageMembersModal
            group={selectedGroup}
            onUpdateGroup={(updates) => updateGroup(selectedGroup.id, updates)}
            onClose={() => setShowManageMembers(false)}
          />
        )}

        {showSettleUp && selectedGroup && (
          <SettleUpModal
            group={selectedGroup}
            simplifiedDebts={simplifiedDebts}
            onAddSettlement={addSettlement}
            onClose={() => setShowSettleUp(false)}
          />
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
