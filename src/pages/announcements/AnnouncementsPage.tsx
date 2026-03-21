import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LangContext';
import { api } from '../../services/data';
import { useData } from '../../hooks/useData';
import Header from '../../components/layout/Header';
import Card, { CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Input, Textarea, Select, Toggle } from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import type { AnnouncementAudience } from '../../types';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Plus, Megaphone, Pin, Eye, Archive, RotateCcw, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const categoryColors = { general: 'default', maintenance: 'warning', transport: 'info', important: 'danger' } as const;
const audienceColors = { all: 'default', staff: 'info', clients: 'success' } as const;

export default function AnnouncementsPage() {
  const { user, isStaff, isRole } = useAuth();
  const { t } = useLang();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'general' as 'general' | 'maintenance' | 'transport' | 'important', audience: 'all' as AnnouncementAudience, pinned: false });
  const rev = useData('*');
  const [showArchived, setShowArchived] = useState(false);

  const isAdmin = isRole('admin');
  const isWorker = isRole('worker');

  // Active announcements filtered by role
  const announcements = useMemo(() => {
    const all = user ? api.getAnnouncementsForRole(user.role) : [];
    return [...all.filter((a) => a.pinned), ...all.filter((a) => !a.pinned)];
  }, [rev, user]);

  // Archived announcements (staff only)
  const archivedAnnouncements = useMemo(() => {
    if (!isStaff) return [];
    return api.getArchivedAnnouncements();
  }, [rev, isStaff]);

  const save = () => {
    if (!form.title || !form.content) return;
    const audience = isWorker && form.audience === 'clients' ? 'all' : form.audience;
    api.createAnnouncement({ ...form, audience, authorId: user!.id, authorName: user!.name, createdAt: new Date().toISOString().split('T')[0] });
    api.addNotification({
      type: 'announcement',
      title: form.title,
      message: form.content.substring(0, 100),
      read: false,
      createdAt: new Date().toISOString(),
      link: '/app/announcements',
      audience: audience,
    });
    setModalOpen(false); setForm({ title: '', content: '', category: 'general', audience: 'all', pinned: false });
  };

  const handleArchive = (id: string) => {
    api.archiveAnnouncement(id);
   
  };

  const handleRestore = (id: string) => {
    api.restoreAnnouncement(id);
   
  };

  const handleDeletePermanently = (id: string) => {
    if (!confirm(t.common.confirmDelete)) return;
    api.deleteAnnouncement(id);
   
  };

  const daysUntilPurge = (archivedAt?: string) => {
    if (!archivedAt) return 10;
    const days = 10 - differenceInDays(new Date(), new Date(archivedAt));
    return Math.max(0, days);
  };

  const catLabels: Record<string, string> = { general: t.announcements.general, maintenance: t.announcements.maintenance, transport: t.announcements.transportCat, important: t.announcements.important };
  const audienceLabels: Record<string, string> = { all: t.announcements.audienceAll, staff: t.announcements.audienceStaff, clients: t.announcements.audienceClients };

  const audienceOptions = isAdmin
    ? [{ value: 'all', label: t.announcements.audienceAll }, { value: 'staff', label: t.announcements.audienceStaff }, { value: 'clients', label: t.announcements.audienceClients }]
    : [{ value: 'all', label: t.announcements.audienceAll }, { value: 'staff', label: t.announcements.audienceStaff }];

  return (
    <div>
      <Header title={t.announcements.title} />
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <p className="text-sm text-stone-500">{t.announcements.subtitle}</p>
          {isStaff && <Button onClick={() => setModalOpen(true)} icon={<Plus size={16} />}>{t.announcements.newPost}</Button>}
        </div>

        {/* Active announcements */}
        {announcements.length === 0 ? (
          <EmptyState icon={<Megaphone size={24} />} title={t.announcements.noAnnouncements} description={t.announcements.noAnnouncementsDesc} />
        ) : (
          <div className="space-y-4 max-w-3xl">
            {announcements.map((a) => (
              <Card key={a.id} className={a.pinned ? 'border-gold-200 bg-gold-50/30' : ''}>
                <CardBody className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {a.pinned && <Pin size={14} className="text-gold-400" />}
                      <h3 className="text-base font-semibold text-stone-800">{a.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {isStaff && a.audience && a.audience !== 'all' && (
                        <Badge variant={audienceColors[a.audience]}>
                          <span className="flex items-center gap-1"><Eye size={10} /> {audienceLabels[a.audience] || a.audience}</span>
                        </Badge>
                      )}
                      <Badge variant={categoryColors[a.category]}>{catLabels[a.category]}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">{a.content}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-cream-200">
                    <div className="flex items-center gap-4 text-xs text-stone-400">
                      <span>{t.announcements.by}: {a.authorName}</span>
                      <span>{format(parseISO(a.createdAt), 'MMMM d, yyyy')}</span>
                    </div>
                    {isStaff && (
                      <button
                        onClick={() => handleArchive(a.id)}
                        className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-forest-600 transition-colors px-2 py-1 rounded hover:bg-gold-50"
                      >
                        <Archive size={13} /> {t.announcements.archive}
                      </button>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Archived section — staff only */}
        {isStaff && archivedAnnouncements.length > 0 && (
          <div className="max-w-3xl">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-stone-700 transition-colors mb-3"
            >
              <Archive size={16} />
              {t.announcements.archivedSection} ({archivedAnnouncements.length})
              {showArchived ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showArchived && (
              <div className="space-y-3">
                <p className="text-xs text-stone-400">{t.announcements.archivedInfo}</p>
                {archivedAnnouncements.map((a) => {
                  const remaining = daysUntilPurge(a.archivedAt);
                  return (
                    <Card key={a.id} className="opacity-70 border-dashed">
                      <CardBody className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-sm font-semibold text-stone-700">{a.title}</h3>
                            <p className="text-xs text-stone-500 mt-1 line-clamp-2">{a.content}</p>
                          </div>
                          <Badge variant={categoryColors[a.category]}>{catLabels[a.category]}</Badge>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-cream-200">
                          <div className="flex items-center gap-3 text-xs text-stone-400">
                            <span>{t.announcements.by}: {a.authorName}</span>
                            <span className={`font-medium ${remaining <= 3 ? 'text-red-500' : 'text-gold-400'}`}>
                              {remaining} {t.announcements.daysLeft}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleRestore(a.id)}
                              className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 transition-colors px-2 py-1 rounded hover:bg-emerald-50"
                            >
                              <RotateCcw size={12} /> {t.announcements.restore}
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => handleDeletePermanently(a.id)}
                                className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50"
                              >
                                <Trash2 size={12} /> {t.announcements.deletePermanently}
                              </button>
                            )}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t.announcements.createAnnouncement}>
          <div className="space-y-4">
            <Input label={t.announcements.announcementTitle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Textarea label={t.announcements.content} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <Select label={t.announcements.category} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as typeof form.category })}
                options={[{ value: 'general', label: t.announcements.general }, { value: 'maintenance', label: t.announcements.maintenance }, { value: 'transport', label: t.announcements.transportCat }, { value: 'important', label: t.announcements.important }]} />
              <Select label={t.announcements.audience} value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value as AnnouncementAudience })}
                options={audienceOptions} />
            </div>
            <Toggle label={t.announcements.pinPost} checked={form.pinned} onChange={(v) => setForm({ ...form, pinned: v })} />
            <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>{t.common.cancel}</Button>
              <Button onClick={save}>{t.announcements.publish}</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
