// ─── Dashboard API ────────────────────────────────────────────────────────────
// These endpoints will be implemented in Strapi as custom controllers or
// by composing multiple collection queries.
// For now, all data is mocked locally to unblock UI development.

export interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  attendanceToday: number; // percentage
  pendingAdmissions: number;
  activeCourses: number;
  totalSchools: number;
  systemUptime: number; // percentage
}

export interface ActivityItem {
  id: string;
  type: 'admission' | 'enrollment' | 'attendance' | 'assignment' | 'user' | 'system';
  title: string;
  description: string;
  timestamp: string;
  actor?: string;
}

const MOCK_ADMIN_STATS: AdminStats = {
  totalStudents: 2_847,
  totalTeachers: 134,
  totalClasses: 96,
  attendanceToday: 91.4,
  pendingAdmissions: 23,
  activeCourses: 312,
  totalSchools: 7,
  systemUptime: 99.98,
};

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: 'a-1',
    type: 'admission',
    title: 'New Admission Request',
    description: 'Lena Park submitted an admission request for Grade 9.',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    actor: 'Lena Park',
  },
  {
    id: 'a-2',
    type: 'user',
    title: 'New Teacher Registered',
    description: 'Dr. Marcus Webb was added to the Science department.',
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    actor: 'Admin',
  },
  {
    id: 'a-3',
    type: 'attendance',
    title: 'Attendance Recorded',
    description: 'Class 10-A attendance marked — 28 of 30 present.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    actor: 'Jordan Blake',
  },
  {
    id: 'a-4',
    type: 'assignment',
    title: 'Assignment Published',
    description: 'Advanced Physics — Chapter 5 problem set distributed.',
    timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
    actor: 'Jordan Blake',
  },
  {
    id: 'a-5',
    type: 'enrollment',
    title: 'Course Enrollment',
    description: '14 students enrolled in Calculus II — Section B.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    actor: 'Morgan Chen',
  },
  {
    id: 'a-6',
    type: 'system',
    title: 'System Backup Complete',
    description: 'Nightly database backup completed successfully (2.4 GB).',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    actor: 'System',
  },
];

const mockDelay = (ms = 600) => new Promise<void>((res) => setTimeout(res, ms));

// ─── Dashboard API ────────────────────────────────────────────────────────────

export const dashboardApi = {
  /**
   * Fetches admin KPI statistics.
   * Strapi: GET /api/dashboard/admin-stats  (custom endpoint)
   */
  async getAdminStats(): Promise<AdminStats> {
    await mockDelay();
    return { ...MOCK_ADMIN_STATS };
  },

  /**
   * Fetches recent system activity.
   * Strapi: GET /api/dashboard/recent-activity  (custom endpoint)
   */
  async getRecentActivity(): Promise<ActivityItem[]> {
    await mockDelay(400);
    return [...MOCK_ACTIVITY];
  },
};
