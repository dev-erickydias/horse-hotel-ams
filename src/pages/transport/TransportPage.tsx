import { useState, useMemo } from 'react';
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
import { Plus, Truck, MapPin, ArrowRight } from 'lucide-react';

const statusColors = { scheduled: 'info', 'in-transit': 'warning', completed: 'success' } as const;

export default function TransportPage() {
  const { t } = useLang();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ horseId: '', horseName: '', transportDate: '', origin: 'Horse Hotel', destination: '', driver: '', notes: '', status: 'scheduled' as Transport['status'] });
  const [tick, setTick] = useState(0);
  const transports = useMemo(() => api.getTransports(), [tick]);
  const horses = api.getHorses();

  const save = () => {
    if (!form.horseId || !form.transportDate || !form.destination) return;
    const horse = horses.find((h) => h.id === form.horseId);
    api.createTransport({ ...form, horseName: horse?.name || '', createdAt: new Date().toISOString().split('T')[0] });
    setModalOpen(false); setForm({ horseId: '', horseName: '', transportDate: '', origin: 'Horse Hotel', destination: '', driver: '', notes: '', status: 'scheduled' }); setTick((x) => x + 1);
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
                        <div><h3 className="text-sm font-semibold text-stone-900">{tr.horseName}</h3><p className="text-xs text-stone-400">{format(parseISO(tr.transportDate), 'EEEE, MMM d, yyyy')}</p></div>
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
            <Input label={t.transport.transportDate} type="date" value={form.transportDate} onChange={(e) => setForm({ ...form, transportDate: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label={t.transport.origin} value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
              <Input label={t.transport.destination} value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required />
            </div>
            <Input label={t.transport.driver} value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} placeholder={t.transport.driverPlaceholder} />
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
