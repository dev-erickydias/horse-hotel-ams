import { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LangContext';
import { api } from '../../services/data';
import Header from '../../components/layout/Header';
import Card, { CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import { Slack, ArrowDownCircle, ArrowUpCircle, AlertTriangle, ClipboardList, Truck, CalendarCheck, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, isStaff } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const horses = useMemo(() => isStaff ? api.getHorses() : api.getHorsesByOwner(user!.id), [user, isStaff]);
  const tasks = useMemo(() => api.getTasks(), []);
  const requests = useMemo(() => api.getRequests(), []);
  const transports = useMemo(() => api.getTransports(), []);

  const checkedIn = horses.filter((h) => h.status === 'checked-in');
  const arrivingToday = horses.filter((h) => isToday(parseISO(h.checkIn)) && h.status === 'upcoming');
  const arrivingSoon = horses.filter((h) => { const d = parseISO(h.checkIn); return (isTomorrow(d) || (!isPast(d) && !isToday(d))) && h.status === 'upcoming'; });
  const departingToday = horses.filter((h) => isToday(parseISO(h.checkOut)) && h.status === 'checked-in');
  const departingSoon = horses.filter((h) => isTomorrow(parseISO(h.checkOut)) && h.status === 'checked-in');
  const inQuarantine = horses.filter((h) => h.quarantine && h.status === 'checked-in');
  const pendingTasks = tasks.filter((tt) => !tt.completed);
  const urgentTasks = pendingTasks.filter((tt) => tt.priority === 'urgent' || tt.priority === 'high');
  const pendingRequests = requests.filter((r) => r.status === 'pending');

  const stats = isStaff
    ? [
        { label: t.dashboard.horsesInHotel, value: checkedIn.length, icon: Slack, color: 'bg-amber-50 text-amber-600', onClick: () => navigate('/app/horses') },
        { label: t.dashboard.pendingTasks, value: pendingTasks.length, icon: ClipboardList, color: 'bg-blue-50 text-blue-600', onClick: () => navigate('/app/tasks') },
        { label: t.dashboard.pendingRequests, value: pendingRequests.length, icon: CalendarCheck, color: 'bg-purple-50 text-purple-600', onClick: () => navigate('/app/bookings') },
        { label: t.dashboard.scheduledTransports, value: transports.filter((tt) => tt.status === 'scheduled').length, icon: Truck, color: 'bg-emerald-50 text-emerald-600', onClick: () => navigate('/app/transport') },
      ]
    : [
        { label: t.dashboard.myHorses, value: horses.length, icon: Slack, color: 'bg-amber-50 text-amber-600', onClick: () => navigate('/app/bookings') },
        { label: t.dashboard.myRequests, value: requests.filter((r) => r.clientId === user!.id).length, icon: CalendarCheck, color: 'bg-purple-50 text-purple-600', onClick: () => navigate('/app/bookings') },
      ];

  return (
    <div>
      <Header title={`${t.common.welcome}, ${user?.name?.split(' ')[0]}`} />
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label} hover onClick={s.onClick}>
              <CardBody className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center shrink-0`}><s.icon size={22} /></div>
                <div><p className="text-2xl font-bold text-stone-900">{s.value}</p><p className="text-xs text-stone-500">{s.label}</p></div>
              </CardBody>
            </Card>
          ))}
        </div>

        {isStaff && (arrivingToday.length > 0 || departingToday.length > 0 || inQuarantine.length > 0) && (
          <div className="grid gap-3 md:grid-cols-3">
            {arrivingToday.length > 0 && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <ArrowDownCircle size={20} className="text-emerald-600 shrink-0" />
                <div><p className="text-sm font-semibold text-emerald-800">{t.dashboard.arrivingToday}</p><p className="text-xs text-emerald-600">{arrivingToday.map((h) => h.name).join(', ')}</p></div>
              </div>
            )}
            {departingToday.length > 0 && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
                <ArrowUpCircle size={20} className="text-blue-600 shrink-0" />
                <div><p className="text-sm font-semibold text-blue-800">{t.dashboard.departingToday}</p><p className="text-xs text-blue-600">{departingToday.map((h) => h.name).join(', ')}</p></div>
              </div>
            )}
            {inQuarantine.length > 0 && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                <AlertTriangle size={20} className="text-red-600 shrink-0" />
                <div><p className="text-sm font-semibold text-red-800">{t.dashboard.inQuarantine}</p><p className="text-xs text-red-600">{inQuarantine.map((h) => h.name).join(', ')}</p></div>
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {isStaff && (
            <>
              <Card>
                <div className="px-5 py-4 border-b border-stone-100"><h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2"><ArrowDownCircle size={16} className="text-emerald-500" /> {t.dashboard.upcomingArrivals}</h2></div>
                <CardBody className="space-y-3">
                  {arrivingSoon.length === 0 && arrivingToday.length === 0 ? <p className="text-sm text-stone-400 py-2">{t.dashboard.noUpcomingArrivals}</p> :
                    [...arrivingToday, ...arrivingSoon].slice(0, 5).map((h) => (
                      <div key={h.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-bold">{h.name.charAt(0)}</div>
                          <div><p className="text-sm font-medium text-stone-900">{h.name}</p><p className="text-xs text-stone-400">{t.dashboard.owner}: {h.ownerName}</p></div>
                        </div>
                        <Badge variant={isToday(parseISO(h.checkIn)) ? 'success' : 'info'}>{isToday(parseISO(h.checkIn)) ? t.common.today : format(parseISO(h.checkIn), 'MMM d')}</Badge>
                      </div>
                    ))
                  }
                </CardBody>
              </Card>
              <Card>
                <div className="px-5 py-4 border-b border-stone-100"><h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2"><ArrowUpCircle size={16} className="text-blue-500" /> {t.dashboard.upcomingDepartures}</h2></div>
                <CardBody className="space-y-3">
                  {departingToday.length === 0 && departingSoon.length === 0 ? <p className="text-sm text-stone-400 py-2">{t.dashboard.noUpcomingDepartures}</p> :
                    [...departingToday, ...departingSoon].slice(0, 5).map((h) => (
                      <div key={h.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">{h.name.charAt(0)}</div>
                          <div><p className="text-sm font-medium text-stone-900">{h.name}</p><p className="text-xs text-stone-400">{h.transportDestination || t.dashboard.noDestination}</p></div>
                        </div>
                        <Badge variant={isToday(parseISO(h.checkOut)) ? 'warning' : 'info'}>{isToday(parseISO(h.checkOut)) ? t.common.today : format(parseISO(h.checkOut), 'MMM d')}</Badge>
                      </div>
                    ))
                  }
                </CardBody>
              </Card>
              <Card>
                <div className="px-5 py-4 border-b border-stone-100"><h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2"><ClipboardList size={16} className="text-amber-500" /> {t.dashboard.urgentTasks}</h2></div>
                <CardBody className="space-y-3">
                  {urgentTasks.length === 0 ? <p className="text-sm text-stone-400 py-2">{t.dashboard.noUrgentTasks}</p> :
                    urgentTasks.slice(0, 5).map((tt) => (
                      <div key={tt.id} className="flex items-center justify-between py-2">
                        <div><p className="text-sm font-medium text-stone-900">{tt.title}</p><p className="text-xs text-stone-400">{t.dashboard.assignedTo}: {tt.assignedToName}</p></div>
                        <Badge variant={tt.priority === 'urgent' ? 'danger' : 'warning'}>{tt.priority}</Badge>
                      </div>
                    ))
                  }
                </CardBody>
              </Card>
              <Card>
                <div className="px-5 py-4 border-b border-stone-100"><h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2"><Users size={16} className="text-purple-500" /> {t.dashboard.pendingRequests}</h2></div>
                <CardBody className="space-y-3">
                  {pendingRequests.length === 0 ? <p className="text-sm text-stone-400 py-2">{t.dashboard.noPendingRequests}</p> :
                    pendingRequests.slice(0, 5).map((r) => (
                      <div key={r.id} className="flex items-center justify-between py-2">
                        <div><p className="text-sm font-medium text-stone-900">{r.title}</p><p className="text-xs text-stone-400">{t.dashboard.from}: {r.clientName}</p></div>
                        <Badge variant="warning">{t.common.pending}</Badge>
                      </div>
                    ))
                  }
                </CardBody>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
