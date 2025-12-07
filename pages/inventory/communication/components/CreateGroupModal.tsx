import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { Modal } from '../../../../components/Modal';
import { Button } from '../../../../components/Button';
import { User } from '../../../../types';


interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    users: User[];
    currentUser: User;
    onCreateGroup: (name: string, memberIds: string[]) => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, users, currentUser, onCreateGroup }) => {
    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const toggleMemberSelection = (userId: string) => {
        setSelectedMembers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleCreate = () => {
        if (!groupName || selectedMembers.length === 0) return;
        onCreateGroup(groupName, selectedMembers);
        setGroupName('');
        setSelectedMembers([]);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Group"
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={!groupName || selectedMembers.length === 0}>Create Group</Button>
                </>
            }
        >
            <div className="space-y-4 p-2">
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Group Name</label>
                    <input
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="e.g. Management Team"
                        className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Select Members</label>
                    <div className="max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-600 rounded-lg divide-y divide-slate-100 dark:divide-slate-700 custom-scrollbar">
                        {users.filter(u => u.id !== currentUser.id).map(user => (
                            <div
                                key={user.id}
                                onClick={() => toggleMemberSelection(user.id)}
                                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${selectedMembers.includes(user.id) ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedMembers.includes(user.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                                    {selectedMembers.includes(user.id) && <Users className="w-3 h-3 text-white" />}
                                </div>
                                <img src={user.avatarUrl} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-600" alt="" />
                                <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">{user.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};
