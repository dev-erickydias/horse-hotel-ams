import type {
  User, Horse, Task, ClientRequest, Announcement, Transport, Notification,
} from '../types';

// Fixed UUIDs for referential integrity
const uid = {
  admin:   'a0000000-0000-0000-0000-000000000001',
  worker1: 'w0000000-0000-0000-0000-000000000001',
  worker2: 'w0000000-0000-0000-0000-000000000002',
  client1: 'c0000000-0000-0000-0000-000000000001',
  client2: 'c0000000-0000-0000-0000-000000000002',
  client3: 'c0000000-0000-0000-0000-000000000003',
};

const hid = {
  h1: 'h0000000-0000-0000-0000-000000000001',
  h2: 'h0000000-0000-0000-0000-000000000002',
  h3: 'h0000000-0000-0000-0000-000000000003',
  h4: 'h0000000-0000-0000-0000-000000000004',
};

// Today and relative dates
const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const rel = (days: number) => { const d = new Date(today); d.setDate(d.getDate() + days); return fmt(d); };

// ── Users ──────────────────────────────────────────
export const seedUsers: User[] = [
  {
    id: uid.admin, email: 'admin@horsehotel.nl', name: 'Jan van Bergen',
    role: 'admin', status: 'active', password: '$2b$10$fLnMXIVdAj.dDNkLojlzPe8HT7Oosza3hT1AT72ozypAHosk3laeK',
    createdAt: '2024-01-15',
  },
  {
    id: uid.worker1, email: 'anna@horsehotel.nl', name: 'Anna de Vries',
    role: 'worker', status: 'active', password: '$2b$10$fLnMXIVdAj.dDNkLojlzPe8HT7Oosza3hT1AT72ozypAHosk3laeK',
    phone: '+31 6 12345678', createdAt: '2024-02-01',
  },
  {
    id: uid.worker2, email: 'pieter@horsehotel.nl', name: 'Pieter Bakker',
    role: 'worker', status: 'active', password: '$2a$10$dummyhashnotreal000000000000000000000000000000work02',
    phone: '+31 6 98765432', createdAt: '2024-03-10',
  },
  {
    id: uid.client1, email: 'sophie@example.com', name: 'Sophie Laurent',
    role: 'client', status: 'active', password: '$2a$10$dummyhashnotreal000000000000000000000000000000clnt01',
    phone: '+33 6 11223344', createdAt: '2024-06-20',
  },
  {
    id: uid.client2, email: 'marcus@example.com', name: 'Marcus Hoffmann',
    role: 'client', status: 'active', password: '$2a$10$dummyhashnotreal000000000000000000000000000000clnt02',
    phone: '+49 170 5556677', createdAt: '2024-08-05',
  },
  {
    id: uid.client3, email: 'elena@example.com', name: 'Elena Rossi',
    role: 'client', status: 'pending', password: '$2a$10$dummyhashnotreal000000000000000000000000000000clnt03',
    createdAt: rel(-2),
  },
];

