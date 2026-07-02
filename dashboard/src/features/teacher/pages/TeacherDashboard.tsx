import { useAuth } from '../../../hooks/useAuth';
import { StatCard } from '../../../components/dashboard/StatCard';
import { FeaturePlaceholder } from '../../../components/dashboard/FeaturePlaceholder';
import { AlertBanner } from '../../../components/dashboard/AlertBanner';
import { CalendarCheck, BookOpen, Users, Clock } from 'lucide-react';

export function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 select-none text-left">
      <AlertBanner
        type="info"
        message={`Good morning, ${user?.name ?? 'Teacher'}`}
        description={`You have 3 classes scheduled today and 4 assignments pending review.`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Classes"
          value="6"
          icon={<Users className="w-6 h-6" />}
          description="ACTIVE SECTIONS"
        />
        <StatCard
          title="Today's Attendance"
          value="87.5%"
          icon={<CalendarCheck className="w-6 h-6" />}
          trend={{ value: '+3% vs yesterday', isPositive: true }}
          description="PRESENT TODAY"
        />
        <StatCard
          title="Assignments"
          value="4 Pending"
          icon={<BookOpen className="w-6 h-6" />}
          trend={{ value: '2 due tomorrow', isPositive: false }}
          description="NEED REVIEW"
        />
        <StatCard
          title="Office Hours"
          value="2:00 PM"
          icon={<Clock className="w-6 h-6" />}
          description="TODAY'S SESSION"
        />
      </div>

      <FeaturePlaceholder
        title="Teacher Modules"
        description="Attendance marking, assignment management, notes, and class timetable will be available in the next milestone."
        badge="In Development"
      />
    </div>
  );
}
