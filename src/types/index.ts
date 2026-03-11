// ── User & Auth ──────────────────────────────────────────
export type Role = 'admin' | 'worker' | 'client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  phone?: string;
  password?: string;
  inviteToken?: string;
  createdAt: string;
}

// ── Horses ───────────────────────────────────────────────
export type StableType = 'shavings' | 'straw';
export type StableLocation = 'stable-a' | 'stable-b' | 'stable-c' | 'stable-d' | 'pension-left' | 'pension-middle' | 'pension-right';

export interface Horse {
  id: string;
  name: string;
  passportId: string;
  motherName: string;
  ownerId: string;
  ownerName: string;
  checkIn: string;
  checkOut: string;
  stableType: StableType;
  stableLocation: StableLocation;
  walkerSchedule: boolean;
  paddockSchedule: boolean;
  quarantine: boolean;
  quarantineStart?: string;
  quarantineEnd?: string;
  transportDestination?: string;
  notes?: string;
  imageUrl?: string;
  status: 'upcoming' | 'checked-in' | 'checked-out';
}

// ── Tasks ────────────────────────────────────────────────
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  horseId?: string;
  horseName?: string;
  assignedTo: string;
  assignedToName: string;
  dueDate: string;
  completed: boolean;
  priority: TaskPriority;
  createdAt: string;
  createdBy: string;
}

// ── Client Requests ──────────────────────────────────────
export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface ClientRequest {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  facilityType?: string;
  requestedDate?: string;
  status: RequestStatus;
  adminNotes?: string;
  createdAt: string;
}

// ── Announcements ────────────────────────────────────────
export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'maintenance' | 'transport' | 'important';
  authorId: string;
  authorName: string;
  pinned: boolean;
  createdAt: string;
}

// ── Transport ────────────────────────────────────────────
export interface Transport {
  id: string;
  horseId: string;
  horseName: string;
  transportDate: string;
  origin: string;
  destination: string;
  driver: string;
  notes?: string;
  status: 'scheduled' | 'in-transit' | 'completed';
  createdAt: string;
}

// ── Notifications ────────────────────────────────────────
export type NotificationType = 'arrival' | 'departure' | 'request' | 'task' | 'transport' | 'announcement';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}
