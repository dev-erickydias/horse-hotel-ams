# Horse Hotel AMS — Documentation

## Overview

Horse Hotel AMS is a comprehensive management system for horse hotels, designed to handle guest horse registrations, staff task management, client bookings, transport logistics, announcements, and scheduling — all with role-based access control and multilingual support (English, Portuguese, Dutch).

## Tech Stack

- **Frontend:** React 18 + TypeScript 5 + Vite 5
- **Styling:** Tailwind CSS 3.4
- **Routing:** React Router 6
- **Icons:** Lucide React
- **Date handling:** date-fns
- **Data persistence:** localStorage (key: `horse_hotel_data_v4`)
- **Authentication:** Context-based with role management

## Roles & Permissions

| Feature | Admin | Worker | Client |
|---|---|---|---|
| Dashboard | Full stats | Full stats | My horses & requests |
| Horses | View/Add/Edit/Delete all | View/Add/Edit all | View own horses only |
| Tasks | Create/Assign/Complete | View/Complete assigned | — |
| Bookings | Review/Approve/Reject | Review/Approve/Reject | Create requests |
| Transport | Create/Manage | Create/Manage | — |
| Announcements | Create for all audiences, Archive, Delete permanently | Create for all/staff, Archive, Restore | View only |
| Users | Add/Edit role/Delete | — | — |
| Schedule | View/Edit all events | View/Edit all events | View own + public events |
| Profile | View | Edit name/phone, Change password | Edit name/phone, Change password, Register horses |

## Pages & Features

### 1. Landing Page (`/`)
Public-facing page with hotel information, services, facilities, transport details, and contact form. Fully responsive.

### 2. Authentication (`/login`, `/signup`)
- Login with email/password
- Self-registration (status: pending → admin approval required)
- Set password via invite token (`/set-password/:token`)

### 3. Dashboard (`/app/dashboard`)
- **Staff view:** Horse count, pending tasks, pending requests, scheduled transports. Quick cards for arriving/departing today, quarantine alerts, urgent tasks.
- **Client view:** My horses count, my requests count.

### 4. Horse Management (`/app/horses`)
- Search by horse name, owner name, or passport ID
- Filter by status: all, upcoming, checked-in, checked-out
- Full horse profile: name, passport ID, mother, owner, check-in/out dates and times, stable type (shavings/straw), stable location (A-D, pension left/middle/right), walker/paddock schedule, quarantine with date range, transport destination
- Special care section: food type (hay/grass/both), feed type (standard/client-prepared/other), special care notes
- Safe date formatting — no crashes on empty/invalid dates

### 5. Task Management (`/app/tasks`) — Staff only
- Create tasks with title, description, assigned worker, related horse, due date, priority (low/medium/high/urgent)
- Sections: Today's tasks, All active, Upcoming, Completed
- Mark tasks as complete

### 6. Bookings (`/app/bookings`)
- **Clients:** Submit facility requests (arena, paddock, round pen, other) with date and time slots (start/end time)
- **Staff:** Review requests with admin notes, approve or reject
- **Notifications:** Staff receive notification on new request (with sourceId for quick actions). Client receives notification on approve/reject.
- **Quick actions from notifications:** Admin can approve/reject directly from the notification panel without navigating away.

### 7. Transport (`/app/transport`) — Staff only
- Schedule transport: select horse, date, time, origin, destination, driver (with user autocomplete)
- Track status: scheduled → in-transit → completed
- Driver field uses autocomplete component that searches users by name

### 8. Announcements (`/app/announcements`)
- **Audience targeting:** all, staff only, clients only. Workers can post to all or staff. Admin can post to any audience.
- **Pinning:** Pin important announcements to top
- **Categories:** General, Maintenance, Transport, Important (color-coded badges)
- **Archive system:** Staff can archive announcements. Archived items go to a collapsible "Archived" section. Each archived item shows days remaining before auto-deletion. Announcements are permanently deleted after 10 days. Staff can restore archived items. Admin can delete permanently at any time.

