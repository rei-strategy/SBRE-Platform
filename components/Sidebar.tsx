
import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Users, FileText, Briefcase, DollarSign,
  ChevronRight, ChevronLeft, PieChart, HardHat, PanelLeftOpen, Megaphone,
  Zap, Send, BarChart3, ChevronDown, Bot, Package, ShoppingCart, Box,
  MessageSquare, LogOut, Settings, Moon, Sun, ArrowLeft, Clock,
  Search, TrendingUp, Globe, Target, Rocket, Video, Bell
} from 'lucide-react';
import { UserRole, User } from '../types';
import { StoreContext } from '../store';

interface SidebarProps {
  user: User;
  onSwitchUser: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

type SidebarView = 'nav' | 'settings';

export const Sidebar: React.FC<SidebarProps> = ({ user, onSwitchUser, isCollapsed, toggleCollapse }) => {
  const store = useContext(StoreContext);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.OFFICE || user.role === UserRole.CLIENT;
  const roleSwitchLabel = user.role === UserRole.ADMIN
    ? 'Switch Role (Admin → Technician)'
    : user.role === UserRole.TECHNICIAN
      ? 'Switch Role (Technician → Admin)'
      : `Switch Role (Current: ${user.role})`;

  const [currentView, setCurrentView] = useState<SidebarView>('nav');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'marketing': false,
    'inventory': false
  });
  const notifications = store?.notifications.filter(n => n.userId === user.id) || [];
  const unreadCount = notifications.filter(n => !n.read).length;
  const unreadMessageCount = store?.messages.filter(m => m.senderId !== user.id && !m.readBy.includes(user.id)).length || 0;

  const toggleGroup = (key: string) => {
    if (isCollapsed) toggleCollapse();
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProfileClick = () => {
    if (isCollapsed) toggleCollapse();
    navigate('/settings');
  };

  const navSections = [
    {
      label: 'General',
      items: [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard, show: true },
        { path: '/notifications', label: 'Notifications', icon: Bell, show: true, badge: unreadCount },
        { path: '/schedule', label: 'Schedule', icon: Calendar, show: true },
        { path: '/communication', label: 'Inbox', icon: MessageSquare, show: true, badge: unreadMessageCount },
        { path: '/reports', label: 'Reports', icon: PieChart, show: isAdmin },
        { path: '/admin/settings', label: 'Admin Panel', icon: Settings, show: isAdmin },
      ]
    },
    {
      label: 'Operations',
      items: [
        { path: '/jobs', label: 'Jobs', icon: Briefcase, show: true },
        { path: '/timesheets', label: 'Timesheets', icon: Clock, show: true },
        { path: '/contacts', label: 'Contacts', icon: Users, show: isAdmin },
        { path: '/team', label: 'Team', icon: HardHat, show: isAdmin },
        {
          id: 'inventory',
          label: 'Inventory',
          icon: Package,
          show: isAdmin,
          isGroup: true,
          subItems: [
            { path: '/inventory', label: 'Dashboard', icon: BarChart3 },
            { path: '/inventory/stock', label: 'Stock Levels', icon: Box },
            { path: '/inventory/products', label: 'Products', icon: Package },
            { path: '/inventory/orders', label: 'Purchasing', icon: ShoppingCart },
          ]
        },
        { path: '/marketing/automations', label: 'Automations', icon: Zap, show: isAdmin },
      ]
    },
    {
      label: 'Finance',
      items: [
        { path: '/quotes', label: 'Quotes', icon: FileText, show: isAdmin },
        { path: '/invoices', label: 'Invoices', icon: DollarSign, show: isAdmin },
      ]
    },
    {
      label: 'Insights',
      items: [
        { path: '/ai-receptionist', label: 'AI Agent', icon: Bot, show: false },
        {
          id: 'research',
          label: 'Research',
          icon: Search,
          show: false,
          isGroup: true,
          subItems: [
            { path: '/research/competitor-insights', label: 'Competitor Insights', icon: Users },
            { path: '/research/market-trends', label: 'Market Trends', icon: TrendingUp },
            { path: '/research/keyword-discovery', label: 'Keyword Discovery', icon: Search },
            { path: '/research/business-audit', label: 'Business Audit', icon: FileText },
            { path: '/research/seo-audit', label: 'SEO Audit', icon: Globe },
            { path: '/research/opportunity-finder', label: 'Opportunities', icon: Target },
            { path: '/research/growth-plan-generator', label: 'Growth Plan', icon: Rocket },
          ]
        }
      ]
    }
  ];

  return (
    <aside className={`h-screen flex flex-col fixed left-0 top-0 z-50 shadow-2xl font-sans transition-[width] duration-300 ease-in-out border-r bg-white border-slate-200 text-slate-600 dark:bg-[#0B1120] dark:border-slate-800 dark:text-slate-300 ${isCollapsed ? 'w-[80px]' : 'w-52'}`}>
      <div className="h-20 flex items-center justify-center shrink-0 relative px-4">
        {currentView === 'settings' ? (
          <div className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className={`transition-all duration-300 font-bold text-lg flex items-center gap-2 text-slate-900 dark:text-white ${isCollapsed ? 'hidden' : 'block'}`}><Settings className="w-5 h-5 text-teal-500" /> Settings</div>
            <button onClick={() => { setCurrentView('nav'); }} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
          </div>
        ) : (
          <>
            <div className={`transition-all duration-300 flex items-center justify-center ${isCollapsed ? 'w-16 opacity-100' : 'w-44 opacity-100'}`}>
              {isCollapsed ? (
                <>
                  <img src="/branding/logo/sbre-mark.svg" alt="SBRE platform logo" className="h-10 w-10 object-contain dark:hidden" />
                  <img src="/branding/logo/sbre-mark-light.svg" alt="SBRE platform logo" className="h-10 w-10 object-contain hidden dark:block" />
                </>
              ) : (
                <>
                  <img src="/branding/logo/sbre-logo.svg" alt="SBRE platform logo" className="max-w-[11rem] max-h-14 object-contain dark:hidden" />
                  <img src="/branding/logo/sbre-logo-light.svg" alt="SBRE platform logo" className="max-w-[11rem] max-h-14 object-contain hidden dark:block" />
                </>
              )}
            </div>
            <button onClick={toggleCollapse} className="absolute -right-3 top-8 p-1 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 z-50 border bg-white text-slate-500 border-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:text-white">{isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}</button>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 custom-scrollbar">
        {currentView === 'nav' && navSections.map((section, idx) => {
          const hasVisibleItems = section.items.some((item: any) => item.show);
          if (!hasVisibleItems) return null;
          return (
            <div key={section.label} className="mb-6">
              <div className={`px-6 mb-2 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{section.label}</p>
              </div>
              <div className="px-3 space-y-0.5">
                {section.items.filter((item: any) => item.show).map((item: any) => {
                  if (item.isGroup) {
                    const isOpen = expandedGroups[item.id];
                    const isChildActive = item.subItems.some((sub: any) => location.pathname === sub.path);
                    return (
                      <div key={item.id} className="mb-1">
                        <button onClick={() => toggleGroup(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${isChildActive ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}>
                          {isChildActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full" />}
                          <item.icon className={`w-5 h-5 shrink-0 transition-colors ${isChildActive ? 'text-teal-500 dark:text-teal-400' : 'group-hover:text-slate-700 dark:group-hover:text-slate-200'}`} />
                          <div className={`flex items-center justify-between flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                            <span className="text-sm font-medium">{item.label}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen && !isCollapsed ? 'max-h-[600px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                          <div className="ml-9 border-l border-slate-200 dark:border-slate-700/50 space-y-1 pl-2">
                            {item.subItems.map((sub: any) => (
                              <Link key={sub.path} to={sub.path} className={`block px-3 py-2 rounded-md text-xs font-medium transition-colors ${location.pathname === sub.path ? 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-500/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800/30'}`}>{sub.label}</Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                  return (
                    <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${isActive ? 'bg-gradient-to-r from-teal-50 to-transparent dark:from-teal-500/10 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/50'}`}>
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full shadow-[0_0_10px_rgba(20,184,166,0.5)]" />}
                      <div className="relative">
                        <item.icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-teal-500 dark:text-teal-400' : 'group-hover:text-slate-700 dark:group-hover:text-slate-200'}`} strokeWidth={isActive ? 2.5 : 2} />
                        {isCollapsed && item.badge > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-[#0B1120]"></span>}
                      </div>
                      <div className={`flex-1 flex items-center justify-between overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                        <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                        {item.badge > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center ml-2">{item.badge > 99 ? '99+' : item.badge}</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
        {currentView === 'settings' && (
          <div className="px-3 space-y-2">
            <button onClick={onSwitchUser} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"><PanelLeftOpen className="w-5 h-5" /><span className={`text-sm font-medium ${isCollapsed ? 'hidden' : 'block'}`}>{roleSwitchLabel}</span></button>
            <button onClick={store?.logout} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors mt-4"><LogOut className="w-5 h-5" /><span className={`text-sm font-medium ${isCollapsed ? 'hidden' : 'block'}`}>Logout</span></button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800/50 bg-white dark:bg-[#0B1120]">
        <button onClick={handleProfileClick} className={`w-full relative bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 outline-none ${isCollapsed ? 'p-2' : 'p-3'} ${currentView === 'settings' ? 'ring-2 ring-teal-500/50 border-teal-500/50' : ''}`}>
          <div className="flex items-center gap-3 text-left">
            <div className="relative shrink-0">
              <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-600 group-hover:border-teal-500 transition-colors" />
              {unreadCount > 0 && currentView !== 'settings' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>}
            </div>
            <div className={`flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              <p className="text-sm font-bold text-slate-700 dark:text-white truncate">{user.name.split(' ')[0]}</p>
              <p className="text-[10px] font-medium text-teal-600 dark:text-teal-500 uppercase tracking-wide truncate">Settings</p>
            </div>
            {!isCollapsed && <Settings className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform ${currentView === 'settings' ? 'rotate-90 text-teal-500' : ''}`} />}
          </div>
        </button>
      </div>
    </aside>
  );
};