// ── Horses ─────────────────────────────────────────
export const seedHorses: Horse[] = [
  {
    id: hid.h1, name: 'Eclipse', passportId: 'NL-528-2019-04521',
    motherName: 'Luna Star', ownerId: uid.client1, ownerName: 'Sophie Laurent',
    checkIn: rel(-3), checkOut: rel(4), checkInTime: '09:00', checkOutTime: '14:00',
    stableType: 'shavings', stableLocation: 'stable-a',
    walkerSchedule: true, paddockSchedule: true, quarantine: false,
    status: 'checked-in', foodType: 'hay', feedType: 'standard',
    specialCare: 'Sensitive to cold — extra blanket at night.',
    notes: 'Very calm horse, easy to handle.',
  },
  {
    id: hid.h2, name: 'Thunderbolt', passportId: 'DE-276-2020-08834',
    motherName: 'Storm Chaser', ownerId: uid.client2, ownerName: 'Marcus Hoffmann',
    checkIn: rel(0), checkOut: rel(7), checkInTime: '11:00', checkOutTime: '10:00',
    stableType: 'straw', stableLocation: 'stable-b',
    walkerSchedule: true, paddockSchedule: false, quarantine: true,
    quarantineStart: rel(0), quarantineEnd: rel(3),
    status: 'checked-in', foodType: 'both', feedType: 'client-prepared',
    specialCare: 'Dietary restrictions — no grain supplements.',
    transportDestination: 'Schiphol Airport → Dubai',
  },
  {
    id: hid.h3, name: 'Bella Rosa', passportId: 'FR-250-2018-12067',
    motherName: 'Rose Garden', ownerId: uid.client1, ownerName: 'Sophie Laurent',
    checkIn: rel(1), checkOut: rel(6), checkInTime: '08:30',
    stableType: 'shavings', stableLocation: 'pension-left',
    walkerSchedule: false, paddockSchedule: true, quarantine: false,
    status: 'upcoming', foodType: 'grass', feedType: 'standard',
    notes: 'Arriving from Paris CDG with transport company.',
  },
  {
    id: hid.h4, name: 'Nordic King', passportId: 'SE-752-2021-03298',
    motherName: 'Frost Queen', ownerId: uid.client2, ownerName: 'Marcus Hoffmann',
    checkIn: rel(-7), checkOut: rel(0), checkInTime: '10:00', checkOutTime: '16:00',
    stableType: 'straw', stableLocation: 'stable-d',
    walkerSchedule: true, paddockSchedule: true, quarantine: false,
    status: 'checked-in', foodType: 'hay', feedType: 'standard',
    transportDestination: 'Stockholm, Sweden',
    notes: 'Departing today — transport confirmed.',
  },
];

// ── Tasks ──────────────────────────────────────────
export const seedTasks: Task[] = [
  {
    id: 't0000000-0000-0000-0000-000000000001',
    title: 'Prepare stable A for Eclipse blanket change',
    description: 'Eclipse needs extra blanket at night due to cold sensitivity. Check temperature and adjust.',
    horseId: hid.h1, horseName: 'Eclipse',
    assignedTo: uid.worker1, assignedToName: 'Anna de Vries',
    dueDate: rel(0), completed: false, priority: 'high',
    createdAt: rel(-1), createdBy: uid.admin,
  },
  {
    id: 't0000000-0000-0000-0000-000000000002',
    title: 'Quarantine check — Thunderbolt',
    description: 'Daily veterinary check for Thunderbolt during quarantine period. Record temperature and behavior.',
    horseId: hid.h2, horseName: 'Thunderbolt',
    assignedTo: uid.worker2, assignedToName: 'Pieter Bakker',
    dueDate: rel(0), completed: false, priority: 'urgent',
    createdAt: rel(0), createdBy: uid.admin,
  },
  {
    id: 't0000000-0000-0000-0000-000000000003',
    title: 'Prepare departure for Nordic King',
    description: 'Load Nordic King for transport to Stockholm. Ensure all export documents are ready.',
    horseId: hid.h4, horseName: 'Nordic King',
    assignedTo: uid.worker1, assignedToName: 'Anna de Vries',
    dueDate: rel(0), completed: false, priority: 'high',
    createdAt: rel(-1), createdBy: uid.admin,
  },
  {
    id: 't0000000-0000-0000-0000-000000000004',
    title: 'Restock hay and shavings in stable block A',
    description: 'Supply running low. Order from the usual supplier and restock all stalls.',
    assignedTo: uid.worker2, assignedToName: 'Pieter Bakker',
    dueDate: rel(2), completed: false, priority: 'medium',
    createdAt: rel(-2), createdBy: uid.admin,
  },
];

