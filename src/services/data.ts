import type {
  User, Horse, Task, ClientRequest, Announcement, Transport, Notification,
} from '../types';

let _idCounter = Date.now();
function genId(): string { return (++_idCounter).toString(36); }

const today = () => new Date().toISOString().split('T')[0];
const daysFromNow = (n: number) => {
  const d = new Date(); d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
};

const SEED_USERS: User[] = [
  { id: 'u1', email: 'admin@admin.com', name: 'Admin', role: 'admin', phone: '+00 000 0000', password: 'admin', createdAt: '2024-01-01' },
];

const SEED_HORSES: Horse[] = [
  { id: 'h1', name: 'Storm', passportId: 'XX-000001', motherName: 'Breeze', ownerId: 'u1', ownerName: 'Admin', checkIn: daysFromNow(-5), checkOut: daysFromNow(10), stableType: 'shavings', stableLocation: 'stable-a', walkerSchedule: true, paddockSchedule: true, quarantine: false, status: 'checked-in', notes: 'Prefers morning paddock time' },
  { id: 'h2', name: 'Luna', passportId: 'XX-000002', motherName: 'Star', ownerId: 'u1', ownerName: 'Admin', checkIn: daysFromNow(-2), checkOut: daysFromNow(5), stableType: 'straw', stableLocation: 'pension-left', walkerSchedule: false, paddockSchedule: true, quarantine: true, quarantineStart: daysFromNow(-2), quarantineEnd: daysFromNow(5), status: 'checked-in', notes: 'In quarantine' },
  { id: 'h3', name: 'Thunder', passportId: 'XX-000003', motherName: 'Lightning', ownerId: 'u1', ownerName: 'Admin', checkIn: daysFromNow(1), checkOut: daysFromNow(14), stableType: 'shavings', stableLocation: 'stable-b', walkerSchedule: true, paddockSchedule: false, quarantine: false, status: 'upcoming', transportDestination: 'Destination City' },
];

const SEED_TASKS: Task[] = [
  { id: 't1', title: 'Prepare box for Thunder', description: 'Set up shavings box in stable B for Thunder arriving tomorrow.', horseId: 'h3', horseName: 'Thunder', assignedTo: 'u1', assignedToName: 'Admin', dueDate: daysFromNow(1), completed: false, priority: 'high', createdAt: today(), createdBy: 'u1' },
  { id: 't2', title: 'Luna quarantine check', description: 'Daily quarantine health check for Luna.', horseId: 'h2', horseName: 'Luna', assignedTo: 'u1', assignedToName: 'Admin', dueDate: today(), completed: false, priority: 'urgent', createdAt: today(), createdBy: 'u1' },
];

const SEED_ANNOUNCEMENTS: Announcement[] = [
  { id: 'a1', title: 'Welcome to the new system', content: 'We are excited to launch our new horse hotel management platform.', category: 'general', authorId: 'u1', authorName: 'Admin', pinned: true, createdAt: daysFromNow(-1) },
];

const STORAGE_KEY = 'horse_hotel_data_v3';

interface AppState {
  users: User[]; horses: Horse[]; tasks: Task[]; requests: ClientRequest[];
  announcements: Announcement[]; transports: Transport[]; notifications: Notification[];
}

function getInitialState(): AppState {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) { try { return JSON.parse(stored); } catch { /* */ } }
  return { users: SEED_USERS, horses: SEED_HORSES, tasks: SEED_TASKS, requests: [], announcements: SEED_ANNOUNCEMENTS, transports: [], notifications: [
    { id: 'n1', type: 'arrival', title: 'New Arrival Tomorrow', message: 'Thunder is arriving tomorrow.', read: false, createdAt: today(), link: '/app/horses' },
  ]};
}

let state: AppState = getInitialState();
function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

export function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  state = getInitialState();
  persist();
}

function create<T extends { id: string }>(key: keyof AppState, item: Omit<T, 'id'>): T {
  const newItem = { ...item, id: genId() } as T;
  (state[key] as T[]).unshift(newItem); persist(); return newItem;
}
function update<T extends { id: string }>(key: keyof AppState, id: string, updates: Partial<T>): T | undefined {
  const arr = state[key] as T[];
  const idx = arr.findIndex((item) => item.id === id);
  if (idx === -1) return undefined;
  arr[idx] = { ...arr[idx], ...updates }; persist(); return arr[idx];
}
function remove(key: keyof AppState, id: string): boolean {
  const arr = state[key] as { id: string }[];
  const idx = arr.findIndex((item) => item.id === id);
  if (idx === -1) return false; arr.splice(idx, 1); persist(); return true;
}

export const api = {
  getUsers: () => [...state.users],
  getUser: (id: string) => state.users.find((u) => u.id === id),
  getUserByEmail: (email: string) => state.users.find((u) => u.email === email),
  getUserByToken: (token: string) => state.users.find((u) => u.inviteToken === token),
  createUser: (u: Omit<User, 'id'>) => create<User>('users', u),
  updateUser: (id: string, u: Partial<User>) => update<User>('users', id, u),
  deleteUser: (id: string) => remove('users', id),

  getHorses: () => [...state.horses],
  getHorse: (id: string) => state.horses.find((h) => h.id === id),
  getHorsesByOwner: (ownerId: string) => state.horses.filter((h) => h.ownerId === ownerId),
  createHorse: (h: Omit<Horse, 'id'>) => create<Horse>('horses', h),
  updateHorse: (id: string, h: Partial<Horse>) => update<Horse>('horses', id, h),
  deleteHorse: (id: string) => remove('horses', id),

  getTasks: () => [...state.tasks],
  createTask: (t: Omit<Task, 'id'>) => create<Task>('tasks', t),
  updateTask: (id: string, t: Partial<Task>) => update<Task>('tasks', id, t),
  deleteTask: (id: string) => remove('tasks', id),

  getRequests: () => [...state.requests],
  getRequestsByClient: (clientId: string) => state.requests.filter((r) => r.clientId === clientId),
  createRequest: (r: Omit<ClientRequest, 'id'>) => create<ClientRequest>('requests', r),
  updateRequest: (id: string, r: Partial<ClientRequest>) => update<ClientRequest>('requests', id, r),

  getAnnouncements: () => [...state.announcements],
  createAnnouncement: (a: Omit<Announcement, 'id'>) => create<Announcement>('announcements', a),
  updateAnnouncement: (id: string, a: Partial<Announcement>) => update<Announcement>('announcements', id, a),
  deleteAnnouncement: (id: string) => remove('announcements', id),

  getTransports: () => [...state.transports],
  createTransport: (t: Omit<Transport, 'id'>) => create<Transport>('transports', t),
  updateTransport: (id: string, t: Partial<Transport>) => update<Transport>('transports', id, t),

  getNotifications: () => [...state.notifications],
  markNotificationRead: (id: string) => update<Notification>('notifications', id, { read: true }),
  markAllRead: () => { state.notifications.forEach((n) => (n.read = true)); persist(); },
  addNotification: (n: Omit<Notification, 'id'>) => create<Notification>('notifications', n),
};
