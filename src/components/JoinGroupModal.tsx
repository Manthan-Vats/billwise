import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Users, Hash, UserPlus } from "lucide-react";

interface JoinGroupModalProps {
  onJoinGroup: (groupCode: string) => void;
  onClose: () => void;
}

export const JoinGroupModal: React.FC<JoinGroupModalProps> = ({
  onJoinGroup,
  onClose,
}) => {
  const [groupCode, setGroupCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupCode.trim()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onJoinGroup(groupCode.trim().toUpperCase());
    setIsLoading(false);
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
        className="bg-surface rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-textdark flex items-center space-x-2">
            <UserPlus className="w-5 h-5" />
            <span>Join Group</span>
          </h2>
          <button
            onClick={onClose}
            className="text-secondary hover:text-textdark/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-gradient-to-r from-surface/80 to-secondary/10 rounded-xl p-4 border border-primary/30">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-medium text-primary">How to join a group</h3>
            </div>
            <p className="text-sm text-primary/80">
              Ask a group member for the 6-digit group code and enter it below
              to join their expense group.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-textdark/90 mb-2">
              Group Code
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" />
              <input
                type="text"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface/60 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all text-center text-lg font-mono tracking-wider"
                required
              />
            </div>
            <p className="text-xs text-secondary mt-2">
              Enter the 6-character group code (letters and numbers)
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-surface/60 text-textdark/90 rounded-xl hover:bg-surface/80 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!groupCode.trim() || isLoading}
              className="flex-1 px-6 py-3 bg-primary hover:bg-accent text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 focus:ring-2 focus:ring-accent"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-surface/30 border-t-surface rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Join Group</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
