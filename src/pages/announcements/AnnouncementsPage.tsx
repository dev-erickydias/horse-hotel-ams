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
import { format, parseISO } from 'date-fns';
import { Plus, Megaphone, Pin } from 'lucide-react';

const categoryColors = { general: 'default', maintenance: 'warning', transport: 'info', important: 'danger' } as const;

export default function AnnouncementsPage() {
  const { user, isStaff } = useAuth();
  const { t } = useLang();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'general' as 'general' | 'maintenance' | 'transport' | 'important', pinned: false });
  const [tick, setTick] = useState(0);
  const announcements = useMemo(() => { const all = api.getAnnouncements(); return [...all.filter((a) => a.pinned), ...all.filter((a) => !a.pinned)]; }, [tick]);

  const save = () => {
    if (!form.title || !form.content) return;
    api.createAnnouncement({ ...form, authorId: user!.id, authorName: user!.name, createdAt: new Date().toISOString().split('T')[0] });
    setModalOpen(false); setForm({ title: '', content: '', category: 'general', pinned: false }); setTick((x) => x + 1);
  };

  const catLabels: Record<string, string> = { general: t.announcements.general, maintenance: t.announcements.maintenance, transport: t.announcements.transportCat, important: t.announcements.important };

  return (
    <div>
      <Header title={t.announcements.title} />
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <p className="text-sm text-stone-500">{t.announcements.subtitle}</p>
          {isStaff && <Button onClick={() => setModalOpen(true)} icon={<Plus size={16} />}>{t.announcements.newPost}</Button>}
        </div>
        {announcements.length === 0 ? (
          <EmptyState icon={<Megaphone size={24} />} title={t.announcements.noAnnouncements} description={t.announcements.noAnnouncementsDesc} />
        ) : (
          <div className="space-y-4 max-w-3xl">
            {announcements.map((a) => (
              <Card key={a.id} className={a.pinned ? 'border-amber-200 bg-amber-50/30' : ''}>
                <CardBody className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {a.pinned && <Pin size={14} className="text-amber-500" />}
                      <h3 className="text-base font-semibold text-stone-900">{a.title}</h3>
                    </div>
                    <Badge variant={categoryColors[a.category]}>{catLabels[a.category]}</Badge>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">{a.content}</p>
                  <div className="flex items-center gap-4 text-xs text-stone-400 pt-2 border-t border-stone-100">
                    <span>{t.announcements.by}: {a.authorName}</span>
                    <span>{format(parseISO(a.createdAt), 'MMMM d, yyyy')}</span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t.announcements.createAnnouncement}>
          <div className="space-y-4">
            <Input label={t.announcements.announcementTitle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Textarea label={t.announcements.content} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            <Select label={t.announcements.category} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as typeof form.category })}
              options={[{ value: 'general', label: t.announcements.general }, { value: 'maintenance', label: t.announcements.maintenance }, { value: 'transport', label: t.announcements.transportCat }, { value: 'important', label: t.announcements.important }]} />
            <Toggle label={t.announcements.pinPost} checked={form.pinned} onChange={(v) => setForm({ ...form, pinned: v })} />
            <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>{t.common.cancel}</Button>
              <Button onClick={save}>{t.announcements.publish}</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
