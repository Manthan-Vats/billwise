import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Users, Plus, Trash2 } from "lucide-react";
import { Member } from "../types";
import { generateGroupCode } from "../utils/analytics";

interface AddGroupModalProps {
  onAddGroup: (group: any) => void;
  onClose: () => void;
}

export const AddGroupModal: React.FC<AddGroupModalProps> = ({
  onAddGroup,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [members, setMembers] = useState<Omit<Member, "id" | "joinedAt">[]>([
    { name: "", email: "" },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || members.filter((m) => m.name.trim()).length === 0)
      return;

    const validMembers: Member[] = members
      .filter((m) => m.name.trim())
      .map((member, index) => ({
        ...member,
        id: `member-${Date.now()}-${index}`,
        name: member.name.trim(),
        joinedAt: new Date().toISOString(),
      }));

    onAddGroup({
      name: name.trim(),
      description: description.trim() || undefined,
      budget: budget ? parseFloat(budget) : undefined,
      members: validMembers,
      groupCode: generateGroupCode(),
    });

    onClose();
  };

  const addMember = () => {
    setMembers([...members, { name: "", email: "" }]);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (
    index: number,
    field: keyof Omit<Member, "id" | "joinedAt">,
    value: string,
  ) => {
    setMembers(
      members.map((member, i) =>
        i === index ? { ...member, [field]: value } : member,
      ),
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-surface rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-surface/60"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-textdark flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Create New Group</span>
          </h2>
          <button
            onClick={onClose}
            className="text-secondary hover:text-textdark/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-textdark/90 mb-2">
              Group Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Weekend Trip, Roommates, Office Lunch"
              className="w-full px-4 py-2.5 rounded-xl border border-surface/60 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-textdark/90 mb-2">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the group"
              className="w-full px-4 py-2.5 rounded-xl border border-surface/60 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          <div>
            <div>
              <label className="block text-sm font-medium text-textdark/90 mb-2">
                Budget (optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface/60 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-textdark/90">
                Members *
              </label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={addMember}
                className="bg-primary hover:bg-accent text-white p-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="space-y-3">
              {members.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) =>
                        updateMember(index, "name", e.target.value)
                      }
                      placeholder="Member name"
                      className="w-full px-3 py-2 rounded-lg border border-surface/60 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) =>
                        updateMember(index, "email", e.target.value)
                      }
                      placeholder="Email (optional)"
                      className="w-full px-3 py-2 rounded-lg border border-surface/60 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                  </div>
                  {members.length > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => removeMember(index)}
                      className="text-primary hover:text-accent p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-surface/40">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 border border-primary/40 text-primary rounded-xl hover:bg-primary/10 focus:ring-2 focus:ring-primary/30 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex-1 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-accent transition-colors disabled:opacity-50"
              disabled={
                !name.trim() ||
                members.filter((m) => m.name.trim()).length === 0
              }
            >
              Create Group
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
