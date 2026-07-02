import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarCheck,
  FileText,
  BookOpen,
  FileSpreadsheet,
  Calendar,
  UserPlus,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Users,
  School,
  Layers,
  BarChart3,
  TrendingUp,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/user.types';
import { isAdminRole } from '../../permissions/roles';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  /** If set, only shown to these roles */
  roles?: UserRole[];
}

// ── Nav definitions per portal area ──────────────────────────────────────────

const ADMIN_ITEMS: SidebarItem[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Students', path: '/admin/students', icon: GraduationCap },
  { name: 'Teachers', path: '/admin/teachers', icon: Users },
  { name: 'Classes', path: '/admin/classes', icon: Layers },
  { name: 'Courses', path: '/admin/courses', icon: BookOpen },
  { name: 'Admissions', path: '/admin/admissions', icon: UserPlus },
  { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
  { name: 'Analytics', path: '/admin/analytics', icon: TrendingUp },
  {
    name: 'Schools',
    path: '/admin/schools',
    icon: School,
    roles: [UserRole.SUPER_ADMIN],
  },
];

const TEACHER_ITEMS: SidebarItem[] = [
  { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
  { name: 'Attendance', path: '/teacher/attendance', icon: CalendarCheck },
  { name: 'Assignments', path: '/teacher/assignments', icon: BookOpen },
  { name: 'Notes', path: '/teacher/notes', icon: FileText },
  { name: 'Exams', path: '/teacher/exams', icon: FileSpreadsheet },
  { name: 'Timetable', path: '/teacher/timetable', icon: Calendar },
];

const STUDENT_ITEMS: SidebarItem[] = [
  { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
  { name: 'Attendance', path: '/student/attendance', icon: CalendarCheck },
  { name: 'Notes', path: '/student/notes', icon: FileText },
  { name: 'Assignments', path: '/student/assignments', icon: BookOpen },
  { name: 'Exams', path: '/student/exams', icon: FileSpreadsheet },
  { name: 'Timetable', path: '/student/timetable', icon: Calendar },
];

// ── NavItem ───────────────────────────────────────────────────────────────────

function NavItem({
  item,
  isCollapsed,
}: {
  item: SidebarItem;
  isCollapsed: boolean;
}) {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group relative cursor-pointer ${
          isActive
            ? 'bg-primary-50 text-primary-650 dark:bg-primary-950/20 dark:text-primary-400'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <item.icon
            className={`w-5 h-5 shrink-0 ${
              isActive
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
            }`}
          />
          {!isCollapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {item.name}
            </motion.span>
          )}
          {isCollapsed && (
            <div className="absolute left-16 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 shadow-md whitespace-nowrap z-50">
              {item.name}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Determine which nav set to show
  const rawItems: SidebarItem[] = user
    ? isAdminRole(user.role)
      ? ADMIN_ITEMS
      : user.role === UserRole.TEACHER
      ? TEACHER_ITEMS
      : STUDENT_ITEMS
    : [];

  // Filter out role-restricted items
  const menuItems = rawItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] z-30 select-none overflow-hidden"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-primary-700 shadow-md shadow-primary-500/20 text-white shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-extrabold font-heading bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent"
            >
              SchoolPortal
            </motion.span>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => (
          <NavItem key={item.path} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>

      {/* Footer — Settings + Logout */}
      <div className="p-4 border-t border-slate-100 dark:border-white/5 space-y-1">
        <NavItem
          item={{ name: 'Settings', path: '/admin/settings', icon: Settings }}
          isCollapsed={isCollapsed}
        />

        {/* Logout button */}
        <button
          onClick={handleLogout}
          id="sidebar-logout-btn"
          className="flex w-full items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-200 group relative cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Sign Out
            </motion.span>
          )}
          {isCollapsed && (
            <div className="absolute left-16 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 shadow-md whitespace-nowrap z-50">
              Sign Out
            </div>
          )}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute bottom-20 -right-0 translate-x-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer z-50 shrink-0"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>
    </motion.aside>
  );
}