### 9. User Management (`/app/users`) — Staff only
- Search users by name, email, phone, horse name, or passport ID
- View linked horses per user (with name and passport ID badges)
- Pending approvals section: approve with role assignment or reject
- **Admin role change:** Admin can change any user's role (client ↔ worker ↔ admin) directly from the user card
- Create new users with temporary password
- Delete users (admin only, cannot delete self)

### 10. Schedule/Agenda (`/app/schedule`)
- **Week view:** 7-day grid with compact event cards, click day for detail
- **Day view:** Full event list for selected day
- **Event types:** Booking (blue), Transport (purple), Arrival (green), Departure (amber)
- Navigation: previous/next week/day, "Today" button
- **Client view:** Own bookings + all arrivals/departures/transports
- **Edit:** Admin can edit any booking time, clients only their own

### 11. Profile (`/app/profile`)
- View/edit name, email (read-only), phone
- Change password (current → new → confirm)
- **My Horses section:** Register horses with basic info + care/feeding details. Edit existing horses.

## Notification System

- Role-based filtering: notifications are filtered by audience (all/staff/clients) and targetUserId
- Types: arrival, departure, request, task, transport, announcement, registration
- Bell icon in header with unread count (animated pulse)
- Click notification → navigate to linked page
- Request notifications for staff include "Approve" and "Reject" buttons for quick inline actions
- Mark all as read

## Internationalization (i18n)

Three languages fully supported: English (`en`), Portuguese (`pt`), Dutch (`nl`). Language switcher in header. All UI labels, buttons, messages, and placeholders are translated.

## Data Architecture

All data is stored in localStorage under key `horse_hotel_data_v4`. The data service (`src/services/data.ts`) provides a complete CRUD API. Seed data includes one admin user (`admin@admin.com` / `admin`) and three sample horses.

### Key entities:
- **User:** id, email, name, role, status, phone, password, inviteToken, createdAt
- **Horse:** id, name, passportId, motherName, ownerId, ownerName, checkIn/Out + times, stableType, stableLocation, walker/paddock/quarantine schedules, food/feed type, specialCare, notes, status
- **Task:** id, title, description, horseId, assignedTo, dueDate, priority, completed
- **ClientRequest:** id, clientId, title, description, facilityType, requestedDate/Time, status, adminNotes
- **Announcement:** id, title, content, category, audience, authorId, pinned, archived, archivedAt
- **Transport:** id, horseId, horseName, date, time, origin, destination, driver, status
- **Notification:** id, type, title, message, read, link, audience, targetUserId, sourceId
- **ScheduleEvent:** (computed) id, type, title, date, time, userId, horseId, facilityType, editable

## File Structure

```
src/
├── App.tsx                          # Routes & protected routes
├── contexts/
│   ├── AuthContext.tsx               # Authentication state & role checks
│   └── LangContext.tsx               # Language state & switcher
├── i18n/
│   ├── en.ts, pt.ts, nl.ts          # Translation files
│   └── index.ts                     # i18n exports
├── services/
│   └── data.ts                      # Data layer (localStorage CRUD)
├── types/
│   └── index.ts                     # TypeScript interfaces
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx            # Sidebar + content layout
│   │   ├── Header.tsx               # Top bar with notifications
│   │   └── Sidebar.tsx              # Navigation sidebar
│   └── ui/
│       ├── Badge.tsx, Button.tsx, Card.tsx, EmptyState.tsx, Input.tsx, Modal.tsx
│       └── LangSwitcher.tsx
└── pages/
    ├── landing/LandingPage.tsx
    ├── auth/LoginPage.tsx, SignupPage.tsx, SetPasswordPage.tsx
    ├── dashboard/DashboardPage.tsx
    ├── horses/HorsesPage.tsx
    ├── tasks/TasksPage.tsx
    ├── bookings/BookingsPage.tsx
    ├── transport/TransportPage.tsx
    ├── announcements/AnnouncementsPage.tsx
    ├── users/UsersPage.tsx
    ├── schedule/SchedulePage.tsx
    └── profile/ProfilePage.tsx
```

## Running the Project

```bash
npm install
npm run dev          # Development server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
```

## Default Login

- **Admin:** admin@admin.com / admin
