import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Auth
import { AuthProvider } from './auth/AuthProvider';
import { AppLoadingScreen } from './components/auth/AppLoadingScreen';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';
import { RoleGuard } from './routes/RoleGuard';

// Layout
import { PortalLayout } from './components/layout/PortalLayout';

// Auth Pages
import { LoginPage } from './features/auth/pages/LoginPage';
import { ForgotPasswordPage } from './features/auth/pages/ForgotPasswordPage';

// Error Pages
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminDashboard } from './features/admin/pages/AdminDashboard';
import { UsersPage } from './features/admin/pages/UsersPage';
import { StudentsPage } from './features/students/pages/StudentsPage';
import { StudentDetailsPage } from './features/students/pages/StudentDetailsPage';
import { CreateStudentPage } from './features/students/pages/CreateStudentPage';
import { EditStudentPage } from './features/students/pages/EditStudentPage';
import { TeachersPage } from './features/teachers/pages/TeachersPage';
import { TeacherDetailsPage } from './features/teachers/pages/TeacherDetailsPage';
import { CreateTeacherPage } from './features/teachers/pages/CreateTeacherPage';
import { EditTeacherPage } from './features/teachers/pages/EditTeacherPage';
import { ClassesPage } from './features/admin/pages/ClassesPage';
import { CoursesPage } from './features/admin/pages/CoursesPage';
import { SchoolsPage } from './features/admin/pages/SchoolsPage';
import { AdmissionsPage } from './features/admin/pages/AdmissionsPage';
import { ReportsPage } from './features/admin/pages/ReportsPage';
import { AnalyticsPage } from './features/admin/pages/AnalyticsPage';
import { SettingsPage } from './features/admin/pages/SettingsPage';

// Teacher Pages
import { TeacherDashboard } from './features/teacher/pages/TeacherDashboard';

// Student Pages
import { StudentDashboard } from './features/student/pages/StudentDashboard';

// Design System Showcase (retained)
import { DashboardHome } from './pages/DashboardHome';

// Role
import { UserRole } from './types/user.types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {/* Blocks render until session is restored from localStorage */}
          <AppLoadingScreen>
            <Routes>
              {/* ── Public auth routes ────────────────────────────────────── */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              </Route>

              {/* ── Error pages (accessible always) ──────────────────────── */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/404" element={<NotFoundPage />} />

              {/* ── Protected portal ─────────────────────────────────────── */}
              <Route element={<ProtectedRoute />}>
                <Route element={<PortalLayout />}>

                  {/* Root redirect → role-aware default handled by ProtectedRoute */}
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />

                  {/* ── Admin / School Admin routes ───────────────────────── */}
                  <Route
                    element={
                      <RoleGuard
                        allowedRoles={[UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]}
                        redirectTo="/unauthorized"
                      />
                    }
                  >
                    <Route path="admin/dashboard" element={<AdminDashboard />} />
                    <Route path="admin/users" element={<UsersPage />} />
                    <Route path="admin/students" element={<StudentsPage />} />
                    <Route path="admin/students/create" element={<CreateStudentPage />} />
                    <Route path="admin/students/:id" element={<StudentDetailsPage />} />
                    <Route path="admin/students/:id/edit" element={<EditStudentPage />} />
                    <Route path="admin/teachers" element={<TeachersPage />} />
                    <Route path="admin/teachers/create" element={<CreateTeacherPage />} />
                    <Route path="admin/teachers/:id" element={<TeacherDetailsPage />} />
                    <Route path="admin/teachers/:id/edit" element={<EditTeacherPage />} />
                    <Route path="admin/classes" element={<ClassesPage />} />
                    <Route path="admin/courses" element={<CoursesPage />} />
                    <Route path="admin/admissions" element={<AdmissionsPage />} />
                    <Route path="admin/reports" element={<ReportsPage />} />
                    <Route path="admin/analytics" element={<AnalyticsPage />} />
                    <Route path="admin/settings" element={<SettingsPage />} />

                    {/* Super Admin only */}
                    <Route
                      element={
                        <RoleGuard
                          allowedRoles={[UserRole.SUPER_ADMIN]}
                          redirectTo="/unauthorized"
                        />
                      }
                    >
                      <Route path="admin/schools" element={<SchoolsPage />} />
                    </Route>
                  </Route>

                  {/* ── Teacher routes ────────────────────────────────────── */}
                  <Route
                    element={
                      <RoleGuard
                        allowedRoles={[UserRole.TEACHER]}
                        redirectTo="/unauthorized"
                      />
                    }
                  >
                    <Route path="teacher/dashboard" element={<TeacherDashboard />} />
                  </Route>

                  {/* ── Student routes ────────────────────────────────────── */}
                  <Route
                    element={
                      <RoleGuard
                        allowedRoles={[UserRole.STUDENT]}
                        redirectTo="/unauthorized"
                      />
                    }
                  >
                    <Route path="student/dashboard" element={<StudentDashboard />} />
                  </Route>

                  {/* ── Design system showcase (dev convenience, no RBAC) ── */}
                  <Route path="showcase" element={<DashboardHome />} />

                </Route>
              </Route>

              {/* ── Catch-all ─────────────────────────────────────────────── */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AppLoadingScreen>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
