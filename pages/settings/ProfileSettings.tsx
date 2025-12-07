import React from 'react';
import { User } from '../../types';
import { Button } from '../../components/Button';

interface ProfileSettingsProps {
    currentUser: User;
    handleDeleteAccount: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ currentUser, handleDeleteAccount }) => {
    return (
        <div className="space-y-6 max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">My Profile</h2>
            <div className="flex items-center gap-4 mb-6">
                <img src={currentUser.avatarUrl} alt="Profile" className="w-20 h-20 rounded-full border-4 border-slate-100 dark:border-slate-700" />
                <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{currentUser.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 uppercase">{currentUser.role}</p>
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                <input
                    className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 outline-none cursor-not-allowed"
                    value={currentUser.email}
                    readOnly
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                <input
                    className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    defaultValue={currentUser.phone}
                />
            </div>
            <div className="pt-4 flex flex-col gap-4">
                <Button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100">Save Changes</Button>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mb-2 uppercase tracking-wide">Danger Zone</h3>
                    <Button variant="danger" size="sm" onClick={handleDeleteAccount}>Delete Account</Button>
                </div>
            </div>
        </div>
    );
};
