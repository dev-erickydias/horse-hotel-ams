import { useState, useMemo } from 'react';
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
import { Plus, Mail, Phone, UserCheck, UserX, Clock, Trash2, UserPlus, Search, Slack, Shield } from 'lucide-react';

const roleColors = { admin: 'danger', worker: 'info', client: 'success' } as const;

export default function UsersPage() {
  const { isRole } = useAuth();
  const { t } = useLang();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'worker' as Role, phone: '', password: '' });
  const [approveRole, setApproveRole] = useState<Record<string, Role>>({});
  const [editRoleUser, setEditRoleUser] = useState<string | null>(null);
  const [editRoleValue, setEditRoleValue] = useState<Role>('client');
  const [search, setSearch] = useState('');
  const [tick, setTick] = useState(0);
  const allUsers = (() => { void tick; return api.getUsers(); })();
  const allHorses = (() => { void tick; return api.getHorses(); })();
  const pendingUsers = allUsers.filter((u) => u.status === 'pending');
  const isAdmin = isRole('admin');

  // Filter users: by name, email, horse name, or passport ID
  const users = useMemo(() => {
    let list = allUsers.filter((u) => u.status !== 'pending');
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((u) => {
        // Match by user name or email
        if (u.name.toLowerCase().includes(q)) return true;
        if (u.email.toLowerCase().includes(q)) return true;
        if (u.phone && u.phone.toLowerCase().includes(q)) return true;
        // Match by horse name or passport ID linked to this user
        const userHorses = allHorses.filter((h) => h.ownerId === u.id);
        if (userHorses.some((h) => h.name.toLowerCase().includes(q))) return true;
        if (userHorses.some((h) => h.passportId.toLowerCase().includes(q))) return true;
        return false;
      });
    }
    return list;
  }, [allUsers, allHorses, search]);

  // Get horse names for a user
  const getUserHorses = (userId: string) => allHorses.filter((h) => h.ownerId === userId);

  const handleApprove = (userId: string) => {
    const role = approveRole[userId] || 'client';
    api.updateUser(userId, { status: 'active', role });
    api.addNotification({
      type: 'registration',
      title: t.users.userApproved,
      message: `User approved with role: ${role}`,
      read: false,
      createdAt: new Date().toISOString(),
      link: '/app/users',
      audience: 'staff',
    });
    setTick((x) => x + 1);
  };

  const handleReject = (userId: string) => {
    api.deleteUser(userId);
    setTick((x) => x + 1);
  };

  const save = () => {
    if (!form.name || !form.email || !form.password) return;
    api.createUser({
      name: form.name,
      email: form.email,
      role: form.role,
      phone: form.phone || undefined,
      password: form.password,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    });
    setModalOpen(false);
    setForm({ name: '', email: '', role: 'worker', phone: '', password: '' });
    setSearch('');
    setTick((x) => x + 1);
  };

  const handleChangeRole = (userId: string) => {
    api.updateUser(userId, { role: editRoleValue });
    setEditRoleUser(null);
    setTick((x) => x + 1);
  };

  const roleLabels: Record<string, string> = { admin: t.users.admin, worker: t.users.worker, client: t.users.client };

  return (
    <div>
      <Header title={t.users.title} />
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder={t.users.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-stone-200 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
              />
            </div>
            <p className="text-sm text-stone-500 shrink-0">{users.length} {t.users.registeredUsers}</p>
          </div>
          {isAdmin && <Button onClick={() => setModalOpen(true)} icon={<Plus size={16} />}>{t.users.addUser}</Button>}
        </div>

        {/* Pending Approvals Section */}
        {isAdmin && pendingUsers.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-stone-700">{t.users.pendingApprovals}</h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">{pendingUsers.length}</span>
            </div>
            <p className="text-xs text-stone-500">{t.users.pendingApprovalsDesc}</p>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {pendingUsers.map((u) => (
                <Card key={u.id} hover>
                  <CardBody>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-600 font-bold text-lg shrink-0">
                        <Clock size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-stone-900 truncate">{u.name}</h3>
                          <Badge variant="warning">{t.users.pendingApproval}</Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-stone-400 mt-1"><Mail size={12} /><span className="truncate">{u.email}</span></div>
                        {u.phone && <div className="flex items-center gap-1 text-xs text-stone-400 mt-0.5"><Phone size={12} /> {u.phone}</div>}
                        <div className="text-xs text-stone-400 mt-0.5">{t.users.registeredOn}: {u.createdAt}</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-stone-100 space-y-3">
                      <Select
                        label={t.users.assignRole}
                        value={approveRole[u.id] || 'client'}
                        onChange={(e) => setApproveRole({ ...approveRole, [u.id]: e.target.value as Role })}
                        options={[
                          { value: 'client', label: t.users.client },
                          { value: 'worker', label: t.users.worker },
                          { value: 'admin', label: t.users.admin },
                        ]}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApprove(u.id)} icon={<UserCheck size={14} />} className="flex-1">
                          {t.users.approveUser}
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleReject(u.id)} icon={<UserX size={14} />} className="flex-1">
                          {t.users.rejectUser}
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {users.map((u) => {
            const horses = getUserHorses(u.id);
            return (
              <Card key={u.id} hover>
                <CardBody>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-lg shrink-0">{u.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-stone-900 truncate">{u.name}</h3>
                        <Badge variant={roleColors[u.role]}>{roleLabels[u.role]}</Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-stone-400 mt-1"><Mail size={12} /><span className="truncate">{u.email}</span></div>
                      {u.phone && <div className="flex items-center gap-1 text-xs text-stone-400 mt-0.5"><Phone size={12} /> {u.phone}</div>}
                    </div>
                  </div>
                  {/* Show linked horses */}
                  {horses.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-stone-100">
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                        <Slack size={12} />
                        <span className="font-medium">{t.users.linkedHorses}:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {horses.map((h) => (
                          <span key={h.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                            {h.name} <span className="text-amber-400 font-mono text-[10px]">{h.passportId}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Admin actions: change role & delete */}
                  {isAdmin && u.id !== 'u1' && (
                    <div className="mt-3 pt-2 border-t border-stone-100 space-y-2">
                      {editRoleUser === u.id ? (
                        <div className="flex items-center gap-2">
                          <Select
                            label=""
                            value={editRoleValue}
                            onChange={(e) => setEditRoleValue(e.target.value as Role)}
                            options={[
                              { value: 'client', label: t.users.client },
                              { value: 'worker', label: t.users.worker },
                              { value: 'admin', label: t.users.admin },
                            ]}
                          />
                          <Button size="sm" onClick={() => handleChangeRole(u.id)}>{t.common.save}</Button>
                          <Button size="sm" variant="secondary" onClick={() => setEditRoleUser(null)}>{t.common.cancel}</Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" icon={<Shield size={14} />}
                            onClick={() => { setEditRoleUser(u.id); setEditRoleValue(u.role); }}>
                            {t.users.changeRole}
                          </Button>
                          <Button size="sm" variant="ghost" icon={<Trash2 size={14} />}
                            onClick={() => { if (confirm(t.common.confirmDelete)) { api.deleteUser(u.id); setTick((x) => x + 1); } }}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            {t.users.deleteUser}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Create User Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t.users.createUser}>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700">
              {t.users.createUserInfo}
            </div>
            <Input label={t.users.fullName} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label={t.users.email} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label={t.users.password} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={t.users.passwordPlaceholder} required />
            <div className="grid grid-cols-2 gap-4">
              <Select label={t.users.role} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                options={[{ value: 'worker', label: t.users.worker }, { value: 'client', label: t.users.client }, { value: 'admin', label: t.users.admin }]} />
              <Input label={t.users.phone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>{t.common.cancel}</Button>
              <Button onClick={save} icon={<UserPlus size={16} />}>{t.users.createUser}</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
