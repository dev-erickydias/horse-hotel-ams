import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LangContext';
import { api } from '../../services/data';
import Header from '../../components/layout/Header';
import Card, { CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import type { ScheduleEvent } from '../../types';
import { format, parseISO, addDays, startOfWeek, isSameDay } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Truck, LogIn, LogOut, CalendarCheck, Clock, Edit2 } from 'lucide-react';

const eventTypeConfig: Record<string, { color: string; bgColor: string; icon: typeof Calendar }> = {
  booking: { color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200', icon: CalendarCheck },
  transport: { color: 'text-purple-700', bgColor: 'bg-purple-50 border-purple-200', icon: Truck },
  arrival: { color: 'text-green-700', bgColor: 'bg-green-50 border-green-200', icon: LogIn },
  departure: { color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200', icon: LogOut },
};

export default function SchedulePage() {
  const { user, isStaff, isRole } = useAuth();
  const { t } = useLang();
  const isAdmin = isRole('admin');
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editModal, setEditModal] = useState<ScheduleEvent | null>(null);
  const [editTime, setEditTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [tick, setTick] = useState(0);

  const allEvents = useMemo(() => {
    const events = api.getScheduleEvents();
    // Clients can only see their own bookings + all arrivals/departures/transports
    if (!isStaff) {
      return events.filter((e) => {
        if (e.type === 'booking') return e.userId === user?.id;
        return true; // arrivals, departures, transports are visible to all
      });
    }
    return events;
  }, [tick, isStaff, user]);

  // Week view: get 7 days starting from Monday
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDate = (date: Date) => allEvents.filter((e) => {
    try { return isSameDay(parseISO(e.date), date); } catch { return false; }
  });

  const todayEvents = getEventsForDate(currentDate);

  const navigatePrev = () => {
    if (viewMode === 'week') setCurrentDate((d) => addDays(d, -7));
    else setCurrentDate((d) => addDays(d, -1));
  };
  const navigateNext = () => {
    if (viewMode === 'week') setCurrentDate((d) => addDays(d, 7));
    else setCurrentDate((d) => addDays(d, 1));
  };
  const goToToday = () => setCurrentDate(new Date());

  const canEditEvent = (event: ScheduleEvent) => {
    if (isAdmin) return event.type === 'booking'; // admin can edit booking times
    if (event.type === 'booking' && event.userId === user?.id) return true; // clients can edit own bookings
    return false;
  };

  const openEditModal = (event: ScheduleEvent) => {
    if (!canEditEvent(event)) return;
    setEditModal(event);
    setEditTime(event.time || '');
    setEditEndTime(event.endTime || '');
  };

  const saveEdit = () => {
    if (!editModal) return;
    // Update the underlying request
    if (editModal.type === 'booking') {
      api.updateRequest(editModal.sourceId, { requestedTime: editTime || undefined, requestedEndTime: editEndTime || undefined });
    }
    setEditModal(null);
    setTick((x) => x + 1);
  };

  const typeLabels: Record<string, string> = {
    booking: t.schedule.booking,
    transport: t.schedule.transport,
    arrival: t.schedule.arrival,
    departure: t.schedule.departure,
  };

  const renderEvent = (event: ScheduleEvent, compact = false) => {
    const config = eventTypeConfig[event.type] || eventTypeConfig.booking;
    const Icon = config.icon;
    const editable = canEditEvent(event);

    return (
      <div
        key={event.id}
        className={`${compact ? 'p-1.5' : 'p-3'} rounded-lg border ${config.bgColor} ${editable ? 'cursor-pointer hover:shadow-md' : ''} transition-all`}
        onClick={() => editable && openEditModal(event)}
      >
        <div className="flex items-start gap-2">
          <Icon size={compact ? 12 : 14} className={`${config.color} shrink-0 mt-0.5`} />
          <div className="flex-1 min-w-0">
            <p className={`${compact ? 'text-[11px]' : 'text-xs'} font-semibold ${config.color} truncate`}>{event.title}</p>
            {event.time && (
              <p className={`${compact ? 'text-[10px]' : 'text-xs'} ${config.color} opacity-70 flex items-center gap-0.5`}>
                <Clock size={compact ? 8 : 10} />
                {event.time}{event.endTime && ` - ${event.endTime}`}
              </p>
            )}
            {!compact && event.userName && <p className="text-xs text-stone-500 mt-0.5">{event.userName}</p>}
            {!compact && editable && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-stone-400 mt-1"><Edit2 size={8} /> {t.schedule.clickToEdit}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Header title={t.schedule.title} />
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={navigatePrev} icon={<ChevronLeft size={16} />} />
            <Button size="sm" variant="secondary" onClick={goToToday}>{t.common.today}</Button>
            <Button size="sm" variant="secondary" onClick={navigateNext} icon={<ChevronRight size={16} />} />
            <h2 className="text-lg font-semibold text-stone-900 ml-2">
              {viewMode === 'week'
                ? `${format(weekDays[0], 'MMM d')} - ${format(weekDays[6], 'MMM d, yyyy')}`
                : format(currentDate, 'EEEE, MMMM d, yyyy')
              }
            </h2>
          </div>
          <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5">
            <button onClick={() => setViewMode('day')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'day' ? 'bg-white shadow text-stone-900' : 'text-stone-500'}`}>
              {t.schedule.dayView}
            </button>
            <button onClick={() => setViewMode('week')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'week' ? 'bg-white shadow text-stone-900' : 'text-stone-500'}`}>
              {t.schedule.weekView}
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3">
          {Object.entries(eventTypeConfig).map(([type, config]) => {
            const Icon = config.icon;
            return (
              <span key={type} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bgColor} ${config.color}`}>
                <Icon size={12} /> {typeLabels[type]}
              </span>
            );
          })}
        </div>

        {/* Week View */}
        {viewMode === 'week' && (
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const dayEvents = getEventsForDate(day);
              const isToday = isSameDay(day, new Date());
              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[140px] rounded-lg border p-2 cursor-pointer transition-all hover:shadow-sm ${isToday ? 'border-amber-300 bg-amber-50/30' : 'border-stone-200 bg-white'}`}
                  onClick={() => { setCurrentDate(day); setViewMode('day'); }}
                >
                  <div className="text-center mb-2">
                    <p className="text-[10px] text-stone-400 uppercase">{format(day, 'EEE')}</p>
                    <p className={`text-sm font-bold ${isToday ? 'text-amber-600' : 'text-stone-900'}`}>{format(day, 'd')}</p>
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((e) => renderEvent(e, true))}
                    {dayEvents.length > 3 && (
                      <p className="text-[10px] text-stone-400 text-center">+{dayEvents.length - 3} {t.schedule.more}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Day View */}
        {viewMode === 'day' && (
          <div>
            {todayEvents.length === 0 ? (
              <EmptyState icon={<Calendar size={24} />} title={t.schedule.noEvents} description={t.schedule.noEventsDesc} />
            ) : (
              <div className="space-y-3 max-w-2xl">
                {todayEvents.map((e) => renderEvent(e))}
              </div>
            )}
          </div>
        )}

        {/* Edit Modal */}
        <Modal open={!!editModal} onClose={() => setEditModal(null)} title={t.schedule.editEvent}>
          {editModal && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-100">
                <h3 className="text-sm font-semibold text-stone-900">{editModal.title}</h3>
                <p className="text-xs text-stone-500 mt-1">{format(parseISO(editModal.date), 'EEEE, MMMM d, yyyy')}</p>
                {editModal.userName && <p className="text-xs text-stone-500">{editModal.userName}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label={t.schedule.startTime} type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} />
                <Input label={t.schedule.endTime} type="time" value={editEndTime} onChange={(e) => setEditEndTime(e.target.value)} />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <Button variant="secondary" onClick={() => setEditModal(null)}>{t.common.cancel}</Button>
                <Button onClick={saveEdit}>{t.common.save}</Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
