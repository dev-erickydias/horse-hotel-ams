import type {
  User, Horse, Task, ClientRequest, Announcement, Transport, Notification, ScheduleEvent,
} from '../types';
import { sanitizeObject } from '../utils/sanitize';
import { supabase, isSupabaseConfigured } from './supabase';

// ── Table names ─────────────────────────────────────────────
const T = {
  users: 'horse_hotel_users',
  horses: 'horse_hotel_horses',
  tasks: 'horse_hotel_tasks',
  requests: 'horse_hotel_requests',
  announcements: 'horse_hotel_announcements',
  transports: 'horse_hotel_transports',
  notifications: 'horse_hotel_notifications',
} as const;

// ── Snake ↔ Camel conversion ────────────────────────────────
function snakeToCamel(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

function camelToSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    const snakeKey = key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
}

// ── In-memory state (cache) ─────────────────────────────────
interface AppState {
  users: User[]; horses: Horse[]; tasks: Task[]; requests: ClientRequest[];
  announcements: Announcement[]; transports: Transport[]; notifications: Notification[];
}

let state: AppState = {
  users: [], horses: [], tasks: [], requests: [],
  announcements: [], transports: [], notifications: [],
};

let _initialized = false;
let _initPromise: Promise<void> | null = null;

// ── Initialize: fetch all from Supabase ─────────────────────
export async function initializeData(): Promise<void> {
  if (_initialized) return;
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    try {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured — running with empty state.');
        _initialized = true;
        return;
      }

      const results = await Promise.all([
        supabase.from(T.users).select('*').order('created_at', { ascending: false }),
        supabase.from(T.horses).select('*').order('created_at', { ascending: false }),
        supabase.from(T.tasks).select('*').order('created_at', { ascending: false }),
        supabase.from(T.requests).select('*').order('created_at', { ascending: false }),
        supabase.from(T.announcements).select('*').order('created_at', { ascending: false }),
        supabase.from(T.transports).select('*').order('created_at', { ascending: false }),
        supabase.from(T.notifications).select('*').order('created_at', { ascending: false }),
      ]);

      const [users, horses, tasks, requests, announcements, transports, notifications] = results;

      // Log any Supabase errors
      results.forEach((r, i) => {
        if (r.error) console.error(`[Supabase] Error loading table ${Object.values(T)[i]}:`, r.error);
      });

      state.users = (users.data || []).map((r) => snakeToCamel(r) as unknown as User);
      state.horses = (horses.data || []).map((r) => snakeToCamel(r) as unknown as Horse);
      state.tasks = (tasks.data || []).map((r) => snakeToCamel(r) as unknown as Task);
      state.requests = (requests.data || []).map((r) => snakeToCamel(r) as unknown as ClientRequest);
      state.announcements = (announcements.data || []).map((r) => snakeToCamel(r) as unknown as Announcement);
      state.transports = (transports.data || []).map((r) => snakeToCamel(r) as unknown as Transport);
      state.notifications = (notifications.data || []).map((r) => snakeToCamel(r) as unknown as Notification);

      console.info(`[DataInit] Loaded ${state.users.length} users, ${state.horses.length} horses, ${state.tasks.length} tasks`);

      _initialized = true;
    } catch (err) {
      console.error('Failed to initialize data from Supabase:', err);
      _initialized = true; // still mark as initialized so app doesn't hang
    }
  })();

  return _initPromise;
}

export function isDataReady(): boolean {
  return _initialized;
}

// ── Async DB helpers (fire-and-forget) ──────────────────────
function dbInsert(table: string, data: Record<string, unknown>) {
  if (!isSupabaseConfigured) return;
  const snakeData = camelToSnake(data);
  supabase.from(table).insert(snakeData).then(({ error }) => {
    if (error) console.error(`[Supabase] Insert error on ${table}:`, error);
  });
}

function dbUpdate(table: string, id: string, data: Record<string, unknown>) {
  if (!isSupabaseConfigured) return;
  const snakeData = camelToSnake(data);
  delete snakeData.id;
  supabase.from(table).update(snakeData).eq('id', id).then(({ error }) => {
    if (error) console.error(`[Supabase] Update error on ${table}:`, error);
  });
}

