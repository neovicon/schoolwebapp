import { useQuery } from '@tanstack/react-query';
import {
  GraduationCap,
  Users,
  BookOpen,
  CalendarCheck,
  UserPlus,
  School,
  Layers,
  Activity,
} from 'lucide-react';
import { dashboardApi } from '../../../api/dashboard.api';
import { StatCard } from '../../../components/dashboard/StatCard';
import { AdminQuickActions } from '../components/AdminQuickActions';
import { AdminActivityFeed } from '../components/AdminActivityFeed';
import { useAuth } from '../../../hooks/useAuth';
import { ROLE_LABELS } from '../../../permissions/roles';
import { AlertBanner } from '../../../components/dashboard/AlertBanner';

// ── System Status Bar ────────────────────────────────────────────────────────

function SystemStatusBar() {
  const services = [
    { name: 'API Gateway', ok: true },
    { name: 'Database', ok: true },
    { name: 'Email Service', ok: true },
    { name: 'Storage', ok: true },
    { name: 'Auth Service', ok: true },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
          System Status
        </h3>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          All Systems Operational
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {services.map((s) => (
          <div
            key={s.name}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5"
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${s.ok ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">
              {s.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────

export function AdminDashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: dashboardApi.getAdminStats,
  });

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: dashboardApi.getRecentActivity,
  });

  const roleLabel = user ? ROLE_LABELS[user.role] : '';

  return (
    <div className="space-y-8 select-none text-left">
      {/* Welcome Banner */}
      <AlertBanner
        type="info"
        message={`Welcome back, ${user?.name ?? 'Admin'}`}
        description={`Signed in as ${roleLabel}${user?.schoolName ? ` · ${user.schoolName}` : ''}. Here's your portal overview for today.`}
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={statsLoading ? '—' : stats!.totalStudents.toLocaleString()}
          icon={<GraduationCap className="w-6 h-6" />}
          trend={{ value: '+124 this term', isPositive: true }}
          description="ENROLLED"
        />
        <StatCard
          title="Total Teachers"
          value={statsLoading ? '—' : stats!.totalTeachers.toLocaleString()}
          icon={<Users className="w-6 h-6" />}
          trend={{ value: '+6 this term', isPositive: true }}
          description="ACTIVE STAFF"
        />
        <StatCard
          title="Total Classes"
          value={statsLoading ? '—' : stats!.totalClasses.toLocaleString()}
          icon={<Layers className="w-6 h-6" />}
          description="RUNNING NOW"
        />
        <StatCard
          title="Attendance Today"
          value={statsLoading ? '—' : `${stats!.attendanceToday}%`}
          icon={<CalendarCheck className="w-6 h-6" />}
          trend={{ value: '+1.8% vs yesterday', isPositive: true }}
          description="PRESENT TODAY"
        />
      </div>

      {/* Second Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Admissions"
          value={statsLoading ? '—' : stats!.pendingAdmissions.toLocaleString()}
          icon={<UserPlus className="w-6 h-6" />}
          trend={{ value: '5 need review', isPositive: false }}
          description="APPLICATIONS"
        />
        <StatCard
          title="Active Courses"
          value={statsLoading ? '—' : stats!.activeCourses.toLocaleString()}
          icon={<BookOpen className="w-6 h-6" />}
          description="THIS TERM"
        />
        <StatCard
          title="Total Schools"
          value={statsLoading ? '—' : stats!.totalSchools.toLocaleString()}
          icon={<School className="w-6 h-6" />}
          description="INSTITUTIONS"
        />
        <StatCard
          title="System Uptime"
          value={statsLoading ? '—' : `${stats!.systemUptime}%`}
          icon={<Activity className="w-6 h-6" />}
          trend={{ value: 'Last 30 days', isPositive: true }}
          description="AVAILABILITY"
        />
      </div>

      {/* Quick Actions */}
      <AdminQuickActions />

      {/* Activity Feed + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminActivityFeed items={activityLoading ? [] : (activity ?? [])} />
        </div>
        <div>
          <SystemStatusBar />
        </div>
      </div>
    </div>
  );
}
