import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Trash2,
  ChevronDown,
  UserPlus,
  Copy,
  BarChart3,
} from "lucide-react";
import { Group } from "../types";

interface GroupSelectorProps {
  groups: Group[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string) => void;
  onAddGroup: () => void;
  onJoinGroup: () => void;
  onDeleteGroup: (groupId: string) => void;
  onViewDashboard: (groupId: string) => void;
  activeView: "expenses" | "balances" | "dashboard";
}

export const GroupSelector: React.FC<GroupSelectorProps> = ({
  groups,
  selectedGroupId,
  onSelectGroup,
  onAddGroup,
  onJoinGroup,
  onDeleteGroup,
  onViewDashboard,
  activeView,
}) => {
  const copyGroupCode = (groupCode: string) => {
    navigator.clipboard.writeText(groupCode);
    // You could add a toast notification here
  };

  return (
    <div className="bg-surface/60 backdrop-blur-sm rounded-2xl p-6 border border-surface/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-textdark flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Groups</span>
        </h2>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onJoinGroup}
            className="bg-secondary hover:bg-secondary/90 text-white p-2 rounded-lg transition-all duration-200"
            title="Join Group"
          >
            <UserPlus className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddGroup}
            className="bg-primary hover:bg-accent text-white p-2 rounded-lg transition-all duration-200"
            title="Create Group"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
          >
            <Users className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <h3 className="font-medium text-textdark/90 mb-2">No groups yet</h3>
            <p className="text-sm text-secondary mb-4">
              Create your first group or join an existing one
            </p>
            <div className="flex space-x-2 justify-center">
              <button
                onClick={onAddGroup}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Create Group
              </button>
              <button
                onClick={onJoinGroup}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Join Group
              </button>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="space-y-2">
          {groups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedGroupId === group.id
                  ? "bg-secondary/20 border-2 border-secondary/50"
                  : "bg-surface/50 hover:bg-surface/70 border border-surface/40"
              }`}
              onClick={() => onSelectGroup(group.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-textdark">{group.name}</h3>
                    <div className="flex items-center space-x-1 bg-surface/70 px-2 py-1 rounded text-xs font-mono">
                      <span className="text-secondary">{group.groupCode}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyGroupCode(group.groupCode);
                        }}
                        className="text-secondary/80 hover:text-secondary transition-colors"
                        title="Copy group code"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-secondary">
                    {group.members.length} member
                    {group.members.length !== 1 ? "s" : ""}
                    {group.description && ` • ${group.description}`}
                    {group.budget &&
                      ` • Budget: ${group.currency} ${group.budget}`}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedGroupId === group.id && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDashboard(group.id);
                        }}
                        className={`p-1.5 rounded transition-colors ${
                          activeView === "dashboard"
                            ? "bg-primary text-white"
                            : "text-primary hover:bg-primary/10"
                        }`}
                        title="View Dashboard"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </motion.button>
                      <ChevronDown className="w-4 h-4 text-primary" />
                    </>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteGroup(group.id);
                    }}
                    className="text-accent hover:text-primary p-1 rounded transition-colors"
                    title="Delete Group"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
