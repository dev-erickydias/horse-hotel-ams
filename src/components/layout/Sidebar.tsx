import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LangContext';
import {
  LayoutDashboard, Slack, ClipboardList, Users, Megaphone,
  Truck, CalendarCheck, LogOut, ChevronLeft, Menu, X,
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
  const { user, logout, isStaff } = useAuth();
  const { t } = useLang();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const staffLinks = [
    { to: '/app/dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { to: '/app/horses', label: t.nav.horses, icon: Slack },
    { to: '/app/tasks', label: t.nav.tasks, icon: ClipboardList },
    { to: '/app/bookings', label: t.nav.bookings, icon: CalendarCheck },
    { to: '/app/transport', label: t.nav.transport, icon: Truck },
    { to: '/app/announcements', label: t.nav.announcements, icon: Megaphone },
    { to: '/app/users', label: t.nav.users, icon: Users },
  ];

  const clientLinks = [
    { to: '/app/dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { to: '/app/bookings', label: t.nav.myRequests, icon: CalendarCheck },
    { to: '/app/announcements', label: t.nav.announcements, icon: Megaphone },
  ];

  const links = isStaff ? staffLinks : clientLinks;

  const nav = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-stone-800/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold text-sm shrink-0">AH</div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-white tracking-wide truncate">{t.common.appName}</h1>
              <p className="text-[11px] text-stone-400 truncate">{t.common.management}</p>
            </div>
          )}
        </div>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive ? 'bg-amber-600/20 text-amber-400' : 'text-stone-400 hover:text-white hover:bg-white/5'}`
            }
          >
            <link.icon size={18} className="shrink-0" />
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-stone-800/50">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-amber-600/20 flex items-center justify-center text-amber-400 text-xs font-bold shrink-0">
            {user?.name?.charAt(0)}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-stone-400 capitalize">{user?.role}</p>
            </div>
          )}
        </div>
        <button onClick={logout} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-stone-400 hover:text-white hover:bg-white/5 transition-all">
          <LogOut size={18} />
          {!collapsed && <span>{t.common.logout}</span>}
        </button>
      </div>
      <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex items-center justify-center py-3 border-t border-stone-800/50 text-stone-500 hover:text-white transition-colors">
        <ChevronLeft size={16} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );

  return (
    <>
      <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-stone-900 text-white shadow-lg">
        <Menu size={20} />
      </button>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full bg-stone-900">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-stone-400 hover:text-white"><X size={20} /></button>
            {nav}
          </div>
        </div>
      )}
      <aside className={`hidden lg:flex flex-col bg-stone-900 border-r border-stone-800 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-64'}`}>
        {nav}
      </aside>
    </>
  );
}
