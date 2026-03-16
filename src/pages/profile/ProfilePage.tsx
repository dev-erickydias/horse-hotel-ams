import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LangContext';
import { api } from '../../services/data';
import Header from '../../components/layout/Header';
import Card, { CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Input, Textarea, Select } from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import type { Horse, FoodType, FeedType } from '../../types';
import { format, parseISO } from 'date-fns';
import { User, Mail, Phone, Edit2, Plus, Slack, CheckCircle, Leaf, Save, Lock } from 'lucide-react';

const emptyClientHorse = {
  name: '', passportId: '', motherName: '',
  checkIn: '', checkOut: '',
  foodType: 'hay' as FoodType, feedType: 'standard' as FeedType,
  feedOther: '', specialCare: '', notes: '',
};

export default function ProfilePage() {
  const { user, isRole } = useAuth();
  const { t } = useLang();
  const isAdmin = isRole('admin');
  const isClient = isRole('client');
  const isWorker = isRole('worker');

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [savedMsg, setSavedMsg] = useState('');
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [horseModal, setHorseModal] = useState(false);
  const [editingHorse, setEditingHorse] = useState<Horse | null>(null);
  const [horseForm, setHorseForm] = useState(emptyClientHorse);
  const [tick, setTick] = useState(0);

  const myHorses = useMemo(() => {
    void tick;
    return user ? api.getHorsesByOwner(user.id) : [];
  }, [user, tick]);

  const currentUser = user ? api.getUser(user.id) : null;

  const foodLabels: Record<FoodType, string> = { hay: t.horses.foodHay, grass: t.horses.foodGrass, both: t.horses.foodBoth };
  const feedLabels: Record<FeedType, string> = { standard: t.horses.feedStandard, 'client-prepared': t.horses.feedClientPrepared, other: t.horses.feedOther };

  const saveProfile = () => {
    if (!user) return;
    api.updateUser(user.id, { name: profileForm.name, phone: profileForm.phone });
    setEditingProfile(false);
    setSavedMsg(t.profile.savedSuccess);
    setTimeout(() => setSavedMsg(''), 3000);
    setTick((x) => x + 1);
  };

  const changePassword = () => {
    setPwError(''); setPwSuccess('');
    if (!user) return;
    const fresh = api.getUser(user.id);
    if (!fresh || fresh.password !== pwForm.current) { setPwError(t.profile.wrongCurrentPassword); return; }
    if (pwForm.newPw.length < 4) { setPwError(t.profile.passwordTooShort); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError(t.profile.passwordMismatch); return; }
    api.updateUser(user.id, { password: pwForm.newPw });
    setPwForm({ current: '', newPw: '', confirm: '' });
    setPwSuccess(t.profile.passwordChanged);
    setTimeout(() => setPwSuccess(''), 3000);
  };

  const openAddHorse = () => {
    setEditingHorse(null);
    setHorseForm(emptyClientHorse);
    setHorseModal(true);
  };

  const openEditHorse = (h: Horse) => {
    setEditingHorse(h);
    setHorseForm({
      name: h.name, passportId: h.passportId, motherName: h.motherName,
      checkIn: h.checkIn, checkOut: h.checkOut,
      foodType: h.foodType || 'hay', feedType: h.feedType || 'standard',
      feedOther: h.feedOther || '', specialCare: h.specialCare || '', notes: h.notes || '',
    });
    setHorseModal(true);
  };

  const saveHorse = () => {
    if (!user || !horseForm.name || !horseForm.passportId) return;
    const data: Omit<Horse, 'id'> = {
      name: horseForm.name, passportId: horseForm.passportId, motherName: horseForm.motherName,
      ownerId: user.id, ownerName: currentUser?.name || user.name,
      checkIn: horseForm.checkIn || new Date().toISOString().split('T')[0],
      checkOut: horseForm.checkOut || '',
      stableType: 'shavings', stableLocation: 'stable-a',
      walkerSchedule: false, paddockSchedule: false, quarantine: false,
      status: 'upcoming',
      foodType: horseForm.foodType, feedType: horseForm.feedType,
      feedOther: horseForm.feedOther, specialCare: horseForm.specialCare,
      notes: horseForm.notes,
    };
    if (editingHorse) {
      api.updateHorse(editingHorse.id, {
        name: horseForm.name, passportId: horseForm.passportId, motherName: horseForm.motherName,
        foodType: horseForm.foodType, feedType: horseForm.feedType,
        feedOther: horseForm.feedOther, specialCare: horseForm.specialCare,
        notes: horseForm.notes, checkIn: horseForm.checkIn, checkOut: horseForm.checkOut,
      });
    } else {
      api.createHorse(data);
      // Notify admin
      api.addNotification({
        type: 'arrival',
        title: `New horse registered: ${horseForm.name}`,
        message: `${currentUser?.name || user.name} registered a new horse: ${horseForm.name}`,
        read: false,
        createdAt: new Date().toISOString(),
        link: '/app/horses',
      });
    }
    setHorseModal(false);
    setTick((x) => x + 1);
  };

  const updH = (key: string, val: any) => setHorseForm((f) => ({ ...f, [key]: val }));

  const roleLabels: Record<string, string> = { admin: t.users.admin, worker: t.users.worker, client: t.users.client };
  const roleColors = { admin: 'danger', worker: 'info', client: 'success' } as const;

  return (
    <div>
      <Header title={t.profile.title} />
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in max-w-4xl">

        {/* Success message */}
        {savedMsg && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 flex items-center gap-2">
            <CheckCircle size={16} /> {savedMsg}
          </div>
        )}

        {/* Basic Info Card */}
        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-stone-700">{t.profile.basicInfo}</h3>
              {(isClient || isWorker) && !editingProfile && (
                <Button size="sm" variant="secondary" icon={<Edit2 size={14} />} onClick={() => setEditingProfile(true)}>
                  {t.profile.editProfile}
                </Button>
              )}
            </div>

            {editingProfile ? (
              <div className="space-y-4">
                <Input label={t.users.fullName} value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
                <Input label={t.users.email} value={profileForm.email} disabled />
                <Input label={t.users.phone} value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                <div className="flex gap-2 pt-2">
                  <Button onClick={saveProfile} icon={<Save size={14} />}>{t.common.save}</Button>
                  <Button variant="secondary" onClick={() => setEditingProfile(false)}>{t.common.cancel}</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-2xl shrink-0">
                  {(currentUser?.name || user?.name || '?').charAt(0)}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-stone-900">{currentUser?.name || user?.name}</h2>
                    <Badge variant={roleColors[user?.role || 'client']}>{roleLabels[user?.role || 'client']}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-stone-500"><Mail size={14} /> {currentUser?.email || user?.email}</div>
                  {(currentUser?.phone || user?.phone) && (
                    <div className="flex items-center gap-1 text-sm text-stone-500"><Phone size={14} /> {currentUser?.phone || user?.phone}</div>
                  )}
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardBody>
            <h3 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2"><Lock size={16} /> {t.profile.changePassword}</h3>
            {pwSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 flex items-center gap-2">
                <CheckCircle size={16} /> {pwSuccess}
              </div>
            )}
            {pwError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{pwError}</div>
            )}
            <div className="space-y-4">
              <Input label={t.profile.currentPassword} type="password" value={pwForm.current} onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })} placeholder={t.profile.currentPasswordPlaceholder} />
              <div className="grid grid-cols-2 gap-4">
                <Input label={t.profile.newPassword} type="password" value={pwForm.newPw} onChange={(e) => setPwForm({ ...pwForm, newPw: e.target.value })} placeholder={t.profile.newPasswordPlaceholder} />
                <Input label={t.profile.confirmNewPassword} type="password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} placeholder={t.profile.confirmNewPasswordPlaceholder} />
              </div>
              <Button size="sm" onClick={changePassword} icon={<Lock size={14} />}>{t.profile.changePassword}</Button>
            </div>
          </CardBody>
        </Card>

        {/* My Horses Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-stone-700">{t.profile.myHorses}</h3>
            {(isClient || isWorker || isAdmin) && (
              <Button size="sm" onClick={openAddHorse} icon={<Plus size={14} />}>{t.profile.addHorse}</Button>
            )}
          </div>

          {myHorses.length === 0 ? (
            <EmptyState icon={<Slack size={24} />} title={t.profile.noHorses} description={t.profile.noHorsesDesc} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {myHorses.map((h) => (
                <Card key={h.id} hover>
                  <CardBody className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold">{h.name.charAt(0)}</div>
                        <div>
                          <h3 className="font-semibold text-stone-900 text-sm">{h.name}</h3>
                          <p className="text-xs text-stone-500 font-mono bg-stone-100 px-1.5 py-0.5 rounded mt-0.5 inline-block">{h.passportId}</p>
                        </div>
                      </div>
                      <Badge variant={h.status === 'checked-in' ? 'success' : h.status === 'upcoming' ? 'info' : 'default'}>
                        {h.status === 'checked-in' ? t.horses.checkedIn : h.status === 'upcoming' ? t.horses.upcoming : t.horses.checkedOut}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                      {h.motherName && <div><span className="text-stone-400">{t.horses.mother}:</span> <span className="text-stone-700 ml-1">{h.motherName}</span></div>}
                      {h.checkIn && <div><span className="text-stone-400">{t.horses.checkIn}:</span> <span className="text-stone-700 ml-1">{(() => { try { return format(parseISO(h.checkIn), 'MMM d, yyyy'); } catch { return h.checkIn; } })()}</span></div>}
                      {h.checkOut && <div><span className="text-stone-400">{t.horses.checkOut}:</span> <span className="text-stone-700 ml-1">{(() => { try { return format(parseISO(h.checkOut), 'MMM d, yyyy'); } catch { return h.checkOut; } })()}</span></div>}
                    </div>

                    {/* Care info */}
                    <div className="flex flex-wrap gap-1.5">
                      {h.foodType && <Badge variant="purple">{foodLabels[h.foodType]}</Badge>}
                      {h.feedType && <Badge variant="warning">{feedLabels[h.feedType]}</Badge>}
                    </div>

                    {h.specialCare && (
                      <div className="text-xs text-stone-500 bg-amber-50 border border-amber-100 rounded-lg p-2">
                        <span className="font-semibold text-amber-700">{t.horses.specialCare}:</span> {h.specialCare}
                      </div>
                    )}

                    {(isClient || isWorker || isAdmin) && (
                      <div className="pt-2 border-t border-stone-100">
                        <Button size="sm" variant="secondary" icon={<Edit2 size={14} />} onClick={() => openEditHorse(h)}>{t.common.edit}</Button>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Horse Modal */}
        <Modal open={horseModal} onClose={() => setHorseModal(false)} title={editingHorse ? t.horses.editHorse : t.profile.addHorse} size="lg">
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{t.profile.horseInfo}</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input label={t.horses.horseName} value={horseForm.name} onChange={(e) => updH('name', e.target.value)} required />
              <Input label={t.horses.passportId} value={horseForm.passportId} onChange={(e) => updH('passportId', e.target.value)} required />
            </div>
            <Input label={t.horses.motherName} value={horseForm.motherName} onChange={(e) => updH('motherName', e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label={t.horses.checkIn} type="date" value={horseForm.checkIn} onChange={(e) => updH('checkIn', e.target.value)} />
              <Input label={t.horses.checkOut} type="date" value={horseForm.checkOut} onChange={(e) => updH('checkOut', e.target.value)} />
            </div>

            {/* Care & Feeding */}
            <div className="pt-3 border-t border-stone-200">
              <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Leaf size={14} className="text-emerald-600" /> {t.profile.careInfo}
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Select label={t.horses.foodType} value={horseForm.foodType} onChange={(e) => updH('foodType', e.target.value)}
                    options={[{ value: 'hay', label: t.horses.foodHay }, { value: 'grass', label: t.horses.foodGrass }, { value: 'both', label: t.horses.foodBoth }]} />
                  <Select label={t.horses.feedType} value={horseForm.feedType} onChange={(e) => updH('feedType', e.target.value)}
                    options={[{ value: 'standard', label: t.horses.feedStandard }, { value: 'client-prepared', label: t.horses.feedClientPrepared }, { value: 'other', label: t.horses.feedOther }]} />
                </div>
                {horseForm.feedType === 'other' && (
                  <Input label={t.horses.feedOther} value={horseForm.feedOther} onChange={(e) => updH('feedOther', e.target.value)} placeholder={t.horses.feedOtherPlaceholder} />
                )}
                <Textarea label={t.horses.specialCare} value={horseForm.specialCare} onChange={(e) => updH('specialCare', e.target.value)} placeholder={t.horses.specialCarePlaceholder} />
              </div>
            </div>

            <Textarea label={t.horses.notes} value={horseForm.notes} onChange={(e) => updH('notes', e.target.value)} />

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
              <Button variant="secondary" onClick={() => setHorseModal(false)}>{t.common.cancel}</Button>
              <Button onClick={saveHorse}>{editingHorse ? t.common.save : t.profile.addHorse}</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
