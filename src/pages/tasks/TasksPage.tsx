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
import { Input, Textarea, Select } from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import type { Task, TaskPriority } from '../../types';
import { format, parseISO, isToday } from 'date-fns';
import { Plus, CheckCircle2, Circle, ClipboardList, Calendar } from 'lucide-react';

const priorityColors = { low: 'default', medium: 'info', high: 'warning', urgent: 'danger' } as const;

export default function TasksPage() {
  const { user } = useAuth();
  const { t } = useLang();
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', horseId: '', assignedTo: '', dueDate: '', priority: 'medium' as TaskPriority });
  const [formError, setFormError] = useState('');
  const rev = useData('*');

  const tasks = useMemo(() => { const all = api.getTasks(); return tab === 'active' ? all.filter((x) => !x.completed) : all.filter((x) => x.completed); }, [tab, rev]);
  const todayTasks = tasks.filter((x) => isToday(parseISO(x.dueDate)));
  const otherTasks = tasks.filter((x) => !isToday(parseISO(x.dueDate)));
  const workers = api.getUsers().filter((u) => u.role === 'worker' || u.role === 'admin');
  const horses = api.getHorses();

  const toggleComplete = (id: string, current: boolean) => { api.updateTask(id, { completed: !current }); };
  const save = () => {
    if (!form.title || !form.dueDate || !form.assignedTo) { setFormError(t.common.fillRequired || 'Please fill in all required fields.'); return; }
    setFormError('');
    const worker = workers.find((w) => w.id === form.assignedTo);
    const horse = horses.find((h) => h.id === form.horseId);
    api.createTask({ ...form, assignedToName: worker?.name || '', horseName: horse?.name, completed: false, createdAt: new Date().toISOString().split('T')[0], createdBy: user!.id });
    setModalOpen(false); setForm({ title: '', description: '', horseId: '', assignedTo: '', dueDate: '', priority: 'medium' });
  };

  const renderTask = (x: Task) => (
    <div key={x.id} className="flex items-start gap-4 py-4 border-b border-cream-200 last:border-0 group">
      <button onClick={() => toggleComplete(x.id, x.completed)} className={`mt-0.5 shrink-0 transition-colors ${x.completed ? 'text-emerald-500' : 'text-stone-300 hover:text-gold-400'}`}>
        {x.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`text-sm font-medium ${x.completed ? 'text-stone-400 line-through' : 'text-stone-800'}`}>{x.title}</p>
          <Badge variant={priorityColors[x.priority]}>{x.priority}</Badge>
          {x.horseName && <Badge variant="purple">{x.horseName}</Badge>}
        </div>
        {x.description && <p className="text-xs text-stone-500 mt-1 line-clamp-2">{x.description}</p>}
        <div className="flex items-center gap-4 mt-2 text-xs text-stone-400">
          <span>{t.dashboard.assignedTo}: {x.assignedToName}</span>
          <span className="flex items-center gap-1"><Calendar size={12} /> {format(parseISO(x.dueDate), 'MMM d, yyyy')}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Header title={t.tasks.title} />
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-cream-200 rounded-lg p-0.5">
            <button onClick={() => setTab('active')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === 'active' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}>{t.common.active}</button>
            <button onClick={() => setTab('completed')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === 'completed' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}>{t.common.completed}</button>
          </div>
          <Button onClick={() => setModalOpen(true)} icon={<Plus size={16} />}>{t.tasks.newTask}</Button>
        </div>

        {tasks.length === 0 ? (
          <EmptyState icon={<ClipboardList size={24} />} title={tab === 'active' ? t.tasks.allCaughtUp : t.tasks.completedTasks} description={tab === 'active' ? t.tasks.noActiveTasks : t.tasks.noCompletedTasks} />
        ) : (
          <div className="space-y-6">
            {tab === 'active' && todayTasks.length > 0 && (
              <Card>
                <div className="px-5 py-3 border-b border-cream-200 bg-gold-50/50"><h3 className="text-sm font-semibold text-forest-800">{t.tasks.todaysTasks} ({todayTasks.length})</h3></div>
                <CardBody>{todayTasks.map(renderTask)}</CardBody>
              </Card>
            )}
            <Card>
              <div className="px-5 py-3 border-b border-cream-200"><h3 className="text-sm font-semibold text-stone-700">{tab === 'active' ? (todayTasks.length > 0 ? t.tasks.upcomingTasks : t.tasks.allActive) : t.tasks.completedTasks}</h3></div>
              <CardBody>{(tab === 'active' && todayTasks.length > 0 ? otherTasks : tasks).map(renderTask)}</CardBody>
            </Card>
          </div>
        )}

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t.tasks.createTask}>
          <div className="space-y-4">
            <Input label={t.tasks.taskTitle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Textarea label={t.tasks.description} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Select label={t.tasks.assignTo} value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                options={[{ value: '', label: t.tasks.selectWorker }, ...workers.map((w) => ({ value: w.id, label: w.name }))]} />
              <Select label={t.tasks.relatedHorse} value={form.horseId} onChange={(e) => setForm({ ...form, horseId: e.target.value })}
                options={[{ value: '', label: t.common.none }, ...horses.map((h) => ({ value: h.id, label: h.name }))]} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label={t.tasks.dueDate} type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
              <Select label={t.tasks.priority} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}
                options={[{ value: 'low', label: t.tasks.low }, { value: 'medium', label: t.tasks.medium }, { value: 'high', label: t.tasks.high }, { value: 'urgent', label: t.tasks.urgent }]} />
            </div>
            {formError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{formError}</div>}
            <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
              <Button variant="secondary" onClick={() => { setModalOpen(false); setFormError(''); }}>{t.common.cancel}</Button>
              <Button onClick={save}>{t.tasks.createTask}</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
