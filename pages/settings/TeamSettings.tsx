import React, { useState } from 'react';
import { User, PayrollType } from '../../types';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Users, Copy, Mail, MessageCircle } from 'lucide-react';

interface TeamSettingsProps {
    users: User[];
    updateUser: (user: User) => void;
    settings: any;
}

export const TeamSettings: React.FC<TeamSettingsProps> = ({ users, updateUser, settings }) => {
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const handleUserUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            updateUser(editingUser);
            setEditingUser(null);
        }
    };

    const copyInviteCode = () => {
        if (settings.companyCode) {
            navigator.clipboard.writeText(settings.companyCode);
            alert("Invite code copied to clipboard!");
        }
    };

    const copyInviteInstructions = () => {
        const text = `Join my team on Gitta Job!\n\n1. Go to the app.\n2. Select "Join Existing Team".\n3. Enter this code: ${settings.companyCode}`;
        navigator.clipboard.writeText(text);
        alert("Invite instructions copied to clipboard!");
    };

    return (
        <div>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Team & Payroll</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage access, timesheets, and pay structures.</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setIsInviteModalOpen(true)}>Invite New User</Button>
            </div>

            <div className="space-y-4">
                {users.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <img src={user.avatarUrl} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 object-cover" />
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">{user.role}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Payroll</p>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {user.payrollType === 'HOURLY' ? `$${user.payRate}/hr` : user.payrollType === 'COMMISSION' ? `${user.payRate}% Comm.` : `$${user.payRate}/day`}
                                </p>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Timesheets</p>
                                <p className={`text-sm font-bold ${user.enableTimesheets ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                    {user.enableTimesheets ? 'Enabled' : 'Disabled'}
                                </p>
                            </div>
                            <Button size="sm" variant="secondary" onClick={() => setEditingUser(user)}>Edit</Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit User Modal */}
            <Modal
                isOpen={!!editingUser}
                onClose={() => setEditingUser(null)}
                title={`Edit Settings: ${editingUser?.name}`}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setEditingUser(null)}>Cancel</Button>
                        <Button onClick={handleUserUpdate}>Save Changes</Button>
                    </>
                }
            >
                {editingUser && (
                    <div className="space-y-4 p-2">
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <div>
                                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-1">Enable Timesheets</label>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Allow this user to track time.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingUser({ ...editingUser, enableTimesheets: !editingUser.enableTimesheets })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${editingUser.enableTimesheets ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-600'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editingUser.enableTimesheets ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Payroll Type</label>
                            <select
                                className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={editingUser.payrollType}
                                onChange={(e) => setEditingUser({ ...editingUser, payrollType: e.target.value as PayrollType })}
                            >
                                <option value="HOURLY">Hourly Rate ($/hr)</option>
                                <option value="COMMISSION">Commission (% of Job)</option>
                                <option value="DAILY_RATE">Daily Rate ($/day)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Rate Value</label>
                            <input
                                type="number"
                                className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={editingUser.payRate}
                                onChange={(e) => setEditingUser({ ...editingUser, payRate: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>
                )}
            </Modal>

            {/* Invite User Modal */}
            <Modal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                title="Invite Team Member"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsInviteModalOpen(false)}>Close</Button>
                        <Button onClick={copyInviteInstructions}>Copy Instructions</Button>
                    </>
                }
            >
                <div className="p-4 space-y-6 text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Invite your team</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Share this code with your team members. They will need to enter it when they select "Join Existing Team" during signup.
                        </p>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 relative group">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Company Code</p>
                        <div className="flex items-center justify-center gap-3">
                            <span className="text-4xl font-mono font-bold text-slate-900 dark:text-white tracking-widest">
                                {settings.companyCode || 'LOADING'}
                            </span>
                        </div>
                        <div className="absolute top-2 right-2">
                            <button onClick={copyInviteCode} className="p-2 text-slate-400 hover:text-emerald-500 transition-colors" title="Copy Code">
                                <Copy className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-center">
                        <Button variant="secondary" onClick={() => window.open(`mailto:?subject=Join ${settings.companyName} on Gitta Job&body=Hey,%0D%0A%0D%0APlease join our workspace on Gitta Job.%0D%0A%0D%0A1. Create an account.%0D%0A2. Select "Join Existing Team".%0D%0A3. Enter code: ${settings.companyCode}`)}>
                            <Mail className="w-4 h-4 mr-2" /> Send Email
                        </Button>
                        <Button variant="secondary" onClick={copyInviteInstructions}>
                            <MessageCircle className="w-4 h-4 mr-2" /> Copy Message
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
