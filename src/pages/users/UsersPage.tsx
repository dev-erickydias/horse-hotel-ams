import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LangContext';
import { api } from '../../services/data';
import Header from '../../components/layout/Header';
import Card, { CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import type { Role } from '../../types';
import { Plus, Mail, Phone, Link2, Check, ExternalLink } from 'lucide-react';

const roleColors = { admin: 'danger', worker: 'info', client: 'success' } as const;

function generateToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default function UsersPage() {
  const { isRole } = useAuth();
  const { t } = useLang();
  const [modalOpen, setModalOpen] = useState(false);
  const [inviteModal, setInviteModal] = useState<{ link: string; email: string; name: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'worker' as Role, phone: '' });
  const [tick, setTick] = useState(0);
  const users = (() => { void tick; return api.getUsers(); })();
  const isAdmin = isRole('admin');

  const save = () => {
    if (!form.name || !form.email) return;
    const token = generateToken();
    const newUser = api.createUser({
      ...form,
      password: undefined,
      inviteToken: token,
      createdAt: new Date().toISOString().split('T')[0],
    });

    const baseUrl = window.location.origin;
    const link = `${baseUrl}/set-password/${token}`;

    // Open mailto with invitation
    const subject = encodeURIComponent(`Welcome to Horse Hotel - Set Your Password`);
    const body = encodeURIComponent(
      `Hello ${form.name},\n\nYou have been invited to the Horse Hotel management system.\n\nPlease click the link below to set your password:\n${link}\n\nBest regards,\nHorse Hotel Team`
    );
    window.open(`mailto:${form.email}?subject=${subject}&body=${body}`, '_blank');

    setModalOpen(false);
    setForm({ name: '', email: '', role: 'worker', phone: '' });
    setInviteModal({ link, email: form.email, name: form.name });
    setTick((x) => x + 1);
  };

  const copyLink = () => {
    if (inviteModal) {
      navigator.clipboard.writeText(inviteModal.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const roleLabels: Record<string, string> = { admin: t.users.admin, worker: t.users.worker, client: t.users.client };

  return (
    <div>
      <Header title={t.users.title} />
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <p className="text-sm text-stone-500">{users.length} {t.users.registeredUsers}</p>
          {isAdmin && <Button onClick={() => setModalOpen(true)} icon={<Plus size={16} />}>{t.users.addUser}</Button>}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {users.map((u) => (
            <Card key={u.id} hover>
              <CardBody>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-lg shrink-0">{u.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-stone-900 truncate">{u.name}</h3>
                      <Badge variant={roleColors[u.role]}>{roleLabels[u.role]}</Badge>
                      {u.inviteToken && !u.password && <Badge variant="warning">{t.users.pendingInvite}</Badge>}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-stone-400 mt-1"><Mail size={12} /><span className="truncate">{u.email}</span></div>
                    {u.phone && <div className="flex items-center gap-1 text-xs text-stone-400 mt-0.5"><Phone size={12} /> {u.phone}</div>}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Create User Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t.users.createUser}>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700">
              An invitation email will be sent to the user so they can set their own password.
            </div>
            <Input label={t.users.fullName} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label={t.users.email} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <Select label={t.users.role} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                options={[{ value: 'worker', label: t.users.worker }, { value: 'client', label: t.users.client }, { value: 'admin', label: t.users.admin }]} />
              <Input label={t.users.phone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>{t.common.cancel}</Button>
              <Button onClick={save} icon={<Mail size={16} />}>{t.users.createUser}</Button>
            </div>
          </div>
        </Modal>

        {/* Invite Link Modal */}
        <Modal open={!!inviteModal} onClose={() => { setInviteModal(null); setCopied(false); }} title={t.users.inviteLink}>
          {inviteModal && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-sm text-emerald-700">
                {t.users.inviteSent}
              </div>
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                <p className="text-xs text-stone-500 mb-1">{t.users.inviteLink}:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-white px-3 py-2 rounded border border-stone-200 overflow-x-auto whitespace-nowrap">{inviteModal.link}</code>
                  <Button size="sm" variant="secondary" onClick={copyLink} icon={copied ? <Check size={14} /> : <Link2 size={14} />}>
                    {copied ? t.users.linkCopied : t.users.copyLink}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-stone-400">
                {inviteModal.name} ({inviteModal.email})
              </p>
              <div className="flex justify-end pt-2">
                <Button variant="secondary" onClick={() => { setInviteModal(null); setCopied(false); }}>{t.common.cancel}</Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
