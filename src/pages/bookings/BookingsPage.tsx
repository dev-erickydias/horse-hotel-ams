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
import type { RequestStatus } from '../../types';
import { format, parseISO } from 'date-fns';
import { Plus, CalendarCheck, CheckCircle, XCircle, Clock } from 'lucide-react';

const statusConfig: Record<RequestStatus, { color: 'warning' | 'success' | 'danger'; icon: typeof Clock }> = {
  pending: { color: 'warning', icon: Clock }, approved: { color: 'success', icon: CheckCircle }, rejected: { color: 'danger', icon: XCircle },
};

export default function BookingsPage() {
  const { user, isStaff } = useAuth();
  const { t } = useLang();
  const [filter, setFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewModal, setReviewModal] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [form, setForm] = useState({ title: '', description: '', facilityType: 'arena', requestedDate: '' });
  const [tick, setTick] = useState(0);

  const requests = useMemo(() => {
    let list = isStaff ? api.getRequests() : api.getRequestsByClient(user!.id);
    if (filter !== 'all') list = list.filter((r) => r.status === filter);
    return list;
  }, [user, isStaff, filter, tick]);

  const submitRequest = () => {
    if (!form.title || !form.description) return;
    api.createRequest({ ...form, clientId: user!.id, clientName: user!.name, status: 'pending', createdAt: new Date().toISOString().split('T')[0] });
    setModalOpen(false); setForm({ title: '', description: '', facilityType: 'arena', requestedDate: '' }); setTick((x) => x + 1);
  };

  const reviewRequest = (id: string, status: RequestStatus) => {
    api.updateRequest(id, { status, adminNotes: adminNotes || undefined });
    setReviewModal(null); setAdminNotes(''); setTick((x) => x + 1);
  };

  const reviewing = requests.find((r) => r.id === reviewModal);
  const filterLabels: Record<string, string> = { all: t.common.all, pending: t.common.pending, approved: t.common.approved, rejected: t.common.rejected };

  return (
    <div>
      <Header title={isStaff ? t.bookings.title : t.bookings.clientTitle} />
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5">
            {['all', 'pending', 'approved', 'rejected'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === f ? 'bg-white shadow text-stone-900' : 'text-stone-500'}`}>
                {filterLabels[f]}
              </button>
            ))}
          </div>
          {!isStaff && <Button onClick={() => setModalOpen(true)} icon={<Plus size={16} />}>{t.bookings.newRequest}</Button>}
        </div>

        {requests.length === 0 ? (
          <EmptyState icon={<CalendarCheck size={24} />} title={t.bookings.noRequests}
            description={isStaff ? t.bookings.noRequestsStaff : t.bookings.noRequestsClient}
            action={!isStaff ? <Button onClick={() => setModalOpen(true)} icon={<Plus size={16} />}>{t.bookings.submitRequest}</Button> : undefined} />
        ) : (
          <div className="space-y-3">
            {requests.map((r) => {
              const cfg = statusConfig[r.status];
              return (
                <Card key={r.id}>
                  <CardBody>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1"><h3 className="text-sm font-semibold text-stone-900">{r.title}</h3><Badge variant={cfg.color}>{r.status}</Badge></div>
                        <p className="text-sm text-stone-600 mb-2">{r.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-stone-400">
                          {isStaff && <span>{t.dashboard.from}: {r.clientName}</span>}
                          {r.facilityType && <span>{t.bookings.facility}: {r.facilityType}</span>}
                          {r.requestedDate && <span>{t.bookings.requestedDate}: {format(parseISO(r.requestedDate), 'MMM d, yyyy')}</span>}
                          <span>{t.bookings.submitted}: {format(parseISO(r.createdAt), 'MMM d, yyyy')}</span>
                        </div>
                        {r.adminNotes && <div className="mt-3 p-3 rounded-lg bg-stone-50 text-xs text-stone-600"><span className="font-medium">{t.bookings.adminNotes}:</span> {r.adminNotes}</div>}
                      </div>
                      {isStaff && r.status === 'pending' && (
                        <Button size="sm" variant="secondary" onClick={() => { setReviewModal(r.id); setAdminNotes(''); }}>{t.common.review}</Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t.bookings.submitRequest}>
          <div className="space-y-4">
            <Input label={t.bookings.requestTitle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={t.bookings.requestTitlePlaceholder} required />
            <Textarea label={t.tasks.description} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder={t.bookings.descriptionPlaceholder} required />
            <div className="grid grid-cols-2 gap-4">
              <Select label={t.bookings.facility} value={form.facilityType} onChange={(e) => setForm({ ...form, facilityType: e.target.value })}
                options={[{ value: 'arena', label: t.bookings.arena }, { value: 'paddock', label: t.bookings.paddockFacility }, { value: 'round-pen', label: t.bookings.roundPen }, { value: 'other', label: t.bookings.other }]} />
              <Input label={t.bookings.requestedDate} type="date" value={form.requestedDate} onChange={(e) => setForm({ ...form, requestedDate: e.target.value })} />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>{t.common.cancel}</Button>
              <Button onClick={submitRequest}>{t.common.submit}</Button>
            </div>
          </div>
        </Modal>

        <Modal open={!!reviewModal} onClose={() => setReviewModal(null)} title={t.bookings.reviewRequest}>
          {reviewing && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-stone-900">{reviewing.title}</h3>
                <p className="text-sm text-stone-600 mt-1">{reviewing.description}</p>
                <p className="text-xs text-stone-400 mt-2">{t.dashboard.from}: {reviewing.clientName} {reviewing.requestedDate && ` · ${format(parseISO(reviewing.requestedDate), 'MMM d, yyyy')}`}</p>
              </div>
              <Textarea label={t.bookings.adminNotes} value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder={t.bookings.adminNotesPlaceholder} />
              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <Button variant="danger" onClick={() => reviewRequest(reviewing.id, 'rejected')} icon={<XCircle size={16} />}>{t.common.reject}</Button>
                <Button variant="success" onClick={() => reviewRequest(reviewing.id, 'approved')} icon={<CheckCircle size={16} />}>{t.common.approve}</Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
