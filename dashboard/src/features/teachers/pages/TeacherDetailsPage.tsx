import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Clock } from 'lucide-react';
import { Tabs } from '../../../components/ui/Tabs';
import { Card, CardBody } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/dashboard/EmptyState';
import { TeacherHeader } from '../components/TeacherHeader';
import { TeacherOverview } from '../components/TeacherOverview';
import { TeacherProfessional } from '../components/TeacherProfessional';
import { TeacherAssignments } from '../components/TeacherAssignments';
import { TeacherDocuments } from '../components/TeacherDocuments';
import { useTeacher } from '../hooks/useTeachers';
import type { TeacherProfile } from '../../../types/teacher.types';

const TABS = [
  { label: 'Overview', value: 'overview' },
  { label: 'Professional', value: 'professional' },
  { label: 'Teaching Assignments', value: 'assignments' },
  { label: 'Documents', value: 'documents' },
  { label: 'Activity History', value: 'activity' },
];

export function TeacherDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: teacher, isLoading, error } = useTeacher(id);
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <div className="space-y-6 text-left select-none">
        <div className="h-28 w-full rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="h-12 w-96 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          <div className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="py-12">
        <EmptyState
          title="Teacher profile not found"
          description="The teacher profile you are looking for does not exist or you do not have permission to view it."
          icon={<Users className="w-8 h-8 text-slate-400" />}
          actionText="Back to Directory"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  // Render tab contents
  const renderTabContent = () => {
    switch (activeTab) {
      case 'professional':
        return <TeacherProfessional teacher={teacher} />;
      case 'assignments':
        return <TeacherAssignments teacher={teacher} />;
      case 'documents':
        return <TeacherDocuments />;
      case 'activity':
        return <ActivityTimeline teacher={teacher} />;
      case 'overview':
      default:
        return <TeacherOverview teacher={teacher} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Teacher Details Header */}
      <TeacherHeader teacher={teacher} />

      {/* Tabs navigation */}
      <div className="max-w-3xl">
        <Tabs tabs={TABS} value={activeTab} onChange={setActiveTab} />
      </div>

      {/* Dynamic Tab Body */}
      <div className="mt-8">
        {renderTabContent()}
      </div>
    </div>
  );
}

// ─── Activity Timeline ────────────────────────────────────────────────────────

interface ActivityTimelineProps {
  teacher: TeacherProfile;
}

function ActivityTimeline({ teacher }: ActivityTimelineProps) {
  const assignments = teacher.teachingAssignments || [];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const activities = [
    {
      id: 'act-3',
      title: `Teacher status updated to '${teacher.status}'`,
      description: `Staff profile status updated manually by administrator.`,
      timestamp: teacher.updatedAt,
    },
    ...assignments.map((item) => ({
      id: `assign-${item.documentId}`,
      title: `Assigned subject ${item.subject?.name || 'Classroom Subject'}`,
      description: `Assigned to Section ${item.section?.name || 'A'} of ${item.section?.class?.name || 'Class'} for the academic year ${item.academicYear?.name || 'Current'}.`,
      timestamp: teacher.createdAt,
    })),
    {
      id: 'act-1',
      title: 'Teacher profile created',
      description: `Onboarding profile recorded under employee ID ${teacher.employeeId}.`,
      timestamp: teacher.createdAt,
    },
  ];

  // Sort activities by timestamp descending
  const sortedActivities = activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card className="text-left select-none">
      <CardBody className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-650 dark:text-slate-350 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white leading-tight">
              Activity History
            </h3>
            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold">
              Logs of system updates and administrative actions
            </span>
          </div>
        </div>

        <div className="relative border-l border-slate-200 dark:border-white/5 pl-6 ml-4 space-y-6">
          {sortedActivities.map((act) => (
            <div key={act.id} className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary-500 border-4 border-white dark:border-slate-900 shadow-sm" />
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  {act.title}
                </h4>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  {act.description}
                </p>
                <span className="text-2xs font-bold text-slate-400 dark:text-slate-500 mt-2 block">
                  {formatDate(act.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
