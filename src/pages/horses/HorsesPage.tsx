import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LangContext';
import { api } from '../../services/data';
import Header from '../../components/layout/Header';
import Card, { CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Input, Textarea, Select, Toggle } from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import type { Horse, StableType, StableLocation, FoodType, FeedType } from '../../types';
import { format, parseISO } from 'date-fns';
import { Plus, Search, Slack, Edit2, Trash2, Apple, Leaf } from 'lucide-react';

const statusColors = { upcoming: 'info', 'checked-in': 'success', 'checked-out': 'default' } as const;

function safeFormatDate(dateStr: string | undefined, fmt: string): string {
  if (!dateStr) return '—';
  try { return format(parseISO(dateStr), fmt); } catch { return dateStr; }
}

const emptyHorse: Omit<Horse, 'id'> = {
  name: '', passportId: '', motherName: '', ownerId: '', ownerName: '',
  checkIn: '', checkOut: '', checkInTime: '', checkOutTime: '',
  stableType: 'shavings', stableLocation: 'stable-a',
  walkerSchedule: false, paddockSchedule: false, quarantine: false, status: 'upcoming',
  notes: '', transportDestination: '',
  foodType: 'hay', feedType: 'standard', feedOther: '', specialCare: '',
};

export default function HorsesPage() {
  const { user, isStaff, isRole } = useAuth();
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Horse | null>(null);
  const [form, setForm] = useState<Omit<Horse, 'id'>>(emptyHorse);
  const [tick, setTick] = useState(0);

  const isAdmin = isRole('admin');
  const isWorker = isRole('worker');
  const isClient = isRole('client');

  const stableLocationLabels: Record<StableLocation, string> = {
    'stable-a': t.horses.stableA, 'stable-b': t.horses.stableB,
    'stable-c': t.horses.stableC, 'stable-d': t.horses.stableD,
    'pension-left': t.horses.pensionLeft, 'pension-middle': t.horses.pensionMiddle,
    'pension-right': t.horses.pensionRight,
  };

  const foodLabels: Record<FoodType, string> = { hay: t.horses.foodHay, grass: t.horses.foodGrass, both: t.horses.foodBoth };
  const feedLabels: Record<FeedType, string> = { standard: t.horses.feedStandard, 'client-prepared': t.horses.feedClientPrepared, other: t.horses.feedOther };

  const horses = useMemo(() => {
    let list = isStaff ? api.getHorses() : api.getHorsesByOwner(user!.id);
    if (filter !== 'all') list = list.filter((h) => h.status === filter);
    if (search) list = list.filter((h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      h.passportId.toLowerCase().includes(search.toLowerCase())
    );
    return list;
  }, [user, isStaff, search, filter, tick]);

  // Owners can be clients OR workers (workers can also have horses)
  const ownerUsers = api.getUsers().filter((u) => u.role === 'client' || u.role === 'worker');

  const openCreate = () => { setEditing(null); setForm(emptyHorse); setModalOpen(true); };
  const openEdit = (h: Horse) => { setEditing(h); setForm({ ...h }); setModalOpen(true); };

  const save = () => {
    if (!form.name || !form.passportId || !form.checkIn || !form.checkOut) return;
    const owner = ownerUsers.find((u) => u.id === form.ownerId);
    const data = { ...form, ownerName: owner?.name || form.ownerName };
    if (editing) api.updateHorse(editing.id, data);
    else api.createHorse(data);
    setModalOpen(false); setTick((x) => x + 1);
  };

  // Only admin can delete horses
  const deleteHorse = (id: string) => {
    if (!isAdmin) return;
    if (!confirm(t.common.confirmDelete)) return;
    api.deleteHorse(id); setTick((x) => x + 1);
  };

  const upd = (key: keyof typeof form, val: any) => setForm((f) => ({ ...f, [key]: val }));

  const statusLabel = (s: string) => {
    if (s === 'upcoming') return t.horses.upcoming;
    if (s === 'checked-in') return t.horses.checkedIn;
    return t.horses.checkedOut;
  };

  // Staff (admin + worker) and clients can add; but clients add their own horse via profile
  const canAdd = isStaff;
  // Admin can edit everything; worker can edit but not delete; client can only view
  const canEdit = isStaff;
  const canDelete = isAdmin;

  return (
    <div>
      <Header title={isStaff ? t.horses.title : t.nav.myHorses} />
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input type="text" placeholder={t.horses.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)}
                autoComplete="off" className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-stone-200 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none" />
            </div>
            <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5">
              {['all', 'upcoming', 'checked-in', 'checked-out'].map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === f ? 'bg-white shadow text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}>
                  {f === 'all' ? t.common.all : statusLabel(f)}
                </button>
              ))}
            </div>
          </div>
          {canAdd && <Button onClick={openCreate} icon={<Plus size={16} />}>{t.horses.addHorse}</Button>}
        </div>

        {horses.length === 0 ? (
          <EmptyState icon={<Slack size={24} />} title={t.horses.noHorses} description={t.horses.noHorsesDesc} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {horses.map((h) => (
              <Card key={h.id} hover className="relative group">
                <CardBody className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-lg">{h.name.charAt(0)}</div>
                      <div>
                        <h3 className="font-semibold text-stone-900">{h.name}</h3>
                        <p className="text-xs text-stone-500 font-mono font-semibold bg-stone-100 px-2 py-0.5 rounded mt-0.5 inline-block">{h.passportId}</p>
                      </div>
                    </div>
                    <Badge variant={statusColors[h.status]}>{statusLabel(h.status)}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div><span className="text-stone-400">{t.horses.mother}:</span> <span className="text-stone-700 font-medium ml-1">{h.motherName}</span></div>
                    <div><span className="text-stone-400">{t.horses.owner}:</span> <span className="text-stone-700 font-medium ml-1">{h.ownerName}</span></div>
                    <div><span className="text-stone-400">{t.horses.checkIn}:</span> <span className="text-stone-700 font-medium ml-1">{safeFormatDate(h.checkIn, 'MMM d')}</span></div>
                    <div><span className="text-stone-400">{t.horses.checkOut}:</span> <span className="text-stone-700 font-medium ml-1">{safeFormatDate(h.checkOut, 'MMM d')}</span></div>
                    <div><span className="text-stone-400">{t.horses.stableLocation}:</span> <span className="text-stone-700 font-medium ml-1">{stableLocationLabels[h.stableLocation] || h.stableLocation}</span></div>
                    {h.transportDestination && (
                      <div className="col-span-2"><span className="text-stone-400">{t.horses.destination}:</span> <span className="text-stone-700 font-medium ml-1">{h.transportDestination}</span></div>
                    )}
                  </div>

                  {/* Care badges */}
                  <div className="flex flex-wrap gap-2">
                    {h.walkerSchedule && <Badge variant="info">{t.horses.walker}</Badge>}
                    {h.paddockSchedule && <Badge variant="success">{t.horses.paddock}</Badge>}
                    {h.quarantine && <Badge variant="danger">{t.horses.quarantine}</Badge>}
                    {h.foodType && <Badge variant="purple">{foodLabels[h.foodType] || h.foodType}</Badge>}
                    {h.feedType && h.feedType !== 'standard' && <Badge variant="warning">{feedLabels[h.feedType] || h.feedType}</Badge>}
                  </div>

                  {/* Special care note */}
                  {h.specialCare && (
                    <div className="text-xs text-stone-500 bg-amber-50 border border-amber-100 rounded-lg p-2">
                      <span className="font-semibold text-amber-700">{t.horses.specialCare}:</span> {h.specialCare}
                    </div>
                  )}

                  {/* Action buttons based on role */}
                  {(canEdit || canDelete) && (
                    <div className="flex gap-2 pt-2 border-t border-stone-100">
                      {canEdit && <Button size="sm" variant="secondary" icon={<Edit2 size={14} />} onClick={() => openEdit(h)}>{t.common.edit}</Button>}
                      {canDelete && <Button size="sm" variant="ghost" icon={<Trash2 size={14} />} onClick={() => deleteHorse(h.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">{t.common.remove}</Button>}
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t.horses.editHorse : t.horses.registerHorse} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label={t.horses.horseName} value={form.name} onChange={(e) => upd('name', e.target.value)} required />
              <Input label={t.horses.passportId} value={form.passportId} onChange={(e) => upd('passportId', e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label={t.horses.motherName} value={form.motherName} onChange={(e) => upd('motherName', e.target.value)} />
              <Select label={t.horses.owner} value={form.ownerId} onChange={(e) => upd('ownerId', e.target.value)}
                options={[{ value: '', label: t.horses.selectOwner }, ...ownerUsers.map((u) => ({ value: u.id, label: `${u.name} (${u.role})` }))]} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label={t.horses.checkIn} type="date" value={form.checkIn} onChange={(e) => upd('checkIn', e.target.value)} required />
              <Input label={t.horses.checkInTime} type="time" value={form.checkInTime || ''} onChange={(e) => upd('checkInTime', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label={t.horses.checkOut} type="date" value={form.checkOut} onChange={(e) => upd('checkOut', e.target.value)} required />
              <Input label={t.horses.checkOutTime} type="time" value={form.checkOutTime || ''} onChange={(e) => upd('checkOutTime', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label={t.horses.stableType} value={form.stableType} onChange={(e) => upd('stableType', e.target.value as StableType)}
                options={[{ value: 'shavings', label: t.horses.stableShavings }, { value: 'straw', label: t.horses.stableStraw }]} />
              <Select label={t.horses.stableLocation} value={form.stableLocation} onChange={(e) => upd('stableLocation', e.target.value as StableLocation)}
                options={[
                  { value: 'stable-a', label: t.horses.stableA }, { value: 'stable-b', label: t.horses.stableB },
                  { value: 'stable-c', label: t.horses.stableC }, { value: 'stable-d', label: t.horses.stableD },
                  { value: 'pension-left', label: t.horses.pensionLeft }, { value: 'pension-middle', label: t.horses.pensionMiddle },
                  { value: 'pension-right', label: t.horses.pensionRight },
                ]} />
            </div>
            <Select label={t.horses.status} value={form.status} onChange={(e) => upd('status', e.target.value as Horse['status'])}
              options={[{ value: 'upcoming', label: t.horses.upcoming }, { value: 'checked-in', label: t.horses.checkedIn }, { value: 'checked-out', label: t.horses.checkedOut }]} />
            <Input label={t.horses.transportDest} value={form.transportDestination || ''} onChange={(e) => upd('transportDestination', e.target.value)} placeholder={t.horses.transportDestPlaceholder} />
            <div className="grid grid-cols-2 gap-4">
              <Toggle label={t.horses.walkerSchedule} checked={form.walkerSchedule} onChange={(v) => upd('walkerSchedule', v)} />
              <Toggle label={t.horses.paddockSchedule} checked={form.paddockSchedule} onChange={(v) => upd('paddockSchedule', v)} />
            </div>
            <Toggle label={t.horses.quarantine} checked={form.quarantine} onChange={(v) => upd('quarantine', v)} />
            {form.quarantine && (
              <div className="grid grid-cols-2 gap-4">
                <Input label={t.horses.quarantineStart} type="date" value={form.quarantineStart || ''} onChange={(e) => upd('quarantineStart', e.target.value)} />
                <Input label={t.horses.quarantineEnd} type="date" value={form.quarantineEnd || ''} onChange={(e) => upd('quarantineEnd', e.target.value)} />
              </div>
            )}

            {/* Special Care Section */}
            <div className="pt-3 border-t border-stone-200">
              <h3 className="text-sm font-semibold text-stone-700 mb-3 flex items-center gap-2"><Leaf size={16} className="text-emerald-600" /> {t.horses.specialCare}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Select label={t.horses.foodType} value={form.foodType || 'hay'} onChange={(e) => upd('foodType', e.target.value as FoodType)}
                    options={[{ value: 'hay', label: t.horses.foodHay }, { value: 'grass', label: t.horses.foodGrass }, { value: 'both', label: t.horses.foodBoth }]} />
                  <Select label={t.horses.feedType} value={form.feedType || 'standard'} onChange={(e) => upd('feedType', e.target.value as FeedType)}
                    options={[{ value: 'standard', label: t.horses.feedStandard }, { value: 'client-prepared', label: t.horses.feedClientPrepared }, { value: 'other', label: t.horses.feedOther }]} />
                </div>
                {form.feedType === 'other' && (
                  <Input label={t.horses.feedOther} value={form.feedOther || ''} onChange={(e) => upd('feedOther', e.target.value)} placeholder={t.horses.feedOtherPlaceholder} />
                )}
                <Textarea label={t.horses.specialCare} value={form.specialCare || ''} onChange={(e) => upd('specialCare', e.target.value)} placeholder={t.horses.specialCarePlaceholder} />
              </div>
            </div>

            <Textarea label={t.horses.notes} value={form.notes || ''} onChange={(e) => upd('notes', e.target.value)} />
            <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>{t.common.cancel}</Button>
              <Button onClick={save}>{editing ? t.common.save : t.horses.addHorse}</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
