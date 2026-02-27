import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../store';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, Inbox } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const store = useContext(StoreContext);
  if (!store) return null;

  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead } = store;
  const userNotifications = notifications.filter((n) => n.userId === currentUser.id);
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6" /> Notifications
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {userNotifications.length} total • {unreadCount} unread
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 px-3 py-2 rounded-md border border-emerald-200 dark:border-emerald-700"
          >
            <Check className="w-3 h-3" /> Mark all read
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {userNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
              <Inbox className="w-7 h-7 opacity-60" />
            </div>
            <p className="text-sm font-medium">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {userNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-5 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors ${
                  !notif.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="mt-1">
                  {!notif.read ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm shadow-blue-500/50 ring-2 ring-blue-100 dark:ring-blue-900"></div>
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className={`text-sm font-bold ${!notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${!notif.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-500'}`}>
                    {notif.message}
                  </p>
                  <div className="mt-2">
                    {notif.link ? (
                      <Link
                        to={notif.link}
                        onClick={() => markNotificationRead(notif.id)}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View details
                      </Link>
                    ) : (
                      <button
                        onClick={() => markNotificationRead(notif.id)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-700"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
