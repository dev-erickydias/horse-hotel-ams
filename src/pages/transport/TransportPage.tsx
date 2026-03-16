import { useState, useMemo, useRef, useEffect } from 'react';
import { useLang } from '../../contexts/LangContext';
import { api } from '../../services/data';
import Header from '../../components/layout/Header';
import Card, { CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Input, Textarea, Select } from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import type { Transport } from '../../types';
import { format, parseISO } from 'date-fns';
import { Plus, Truck, MapPin, ArrowRight, Clock, User } from 'lucide-react';

const statusColors = { scheduled: 'info', 'in-transit': 'warning', completed: 'success' } as const;

// Autocomplete component for selecting users as driver
function UserAutocomplete({ value, onChange, placeholder, label }: {
  value: string; onChange: (name: string, id?: string) => void; placeholder?: string; label: string;
}) {
  const [query, setQuery] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const users = api.getUsers().filter((u) => u.status === 'active');

  const filtered = useMemo(() => {
    if (!query.trim()) return users.slice(0, 8);
    const q = query.toLowerCase();
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)).slice(0, 8);
  }, [query, users]);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const roleLabel = (role: string) => role === 'admin' ? 'Admin' : role === 'worker' ? 'Worker' : 'Client';
  const roleColor = (role: string) => role === 'admin' ? 'text-red-500' : role === 'worker' ? 'text-blue-500' : 'text-green-500';

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
      <div className="relative">
        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); onChange(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-stone-200 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
        />
      </div>
      {showDropdown && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-stone-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filtered.map((u) => (
            <button
              key={u.id}
              type="button"
              className="w-full text-left px-3 py-2 hover:bg-amber-50 flex items-center gap-2 text-sm transition-colors"
              onClick={() => { setQuery(u.name); onChange(u.name, u.id); setShowDropdown(false); }}
            >
              <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs shrink-0">{u.name.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-stone-900">{u.name}</span>
                <span className={`ml-2 text-xs ${roleColor(u.role)}`}>({roleLabel(u.role)})</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TransportPage() {
  const { t } = useLang();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ horseId: '', horseName: '', transportDate: '', transportTime: '', origin: 'Horse Hotel', destination: '', driver: '', driverId: '', notes: '', status: 'scheduled' as Transport['status'] });
  const [tick, setTick] = useState(0);
  const transports = useMemo(() => api.getTransports(), [tick]);
  const horses = api.getHorses();

  const save = () => {
    if (!form.horseId || !form.transportDate || !form.destination) return;
    const horse = horses.find((h) => h.id === form.horseId);
    api.createTransport({ ...form, horseName: horse?.name || '', createdAt: new Date().toISOString().split('T')[0] });
    // Add notification
    api.addNotification({
      type: 'transport',
      title: t.transport.title,
      message: `${horse?.name || ''}: ${form.origin} → ${form.destination}`,
      read: false,
      createdAt: new Date().toISOString(),
      link: '/app/schedule',
      audience: 'all',
    });
    setModalOpen(false);
    setForm({ horseId: '', horseName: '', transportDate: '', transportTime: '', origin: 'Horse Hotel', destination: '', driver: '', driverId: '', notes: '', status: 'scheduled' });
    setTick((x) => x + 1);
  };
  const updateStatus = (id: string, status: Transport['status']) => { api.updateTransport(id, { status }); setTick((x) => x + 1); };

  const statusLabel = (s: string) => s === 'scheduled' ? t.common.scheduled : s === 'in-transit' ? t.common.inTransit : t.common.completed;

  return (
    <div>
      <Header title={t.transport.title} />
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <p className="text-sm text-stone-500">{t.transport.subtitle}</p>
          <Button onClick={() => setModalOpen(true)} icon={<Plus size={16} />}>{t.transport.scheduleTransport}</Button>
        </div>
        {transports.length === 0 ? (
          <EmptyState icon={<Truck size={24} />} title={t.transport.noTransports} description={t.transport.noTransportsDesc} />
        ) : (
          <div className="space-y-4">
            {transports.map((tr) => (
              <Card key={tr.id}>
                <CardBody>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold">{tr.horseName.charAt(0)}</div>
                        <div>
                          <h3 className="text-sm font-semibold text-stone-900">{tr.horseName}</h3>
                          <p className="text-xs text-stone-400">
                            {format(parseISO(tr.transportDate), 'EEEE, MMM d, yyyy')}
                            {tr.transportTime && <span className="ml-1 inline-flex items-center gap-0.5"><Clock size={10} /> {tr.transportTime}</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-stone-600 mb-2">
                        <MapPin size={14} className="text-stone-400 shrink-0" /><span>{tr.origin}</span><ArrowRight size={14} className="text-stone-400" /><span className="font-medium">{tr.destination}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-stone-400">
                        <span>{t.transport.driver}: {tr.driver || 'TBD'}</span>
                        {tr.notes && <span>{t.transport.notes}: {tr.notes}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={statusColors[tr.status]}>{statusLabel(tr.status)}</Badge>
                      {tr.status === 'scheduled' && <Button size="sm" variant="secondary" onClick={() => updateStatus(tr.id, 'in-transit')}>{t.transport.startTransport}</Button>}
                      {tr.status === 'in-transit' && <Button size="sm" variant="success" onClick={() => updateStatus(tr.id, 'completed')}>{t.transport.complete}</Button>}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t.transport.scheduleTransport}>
          <div className="space-y-4">
            <Select label={t.transport.horse} value={form.horseId} onChange={(e) => setForm({ ...form, horseId: e.target.value })}
              options={[{ value: '', label: t.transport.selectHorse }, ...horses.map((h) => ({ value: h.id, label: h.name }))]} />
            <div className="grid grid-cols-2 gap-4">
              <Input label={t.transport.transportDate} type="date" value={form.transportDate} onChange={(e) => setForm({ ...form, transportDate: e.target.value })} required />
              <Input label={t.transport.transportTime} type="time" value={form.transportTime} onChange={(e) => setForm({ ...form, transportTime: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label={t.transport.origin} value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
              <Input label={t.transport.destination} value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required />
            </div>
            <UserAutocomplete
              label={t.transport.driver}
              value={form.driver}
              onChange={(name, id) => setForm({ ...form, driver: name, driverId: id || '' })}
              placeholder={t.transport.driverPlaceholder}
            />
            <Textarea label={t.transport.notes} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>{t.common.cancel}</Button>
              <Button onClick={save}>{t.transport.schedule}</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
