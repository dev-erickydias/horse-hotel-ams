import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LangProvider } from './contexts/LangContext';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SetPasswordPage from './pages/auth/SetPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import HorsesPage from './pages/horses/HorsesPage';
import TasksPage from './pages/tasks/TasksPage';
import BookingsPage from './pages/bookings/BookingsPage';
import TransportPage from './pages/transport/TransportPage';
import AnnouncementsPage from './pages/announcements/AnnouncementsPage';
import UsersPage from './pages/users/UsersPage';
import type { ReactNode } from 'react';

function ProtectedRoute({ children, staffOnly = false }: { children: ReactNode; staffOnly?: boolean }) {
  const { user, isStaff } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (staffOnly && !isStaff) return <Navigate to="/app/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/app/dashboard" replace /> : <LoginPage />} />
      <Route path="/set-password/:token" element={<SetPasswordPage />} />
      <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="horses" element={<ProtectedRoute staffOnly><HorsesPage /></ProtectedRoute>} />
        <Route path="tasks" element={<ProtectedRoute staffOnly><TasksPage /></ProtectedRoute>} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="transport" element={<ProtectedRoute staffOnly><TransportPage /></ProtectedRoute>} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="users" element={<ProtectedRoute staffOnly><UsersPage /></ProtectedRoute>} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/app/dashboard' : '/'} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LangProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LangProvider>
    </BrowserRouter>
  );
}
