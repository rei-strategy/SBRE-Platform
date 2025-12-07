import React from 'react';
import { StoreContext } from '../store';
import { Play, Pause, Clock, Mail, Plus, Zap, Calendar, MessageSquare, Tag, CheckSquare, Briefcase, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AutomationTriggerType } from '../types';

import { AutomationRunsHistory } from '../components/AutomationRunsHistory';

export const MarketingAutomations: React.FC = () => {
  const store = React.useContext(StoreContext);
  const { marketingAutomations, updateAutomation } = store;
  const navigate = useNavigate();
  const [viewingRunsId, setViewingRunsId] = React.useState<string | null>(null);

  const toggleAutomation = async (e: React.MouseEvent, automation: any) => {
    e.stopPropagation();
    await updateAutomation({ ...automation, isActive: !automation.isActive });
  };

  const getTriggerIcon = (type: AutomationTriggerType) => {
    switch (type) {
      case 'NEW_CLIENT': return <Zap className="w-6 h-6 text-white" />;
      case 'NEW_JOB': return <Briefcase className="w-6 h-6 text-white" />;
      case 'JOB_COMPLETED': return <CheckSquare className="w-6 h-6 text-white" />;
      case 'NEW_QUOTE': return <MessageSquare className="w-6 h-6 text-white" />;
      case 'CLIENT_BIRTHDAY': return <Calendar className="w-6 h-6 text-white" />;
      default: return <Zap className="w-6 h-6 text-white" />;
    }
  };

  const getGradient = (type: AutomationTriggerType) => {
    switch (type) {
      case 'NEW_CLIENT': return 'from-blue-500 to-indigo-600';
      case 'NEW_JOB': return 'from-emerald-500 to-teal-600';
      case 'JOB_COMPLETED': return 'from-orange-500 to-red-600';
      case 'NEW_QUOTE': return 'from-purple-500 to-pink-600';
      case 'CLIENT_BIRTHDAY': return 'from-pink-500 to-rose-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const restoreDefaults = async () => {
    if (!confirm('This will restore the default automations. Continue?')) return;

    // Import dynamically to avoid circular deps if any, or just use the imported one
    const { defaultAutomations } = await import('../data/defaultAutomations');

    for (const automation of defaultAutomations) {
      // Add companyId from current user context if needed, but addAutomation handles it usually or we pass it
      // store.addAutomation expects Omit<MarketingAutomation, 'id' | 'createdAt' | 'stats'>
      // We need to ensure we pass the right object
      await store.addAutomation({
        ...automation,
        companyId: store.currentUser.companyId
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Automations</h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 hidden md:block">Manage your nurture workflows</p>
          </div>
          <button
            onClick={() => navigate('/marketing/automations/new')}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Create New
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {marketingAutomations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <Zap className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Automations Yet</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
              Get started by creating a new automation or restore the default templates to see examples of what's possible.
            </p>
            <div className="flex gap-4">
              <button
                onClick={restoreDefaults}
                className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Restore Defaults
              </button>
              <button
                onClick={() => navigate('/marketing/automations/new')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
              >
                Create Custom
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {marketingAutomations.map(automation => (
              <div
                key={automation.id}
                onClick={() => navigate(`/marketing/automations/${automation.id}`)}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 cursor-pointer overflow-hidden"
              >
                {/* Top Section */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGradient(automation.triggerType)} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {getTriggerIcon(automation.triggerType)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this automation?')) {
                          store.deleteAutomation(automation.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete Automation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => toggleAutomation(e, automation)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${automation.isActive ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${automation.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 line-clamp-1">{automation.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 h-10">{automation.description || 'No description provided.'}</p>
                </div>

                {/* Stats/Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                      <Mail className="w-3 h-3" />
                      <span>{automation.steps.filter(s => s.type === 'SEND_EMAIL').length}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                      <Clock className="w-3 h-3" />
                      <span>{automation.steps.filter(s => s.type === 'DELAY').length}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewingRunsId(automation.id);
                    }}
                    className="text-right hover:bg-slate-50 dark:hover:bg-slate-700/50 px-2 py-1 rounded-md transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{automation.stats?.runs || 0}</span>
                    <span className="text-[10px] text-slate-500 uppercase ml-1">Runs</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => navigate('/marketing/automations/new')}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Runs History Modal */}
      {viewingRunsId && (
        <AutomationRunsHistory
          automationId={viewingRunsId}
          onClose={() => setViewingRunsId(null)}
        />
      )}
    </div>
  );
};
