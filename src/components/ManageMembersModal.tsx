import React, { useState } from "react";
import { X, Users, Trash2, Edit2, Check, UserPlus } from "lucide-react";
import { Group, Member } from "../types";

interface ManageMembersModalProps {
  group: Group;
  onUpdateGroup: (updates: Partial<Group>) => void;
  onClose: () => void;
}

export const ManageMembersModal: React.FC<ManageMembersModalProps> = ({
  group,
  onUpdateGroup,
  onClose,
}) => {
  const [members, setMembers] = useState<Member[]>(group.members);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const handleSave = () => {
    onUpdateGroup({ members });
    onClose();
  };

  const startEdit = (member: Member) => {
    setEditingId(member.id);
    setEditName(member.name);
    setEditEmail(member.email || "");
  };

  const saveEdit = () => {
    if (!editName.trim()) return;

    setMembers(
      members.map((member) =>
        member.id === editingId
          ? {
              ...member,
              name: editName.trim(),
              email: editEmail.trim() || undefined,
            }
          : member,
      ),
    );
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  };

  const removeMember = (memberId: string) => {
    if (members.length > 1) {
      setMembers(members.filter((m) => m.id !== memberId));
    }
  };

  const addMember = () => {
    if (!newMemberName.trim()) return;

    const newMember: Member = {
      id: `member-${Date.now()}`,
      name: newMemberName.trim(),
      email: newMemberEmail.trim() || undefined,
      joinedAt: new Date().toISOString(),
    };

    setMembers([...members, newMember]);
    setNewMemberName("");
    setNewMemberEmail("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-textdark flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Manage Members</span>
          </h2>
          <button
            onClick={onClose}
            className="text-secondary hover:text-textdark/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Existing Members */}
          <div>
            <h3 className="text-sm font-medium text-textdark/90 mb-3">
              Current Members ({members.length})
            </h3>
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-surface/50 rounded-xl p-3 flex items-center space-x-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/80 to-secondary/60 rounded-full flex items-center justify-center text-white font-semibold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>

                  {editingId === member.id ? (
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-surface/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
                        placeholder="Name"
                      />
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-surface/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
                        placeholder="Email (optional)"
                      />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div className="font-medium text-textdark">
                        {member.name}
                      </div>
                      {member.email && (
                        <div className="text-sm text-textdark/70">
                          {member.email}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center space-x-1">
                    {editingId === member.id ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="text-green-600 hover:text-green-800 p-1"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-secondary hover:text-textdark/90 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(member)}
                          className="text-primary hover:text-accent p-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {members.length > 1 && (
                          <button
                            onClick={() => removeMember(member.id)}
                            className="text-accent hover:text-primary p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Member */}
          <div>
            <h3 className="text-sm font-medium text-textdark/90 mb-3 flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Add New Member</span>
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Member name"
                className="w-full px-4 py-2.5 rounded-xl border border-surface/60 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <input
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Email (optional)"
                className="w-full px-4 py-2.5 rounded-xl border border-surface/60 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <button
                onClick={addMember}
                disabled={!newMemberName.trim()}
                className="w-full px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 pt-6 border-t border-surface/40 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-2.5 border border-surface/60 text-textdark/90 rounded-xl hover:bg-surface/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-primary hover:bg-accent text-white rounded-xl transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
