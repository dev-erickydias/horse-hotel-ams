import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LangProvider } from './contexts/LangContext';
import DataProvider from './components/DataProvider';
import ErrorBoundary from './components/ErrorBoundary';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SetPasswordPage from './pages/auth/SetPasswordPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import HorsesPage from './pages/horses/HorsesPage';
import TasksPage from './pages/tasks/TasksPage';
import BookingsPage from './pages/bookings/BookingsPage';
import TransportPage from './pages/transport/TransportPage';
import AnnouncementsPage from './pages/announcements/AnnouncementsPage';
import UsersPage from './pages/users/UsersPage';
import ProfilePage from './pages/profile/ProfilePage';
import SchedulePage from './pages/schedule/SchedulePage';
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
      <Route path="/signup" element={user ? <Navigate to="/app/dashboard" replace /> : <SignupPage />} />
      <Route path="/set-password/:token" element={<SetPasswordPage />} />
      <Route path="/forgot-password" element={user ? <Navigate to="/app/dashboard" replace /> : <ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="horses" element={<HorsesPage />} />
        <Route path="tasks" element={<ProtectedRoute staffOnly><TasksPage /></ProtectedRoute>} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="transport" element={<ProtectedRoute staffOnly><TransportPage /></ProtectedRoute>} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="users" element={<ProtectedRoute staffOnly><UsersPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/app/dashboard' : '/'} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <DataProvider>
          <LangProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </LangProvider>
        </DataProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
