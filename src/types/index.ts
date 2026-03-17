// ── User & Auth ──────────────────────────────────────────
export type Role = 'admin' | 'worker' | 'client';
export type UserStatus = 'pending' | 'active';

export type Lang = 'en' | 'pt' | 'nl';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  status?: UserStatus;
  avatar?: string;
  phone?: string;
  password?: string;
  inviteToken?: string;
  sessionToken?: string;
  lang?: Lang;
  createdAt: string;
}

// ── Horses ───────────────────────────────────────────────
export type StableType = 'shavings' | 'straw';
export type StableLocation = 'stable-a' | 'stable-b' | 'stable-c' | 'stable-d' | 'pension-left' | 'pension-middle' | 'pension-right';
export type FoodType = 'hay' | 'grass' | 'both';
export type FeedType = 'standard' | 'client-prepared' | 'other';

export interface Horse {
  id: string;
  name: string;
  passportId: string;
  motherName: string;
  ownerId: string;
  ownerName: string;
  checkIn: string;
  checkOut: string;
  checkInTime?: string;
  checkOutTime?: string;
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
  // Special care fields
  foodType?: FoodType;
  feedType?: FeedType;
  feedOther?: string;
  specialCare?: string;
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
  requestedTime?: string;
  requestedEndTime?: string;
  status: RequestStatus;
  adminNotes?: string;
  createdAt: string;
}

// ── Announcements ────────────────────────────────────────
export type AnnouncementAudience = 'all' | 'staff' | 'clients';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'maintenance' | 'transport' | 'important';
  audience: AnnouncementAudience;
  authorId: string;
  authorName: string;
  pinned: boolean;
  createdAt: string;
  archived?: boolean;
  archivedAt?: string;
}

// ── Transport ────────────────────────────────────────────
export interface Transport {
  id: string;
  horseId: string;
  horseName: string;
  transportDate: string;
  transportTime?: string;
  origin: string;
  destination: string;
  driverId?: string;
  driver: string;
  notes?: string;
  status: 'scheduled' | 'in-transit' | 'completed';
  createdAt: string;
}

// ── Notifications ────────────────────────────────────────
export type NotificationType = 'arrival' | 'departure' | 'request' | 'task' | 'transport' | 'announcement' | 'registration';
export type NotificationAudience = 'all' | 'staff' | 'clients';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  audience?: NotificationAudience;
  targetUserId?: string;
  sourceId?: string;
}

// ── Schedule Events ──────────────────────────────────────
export type ScheduleEventType = 'booking' | 'transport' | 'arrival' | 'departure';

export interface ScheduleEvent {
  id: string;
  type: ScheduleEventType;
  title: string;
  date: string;
  time?: string;
  endTime?: string;
  userId?: string;
  userName?: string;
  horseId?: string;
  horseName?: string;
  facilityType?: string;
  sourceId: string;
  editable: boolean;
}