function dbDelete(table: string, id: string) {
  if (!isSupabaseConfigured) return;
  supabase.from(table).delete().eq('id', id).then(({ error }) => {
    if (error) console.error(`[Supabase] Delete error on ${table}:`, error);
  });
}

// ── Sync CRUD (cache-first, write-through to Supabase) ──────
function create<T extends { id: string }>(key: keyof AppState, table: string, item: Omit<T, 'id'>): T {
  const sanitized = sanitizeObject(item);
  const id = crypto.randomUUID();
  const newItem = { ...sanitized, id } as T;
  (state[key] as T[]).unshift(newItem);
  dbInsert(table, { ...sanitized, id });
  return newItem;
}

function update<T extends { id: string }>(key: keyof AppState, table: string, id: string, updates: Partial<T>): T | undefined {
  const arr = state[key] as T[];
  const idx = arr.findIndex((item) => item.id === id);
  if (idx === -1) return undefined;
  const sanitized = sanitizeObject(updates);
  arr[idx] = { ...arr[idx], ...sanitized };
  dbUpdate(table, id, sanitized as Record<string, unknown>);
  return arr[idx];
}

function remove(key: keyof AppState, table: string, id: string): boolean {
  const arr = state[key] as { id: string }[];
  const idx = arr.findIndex((item) => item.id === id);
  if (idx === -1) return false;
  arr.splice(idx, 1);
  dbDelete(table, id);
  return true;
}

// ── Reset: clear Supabase data (dangerous) ──────────────────
export function resetData() {
  // Clear all tables in Supabase
  Object.values(T).forEach((table) => {
    supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000').then(() => {});
  });
  state = { users: [], horses: [], tasks: [], requests: [], announcements: [], transports: [], notifications: [] };
}