// ── Client Requests (Bookings) ─────────────────────
export const seedRequests: ClientRequest[] = [
  {
    id: 'r0000000-0000-0000-0000-000000000001',
    clientId: uid.client1, clientName: 'Sophie Laurent',
    title: 'Indoor arena session for Eclipse',
    description: 'Would like to book the indoor arena for a light exercise session.',
    facilityType: 'Indoor Arena', requestedDate: rel(2), requestedTime: '10:00', requestedEndTime: '11:30',
    status: 'approved', createdAt: rel(-2),
  },
  {
    id: 'r0000000-0000-0000-0000-000000000002',
    clientId: uid.client2, clientName: 'Marcus Hoffmann',
    title: 'Wash bay reservation',
    description: 'Need the wash bay to groom Thunderbolt before transport.',
    facilityType: 'Wash Bay', requestedDate: rel(3), requestedTime: '14:00', requestedEndTime: '15:00',
    status: 'pending', createdAt: rel(-1),
  },
  {
    id: 'r0000000-0000-0000-0000-000000000003',
    clientId: uid.client1, clientName: 'Sophie Laurent',
    title: 'Paddock time for Bella Rosa',
    description: 'Request extra paddock time for Bella Rosa upon arrival for acclimatization.',
    facilityType: 'Paddock', requestedDate: rel(2), requestedTime: '09:00', requestedEndTime: '12:00',
    status: 'pending', createdAt: rel(0),
  },
  {
    id: 'r0000000-0000-0000-0000-000000000004',
    clientId: uid.client2, clientName: 'Marcus Hoffmann',
    title: 'Guest room for 2 nights',
    description: 'I would like to stay in the guest house while Thunderbolt is in quarantine.',
    facilityType: 'Guest House', requestedDate: rel(1), requestedTime: '15:00',
    status: 'approved', adminNotes: 'Room 2 assigned.', createdAt: rel(-3),
  },
];

// ── Announcements ──────────────────────────────────
export const seedAnnouncements: Announcement[] = [
  {
    id: 'an000000-0000-0000-0000-000000000001',
    title: 'Arena maintenance — temporary closure',
    content: 'The outdoor arena will be closed for surface maintenance from Monday to Wednesday next week. The indoor arena remains available.',
    category: 'maintenance', audience: 'all',
    authorId: uid.admin, authorName: 'Jan van Bergen', pinned: true,
    createdAt: rel(-1),
  },
  {
    id: 'an000000-0000-0000-0000-000000000002',
    title: 'New quarantine protocol update',
    content: 'Please review the updated quarantine procedures effective immediately. All incoming horses from outside the EU require an additional 24-hour observation period.',
    category: 'important', audience: 'staff',
    authorId: uid.admin, authorName: 'Jan van Bergen', pinned: false,
    createdAt: rel(-3),
  },
  {
    id: 'an000000-0000-0000-0000-000000000003',
    title: 'Transport schedule — March update',
    content: 'Several international transports are scheduled for the coming weeks. Please check the transport page for updated routes and timings.',
    category: 'transport', audience: 'all',
    authorId: uid.admin, authorName: 'Jan van Bergen', pinned: false,
    createdAt: rel(-5),
  },
  {
    id: 'an000000-0000-0000-0000-000000000004',
    title: 'Welcome to our new client portal',
    content: 'Dear clients, we have launched a new management system for easier booking and communication. You can now request facility time, track your horse\'s stay, and receive real-time updates.',
    category: 'general', audience: 'clients',
    authorId: uid.admin, authorName: 'Jan van Bergen', pinned: true,
    createdAt: rel(-7),
  },
];

