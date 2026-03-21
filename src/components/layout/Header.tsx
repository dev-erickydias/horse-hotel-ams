import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { api } from '../../services/data';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LangContext';
import LangSwitcher from '../ui/LangSwitcher';
import { format } from 'date-fns';
import type { Notification } from '../../types';

const typeIcons: Record<string, string> = {
  arrival: '🐴', departure: '📦', request: '📋',
  task: '✅', transport: '🚛', announcement: '📢', registration: '👤',
};

export default function Header({ title }: { title: string }) {
  const { t } = useLang();
  const { user, isStaff } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tick, setTick] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const loadNotifications = () => {
    if (user) setNotifications(api.getNotificationsForUser(user.id, user.role));
  };
  useEffect(() => { loadNotifications(); }, [open, user, tick]);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;
  const markAllRead = () => { api.markAllRead(); loadNotifications(); };

  const getRequestIfPending = (n: Notification) => {
    if (n.type !== 'request' || !n.sourceId || !isStaff) return null;
    const requests = api.getRequests();
    const req = requests.find((r) => r.id === n.sourceId);
    return req && req.status === 'pending' ? req : null;
  };

  const handleApprove = (n: Notification, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!n.sourceId) return;
    const req = api.getRequests().find((r) => r.id === n.sourceId);
    if (!req) return;
    api.updateRequest(n.sourceId, { status: 'approved' });
    api.addNotification({
      type: 'request',
      title: t.common.approved,
      message: `${req.title}: ${t.common.approved}`,
      read: false,
      createdAt: new Date().toISOString(),
      link: '/app/bookings',
      targetUserId: req.clientId,
    });
    api.markNotificationRead(n.id);
    setTick((x) => x + 1);
  };

  const handleReject = (n: Notification, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!n.sourceId) return;
    const req = api.getRequests().find((r) => r.id === n.sourceId);
    if (!req) return;
    api.updateRequest(n.sourceId, { status: 'rejected' });
    api.addNotification({
      type: 'request',
      title: t.common.rejected,
      message: `${req.title}: ${t.common.rejected}`,
      read: false,
      createdAt: new Date().toISOString(),
      link: '/app/bookings',
      targetUserId: req.clientId,
    });
    api.markNotificationRead(n.id);
    setTick((x) => x + 1);
  };

  const handleNotificationClick = (n: Notification) => {
    api.markNotificationRead(n.id);
    loadNotifications();
    if (n.link) {
      setOpen(false);
      navigate(n.link);
    }
  };

  return (
    <header className="h-16 border-b border-cream-300/60 bg-white/70 backdrop-blur-md flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30">
      <div className="lg:ml-0 ml-12">
        <h1 className="text-xl font-bold text-stone-800">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <LangSwitcher />
        <div className="relative" ref={ref}>
          <button onClick={() => setOpen(!open)} className="relative p-2 rounded-xl hover:bg-cream-200 transition-colors text-stone-500">
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold font-body rounded-full flex items-center justify-center animate-pulse">{unread}</span>
            )}
          </button>
          {open && (
            <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-cream-300/80 overflow-hidden animate-scale-in z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-cream-200">
                <h3 className="text-sm font-semibold text-stone-800 font-body">{t.notifications.title}</h3>
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-xs font-body text-forest-600 hover:text-forest-700 flex items-center gap-1">
                    <Check size={12} /> {t.notifications.markAllRead}
                  </button>
                )}
              </div>
              <div className="max-h-[28rem] overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-stone-400 text-center py-8 font-body">{t.notifications.noNotifications}</p>
                ) : (
                  notifications.slice(0, 15).map((n) => {
                    const pendingReq = getRequestIfPending(n);
                    return (
                      <div key={n.id}
                        className={`px-4 py-3 border-b border-cream-100 hover:bg-cream-50 transition-colors cursor-pointer ${!n.read ? 'bg-gold-50/40' : ''}`}
                        onClick={() => handleNotificationClick(n)}>
                        <div className="flex items-start gap-3">
                          <span className="text-lg">{typeIcons[n.type] || '🔔'}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-body flex-1 ${!n.read ? 'font-semibold text-stone-800' : 'text-stone-600'}`}>{n.title}</p>
                              {n.link && <ExternalLink size={12} className="text-stone-300 shrink-0" />}
                            </div>
                            <p className="text-xs text-stone-500 mt-0.5 truncate font-body">{n.message}</p>
                            <p className="text-[11px] text-stone-400 mt-1 font-body">{format(new Date(n.createdAt), 'MMM d, HH:mm')}</p>

                            {pendingReq && (
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={(e) => handleApprove(n, e)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium font-body hover:bg-emerald-100 transition-colors border border-emerald-200"
                                >
                                  <CheckCircle size={12} /> {t.common.approve}
                                </button>
                                <button
                                  onClick={(e) => handleReject(n, e)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-medium font-body hover:bg-red-100 transition-colors border border-red-200"
                                >
                                  <XCircle size={12} /> {t.common.reject}
                                </button>
                                <span className="text-[10px] text-stone-400 ml-1 font-body">
                                  {pendingReq.facilityType}{pendingReq.requestedDate ? ` · ${pendingReq.requestedDate}` : ''}
                                  {pendingReq.requestedTime ? ` · ${pendingReq.requestedTime}` : ''}
                                </span>
                              </div>
                            )}
                          </div>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-gold-400 mt-1.5 shrink-0" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