// ── Public API ──────────────────────────────────────────────
export const api = {
  // ── Users ──
  getUsers: () => [...state.users],
  getUser: (id: string) => state.users.find((u) => u.id === id),
  getUserByEmail: (email: string) => state.users.find((u) => u.email === email),
  getUserByToken: (token: string) => state.users.find((u) => u.inviteToken === token),
  getUserBySessionToken: (token: string) => state.users.find((u) => u.sessionToken === token),
  createUser: (u: Omit<User, 'id'>) => create<User>('users', T.users, u),
  updateUser: (id: string, u: Partial<User>) => update<User>('users', T.users, id, u),
  deleteUser: (id: string) => remove('users', T.users, id),

  // ── Horses ──
  getHorses: () => [...state.horses],
  getHorse: (id: string) => state.horses.find((h) => h.id === id),
  getHorsesByOwner: (ownerId: string) => state.horses.filter((h) => h.ownerId === ownerId),
  createHorse: (h: Omit<Horse, 'id'>) => create<Horse>('horses', T.horses, h),
  updateHorse: (id: string, h: Partial<Horse>) => update<Horse>('horses', T.horses, id, h),
  deleteHorse: (id: string) => remove('horses', T.horses, id),

  // ── Tasks ──
  getTasks: () => [...state.tasks],
  createTask: (t: Omit<Task, 'id'>) => create<Task>('tasks', T.tasks, t),
  updateTask: (id: string, t: Partial<Task>) => update<Task>('tasks', T.tasks, id, t),
  deleteTask: (id: string) => remove('tasks', T.tasks, id),

  // ── Client Requests ──
  getRequests: () => [...state.requests],
  getRequestsByClient: (clientId: string) => state.requests.filter((r) => r.clientId === clientId),
  createRequest: (r: Omit<ClientRequest, 'id'>) => create<ClientRequest>('requests', T.requests, r),
  updateRequest: (id: string, r: Partial<ClientRequest>) => update<ClientRequest>('requests', T.requests, id, r),

  // ── Announcements ──
  getAnnouncements: () => [...state.announcements],
  getAnnouncementsForRole: (role: string) => {
    // Auto-purge archived announcements older than 10 days
    const tenDaysAgo = new Date(); tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    const tenDaysAgoStr = tenDaysAgo.toISOString();
    const toDelete = state.announcements.filter((a) => a.archived && a.archivedAt && a.archivedAt < tenDaysAgoStr);
    toDelete.forEach((a) => remove('announcements', T.announcements, a.id));

    return state.announcements.filter((a) => {
      if (a.archived) return false;
      if (!a.audience || a.audience === 'all') return true;
      if (a.audience === 'staff' && (role === 'admin' || role === 'worker')) return true;
      if (a.audience === 'clients' && role === 'client') return true;
      return false;
    });
  },
  getArchivedAnnouncements: () => {
    const tenDaysAgo = new Date(); tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    const tenDaysAgoStr = tenDaysAgo.toISOString();
    const toDelete = state.announcements.filter((a) => a.archived && a.archivedAt && a.archivedAt < tenDaysAgoStr);
    toDelete.forEach((a) => remove('announcements', T.announcements, a.id));
    return state.announcements.filter((a) => a.archived);
  },
  archiveAnnouncement: (id: string) => update<Announcement>('announcements', T.announcements, id, { archived: true, archivedAt: new Date().toISOString() }),
  restoreAnnouncement: (id: string) => update<Announcement>('announcements', T.announcements, id, { archived: false, archivedAt: undefined }),
  createAnnouncement: (a: Omit<Announcement, 'id'>) => create<Announcement>('announcements', T.announcements, a),
  updateAnnouncement: (id: string, a: Partial<Announcement>) => update<Announcement>('announcements', T.announcements, id, a),
  deleteAnnouncement: (id: string) => remove('announcements', T.announcements, id),

  // ── Transports ──
  getTransports: () => [...state.transports],
  createTransport: (t: Omit<Transport, 'id'>) => create<Transport>('transports', T.transports, t),
  updateTransport: (id: string, t: Partial<Transport>) => update<Transport>('transports', T.transports, id, t),

  // ── Notifications ──
  getNotifications: () => [...state.notifications],
  getNotificationsForUser: (userId: string, role: string) => {
    return state.notifications.filter((n) => {
      if (n.targetUserId) return n.targetUserId === userId;
      if (!n.audience || n.audience === 'all') return true;
      if (n.audience === 'staff' && (role === 'admin' || role === 'worker')) return true;
      if (n.audience === 'clients' && role === 'client') return true;
      return false;
    });
  },
  markNotificationRead: (id: string) => update<Notification>('notifications', T.notifications, id, { read: true }),
  markAllRead: () => {
    state.notifications.forEach((n) => {
      if (!n.read) {
        n.read = true;
        dbUpdate(T.notifications, n.id, { read: true });
      }
    });
  },
  addNotification: (n: Omit<Notification, 'id'>) => create<Notification>('notifications', T.notifications, n),

  // ── Schedule Events (computed from other tables) ──
  getScheduleEvents: (): ScheduleEvent[] => {
    const events: ScheduleEvent[] = [];

    // Approved bookings
    state.requests.filter((r) => r.status === 'approved' && r.requestedDate).forEach((r) => {
      events.push({
        id: `req-${r.id}`, type: 'booking', title: `${r.facilityType || 'Facility'}: ${r.clientName}`,
        date: r.requestedDate!, time: r.requestedTime, endTime: r.requestedEndTime,
        userId: r.clientId, userName: r.clientName, facilityType: r.facilityType,
        sourceId: r.id, editable: true,
      });
    });

    // Transports
    state.transports.forEach((tr) => {
      events.push({
        id: `tr-${tr.id}`, type: 'transport', title: `Transport: ${tr.horseName}`,
        date: tr.transportDate, time: tr.transportTime,
        horseId: tr.horseId, horseName: tr.horseName,
        sourceId: tr.id, editable: false,
      });
    });

    // Horse arrivals
    state.horses.filter((h) => (h.status === 'upcoming' || h.status === 'checked-in') && h.checkIn).forEach((h) => {
      events.push({
        id: `arr-${h.id}`, type: 'arrival', title: `Arrival: ${h.name}`,
        date: h.checkIn, time: h.checkInTime,
        horseId: h.id, horseName: h.name, userName: h.ownerName,
        sourceId: h.id, editable: false,
      });
    });

    // Horse departures
    state.horses.filter((h) => (h.status === 'checked-in' || h.status === 'upcoming') && h.checkOut).forEach((h) => {
      events.push({
        id: `dep-${h.id}`, type: 'departure', title: `Departure: ${h.name}`,
        date: h.checkOut, time: h.checkOutTime,
        horseId: h.id, horseName: h.name, userName: h.ownerName,
        sourceId: h.id, editable: false,
      });
    });

    return events.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return (a.time || '').localeCompare(b.time || '');
    });
  },
};