// ── Transports ─────────────────────────────────────
export const seedTransports: Transport[] = [
  {
    id: 'tr000000-0000-0000-0000-000000000001',
    horseId: hid.h4, horseName: 'Nordic King',
    transportDate: rel(0), transportTime: '16:00',
    origin: 'Horse Hotel Amsterdam', destination: 'Stockholm, Sweden',
    driver: 'Erik Johansson', status: 'scheduled',
    notes: 'Direct transport, estimated 18h. Stop in Hamburg for rest.',
    createdAt: rel(-3),
  },
  {
    id: 'tr000000-0000-0000-0000-000000000002',
    horseId: hid.h3, horseName: 'Bella Rosa',
    transportDate: rel(1), transportTime: '06:00',
    origin: 'Paris CDG Airport', destination: 'Horse Hotel Amsterdam',
    driver: 'Jean-Pierre Moreau', status: 'scheduled',
    notes: 'Pickup at cargo terminal. Flight arrives 04:30.',
    createdAt: rel(-2),
  },
  {
    id: 'tr000000-0000-0000-0000-000000000003',
    horseId: hid.h2, horseName: 'Thunderbolt',
    transportDate: rel(7), transportTime: '08:00',
    origin: 'Horse Hotel Amsterdam', destination: 'Schiphol Airport → Dubai',
    driver: 'Hans Mueller', status: 'scheduled',
    notes: 'Export quarantine must be completed before transport.',
    createdAt: rel(-1),
  },
  {
    id: 'tr000000-0000-0000-0000-000000000004',
    horseId: hid.h1, horseName: 'Eclipse',
    transportDate: rel(4), transportTime: '14:00',
    origin: 'Horse Hotel Amsterdam', destination: 'Lyon, France',
    driver: 'Sophie\'s private transport', status: 'scheduled',
    notes: 'Client arranges own transport. We assist with loading.',
    createdAt: rel(0),
  },
];

// ── Notifications ──────────────────────────────────
export const seedNotifications: Notification[] = [
  {
    id: 'n0000000-0000-0000-0000-000000000001',
    type: 'arrival', title: 'Thunderbolt has arrived',
    message: 'Thunderbolt (Marcus Hoffmann) checked in today. Quarantine started.',
    read: false, createdAt: new Date(today.getTime() - 2 * 3600000).toISOString(),
    link: '/app/horses', audience: 'staff',
  },
  {
    id: 'n0000000-0000-0000-0000-000000000002',
    type: 'request', title: 'New booking request',
    message: 'Marcus Hoffmann requested Wash Bay on ' + rel(3),
    read: false, createdAt: new Date(today.getTime() - 1 * 3600000).toISOString(),
    link: '/app/bookings', audience: 'staff',
    sourceId: 'r0000000-0000-0000-0000-000000000002',
  },
  {
    id: 'n0000000-0000-0000-0000-000000000003',
    type: 'request', title: 'New booking request',
    message: 'Sophie Laurent requested Paddock on ' + rel(2),
    read: false, createdAt: new Date(today.getTime() - 30 * 60000).toISOString(),
    link: '/app/bookings', audience: 'staff',
    sourceId: 'r0000000-0000-0000-0000-000000000003',
  },
  {
    id: 'n0000000-0000-0000-0000-000000000004',
    type: 'departure', title: 'Nordic King departing today',
    message: 'Nordic King is scheduled for transport to Stockholm at 16:00.',
    read: false, createdAt: new Date(today.getTime() - 4 * 3600000).toISOString(),
    link: '/app/transport', audience: 'staff',
  },
  {
    id: 'n0000000-0000-0000-0000-000000000005',
    type: 'request', title: 'Arena session approved',
    message: 'Your indoor arena request for Eclipse has been approved.',
    read: false, createdAt: rel(-1) + 'T10:00:00.000Z',
    link: '/app/bookings', targetUserId: uid.client1,
  },
  {
    id: 'n0000000-0000-0000-0000-000000000006',
    type: 'registration', title: 'New Registration: Elena Rossi',
    message: 'Elena Rossi (elena@example.com) has registered and is waiting for approval.',
    read: false, createdAt: rel(-2) + 'T14:00:00.000Z',
    link: '/app/users', audience: 'staff',
  },
  {
    id: 'n0000000-0000-0000-0000-000000000007',
    type: 'announcement', title: 'Arena maintenance — temporary closure',
    message: 'The outdoor arena will be closed for maintenance next week.',
    read: true, createdAt: rel(-1) + 'T08:00:00.000Z',
    link: '/app/announcements', audience: 'all',
  },
  {
    id: 'n0000000-0000-0000-0000-000000000008',
    type: 'request', title: 'Guest house approved',
    message: 'Your guest house request has been approved. Room 2 assigned.',
    read: true, createdAt: rel(-2) + 'T11:00:00.000Z',
    link: '/app/bookings', targetUserId: uid.client2,
  },
];
