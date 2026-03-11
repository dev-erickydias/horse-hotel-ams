import { useState, useRef, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { api } from '../../services/data';
import { useLang } from '../../contexts/LangContext';
import LangSwitcher from '../ui/LangSwitcher';
import { format } from 'date-fns';
import type { Notification } from '../../types';

const typeIcons: Record<string, string> = {
  arrival: '🐴', departure: '📦', request: '📋',
  task: '✅', transport: '🚛', announcement: '📢',
};

export default function Header({ title }: { title: string }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setNotifications(api.getNotifications()); }, [open]);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;
  const markAllRead = () => { api.markAllRead(); setNotifications(api.getNotifications()); };

  return (
    <header className="h-16 border-b border-stone-200 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30">
      <div className="lg:ml-0 ml-12">
        <h1 className="text-xl font-bold text-stone-900">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <LangSwitcher />
        <div className="relative" ref={ref}>
          <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-stone-100 transition-colors text-stone-500">
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">{unread}</span>
            )}
          </button>
          {open && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden animate-scale-in z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
                <h3 className="text-sm font-semibold text-stone-900">{t.notifications.title}</h3>
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1">
                    <Check size={12} /> {t.notifications.markAllRead}
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-stone-400 text-center py-8">{t.notifications.noNotifications}</p>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <div key={n.id} className={`px-4 py-3 border-b border-stone-50 hover:bg-stone-50 transition-colors ${!n.read ? 'bg-amber-50/40' : ''}`}
                      onClick={() => { api.markNotificationRead(n.id); setNotifications(api.getNotifications()); }}>
                      <div className="flex items-start gap-3">
                        <span className="text-lg">{typeIcons[n.type] || '🔔'}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!n.read ? 'font-semibold text-stone-900' : 'text-stone-700'}`}>{n.title}</p>
                          <p className="text-xs text-stone-500 mt-0.5 truncate">{n.message}</p>
                          <p className="text-[11px] text-stone-400 mt-1">{format(new Date(n.createdAt), 'MMM d, HH:mm')}</p>
                        </div>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
